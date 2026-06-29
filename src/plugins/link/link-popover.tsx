import type { Editor } from '@tiptap/react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { ButtonProps } from '../../components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';
import { Toolbar } from '../../components/ui/toolbar';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { LinkIcon } from '../../icons/link-icon';
import { LinkBubbleMenuContent } from '../bubble-menu/link-bubble-menu-content';
import type { UseLinkPopoverConfig } from './';
import { useLinkPopover } from './';

import './link-popover.scss';

export interface LinkPopoverProps
  extends Omit<ButtonProps, 'type'>,
    UseLinkPopoverConfig {
  onOpenChange?: (isOpen: boolean) => void;
  autoOpenOnLinkActive?: boolean;
}

/**
 * Link button component for triggering the link popover
 */
export const LinkButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Toolbar.Button
        label="链接"
        className={className}
        aria-label="链接"
        ref={ref}
        {...props}
      >
        {children || <LinkIcon className="fsdx-editor-button-icon" />}
      </Toolbar.Button>
    );
  },
);

LinkButton.displayName = 'LinkButton';

/**
 * Link content component for standalone use (mobile toolbar etc.)
 */
export const LinkContent: React.FC<{
  editor?: Editor | null;
}> = ({ editor }) => {
  return <LinkBubbleMenuContent editor={editor ?? null} />;
};

/**
 * Link popover component for Tiptap editors.
 *
 * For custom popover implementations, use the `useLinkPopover` hook instead.
 */
export const LinkPopover = forwardRef<HTMLButtonElement, LinkPopoverProps>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      onSetLink,
      onOpenChange,
      autoOpenOnLinkActive = true,
      onClick,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useFsdxEditor(providedEditor);
    const [isOpen, setIsOpen] = useState(false);

    const { isVisible, canSet, isActive, label, Icon } = useLinkPopover({
      editor,
      hideWhenUnavailable,
      onSetLink,
    });

    const handleOnOpenChange = useCallback(
      (nextIsOpen: boolean) => {
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
      },
      [onOpenChange],
    );

    const handleClose = useCallback(() => {
      setIsOpen(false);
    }, []);

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setIsOpen(!isOpen);
      },
      [onClick, isOpen],
    );

    useEffect(() => {
      if (autoOpenOnLinkActive && isActive) {
        setIsOpen(true);
      }
    }, [autoOpenOnLinkActive, isActive]);

    if (!isVisible) {
      return null;
    }

    return (
      <Popover open={isOpen} onOpenChange={handleOnOpenChange}>
        <PopoverTrigger asChild>
          <LinkButton
            disabled={!canSet}
            data-active-state={isActive ? 'on' : 'off'}
            data-disabled={!canSet}
            aria-label={label}
            aria-pressed={isActive}
            onClick={handleClick}
            {...buttonProps}
            ref={ref}
          >
            {children ?? <Icon className="fsdx-editor-button-icon" />}
          </LinkButton>
        </PopoverTrigger>

        <PopoverContent>
          <LinkBubbleMenuContent editor={editor} onAction={handleClose} />
        </PopoverContent>
      </Popover>
    );
  },
);

LinkPopover.displayName = 'LinkPopover';

export default LinkPopover;
