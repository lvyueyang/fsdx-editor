import type { Editor } from '@tiptap/react';
import { forwardRef, useCallback } from 'react';
import type { ButtonProps } from '../../components/ui/button';
import { Button } from '../../components/ui/button';
import { Tooltip } from '../../components/ui/tooltip';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { useTableAddRowColumn } from './use-table-ops';

type BaseBtn = Omit<ButtonProps, 'type'>;

// ─── 通用按钮渲染组件 ───

interface TableButtonRenderProps {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  canDo: boolean;
  handleAction: () => boolean;
  isVisible: boolean;
  children?: React.ReactNode;
  buttonProps: ButtonProps;
  ref: React.ForwardedRef<HTMLButtonElement>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function TableButtonRender({
  label,
  Icon,
  canDo,
  handleAction,
  isVisible,
  children,
  buttonProps,
  ref,
  onClick,
}: TableButtonRenderProps) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleAction();
    },
    [handleAction, onClick],
  );

  if (!isVisible) return null;

  return (
    <Tooltip title={label}>
      <Button
        type="button"
        variant="ghost"
        data-active-state="off"
        data-disabled={!canDo}
        role="button"
        tabIndex={-1}
        disabled={!canDo}
        aria-label={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? <Icon className="fsdx-editor-button-icon" />}
      </Button>
    </Tooltip>
  );
}

// ─── 通用配置类型 ───

export interface TableBtnConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
}

// ─── 添加行/列按钮 ───

export const TableAddRowBeforeButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onAdded?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onAdded,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useFsdxEditor(providedEditor);
  const h = useTableAddRowColumn({
    editor,
    orientation: 'row',
    direction: 'before',
    hideWhenUnavailable,
    onAdded,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableAddRowBeforeButton.displayName = 'TableAddRowBeforeButton';

export const TableAddRowAfterButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onAdded?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onAdded,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useFsdxEditor(providedEditor);
  const h = useTableAddRowColumn({
    editor,
    orientation: 'row',
    direction: 'after',
    hideWhenUnavailable,
    onAdded,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableAddRowAfterButton.displayName = 'TableAddRowAfterButton';

export const TableAddColumnBeforeButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onAdded?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onAdded,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useFsdxEditor(providedEditor);
  const h = useTableAddRowColumn({
    editor,
    orientation: 'column',
    direction: 'before',
    hideWhenUnavailable,
    onAdded,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableAddColumnBeforeButton.displayName = 'TableAddColumnBeforeButton';

export const TableAddColumnAfterButton = forwardRef<
  HTMLButtonElement,
  BaseBtn & TableBtnConfig & { onAdded?: () => void }
>((props, ref) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable,
    onAdded,
    onClick,
    children,
    ...btn
  } = props;
  const { editor } = useFsdxEditor(providedEditor);
  const h = useTableAddRowColumn({
    editor,
    orientation: 'column',
    direction: 'after',
    hideWhenUnavailable,
    onAdded,
  });
  return (
    <TableButtonRender {...h} buttonProps={btn} ref={ref} onClick={onClick}>
      {children}
    </TableButtonRender>
  );
});
TableAddColumnAfterButton.displayName = 'TableAddColumnAfterButton';
