import { forwardRef, useCallback } from 'react';
// --- UI Primitives ---
import type { ButtonProps } from '../../components/ui/button';
import { Button } from '../../components/ui/button';
import { Tooltip } from '../../components/ui/tooltip';
// --- Hooks ---
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
// --- Tiptap UI ---
import type { UseClearFormattingConfig } from './';
import { useClearFormatting } from './';

export interface ClearFormattingButtonProps
  extends Omit<ButtonProps, 'type'>,
    UseClearFormattingConfig {
  /**
   * Optional text to display alongside the icon.
   */
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
      <Tooltip title={label}>
        <Button
          type="button"
          disabled={!canExecute}
          variant="ghost"
          data-disabled={!canExecute}
          role="button"
          tabIndex={-1}
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
        </Button>
      </Tooltip>
    );
  },
);

ClearFormattingButton.displayName = 'ClearFormattingButton';
