import { forwardRef, useCallback } from 'react';
import { Badge } from '../../components/ui/badge';
import type { ButtonProps } from '../../components/ui/button';
import { Toolbar } from '../../components/ui/toolbar';
import { parseShortcutKeys } from '../../core/editor-utils';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import type { UndoRedoAction, UseUndoRedoConfig } from './';
import { UNDO_REDO_SHORTCUT_KEYS, useUndoRedo } from './';

export interface UndoRedoButtonProps
  extends Omit<ButtonProps, 'type'>,
    UseUndoRedoConfig {
  text?: string;
  showShortcut?: boolean;
}

export function HistoryShortcutBadge({
  action,
  shortcutKeys = UNDO_REDO_SHORTCUT_KEYS[action],
}: {
  action: UndoRedoAction;
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for triggering undo/redo actions in a Tiptap editor.
 *
 * For custom button implementations, use the `useHistory` hook instead.
 */
export const UndoRedoButton = forwardRef<
  HTMLButtonElement,
  UndoRedoButtonProps
>(
  (
    {
      editor: providedEditor,
      action,
      text,
      hideWhenUnavailable = false,
      onExecuted,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useFsdxEditor(providedEditor);
    const { isVisible, handleAction, label, canExecute, Icon, shortcutKeys } =
      useUndoRedo({
        editor,
        action,
        hideWhenUnavailable,
        onExecuted,
      });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleAction();
      },
      [handleAction, onClick],
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
            {showShortcut && (
              <HistoryShortcutBadge
                action={action}
                shortcutKeys={shortcutKeys}
              />
            )}
          </>
        )}
      </Toolbar.Button>
    );
  },
);

UndoRedoButton.displayName = 'UndoRedoButton';
