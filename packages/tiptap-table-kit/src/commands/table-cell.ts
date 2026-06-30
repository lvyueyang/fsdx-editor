import type { Editor } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
import { CellSelection, cellAround } from '@tiptap/pm/tables';
import { getSelectedNodesOfType, updateNodesAttr } from '../utils/editor-utils';
import { findRowDepth, findTableDepth } from '../utils/table-helpers';

// ─── 清除选中的单元格内容 ───

/**
 * 清除选中单元格的内容和样式属性
 */
export function clearSelectedCells(editor: Editor | null): boolean {
  if (!editor) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr }) => {
      const { selection } = tr;

      if (selection instanceof CellSelection) {
        const cells: { pos: number; nodeSize: number; node: PMNode }[] = [];
        selection.forEachCell((_node, pos) => {
          cells.push({ pos, nodeSize: _node.nodeSize, node: _node });
        });

        for (let i = cells.length - 1; i >= 0; i--) {
          const { pos, nodeSize } = cells[i];
          if (nodeSize > 0) {
            tr.delete(pos + 1, pos + nodeSize - 1);
          }
          tr.setNodeMarkup(pos, undefined, {
            ...cells[i].node.attrs,
            textColor: null,
            backgroundColor: null,
            textAlign: null,
            verticalAlign: null,
          });
        }
      } else {
        const cell = cellAround(selection.$anchor);
        if (!cell) return false;

        const node = tr.doc.nodeAt(cell.pos);
        if (
          node &&
          (node.type.name === 'tableCell' || node.type.name === 'tableHeader')
        ) {
          if (node.content.size > 0) {
            tr.delete(cell.pos + 1, cell.pos + node.nodeSize - 1);
          }
          tr.setNodeMarkup(cell.pos, undefined, {
            ...node.attrs,
            textColor: null,
            backgroundColor: null,
            textAlign: null,
            verticalAlign: null,
          });
        }
      }
      return true;
    })
    .run();
}

// ─── 单元格文字颜色 ───

/**
 * 设置选中单元格的文字颜色
 */
export function setCellTextColor(
  editor: Editor | null,
  color: string,
): boolean {
  if (!editor) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr }) => {
      const targets = getSelectedNodesOfType(tr.selection, [
        'tableCell',
        'tableHeader',
      ]);
      return updateNodesAttr(tr, targets, 'textColor', color);
    })
    .run();
}

/**
 * 取消选中单元格的文字颜色
 */
export function unsetCellTextColor(editor: Editor | null): boolean {
  if (!editor) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr }) => {
      const targets = getSelectedNodesOfType(tr.selection, [
        'tableCell',
        'tableHeader',
      ]);
      return updateNodesAttr(tr, targets, 'textColor', null);
    })
    .run();
}

// ─── 单元格背景色 ───

/**
 * 设置选中单元格的背景色（依赖 NodeBackground 扩展）
 */
export function setCellBackgroundColor(
  editor: Editor | null,
  color: string,
): boolean {
  if (!editor) return false;
  return editor.chain().focus().setNodeBackgroundColor(color).run();
}

/**
 * 取消选中单元格的背景色（依赖 NodeBackground 扩展）
 */
export function unsetCellBackgroundColor(editor: Editor | null): boolean {
  if (!editor) return false;
  return editor.chain().focus().unsetNodeBackgroundColor().run();
}

// ─── 单元格垂直对齐 ───

export type CellVerticalAlign = 'top' | 'middle' | 'bottom';

/**
 * 设置选中单元格的垂直对齐
 */
export function setCellVerticalAlign(
  editor: Editor | null,
  align: CellVerticalAlign,
): boolean {
  if (!editor) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr }) => {
      const targets = getSelectedNodesOfType(tr.selection, [
        'tableCell',
        'tableHeader',
      ]);
      return updateNodesAttr(tr, targets, 'verticalAlign', align);
    })
    .run();
}

// ─── 自适应列宽 ───

/**
 * 移除所有单元格的 colwidth 属性，让表格自适应列宽
 */
export function fitToWidth(editor: Editor | null): boolean {
  if (!editor) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr }) => {
      const $a = tr.selection.$anchor;
      const tDepth = findTableDepth($a);
      if (tDepth === -1) return false;

      const tNode = $a.node(tDepth);
      const tStart = $a.start(tDepth);
      let p = tStart + 1;

      tNode.forEach((row) => {
        let cp = p + 1;
        row.forEach((cell) => {
          const attrs = { ...cell.attrs };
          delete attrs.colwidth;
          tr.setNodeMarkup(cp, cell.type, attrs, cell.marks);
          cp += cell.nodeSize;
        });
        p += row.nodeSize;
      });

      return true;
    })
    .run();
}

// ─── 复制选中单元格内容 ───

/**
 * 复制选中单元格的内容到剪贴板（TSV 格式）
 */
export function copySelectedCells(editor: Editor | null): boolean {
  if (!editor) return false;

  const { selection } = editor.state;

  if (selection instanceof CellSelection) {
    const rows: string[][] = [];
    let currentRow: number | null = null;

    selection.forEachCell((_node, pos) => {
      const $pos = editor.state.doc.resolve(pos);
      const rowIdx = $pos.index(findRowDepth($pos) - 1);

      if (currentRow !== rowIdx) {
        currentRow = rowIdx;
        rows.push([]);
      }
      rows[rows.length - 1].push(_node.textContent);
    });

    const text = rows.map((r) => r.join('\t')).join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
  } else {
    const dom = editor.view.nodeDOM(selection.$anchor.pos);
    if (dom instanceof HTMLElement) {
      navigator.clipboard.writeText(dom.textContent ?? '').catch(() => {});
    }
  }

  return true;
}

// ─── 清除指定行/列内容 ───

export type Orientation = 'row' | 'column';

/**
 * 清除当前光标所在行或列的所有内容
 */
export function clearRowColumnContent(
  editor: Editor | null,
  orientation: Orientation,
): boolean {
  if (!editor) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr }) => {
      const $a = tr.selection.$anchor;
      const tDepth = findTableDepth($a);
      if (tDepth === -1) return false;

      if (orientation === 'row') {
        const rDepth = findRowDepth($a);
        if (rDepth === -1) return false;

        const rowNode = $a.node(rDepth);
        let pos = $a.start(rDepth) + 1;

        rowNode.forEach((cell) => {
          const from = pos + 1;
          const to = pos + cell.nodeSize - 1;
          if (from < to) tr.delete(from, to);
          pos += cell.nodeSize;
        });
      } else if (orientation === 'column') {
        const colIdx = $a.index($a.depth - 1);
        const tNode = $a.node(tDepth);
        const tStart = $a.start(tDepth);
        let p = tStart + 1;

        tNode.forEach((row) => {
          const rStart = p;
          const cells: { cpos: number; node: PMNode }[] = [];
          let cp = rStart + 1;

          row.forEach((cell) => {
            cells.push({ cpos: cp, node: cell });
            cp += cell.nodeSize;
          });

          if (colIdx < cells.length) {
            const cell = cells[colIdx];
            const from = cell.cpos + 1;
            const to = cell.cpos + cell.node.nodeSize - 1;
            if (from < to) tr.delete(from, to);
          }

          p += row.nodeSize;
        });
      }
      return true;
    })
    .run();
}

/**
 * 清除当前行内容
 */
export function clearRowContent(editor: Editor | null): boolean {
  return clearRowColumnContent(editor, 'row');
}

/**
 * 清除当前列内容
 */
export function clearColumnContent(editor: Editor | null): boolean {
  return clearRowColumnContent(editor, 'column');
}
