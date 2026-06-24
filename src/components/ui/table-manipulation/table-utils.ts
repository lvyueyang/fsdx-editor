import '@tiptap/extension-table';
import type { Editor } from '@tiptap/react';
import { useEffect, useState } from 'react';

export type Orientation = 'row' | 'column';

export function isInTable(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive('table');
}

/**
 * 监听 selectionUpdate 更新可见性的标准 Hook
 */
export function useTableActionVisibility(
  editor: Editor | null,
  canDoCheck: ((editor: Editor | null) => boolean) | null,
  hideWhenUnavailable: boolean,
) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      if (!editor.isEditable) {
        setIsVisible(false);
        return;
      }
      if (!hideWhenUnavailable) {
        setIsVisible(true);
        return;
      }
      setIsVisible(canDoCheck?.(editor) ?? false);
    };

    update();
    editor.on('selectionUpdate', update);
    return () => {
      editor.off('selectionUpdate', update);
    };
  }, [editor, hideWhenUnavailable, canDoCheck]);

  return isVisible;
}
