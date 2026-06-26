import type { Editor } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { canToggle, isHeadingActive, type Level } from '../heading';

const ALL_LEVELS: Level[] = [1, 2, 3, 4, 5, 6];

export function getTextStyleDisplayText(activeLevel?: Level): string {
  if (activeLevel) {
    return `标题${activeLevel}`;
  }
  return '正文';
}

export interface UseTextStyleDropdownMenuConfig {
  editor?: Editor | null;
}

/**
 * 文本风格下拉菜单 Hook，跟踪当前选中的标题级别
 */
export function useTextStyleDropdownMenu(
  config?: UseTextStyleDropdownMenuConfig,
) {
  const { editor: providedEditor } = config || {};
  const { editor } = useFsdxEditor(providedEditor);
  const [activeLevel, setActiveLevel] = useState<Level | undefined>(undefined);
  const [canToggleState, setCanToggleState] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setActiveLevel(
        editor?.isEditable
          ? ALL_LEVELS.find((level) => isHeadingActive(editor, level))
          : undefined,
      );
      setCanToggleState(canToggle(editor));
    };

    handleUpdate();

    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

  return {
    activeLevel,
    canToggle: canToggleState,
    displayText: getTextStyleDisplayText(activeLevel),
  };
}
