import type { Node as PMNode } from '@tiptap/pm/model';
import { CellSelection, cellAround } from '@tiptap/pm/tables';
import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import {
  getSelectedNodesOfType,
  updateNodesAttr,
} from '../../core/tiptap-utils';
import { useTiptapEditor } from '../../hooks/use-tiptap-editor';
import { AlignCenterIcon } from '../../icons/align-center-icon';
import { AlignJustifyIcon } from '../../icons/align-justify-icon';
import { AlignLeftIcon } from '../../icons/align-left-icon';
import { AlignRightIcon } from '../../icons/align-right-icon';
import { BackgroundColorIcon } from '../../icons/background-color-icon';
import { CopyIcon } from '../../icons/copy-icon';
import { EraserIcon } from '../../icons/eraser-icon';
import { FitToWidthIcon } from '../../icons/fit-to-width-icon';
import { MergeCellsIcon, SplitCellsIcon } from '../../icons/merge-cells-icon';
import { TableHeaderIcon } from '../../icons/table-header-icon';
import { TextColorIcon } from '../../icons/text-color-icon';
import {
  VerticalAlignBottomIcon,
  VerticalAlignMiddleIcon,
  VerticalAlignTopIcon,
} from '../../icons/vertical-align-icon';
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

// ─── 复制选中单元格内容到剪贴板 ───

export interface UseCopySelectedCellsConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onCopied?: () => void;
}

export function useCopySelectedCells(config: UseCopySelectedCellsConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onCopied,
  } = config;
  const { editor } = useTiptapEditor(providedEditor);
  const isVisible = useTableActionVisibility(
    editor,
    canDoInTable,
    hideWhenUnavailable,
  );

  const handleAction = useCallback(() => {
    if (!editor) return false;
    const { selection } = editor.state;

    if (selection instanceof CellSelection) {
      const rows: string[][] = [];
      let currentRow: number | null = null;
      selection.forEachCell((_node, pos) => {
        const $pos = editor.state.doc.resolve(pos);
        const rowIdx = $pos.index(findRowDepth($pos) - 1);
        if (currentRow !== rowIdx) {
          currentRow = rowIdx;
          rows.push([]);
        }
        rows[rows.length - 1].push(_node.textContent);
      });
      const text = rows.map((r) => r.join('\t')).join('\n');
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      const dom = editor.view.nodeDOM(selection.$anchor.pos);
      if (dom instanceof HTMLElement) {
        navigator.clipboard.writeText(dom.textContent ?? '').catch(() => {});
      }
    }
    onCopied?.();
    return true;
  }, [editor, onCopied]);

  return {
    isVisible,
    canDo: canDoInTable(editor),
    handleAction,
    label: '复制',
    Icon: CopyIcon,
  };
}

// ─── 清除选中单元格内容 ───

export interface UseClearSelectedCellsConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onCleared?: () => void;
}

export function useClearSelectedCells(config: UseClearSelectedCellsConfig) {
  const {
    editor: providedEditor,
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
    const success = editor
      .chain()
      .focus()
      .command(({ tr }) => {
        const { selection } = tr;
        if (selection instanceof CellSelection) {
          const cells: { pos: number; nodeSize: number; node: PMNode }[] = [];
          selection.forEachCell((_node, pos) => {
            cells.push({ pos, nodeSize: _node.nodeSize, node: _node });
          });
          for (let i = cells.length - 1; i >= 0; i--) {
            const { pos, nodeSize } = cells[i];
            if (nodeSize > 0) {
              tr.delete(pos + 1, pos + nodeSize - 1);
            }
            tr.setNodeMarkup(pos, undefined, {
              ...cells[i].node.attrs,
              textColor: null,
              backgroundColor: null,
              textAlign: null,
              verticalAlign: null,
            });
          }
        } else {
          const cell = cellAround(selection.$anchor);
          if (!cell) return false;
          const node = tr.doc.nodeAt(cell.pos);
          if (
            node &&
            (node.type.name === 'tableCell' || node.type.name === 'tableHeader')
          ) {
            if (node.content.size > 0) {
              tr.delete(cell.pos + 1, cell.pos + node.nodeSize - 1);
            }
            tr.setNodeMarkup(cell.pos, undefined, {
              ...node.attrs,
              textColor: null,
              backgroundColor: null,
              textAlign: null,
              verticalAlign: null,
            });
          }
        }
        return true;
      })
      .run();
    if (success) onCleared?.();
    return success;
  }, [editor, onCleared]);

  return {
    isVisible,
    canDo: canDoInTable(editor),
    handleAction,
    label: '清除内容',
    Icon: EraserIcon,
  };
}

