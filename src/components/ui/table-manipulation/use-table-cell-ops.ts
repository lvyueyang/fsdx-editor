import '@tiptap/extension-table';
import type { Node as PMNode } from '@tiptap/pm/model';
import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import { useTiptapEditor } from '../../../hooks/use-tiptap-editor';
import { EraserIcon } from '../../icons/eraser-icon';
import { FitToWidthIcon } from '../../icons/fit-to-width-icon';
import { MergeCellsIcon, SplitCellsIcon } from '../../icons/merge-cells-icon';
import { TableHeaderIcon } from '../../icons/table-header-icon';
import { type Orientation, useTableActionVisibility } from './table-utils';
import { canDoInTable, findRowDepth, findTableDepth } from './use-table-ops';

// ─── 合并/拆分单元格 ───

export interface UseTableMergeSplitCellConfig {
  editor?: Editor | null;
  action: 'merge' | 'split';
  hideWhenUnavailable?: boolean;
  onExecuted?: (action: 'merge' | 'split') => void;
}

export function useTableMergeSplitCell(config: UseTableMergeSplitCellConfig) {
  const {
    editor: providedEditor,
    action,
    hideWhenUnavailable = false,
    onExecuted,
  } = config;
  const { editor } = useTiptapEditor(providedEditor);
  const isVisible = useTableActionVisibility(
    editor,
    canDoInTable,
    hideWhenUnavailable,
  );

  const handleAction = useCallback(() => {
    if (!editor) return false;
    const cmd = action === 'merge' ? 'mergeCells' : 'splitCell';
    const success = editor.chain().focus()[cmd as 'mergeCells']().run();
    if (success) onExecuted?.(action);
    return success;
  }, [editor, action, onExecuted]);

  return {
    isVisible,
    canDo: canDoInTable(editor),
    handleAction,
    label: action === 'merge' ? '合并单元格' : '拆分单元格',
    Icon: action === 'merge' ? MergeCellsIcon : SplitCellsIcon,
  };
}

// ─── 清除内容 ───

export interface UseTableClearRowColumnContentConfig {
  editor?: Editor | null;
  orientation?: Orientation;
  resetAttrs?: boolean;
  hideWhenUnavailable?: boolean;
  onCleared?: () => void;
}

export function useTableClearRowColumnContent(
  config: UseTableClearRowColumnContentConfig,
) {
  const {
    editor: providedEditor,
    orientation,
    resetAttrs,
    hideWhenUnavailable = false,
    onCleared,
  } = config;
  const { editor } = useTiptapEditor(providedEditor);
  const isVisible = useTableActionVisibility(
    editor,
    canDoInTable,
    hideWhenUnavailable,
  );

  const handleAction = useCallback(() => {
    if (!editor) return false;
    return editor
      .chain()
      .focus()
      .command(({ tr }) => {
        const $a = tr.selection.$anchor;
        const tDepth = findTableDepth($a);
        if (tDepth === -1) return false;

        if (orientation === 'row') {
          const rDepth = findRowDepth($a);
          if (rDepth === -1) return false;
          const rowNode = $a.node(rDepth);
          let pos = $a.start(rDepth) + 1;
          rowNode.forEach((cell) => {
            const from = pos + 1;
            const to = pos + cell.nodeSize - 1;
            if (from < to) tr.delete(from, to);
            pos += cell.nodeSize;
          });
        } else if (orientation === 'column') {
          const colIdx = $a.index($a.depth - 1);
          const tNode = $a.node(tDepth);
          const tStart = $a.start(tDepth);
          let p = tStart + 1;
          tNode.forEach((row) => {
            const rStart = p;
            const cells: { cpos: number; node: PMNode }[] = [];
            let cp = rStart + 1;
            row.forEach((cell) => {
              cells.push({ cpos: cp, node: cell });
              cp += cell.nodeSize;
            });
            if (colIdx < cells.length) {
              const cell = cells[colIdx];
              const from = cell.cpos + 1;
              const to = cell.cpos + cell.node.nodeSize - 1;
              if (from < to) tr.delete(from, to);
            }
            p += row.nodeSize;
          });
        }
        return true;
      })
      .run();
  }, [editor, orientation, resetAttrs, onCleared]);

  return {
    isVisible,
    canDo: canDoInTable(editor),
    handleAction,
    label: orientation
      ? orientation === 'row'
        ? '清除行内容'
        : '清除列内容'
      : '清除内容',
    Icon: EraserIcon,
  };
}

// ─── 表头切换 ───

export interface UseTableHeaderRowColumnConfig {
  editor?: Editor | null;
  orientation: Orientation;
  hideWhenUnavailable?: boolean;
  onToggled?: () => void;
}

export function useTableHeaderRowColumn(config: UseTableHeaderRowColumnConfig) {
  const {
    editor: providedEditor,
    orientation,
    hideWhenUnavailable = false,
    onToggled,
  } = config;
  const { editor } = useTiptapEditor(providedEditor);
  const isVisible = useTableActionVisibility(
    editor,
    canDoInTable,
    hideWhenUnavailable,
  );

  const handleAction = useCallback(() => {
    if (!editor) return false;
    const cmd =
      orientation === 'row' ? 'toggleHeaderRow' : 'toggleHeaderColumn';
    const success = editor.chain().focus()[cmd as 'toggleHeaderRow']().run();
    if (success) onToggled?.();
    return success;
  }, [editor, orientation, onToggled]);

  return {
    isVisible,
    canDo: canDoInTable(editor),
    handleAction,
    label: orientation === 'row' ? '切换标题行' : '切换标题列',
    Icon: TableHeaderIcon,
  };
}

// ─── 自适应列宽 ───

export interface UseTableFitToWidthConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onWidthAdjusted?: () => void;
}

export function useTableFitToWidth(config: UseTableFitToWidthConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onWidthAdjusted,
  } = config;
  const { editor } = useTiptapEditor(providedEditor);
  const isVisible = useTableActionVisibility(
    editor,
    canDoInTable,
    hideWhenUnavailable,
  );

  const handleAction = useCallback(() => {
    if (!editor) return false;
    return editor
      .chain()
      .focus()
      .command(({ tr }) => {
        const $a = tr.selection.$anchor;
        const tDepth = findTableDepth($a);
        if (tDepth === -1) return false;
        const tNode = $a.node(tDepth);
        const tStart = $a.start(tDepth);
        let p = tStart + 1;
        tNode.forEach((row) => {
          let cp = p + 1;
          row.forEach((cell) => {
            const attrs = { ...cell.attrs };
            delete attrs.colwidth;
            tr.setNodeMarkup(cp, cell.type, attrs, cell.marks);
            cp += cell.nodeSize;
          });
          p += row.nodeSize;
        });
        return true;
      })
      .run();
  }, [editor, onWidthAdjusted]);

  return {
    isVisible,
    canDo: canDoInTable(editor),
    handleAction,
    label: '自适应列宽',
    Icon: FitToWidthIcon,
  };
}
