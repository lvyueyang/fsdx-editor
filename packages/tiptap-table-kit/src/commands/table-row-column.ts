import type { Editor } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
import type { Transaction } from '@tiptap/pm/state';
import { getStoredLocale } from '../utils/state-store';
import {
  canDoInTable,
  findRowDepth,
  findTableDepth,
} from '../utils/table-helpers';

type SwapDirection = -1 | 1;

// ─── 内部辅助：交换相邻行 ───

function swapRows(
  tr: Transaction,
  doc: PMNode,
  tablePos: number,
  tableNode: PMNode,
  rowIdx: number,
  direction: SwapDirection,
): boolean {
  const targetIdx = rowIdx + direction;

  const rows: PMNode[] = [];
  tableNode.forEach((child) => rows.push(child));

  if (targetIdx < 0 || targetIdx >= rows.length) return false;

  const rowPositions: number[] = [];
  let p = tablePos + 1;
  for (const r of rows) {
    rowPositions.push(p);
    p += r.nodeSize;
  }

  const fromA = rowPositions[rowIdx];
  const toA = fromA + rows[rowIdx].nodeSize;
  const fromB = rowPositions[targetIdx];
  const toB = fromB + rows[targetIdx].nodeSize;

  if (direction === -1) {
    tr.replace(fromB, toB, doc.slice(fromA, toA));
    tr.replace(fromA, toA, doc.slice(fromB, toB));
  } else {
    tr.replace(fromA, toA, doc.slice(fromB, toB));
    tr.replace(fromB, toB, doc.slice(fromA, toA));
  }
  return true;
}

// ─── 内部辅助：交换相邻列 ───

function swapColumns(
  tr: Transaction,
  doc: PMNode,
  tablePos: number,
  tableNode: PMNode,
  colIdx: number,
  direction: SwapDirection,
): boolean {
  const targetCol = colIdx + direction;

  let p = tablePos + 1;
  let valid = false;

  tableNode.forEach((row) => {
    const cells: { node: PMNode; pos: number }[] = [];
    let cp = p + 1;
    row.forEach((cell) => {
      cells.push({ node: cell, pos: cp });
      cp += cell.nodeSize;
    });
    if (targetCol < 0 || targetCol >= cells.length || colIdx >= cells.length) {
      p += row.nodeSize;
      return;
    }
    valid = true;
    const cA = cells[colIdx];
    const cB = cells[targetCol];

    if (direction === -1) {
      tr.replace(
        cB.pos,
        cB.pos + cB.node.nodeSize,
        doc.slice(cA.pos, cA.pos + cA.node.nodeSize),
      );
      tr.replace(
        cA.pos,
        cA.pos + cA.node.nodeSize,
        doc.slice(cB.pos, cB.pos + cB.node.nodeSize),
      );
    } else {
      tr.replace(
        cA.pos,
        cA.pos + cA.node.nodeSize,
        doc.slice(cB.pos, cB.pos + cB.node.nodeSize),
      );
      tr.replace(
        cB.pos,
        cB.pos + cB.node.nodeSize,
        doc.slice(cA.pos, cA.pos + cA.node.nodeSize),
      );
    }
    p += row.nodeSize;
  });

  return valid;
}

// ─── 移动行 ───

/**
 * 上移当前行
 */
export function moveRowUp(editor: Editor | null): boolean {
  if (!editor || !canDoInTable(editor)) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const $anchor = state.selection.$anchor;
      const tDepth = findTableDepth($anchor);
      if (tDepth === -1) return false;
      const rDepth = findRowDepth($anchor);
      if (rDepth === -1) return false;

      return swapRows(
        tr,
        state.doc,
        $anchor.start(tDepth),
        $anchor.node(tDepth),
        $anchor.index(rDepth - 1),
        -1,
      );
    })
    .run();
}

/**
 * 下移当前行
 */
export function moveRowDown(editor: Editor | null): boolean {
  if (!editor || !canDoInTable(editor)) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const $anchor = state.selection.$anchor;
      const tDepth = findTableDepth($anchor);
      if (tDepth === -1) return false;
      const rDepth = findRowDepth($anchor);
      if (rDepth === -1) return false;

      return swapRows(
        tr,
        state.doc,
        $anchor.start(tDepth),
        $anchor.node(tDepth),
        $anchor.index(rDepth - 1),
        1,
      );
    })
    .run();
}

// ─── 移动列 ───

/**
 * 左移当前列
 */
export function moveColumnLeft(editor: Editor | null): boolean {
  if (!editor || !canDoInTable(editor)) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const $anchor = state.selection.$anchor;
      const tDepth = findTableDepth($anchor);
      if (tDepth === -1) return false;

      return swapColumns(
        tr,
        state.doc,
        $anchor.start(tDepth),
        $anchor.node(tDepth),
        $anchor.index($anchor.depth - 1),
        -1,
      );
    })
    .run();
}

