import type { Editor } from '@tiptap/core';

/**
 * 从当前位置向上查找 table 节点的深度
 */
export function findTableDepth(
  $pos: ReturnType<Editor['state']['doc']['resolve']>,
) {
  for (let i = $pos.depth; i > 0; i--) {
    if ($pos.node(i).type.name === 'table') return i;
  }
  return -1;
}

/**
 * 从当前位置向上查找 tableRow 节点的深度
 */
export function findRowDepth(
  $pos: ReturnType<Editor['state']['doc']['resolve']>,
) {
  for (let i = $pos.depth; i > 0; i--) {
    if ($pos.node(i).type.name === 'tableRow') return i;
  }
  return -1;
}

/**
 * 判断编辑器是否在表格内且可编辑
 */
export function canDoInTable(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive('table');
}
