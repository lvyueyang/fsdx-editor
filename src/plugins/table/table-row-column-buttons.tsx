import { forwardRef } from 'react';
import type { ButtonProps } from '../../components/ui/button';
import { useTiptapEditor } from '../../hooks/use-tiptap-editor';
import {
  type TableBtnConfig,
  TableButtonRender,
} from './table-toolbar-buttons';
import {
  useTableClearRowColumnContent,
  useTableDeleteRowColumn,
  useTableDuplicateRowColumn,
  useTableHeaderRowColumn,
  useTableMoveRowColumn,
  useTableSortRowColumn,
} from './use-table-ops';

type BaseBtn = Omit<ButtonProps, 'type'>;

// ─── 删除行/列按钮 ───

export const TableDeleteRowButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onDeleted?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onDeleted,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableDeleteRowColumn({
    editor,
    orientation: 'row',
    hideWhenUnavailable,
    onDeleted,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableDeleteRowButton.displayName = 'TableDeleteRowButton';

export const TableDeleteColumnButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onDeleted?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onDeleted,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableDeleteRowColumn({
    editor,
    orientation: 'column',
    hideWhenUnavailable,
    onDeleted,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableDeleteColumnButton.displayName = 'TableDeleteColumnButton';

// ─── 移动行/列按钮 ───

export const TableMoveRowUpButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onMoved?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onMoved,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableMoveRowColumn({
    editor,
    orientation: 'row',
    direction: 'up',
    hideWhenUnavailable,
    onMoved,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableMoveRowUpButton.displayName = 'TableMoveRowUpButton';

export const TableMoveRowDownButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onMoved?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onMoved,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableMoveRowColumn({
    editor,
    orientation: 'row',
    direction: 'down',
    hideWhenUnavailable,
    onMoved,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableMoveRowDownButton.displayName = 'TableMoveRowDownButton';

export const TableMoveColumnLeftButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onMoved?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onMoved,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableMoveRowColumn({
    editor,
    orientation: 'column',
    direction: 'left',
    hideWhenUnavailable,
    onMoved,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableMoveColumnLeftButton.displayName = 'TableMoveColumnLeftButton';

export const TableMoveColumnRightButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onMoved?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onMoved,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableMoveRowColumn({
    editor,
    orientation: 'column',
    direction: 'right',
    hideWhenUnavailable,
    onMoved,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableMoveColumnRightButton.displayName = 'TableMoveColumnRightButton';

// ─── 复制行/列按钮 ───

export const TableDuplicateRowButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onDuplicated?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onDuplicated,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableDuplicateRowColumn({
    editor,
    orientation: 'row',
    hideWhenUnavailable,
    onDuplicated,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableDuplicateRowButton.displayName = 'TableDuplicateRowButton';

export const TableDuplicateColumnButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onDuplicated?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onDuplicated,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableDuplicateRowColumn({
    editor,
    orientation: 'column',
    hideWhenUnavailable,
    onDuplicated,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableDuplicateColumnButton.displayName = 'TableDuplicateColumnButton';

// ─── 排序按钮 ───

export const TableSortColumnAscButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onSorted?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onSorted,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableSortRowColumn({
    editor,
    orientation: 'column',
    direction: 'asc',
    hideWhenUnavailable,
    onSorted,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableSortColumnAscButton.displayName = 'TableSortColumnAscButton';

export const TableSortColumnDescButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onSorted?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onSorted,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableSortRowColumn({
    editor,
    orientation: 'column',
    direction: 'desc',
    hideWhenUnavailable,
    onSorted,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableSortColumnDescButton.displayName = 'TableSortColumnDescButton';

// ─── 清除内容按钮 ───

export const TableClearRowContentButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { resetAttrs?: boolean; onCleared?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    resetAttrs,
    onCleared,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableClearRowColumnContent({
    editor,
    orientation: 'row',
    hideWhenUnavailable,
    resetAttrs,
    onCleared,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableClearRowContentButton.displayName = 'TableClearRowContentButton';

export const TableClearColumnContentButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { resetAttrs?: boolean; onCleared?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    resetAttrs,
    onCleared,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableClearRowColumnContent({
    editor,
    orientation: 'column',
    hideWhenUnavailable,
    onCleared,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableClearColumnContentButton.displayName = 'TableClearColumnContentButton';

// ─── 表头切换按钮 ───

export const TableHeaderRowButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onToggled?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onToggled,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableHeaderRowColumn({
    editor,
    orientation: 'row',
    hideWhenUnavailable,
    onToggled,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableHeaderRowButton.displayName = 'TableHeaderRowButton';

export const TableHeaderColumnButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onToggled?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onToggled,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useTiptapEditor(providedEditor);
  const h = useTableHeaderRowColumn({
    editor,
    orientation: 'column',
    hideWhenUnavailable,
    onToggled,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableHeaderColumnButton.displayName = 'TableHeaderColumnButton';
