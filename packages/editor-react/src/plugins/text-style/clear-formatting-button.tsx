import { forwardRef, useCallback } from 'react';
import type { ButtonProps } from '../../components/ui/button';
import { Toolbar } from '../../components/ui/toolbar';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import type { UseClearFormattingConfig } from './';
import { useClearFormatting } from './';

export interface ClearFormattingButtonProps
  extends Omit<ButtonProps, 'type'>,
    UseClearFormattingConfig {
  text?: string;
}

/**
 * 清除选中范围内所有文本格式（标记和节点）的按钮组件。
 *
 * 如需自定义按钮实现，请使用 `useClearFormatting` hook。
 */
export const ClearFormattingButton = forwardRef<
  HTMLButtonElement,
  ClearFormattingButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onExecuted,
      onClick,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useFsdxEditor(providedEditor);
    const { isVisible, handleClear, canExecute, label, Icon } =
      useClearFormatting({
        editor,
        hideWhenUnavailable,
        onExecuted,
      });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleClear();
      },
      [handleClear, onClick],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Toolbar.Button
        label={label}
        disabled={!canExecute}
        data-disabled={!canExecute}
        aria-label={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="fsdx-editor-button-icon" />
            {text && <span className="fsdx-editor-button-text">{text}</span>}
          </>
        )}
      </Toolbar.Button>
    );
  },
);

ClearFormattingButton.displayName = 'ClearFormattingButton';
