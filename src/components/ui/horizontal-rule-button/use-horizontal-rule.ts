import type { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { useTiptapEditor } from '../../../hooks/use-tiptap-editor';
import { isNodeInSchema } from '../../../lib/tiptap-utils';
import { HorizontalRuleIcon } from '../../icons/horizontal-rule-icon';

export const HORIZONTAL_RULE_SHORTCUT_KEY = 'mod+shift+h';

export interface UseHorizontalRuleConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onInserted?: () => void;
}

/**
 * 判断是否可以插入水平分割线
 */
export function canInsertHorizontalRule(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return isNodeInSchema('horizontalRule', editor);
}

/**
 * 在光标处插入水平分割线
 */
export function insertHorizontalRule(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!canInsertHorizontalRule(editor)) return false;

  return editor.chain().focus().setHorizontalRule().run();
}

/**
 * 决定分割线按钮是否应该显示
 */
export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, hideWhenUnavailable } = props;

  if (!editor) return false;

  if (!hideWhenUnavailable) return true;

  if (!editor.isEditable) return false;

  return isNodeInSchema('horizontalRule', editor);
}

/**
 * 水平分割线工具栏按钮 Hook
 *
 * @example
 * function MyHorizontalRuleButton() {
 *   const { isVisible, handleInsert, label } = useHorizontalRule()
 *
 *   if (!isVisible) return null
 *
 *   return <button onClick={handleInsert}>{label}</button>
 * }
 */
export function useHorizontalRule(config?: UseHorizontalRuleConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canInsert = canInsertHorizontalRule(editor);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleInsert = useCallback(() => {
    if (!editor) return false;

    const success = insertHorizontalRule(editor);
    if (success) {
      onInserted?.();
    }
    return success;
  }, [editor, onInserted]);

  return {
    isVisible,
    canInsert,
    handleInsert,
    label: '分割线',
    shortcutKeys: HORIZONTAL_RULE_SHORTCUT_KEY,
    Icon: HorizontalRuleIcon,
  };
}
