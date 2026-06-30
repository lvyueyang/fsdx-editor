import type { Editor } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
import {
  canDoInTable,
  findRowDepth,
  findTableDepth,
} from '../utils/table-helpers';

// ─── 移动行 ───

/**
 * 上移当前行
 */
export function moveRowUp(editor: Editor | null): boolean {
  if (!editor || !canDoInTable(editor)) return false;

  const { state, view } = editor;
  const { selection, doc } = state;
  const $anchor = selection.$anchor;
  const tDepth = findTableDepth($anchor);
  if (tDepth === -1) return false;

  const rDepth = findRowDepth($anchor);
  if (rDepth === -1) return false;

  const tablePos = $anchor.start(tDepth);
  const tableNode = $anchor.node(tDepth);
  const rowIdx = $anchor.index(rDepth - 1);

  const rows: PMNode[] = [];
  tableNode.forEach((child) => rows.push(child));

  const targetIdx = rowIdx - 1;
  if (targetIdx < 0) return false;

  const rowPositions: number[] = [];
  let p = tablePos + 1;
  for (const r of rows) {
    rowPositions.push(p);
    p += r.nodeSize;
  }

  const tr = state.tr;
  const from1 = rowPositions[rowIdx];
  const to1 = from1 + rows[rowIdx].nodeSize;
  const from2 = rowPositions[targetIdx];
  const to2 = from2 + rows[targetIdx].nodeSize;

  tr.replace(from2, to2, doc.slice(from1, to1));
  tr.replace(from1, to1, doc.slice(from2, to2));
  view.dispatch(tr);

  return true;
}

/**
 * 下移当前行
 */
export function moveRowDown(editor: Editor | null): boolean {
  if (!editor || !canDoInTable(editor)) return false;

  const { state, view } = editor;
  const { selection, doc } = state;
  const $anchor = selection.$anchor;
  const tDepth = findTableDepth($anchor);
  if (tDepth === -1) return false;

  const rDepth = findRowDepth($anchor);
  if (rDepth === -1) return false;

  const tablePos = $anchor.start(tDepth);
  const tableNode = $anchor.node(tDepth);
  const rowIdx = $anchor.index(rDepth - 1);

  const rows: PMNode[] = [];
  tableNode.forEach((child) => rows.push(child));

  const targetIdx = rowIdx + 1;
  if (targetIdx >= rows.length) return false;

  const rowPositions: number[] = [];
  let p = tablePos + 1;
  for (const r of rows) {
    rowPositions.push(p);
    p += r.nodeSize;
  }

  const tr = state.tr;
  const from1 = rowPositions[rowIdx];
  const to1 = from1 + rows[rowIdx].nodeSize;
  const from2 = rowPositions[targetIdx];
  const to2 = from2 + rows[targetIdx].nodeSize;

  tr.replace(from1, to1, doc.slice(from2, to2));
  tr.replace(from2, to2, doc.slice(from1, to1));
  view.dispatch(tr);

  return true;
}

// ─── 移动列 ───

/**
 * 左移当前列
 */
export function moveColumnLeft(editor: Editor | null): boolean {
  if (!editor || !canDoInTable(editor)) return false;

  const { state, view } = editor;
  const { doc } = state;
  const $anchor = state.selection.$anchor;
  const tDepth = findTableDepth($anchor);
  if (tDepth === -1) return false;

  const tablePos = $anchor.start(tDepth);
  const tableNode = $anchor.node(tDepth);
  const colIdx = $anchor.index($anchor.depth - 1);
  const targetCol = colIdx - 1;
  if (targetCol < 0) return false;

  const tr = state.tr;
  let p = tablePos + 1;

  tableNode.forEach((row) => {
    const cells: { node: PMNode; pos: number }[] = [];
    let cp = p + 1;
    row.forEach((cell) => {
      cells.push({ node: cell, pos: cp });
      cp += cell.nodeSize;
    });
    if (targetCol >= cells.length || colIdx >= cells.length) {
      p += row.nodeSize;
      return;
    }
    const c1 = cells[colIdx];
    const c2 = cells[targetCol];
    tr.replace(
      c2.pos,
      c2.pos + c2.node.nodeSize,
      doc.slice(c1.pos, c1.pos + c1.node.nodeSize),
    );
    tr.replace(
      c1.pos,
      c1.pos + c1.node.nodeSize,
      doc.slice(c2.pos, c2.pos + c2.node.nodeSize),
    );
    p += row.nodeSize;
  });

  view.dispatch(tr);
  return true;
}

/**
 * 右移当前列
 */
export function moveColumnRight(editor: Editor | null): boolean {
  if (!editor || !canDoInTable(editor)) return false;

  const { state, view } = editor;
  const { doc } = state;
  const $anchor = state.selection.$anchor;
  const tDepth = findTableDepth($anchor);
  if (tDepth === -1) return false;

  const tablePos = $anchor.start(tDepth);
  const tableNode = $anchor.node(tDepth);
  const colIdx = $anchor.index($anchor.depth - 1);
  const targetCol = colIdx + 1;

  const tr = state.tr;
  let p = tablePos + 1;

  tableNode.forEach((row) => {
    const cells: { node: PMNode; pos: number }[] = [];
    let cp = p + 1;
    row.forEach((cell) => {
      cells.push({ node: cell, pos: cp });
      cp += cell.nodeSize;
    });
    if (targetCol >= cells.length || colIdx >= cells.length) {
      p += row.nodeSize;
      return;
    }
    const c1 = cells[colIdx];
    const c2 = cells[targetCol];
    tr.replace(
      c1.pos,
      c1.pos + c1.node.nodeSize,
      doc.slice(c2.pos, c2.pos + c2.node.nodeSize),
    );
    tr.replace(
      c2.pos,
      c2.pos + c2.node.nodeSize,
      doc.slice(c1.pos, c1.pos + c1.node.nodeSize),
    );
    p += row.nodeSize;
  });

  view.dispatch(tr);
  return true;
}

// ─── 复制行/列 ───

/**
 * 复制当前行
 */
export function duplicateRow(editor: Editor | null): boolean {
  if (!editor) return false;

  const { state, view } = editor;
  const { selection } = state;
  const $anchor = selection.$anchor;
  const tDepth = findTableDepth($anchor);
  if (tDepth === -1) return false;

  const rDepth = findRowDepth($anchor);
  if (rDepth === -1) return false;

  const rowNode = $anchor.node(rDepth);
  const rowEnd = $anchor.start(rDepth) + rowNode.nodeSize;
  const tr = state.tr;
  tr.insert(rowEnd, rowNode.copy(rowNode.content));
  view.dispatch(tr);

  return true;
}

/**
 * 复制当前列
 */
export function duplicateColumn(editor: Editor | null): boolean {
  if (!editor) return false;

  const { state, view } = editor;
  const { selection } = state;
  const $anchor = selection.$anchor;
  const tDepth = findTableDepth($anchor);
  if (tDepth === -1) return false;

  const tableNode = $anchor.node(tDepth);
  const tableStart = $anchor.start(tDepth);
  const colIdx = $anchor.index($anchor.depth - 1);

  const tr = state.tr;
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

  view.dispatch(tr);
  return true;
}

// ─── 排序列 ───

/**
 * 文本比较函数，处理数字/日期/混合内容
 */
function compareCellText(a: string, b: string): number {
  const na = Number.parseFloat(a);
  const nb = Number.parseFloat(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;

  return a.localeCompare(b, 'zh-CN', { numeric: true });
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
        (a, b) => sign * compareCellText(a.text, b.text),
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

      return changed || true;
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
