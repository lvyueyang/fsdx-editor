import '@tiptap/extension-table';
import type { Editor } from '@tiptap/react';

export function findTableDepth(
  $pos: ReturnType<Editor['state']['doc']['resolve']>,
) {
  for (let i = $pos.depth; i > 0; i--) {
    if ($pos.node(i).type.name === 'table') return i;
  }
  return -1;
}

export function findRowDepth(
  $pos: ReturnType<Editor['state']['doc']['resolve']>,
) {
  for (let i = $pos.depth; i > 0; i--) {
    if ($pos.node(i).type.name === 'tableRow') return i;
  }
  return -1;
}

export function canDoInTable(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive('table');
}

export * from './use-table-cell-ops';
export * from './use-table-row-column-ops';