// ─── 单元格文字颜色 ───

export interface UseTableCellTextColorConfig {
  editor?: Editor | null;
  onChanged?: () => void;
}

export function useTableCellTextColor(config: UseTableCellTextColorConfig) {
  const { editor: providedEditor, onChanged } = config;
  const { editor } = useTiptapEditor(providedEditor);

  const setColor = useCallback(
    (color: string) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .command(({ tr }) => {
          const targets = getSelectedNodesOfType(tr.selection, [
            'tableCell',
            'tableHeader',
          ]);
          return updateNodesAttr(tr, targets, 'textColor', color);
        })
        .run();
      onChanged?.();
    },
    [editor, onChanged],
  );

  const unsetColor = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        const targets = getSelectedNodesOfType(tr.selection, [
          'tableCell',
          'tableHeader',
        ]);
        return updateNodesAttr(tr, targets, 'textColor', null);
      })
      .run();
    onChanged?.();
  }, [editor, onChanged]);

  return {
    setColor,
    unsetColor,
    label: '文字颜色',
    Icon: TextColorIcon,
  };
}

// ─── 单元格背景色 ───

export interface UseTableCellBackgroundColorConfig {
  editor?: Editor | null;
  onChanged?: () => void;
}

export function useTableCellBackgroundColor(
  config: UseTableCellBackgroundColorConfig,
) {
  const { editor: providedEditor, onChanged } = config;
  const { editor } = useTiptapEditor(providedEditor);

  const setColor = useCallback(
    (color: string) => {
      if (!editor) return;
      editor.chain().focus().setNodeBackgroundColor(color).run();
      onChanged?.();
    },
    [editor, onChanged],
  );

  const unsetColor = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetNodeBackgroundColor().run();
    onChanged?.();
  }, [editor, onChanged]);

  return {
    setColor,
    unsetColor,
    label: '单元格背景色',
    Icon: BackgroundColorIcon,
  };
}

// ─── 单元格水平对齐 ───

export type CellTextAlign = 'left' | 'center' | 'right' | 'justify';

const textAlignLabels: Record<CellTextAlign, string> = {
  left: '左对齐',
  center: '居中对齐',
  right: '右对齐',
  justify: '两端对齐',
};

const textAlignIcons: Record<
  CellTextAlign,
  React.ComponentType<{ className?: string }>
> = {
  left: AlignLeftIcon,
  center: AlignCenterIcon,
  right: AlignRightIcon,
  justify: AlignJustifyIcon,
};

export interface UseTableCellTextAlignConfig {
  editor?: Editor | null;
  align: CellTextAlign;
  onChanged?: () => void;
}

export function useTableCellTextAlign(config: UseTableCellTextAlignConfig) {
  const { editor: providedEditor, align, onChanged } = config;
  const { editor } = useTiptapEditor(providedEditor);

  const handleAction = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().setTextAlign(align).run();
    onChanged?.();
  }, [editor, align, onChanged]);

  return {
    handleAction,
    label: textAlignLabels[align],
    Icon: textAlignIcons[align],
  };
}

// ─── 单元格垂直对齐 ───

export type CellVerticalAlign = 'top' | 'middle' | 'bottom';

const verticalAlignLabels: Record<CellVerticalAlign, string> = {
  top: '顶端对齐',
  middle: '居中对齐',
  bottom: '底端对齐',
};

const verticalAlignIcons: Record<
  CellVerticalAlign,
  React.ComponentType<{ className?: string }>
> = {
  top: VerticalAlignTopIcon,
  middle: VerticalAlignMiddleIcon,
  bottom: VerticalAlignBottomIcon,
};

export interface UseTableCellVerticalAlignConfig {
  editor?: Editor | null;
  align: CellVerticalAlign;
  onChanged?: () => void;
}

export function useTableCellVerticalAlign(
  config: UseTableCellVerticalAlignConfig,
) {
  const { editor: providedEditor, align, onChanged } = config;
  const { editor } = useTiptapEditor(providedEditor);

  const handleAction = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        const targets = getSelectedNodesOfType(tr.selection, [
          'tableCell',
          'tableHeader',
        ]);
        return updateNodesAttr(tr, targets, 'verticalAlign', align);
      })
      .run();
    onChanged?.();
  }, [editor, align, onChanged]);

  return {
    handleAction,
    label: verticalAlignLabels[align],
    Icon: verticalAlignIcons[align],
  };
}
