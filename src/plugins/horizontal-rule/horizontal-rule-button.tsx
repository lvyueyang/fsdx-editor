import { forwardRef, useCallback } from 'react';
import { Badge } from '../../components/ui/badge';
import type { ButtonProps } from '../../components/ui/button';
import { Toolbar } from '../../components/ui/toolbar';
import { parseShortcutKeys } from '../../core/editor-utils';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import type { UseHorizontalRuleConfig } from './';
import { HORIZONTAL_RULE_SHORTCUT_KEY, useHorizontalRule } from './';

export interface HorizontalRuleButtonProps
  extends Omit<ButtonProps, 'type'>,
    UseHorizontalRuleConfig {
  text?: string;
  showShortcut?: boolean;
}

export function HorizontalRuleShortcutBadge({
  shortcutKeys = HORIZONTAL_RULE_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * 水平分割线插入按钮，点击后在光标处插入分割线
 *
 * 如需自定义按钮实现，请使用 `useHorizontalRule` hook。
 */
export const HorizontalRuleButton = forwardRef<
  HTMLButtonElement,
  HorizontalRuleButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onInserted,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useFsdxEditor(providedEditor);
    const { isVisible, canInsert, handleInsert, label, shortcutKeys, Icon } =
      useHorizontalRule({
        editor,
        hideWhenUnavailable,
        onInserted,
      });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleInsert();
      },
      [handleInsert, onClick],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Toolbar.Button
        label={label}
        disabled={!canInsert}
        data-disabled={!canInsert}
        aria-label={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="fsdx-editor-button-icon" />
            {text && <span className="fsdx-editor-button-text">{text}</span>}
            {showShortcut && (
              <HorizontalRuleShortcutBadge shortcutKeys={shortcutKeys} />
            )}
          </>
        )}
      </Toolbar.Button>
    );
  },
);

HorizontalRuleButton.displayName = 'HorizontalRuleButton';
