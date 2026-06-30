import type { Editor } from '@tiptap/core';
import { isNodeInSchema } from '../utils/editor-utils';

/**
 * 判断当前选区和编辑器是否允许插入表格
 */
export function canInsertTable(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!isNodeInSchema('table', editor)) return false;

  const { selection } = editor.state;
  const { $from } = selection;
  for (let d = $from.depth; d > 0; d--) {
    if ($from.node(d).type.name === 'table') return false;
  }

  return true;
}
