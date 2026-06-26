import '@tiptap/extension-table';
import type { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { isNodeInSchema } from '../../core/tiptap-utils';
import { useTiptapEditor } from '../../hooks/use-tiptap-editor';
import { TableIcon } from '../../icons/table-icon';

export interface UseTableConfig {
  editor?: Editor | null;
  maxRows?: number;
  maxCols?: number;
  hideWhenUnavailable?: boolean;
  onInserted?: (rows: number, cols: number) => void;
}

/**
 * 判断当前选区是否位于表格内
 */
export function isInTable(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive('table');
}

/**
 * 判断是否可以插入表格
 */
export function canInsertTable(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!isNodeInSchema('table', editor)) return false;

  const { selection } = editor.state;
  const { $from } = selection;
  for (let d = $from.depth; d > 0; d--) {
    if ($from.node(d).type.name === 'table') return false;
  }

  return true;
}

/**
 * 向编辑器中插入表格
 */
export function insertTable(
  editor: Editor | null,
  rows: number,
  cols: number,
): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!canInsertTable(editor)) return false;

  return editor
    .chain()
    .focus()
    .insertTable({ rows, cols, withHeaderRow: true })
    .run();
}

/**
 * 决定表格按钮是否应该显示
 */
export function shouldShowTableButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, hideWhenUnavailable } = props;

  if (!editor) return false;
  if (!editor.isEditable) return false;

  if (!hideWhenUnavailable) return true;

  return isNodeInSchema('table', editor);
}

/**
 * 表格工具栏按钮 Hook
 */
export function useTable(config: UseTableConfig = {}) {
  const {
    editor: providedEditor,
    maxRows = 6,
    maxCols = 6,
    hideWhenUnavailable = false,
    onInserted,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canInsert = canInsertTable(editor);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowTableButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();
    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleInsert = useCallback(
    (rows: number, cols: number) => {
      if (!editor) return false;

      const success = insertTable(editor, rows, cols);
      if (success) {
        onInserted?.(rows, cols);
      }
      return success;
    },
    [editor, onInserted],
  );

  return {
    isVisible,
    canInsert,
    handleInsert,
    maxRows,
    maxCols,
    label: '插入表格',
    Icon: TableIcon,
  };
}
