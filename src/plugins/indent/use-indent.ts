import type { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

import { useTiptapEditor } from '../../hooks/use-tiptap-editor';

const DEFAULT_STEP = 2;

export interface UseIndentConfig {
  editor?: Editor | null;
  defaultStep?: number;
  hideWhenUnavailable?: boolean;
}

function getBlockIndent(editor: Editor): number {
  const { $from } = editor.state.selection;
  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth);
    if (node.type.name === 'paragraph' || node.type.name === 'heading') {
      return typeof node.attrs.indent === 'number' ? node.attrs.indent : 0;
    }
  }
  return 0;
}

function isInList(editor: Editor): boolean {
  return (
    editor.isActive('bulletList') ||
    editor.isActive('orderedList') ||
    editor.isActive('taskList')
  );
}

export function useIndent(config: UseIndentConfig = {}) {
  const {
    editor: providedEditor,
    defaultStep = DEFAULT_STEP,
    hideWhenUnavailable = false,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isActive, setIsActive] = useState(false);
  const [currentIndent, setCurrentIndent] = useState(0);

  useEffect(() => {
    if (!editor) {
      setIsVisible(false);
      setIsActive(false);
      setCurrentIndent(0);
      return;
    }

    const updateState = () => {
      setIsVisible(hideWhenUnavailable ? !editor.isActive('code') : true);

      if (isInList(editor)) {
        setIsActive(false);
        setCurrentIndent(0);
      } else {
        const indent = getBlockIndent(editor);
        setIsActive(indent > 0);
        setCurrentIndent(indent);
      }
    };

    updateState();

    editor.on('transaction', updateState);
    editor.on('selectionUpdate', updateState);

    return () => {
      editor.off('transaction', updateState);
      editor.off('selectionUpdate', updateState);
    };
  }, [editor, hideWhenUnavailable]);

  const handleToggle = useCallback(() => {
    if (!editor?.isEditable) return false;
    return editor.chain().focus().toggleIndent(defaultStep).run();
  }, [editor, defaultStep]);

  const handleSetIndent = useCallback(
    (value: number) => {
      if (!editor?.isEditable) return false;
      return editor.chain().focus().setIndent(value).run();
    },
    [editor],
  );

  return {
    isVisible,
    isActive,
    currentIndent,
    handleToggle,
    handleSetIndent,
  };
}
