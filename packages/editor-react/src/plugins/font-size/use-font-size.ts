// 引入以获取 setFontSize / unsetFontSize 命令的类型扩展
import '@tiptap/extension-text-style';
import type { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { clamp } from '../../core/editor-utils';

export const FONT_SIZE_PRESETS = [
  '12',
  '14',
  '16',
  '18',
  '20',
  '24',
  '28',
  '36',
  '48',
  '64',
  '72',
] as const;

export const DEFAULT_FONT_SIZE = '16';
export const MIN_FONT_SIZE = 1;
export const MAX_FONT_SIZE = 256;

export interface UseFontSizeConfig {
  editor?: Editor | null;
}

/**
 * 获取当前选区的字号（px 数值字符串）
 */
function getCurrentFontSize(editor: Editor | null): string | null {
  if (!editor) return null;
  const attrs = editor.getAttributes('textStyle');
  const fontSize = attrs.fontSize as string | undefined;
  if (!fontSize) return null;
  const num = Number.parseFloat(fontSize);
  return Number.isNaN(num) ? null : `${num}`;
}

/**
 * 字号工具栏 Hook
 */
export function useFontSize(config: UseFontSizeConfig) {
  const { editor: providedEditor } = config;
  const editor = providedEditor ?? null;
  const [currentSize, setCurrentSize] = useState<string | null>(null);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      setCurrentSize(getCurrentFontSize(editor));
    };

    update();

    editor.on('selectionUpdate', update);
    editor.on('transaction', update);

    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  const setFontSize = useCallback(
    (size: string) => {
      if (!editor) return;
      editor.chain().focus().setFontSize(`${size}px`).run();
    },
    [editor],
  );

  const unsetFontSize = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetFontSize().run();
  }, [editor]);

  const canSetFontSize =
    !!editor && editor.isEditable && editor.can().setFontSize('16px');

  return {
    currentSize,
    setFontSize,
    unsetFontSize,
    canSetFontSize,
    hasFontSize: currentSize !== null,
  };
}

/**
 * 校验并规范化用户输入的字号值
 */
export function normalizeFontSize(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const num = Number.parseFloat(trimmed);
  if (Number.isNaN(num) || num < MIN_FONT_SIZE) return null;

  return `${clamp(num, MIN_FONT_SIZE, MAX_FONT_SIZE)}`;
}
