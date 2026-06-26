import type { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { isNodeTypeSelected } from '../../core/editor-utils';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';

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
  const { editor } = useFsdxEditor(providedEditor);

  const [canColor, setCanColor] = useState(false);
  const [currentColor, setCurrentColor] = useState<string | null>(null);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setCanColor(canSetTextColor(editor));
      setCurrentColor(getCurrentTextColor(editor));
    };

    handleUpdate();

    editor.on('transaction', handleUpdate);

    return () => {
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

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