/**
 * 右移当前列
 */
export function moveColumnRight(editor: Editor | null): boolean {
  if (!editor || !canDoInTable(editor)) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const $anchor = state.selection.$anchor;
      const tDepth = findTableDepth($anchor);
      if (tDepth === -1) return false;

      return swapColumns(
        tr,
        state.doc,
        $anchor.start(tDepth),
        $anchor.node(tDepth),
        $anchor.index($anchor.depth - 1),
        1,
      );
    })
    .run();
}

// ─── 复制行/列 ───

/**
 * 复制当前行
 */
export function duplicateRow(editor: Editor | null): boolean {
  if (!editor) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const $anchor = state.selection.$anchor;
      const tDepth = findTableDepth($anchor);
      if (tDepth === -1) return false;
      const rDepth = findRowDepth($anchor);
      if (rDepth === -1) return false;

      const rowNode = $anchor.node(rDepth);
      const rowEnd = $anchor.start(rDepth) + rowNode.nodeSize;
      tr.insert(rowEnd, rowNode.copy(rowNode.content));
      return true;
    })
    .run();
}

/**
 * 复制当前列
 */
export function duplicateColumn(editor: Editor | null): boolean {
  if (!editor) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const $anchor = state.selection.$anchor;
      const tDepth = findTableDepth($anchor);
      if (tDepth === -1) return false;

      const tableNode = $anchor.node(tDepth);
      const tableStart = $anchor.start(tDepth);
      const colIdx = $anchor.index($anchor.depth - 1);

      let p = tableStart + 1;

      tableNode.forEach((row) => {
        const rStart = p;
        const cells: { node: PMNode; cpos: number }[] = [];
        let cp = rStart + 1;

        row.forEach((cell) => {
          cells.push({ node: cell, cpos: cp });
          cp += cell.nodeSize;
        });

        if (colIdx < cells.length) {
          tr.insert(
            cells[colIdx].cpos + cells[colIdx].node.nodeSize,
            cells[colIdx].node.copy(cells[colIdx].node.content),
          );
        }
        p += row.nodeSize;
      });

      return true;
    })
    .run();
}

// ─── 排序列 ───

/**
 * 文本比较函数，处理数字/日期/混合内容
 */
function compareCellText(a: string, b: string, locale: string): number {
  const na = Number.parseFloat(a);
  const nb = Number.parseFloat(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;

  return a.localeCompare(b, locale, { numeric: true });
}

/**
 * 排序列内部实现，通过 sign 控制升序(1)或降序(-1)
 */
function sortColumn(editor: Editor | null, sign: 1 | -1): boolean {
  if (!editor) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr }) => {
      const $a = tr.selection.$anchor;
      const tDepth = findTableDepth($a);
      if (tDepth === -1) return false;

      const rDepth = findRowDepth($a);
      if (rDepth === -1) return false;

      const isInHeader =
        $a.node(rDepth).firstChild?.type.name === 'tableHeader';

      const colIdx = $a.index($a.depth - 1);
      const tNode = $a.node(tDepth);
      const tStart = $a.start(tDepth);

      const collect = (
        startRow: number,
      ): { text: string; rowStart: number; rowEnd: number }[] => {
        const items: {
          text: string;
          rowStart: number;
          rowEnd: number;
        }[] = [];
        let p = tStart + 1;
        let ri = 0;

        tNode.forEach((row) => {
          const rStart = p;
          const cells: { cpos: number; node: PMNode }[] = [];
          let cp = rStart + 1;

          row.forEach((cell) => {
            cells.push({ cpos: cp, node: cell });
            cp += cell.nodeSize;
          });

          if (ri >= startRow && colIdx < cells.length) {
            items.push({
              text: cells[colIdx].node.textContent,
              rowStart: rStart,
              rowEnd: rStart + row.nodeSize,
            });
          }
          p += row.nodeSize;
          ri++;
        });
        return items;
      };

      const data = collect(isInHeader ? 1 : 0);
      if (data.length <= 1) return false;

      const sorted = [...data].sort(
        (a, b) =>
          sign * compareCellText(a.text, b.text, getStoredLocale(editor)),
      );

      let changed = false;
      for (let i = 0; i < sorted.length; i++) {
        if (data[i].rowStart !== sorted[i].rowStart) {
          const from = sorted[i].rowStart;
          const to = sorted[i].rowEnd;
          const slice = tr.doc.slice(from, to);
          tr.insert(data[i].rowEnd, slice.content);
          tr.delete(from, to);
          changed = true;
        }
      }

      return changed;
    })
    .run();
}

/**
 * 升序排列当前列
 */
export function sortColumnAsc(editor: Editor | null): boolean {
  return sortColumn(editor, 1);
}

/**
 * 降序排列当前列
 */
export function sortColumnDesc(editor: Editor | null): boolean {
  return sortColumn(editor, -1);
}
