import type { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '../../../hooks/use-tiptap-editor';

// --- Lib ---
import { isNodeTypeSelected } from '../../../lib/tiptap-utils';

// --- Icons ---
import { EraserIcon } from '../../icons/eraser-icon';

/**
 * 清除格式按钮的配置项
 */
export interface UseClearFormattingConfig {
  /**
   * Tiptap 编辑器实例。
   */
  editor?: Editor | null;
  /**
   * 当清除格式操作不可用时是否隐藏按钮。
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * 成功执行清除格式操作后的回调。
   */
  onExecuted?: () => void;
}

/**
 * 检查是否可以执行清除格式操作
 */
export function canClearFormatting(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (isNodeTypeSelected(editor, ['image'])) return false;

  return editor.can().unsetAllMarks() || editor.can().clearNodes();
}

/**
 * 执行清除格式操作：移除所有文本标记并将节点还原为段落
 */
export function clearFormatting(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!canClearFormatting(editor)) return false;

  return editor.chain().focus().unsetAllMarks().clearNodes().run();
}

/**
 * 判断清除格式按钮是否应该显示
 */
export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, hideWhenUnavailable } = props;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isEditable) return false;

  return canClearFormatting(editor);
}

/**
 * 为 Tiptap 编辑器提供清除格式功能的 Hook
 *
 * @example
 * ```tsx
 * function MyClearFormattingButton() {
 *   const { isVisible, handleClear } = useClearFormatting({})
 *
 *   if (!isVisible) return null
 *
 *   return <button onClick={handleClear}>清除格式</button>
 * }
 * ```
 */
export function useClearFormatting(config: UseClearFormattingConfig = {}) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onExecuted,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [canExecute, setCanExecute] = useState<boolean>(false);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setCanExecute(canClearFormatting(editor));
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleUpdate();

    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleClear = useCallback(() => {
    if (!editor) return false;

    const success = clearFormatting(editor);
    if (success) {
      onExecuted?.();
    }
    return success;
  }, [editor, onExecuted]);

  return {
    isVisible,
    handleClear,
    canExecute,
    label: '清除格式',
    Icon: EraserIcon,
  };
}
