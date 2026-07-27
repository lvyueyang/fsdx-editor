/**
 * 表格内容清除命令：清除选中单元格（含样式重置）、整行或整列的内容。
 * 均为直接操作 tr 的纯命令，可在 editor.chain() 中组合调用。
 */
import type { Command } from '@tiptap/core';
import type { Node as PMNode, ResolvedPos } from '@tiptap/pm/model';
import type { Transaction } from '@tiptap/pm/state';
import { CellSelection, cellAround, TableMap } from '@tiptap/pm/tables';

/** 清除单元格时需要一并重置的样式属性 */
const RESET_CELL_ATTRS = {
  textColor: null,
  backgroundColor: null,
  textAlign: null,
  verticalAlign: null,
} as const;

/** 仅清空单元格内容，保留样式属性 */
function deleteCellContent(tr: Transaction, pos: number, node: PMNode): void {
  if (node.content.size > 0) {
    tr.delete(pos + 1, pos + node.nodeSize - 1);
  }
}

/** 清空单元格内容并重置样式属性 */
function resetCell(tr: Transaction, pos: number, node: PMNode): void {
  deleteCellContent(tr, pos, node);
  tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...RESET_CELL_ATTRS });
}

/**
 * 清除选中单元格的内容与样式属性。
 * 支持单元格选区（批量）与光标所在的单个单元格。
 */
export const clearSelectedCells: Command = ({ tr }) => {
  const { selection } = tr;

  if (selection instanceof CellSelection) {
    const cells: { pos: number; node: PMNode }[] = [];
    selection.forEachCell((node, pos) => {
      cells.push({ node, pos });
    });
    // 倒序处理，避免删除内容导致后续单元格位置偏移
    for (let i = cells.length - 1; i >= 0; i--) {
      resetCell(tr, cells[i].pos, cells[i].node);
    }
    return true;
  }

  const cell = cellAround(selection.$anchor);
  if (!cell) return false;

  const node = tr.doc.nodeAt(cell.pos);
  if (!node) return false;

  resetCell(tr, cell.pos, node);
  return true;
};

/** 从当前位置向上查找指定类型节点的深度，未找到返回 -1 */
function findNodeDepth($pos: ResolvedPos, typeName: string): number {
  for (let d = $pos.depth; d > 0; d--) {
    if ($pos.node(d).type.name === typeName) return d;
  }
  return -1;
}

/** 收集整行所有单元格的文档位置 */
function rowCellPositions($anchor: ResolvedPos, rowDepth: number): number[] {
  const positions: number[] = [];
  let pos = $anchor.start(rowDepth) + 1;
  $anchor.node(rowDepth).forEach((cell) => {
    positions.push(pos);
    pos += cell.nodeSize;
  });
  return positions;
}

/**
 * 通过 TableMap 收集当前列所有单元格的文档位置。
 * 被合并单元格覆盖的位置会自动去重，rowspan/colspan 场景同样适用。
 */
function columnCellPositions(
  $anchor: ResolvedPos,
  tableDepth: number,
): number[] {
  const cell = cellAround($anchor);
  if (!cell) return [];

  const tableNode = $anchor.node(tableDepth);
  const tableStart = $anchor.start(tableDepth);
  const map = TableMap.get(tableNode);
  const mapIndex = map.map.indexOf(cell.pos - tableStart);
  if (mapIndex === -1) return [];

  const colIndex = mapIndex % map.width;
  const positions: number[] = [];
  for (let row = 0; row < map.height; row++) {
    const offset = map.map[row * map.width + colIndex];
    // 与上一行是同一个（被合并的）单元格时跳过
    if (row > 0 && map.map[(row - 1) * map.width + colIndex] === offset)
      continue;
    positions.push(tableStart + offset);
  }
  return positions;
}

/** 收集目标行/列的全部单元格位置 */
function collectCellPositions(
  $anchor: ResolvedPos,
  orientation: 'row' | 'column',
  tableDepth: number,
): number[] {
  if (orientation === 'row') {
    const rowDepth = findNodeDepth($anchor, 'tableRow');
    return rowDepth === -1 ? [] : rowCellPositions($anchor, rowDepth);
  }
  return columnCellPositions($anchor, tableDepth);
}

/**
 * 清除当前光标所在行或列的全部单元格内容（保留样式属性）。
 */
export function clearRowColumnContent(orientation: 'row' | 'column'): Command {
  return ({ tr }) => {
    const $anchor = tr.selection.$anchor;
    const tableDepth = findNodeDepth($anchor, 'table');
    if (tableDepth === -1) return false;

    const positions = collectCellPositions($anchor, orientation, tableDepth);
    if (positions.length === 0) return false;

    // 倒序处理，避免删除内容导致后续单元格位置偏移
    for (let i = positions.length - 1; i >= 0; i--) {
      const node = tr.doc.nodeAt(positions[i]);
      if (node) deleteCellContent(tr, positions[i], node);
    }
    return true;
  };
}
