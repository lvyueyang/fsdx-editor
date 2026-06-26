// 引入以获取 setLineHeight / unsetLineHeight 命令的类型扩展
import '@tiptap/extension-text-style';
import type { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { clamp } from '../../core/tiptap-utils';

export const LINE_HEIGHT_PRESETS = [
  '1',
  '1.15',
  '1.5',
  '1.75',
  '2',
  '2.5',
  '3',
] as const;

export const MIN_LINE_HEIGHT = 0.5;
export const MAX_LINE_HEIGHT = 10;

export interface UseLineHeightConfig {
  editor?: Editor | null;
}

/**
 * 获取当前选区的行高值
 */
function getCurrentLineHeight(editor: Editor | null): string | null {
  if (!editor) return null;
  const attrs = editor.getAttributes('textStyle');
  const lineHeight = attrs.lineHeight as string | undefined;
  if (!lineHeight) return null;
  const num = Number.parseFloat(lineHeight);
  return Number.isNaN(num) ? null : `${num}`;
}

/**
 * 行高工具栏 Hook
 */
export function useLineHeight(config: UseLineHeightConfig) {
  const { editor: providedEditor } = config;
  const editor = providedEditor ?? null;
  const [currentLineHeight, setCurrentLineHeight] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      setCurrentLineHeight(getCurrentLineHeight(editor));
    };

    update();

    editor.on('selectionUpdate', update);
    editor.on('transaction', update);

    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  const setLineHeight = useCallback(
    (lineHeight: string) => {
      if (!editor) return;
      editor.chain().focus().setLineHeight(lineHeight).run();
    },
    [editor],
  );

  const unsetLineHeight = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLineHeight().run();
  }, [editor]);

  const canSetLineHeight =
    !!editor && editor.isEditable && editor.can().setLineHeight('1.5');

  return {
    currentLineHeight,
    setLineHeight,
    unsetLineHeight,
    canSetLineHeight,
    hasLineHeight: currentLineHeight !== null,
  };
}

/**
 * 校验并规范化用户输入的行高值
 */
export function normalizeLineHeight(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const num = Number.parseFloat(trimmed);
  if (Number.isNaN(num) || num < MIN_LINE_HEIGHT) return null;

  return `${clamp(num, MIN_LINE_HEIGHT, MAX_LINE_HEIGHT)}`;
}
