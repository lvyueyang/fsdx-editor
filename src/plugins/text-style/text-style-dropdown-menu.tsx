import type { Editor } from '@tiptap/react';
import { forwardRef, useCallback, useState } from 'react';
import type { ButtonProps } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { DropdownMenuButtonItem } from '../../components/ui/dropdown-menu-button-item';
import { Toolbar } from '../../components/ui/toolbar';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { HeadingButton, type Level } from '../heading';
import { useTextStyleDropdownMenu } from './use-text-style-dropdown-menu';

const ALL_LEVELS: Level[] = [1, 2, 3, 4, 5, 6];

export interface TextStyleDropdownMenuProps extends Omit<ButtonProps, 'type'> {
  editor?: Editor;
  modal?: boolean;
}

function TextStyleDropdownMenuImpl(
  {
    editor: providedEditor,
    modal = true,
    ...props
  }: TextStyleDropdownMenuProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { editor } = useFsdxEditor(providedEditor);
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
        <Toolbar.Select
          label="文本风格"
          displayText={displayText}
          active={!!activeLevel}
          disabled={!canToggle}
          data-disabled={!canToggle}
          aria-label={`文本风格：${displayText}`}
          {...props}
          ref={ref}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuButtonItem
            active={!activeLevel}
            onClick={handleParagraph}
          >
            <span className="fsdx-editor-button-text">正文</span>
          </DropdownMenuButtonItem>
          {ALL_LEVELS.map((level) => (
            <DropdownMenuItem key={`heading-${level}`} asChild>
              <HeadingButton
                editor={editor}
                level={level}
                text={`标题${level}`}
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
