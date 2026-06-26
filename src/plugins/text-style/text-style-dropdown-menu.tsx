import type { Editor } from '@tiptap/react';
import { forwardRef, useCallback, useState } from 'react';
import type { ButtonProps } from '../../components/ui/button';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { DropdownMenuButtonItem } from '../../components/ui/dropdown-menu-button-item';
import { cn } from '../../core/tiptap-utils';
import { useTiptapEditor } from '../../hooks/use-tiptap-editor';
import { ChevronDownIcon } from '../../icons/chevron-down-icon';
import { HeadingButton, type Level } from '../heading';
import { useTextStyleDropdownMenu } from './use-text-style-dropdown-menu';

const ALL_LEVELS: Level[] = [1, 2, 3, 4, 5, 6];

export interface TextStyleDropdownMenuProps extends Omit<ButtonProps, 'type'> {
  editor?: Editor;
  modal?: boolean;
}

/**
 * 文本风格下拉菜单，在正文与标题 H1~H6 之间切换
 */
function TextStyleDropdownMenuImpl(
  {
    editor: providedEditor,
    modal = true,
    ...props
  }: TextStyleDropdownMenuProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);
  const { displayText, canToggle, activeLevel } = useTextStyleDropdownMenu({
    editor,
  });

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const handleParagraph = useCallback(() => {
    editor?.chain().focus().setNode('paragraph').run();
  }, [editor]);

  return (
    <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          data-active-state={activeLevel ? 'on' : 'off'}
          role="button"
          tabIndex={-1}
          disabled={!canToggle}
          data-disabled={!canToggle}
          aria-label={`文本风格：${displayText}`}
          tooltip="文本风格"
          {...props}
          ref={ref}
        >
          <span
            className={cn('tiptap-button-text', 'tiptap-button-text-fixed')}
          >
            {displayText}
          </span>
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuButtonItem
            active={!activeLevel}
            onClick={handleParagraph}
          >
            <span className="tiptap-button-text">正文</span>
          </DropdownMenuButtonItem>
          {ALL_LEVELS.map((level) => (
            <DropdownMenuItem key={`heading-${level}`} asChild>
              <HeadingButton
                editor={editor}
                level={level}
                text={`标题${level}`}
                showTooltip={false}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const TextStyleDropdownMenu = forwardRef(TextStyleDropdownMenuImpl);
TextStyleDropdownMenu.displayName = 'TextStyleDropdownMenu';
export default TextStyleDropdownMenu;
