import type { Editor } from '@tiptap/core';
import { isNodeInSchema } from './editor-utils';

/** 判断当前选区和编辑器是否允许插入表格 */
export function canInsertTable(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!isNodeInSchema('tableKit', editor)) return false;

  const { selection } = editor.state;
  const { $from } = selection;
  for (let d = $from.depth; d > 0; d--) {
    if ($from.node(d).type.name === 'tableKit') return false;
  }

  return true;
}

/** 从当前位置向上查找 table 节点的深度 */
export function findTableDepth(
  $pos: ReturnType<Editor['state']['doc']['resolve']>,
) {
  for (let i = $pos.depth; i > 0; i--) {
    if ($pos.node(i).type.name === 'tableKit') return i;
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
  return editor.isActive('tableKit');
}
