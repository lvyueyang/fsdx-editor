import { forwardRef } from 'react';
import { useTiptapEditor } from '../../../hooks/use-tiptap-editor';
import type { ButtonProps } from '../../primitives/button';
import {
  type TableBtnConfig,
  TableButtonRender,
} from './table-toolbar-buttons';
import { useTableFitToWidth, useTableMergeSplitCell } from './use-table-ops';

type BaseBtn = Omit<ButtonProps, 'type'>;

// ─── 合并/拆分按钮 ───

export const TableMergeCellsButton = forwardRef<
  HTMLButtonElement,
  BaseBtn &
    TableBtnConfig & { onExecuted?: (action: 'merge' | 'split') => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onExecuted,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableMergeSplitCell({
    editor,
    action: 'merge',
    hideWhenUnavailable,
    onExecuted,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableMergeCellsButton.displayName = 'TableMergeCellsButton';

export const TableSplitCellsButton = forwardRef<
  HTMLButtonElement,
  BaseBtn &
    TableBtnConfig & { onExecuted?: (action: 'merge' | 'split') => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onExecuted,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableMergeSplitCell({
    editor,
    action: 'split',
    hideWhenUnavailable,
    onExecuted,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableSplitCellsButton.displayName = 'TableSplitCellsButton';

// ─── 自适应列宽按钮 ───

export const TableFitToWidthButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onWidthAdjusted?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onWidthAdjusted,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableFitToWidth({
    editor,
    hideWhenUnavailable,
    onWidthAdjusted,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableFitToWidthButton.displayName = 'TableFitToWidthButton';
