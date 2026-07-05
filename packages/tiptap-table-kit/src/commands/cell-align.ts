import type { Editor } from '@tiptap/core';
import { getSelectedNodesOfType, updateNodesAttr } from '../utils/editor-utils';

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
