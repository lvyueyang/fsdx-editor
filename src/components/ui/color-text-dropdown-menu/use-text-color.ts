'use client';

import type { Editor } from '@tiptap/react';
import { useCallback, useMemo } from 'react';
import { useTiptapEditor } from '../../../hooks/use-tiptap-editor';
import { isNodeTypeSelected } from '../../../lib/tiptap-utils';

export interface UseTextColorConfig {
  editor?: Editor | null;
  /** 要应用的颜色值 */
  color?: string;
  /** 是否在不可用时隐藏按钮 */
  hideWhenUnavailable?: boolean;
}

/**
 * 检查当前选中文本是否可以设置文字颜色
 */
export function canSetTextColor(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (isNodeTypeSelected(editor, ['image'])) return false;
  return editor.can().setColor('#000000');
}

/**
 * 检查指定文字颜色是否处于激活状态
 */
export function isTextColorActive(
  editor: Editor | null,
  color?: string,
): boolean {
  if (!editor || !editor.isEditable || !color) return false;

  const attrs = editor.getAttributes('textStyle');
  return attrs?.color === color;
}

/**
 * 获取当前选中的文字颜色
 */
export function getCurrentTextColor(editor: Editor | null): string | null {
  if (!editor || !editor.isEditable) return null;

  const attrs = editor.getAttributes('textStyle');
  return attrs?.color || null;
}

export function useTextColor(config: UseTextColorConfig = {}) {
  const { editor: providedEditor } = config;
  const { editor } = useTiptapEditor(providedEditor);

  const canColor = useMemo(() => canSetTextColor(editor), [editor]);

  const currentColor = useMemo(() => getCurrentTextColor(editor), [editor]);

  const isActive = useCallback(
    (color: string) => isTextColorActive(editor, color),
    [editor],
  );

  const setColor = useCallback(
    (color: string) => {
      if (!editor || !canColor) return;
      editor.chain().focus().setColor(color).run();
    },
    [editor, canColor],
  );

  const unsetColor = useCallback(() => {
    if (!editor || !canColor) return;
    editor.chain().focus().unsetColor().run();
  }, [editor, canColor]);

  return {
    canColor,
    currentColor,
    isActive,
    setColor,
    unsetColor,
  };
}
