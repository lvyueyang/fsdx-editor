import type { Editor } from '@tiptap/core';
import { CellSelection } from '@tiptap/pm/tables';
import { findRowDepth, findTableDepth } from '../utils/table-helpers';

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
