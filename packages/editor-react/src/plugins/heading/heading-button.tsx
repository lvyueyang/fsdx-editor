import { forwardRef, useCallback } from 'react';
import { Badge } from '../../components/ui/badge';
import type { ButtonProps } from '../../components/ui/button';
import { Toolbar } from '../../components/ui/toolbar';
import { parseShortcutKeys } from '../../core/editor-utils';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import type { Level, UseHeadingConfig } from './';
import { HEADING_SHORTCUT_KEYS, useHeading } from './';

export interface HeadingButtonProps
  extends Omit<ButtonProps, 'type'>,
    UseHeadingConfig {
  text?: string;
  showShortcut?: boolean;
}

export function HeadingShortcutBadge({
  level,
  shortcutKeys = HEADING_SHORTCUT_KEYS[level],
}: {
  level: Level;
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

export const HeadingButton = forwardRef<HTMLButtonElement, HeadingButtonProps>(
  (
    {
      editor: providedEditor,
      level,
      text,
      hideWhenUnavailable = false,
      onToggled,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useFsdxEditor(providedEditor);
    const {
      isVisible,
      canToggle,
      isActive,
      handleToggle,
      label,
      Icon,
      shortcutKeys,
    } = useHeading({
      editor,
      level,
      hideWhenUnavailable,
      onToggled,
    });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleToggle();
      },
      [handleToggle, onClick],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Toolbar.Button
        label={label}
        active={isActive}
        disabled={!canToggle}
        data-disabled={!canToggle}
        aria-label={label}
        aria-pressed={isActive}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="fsdx-editor-button-icon" />
            {text && <span className="fsdx-editor-button-text">{text}</span>}
            {showShortcut && (
              <HeadingShortcutBadge level={level} shortcutKeys={shortcutKeys} />
            )}
          </>
        )}
      </Toolbar.Button>
    );
  },
);

HeadingButton.displayName = 'HeadingButton';
