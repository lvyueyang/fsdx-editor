import type { Editor } from '@tiptap/core';
import { getSelectedNodesOfType, updateNodesAttr } from '../utils/editor-utils';

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
