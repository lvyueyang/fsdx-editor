import type { Editor } from '@tiptap/react';
import { forwardRef, useCallback, useState } from 'react';
import type { ButtonProps } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { DropdownMenuButtonItem } from '../../components/ui/dropdown-menu-button-item';
import { Toolbar } from '../../components/ui/toolbar';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { headingIcons, type Level } from '../heading';
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
    setIsOpen(false);
  }, [editor]);

  const handleHeading = useCallback(
    (level: Level) => {
      if (activeLevel === level) {
        editor?.chain().focus().setNode('paragraph').run();
      } else {
        editor?.chain().focus().setNode('heading', { level }).run();
      }
      setIsOpen(false);
    },
    [editor, activeLevel],
  );

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
          {ALL_LEVELS.map((level) => {
            const HeadingIcon = headingIcons[level];
            return (
              <DropdownMenuButtonItem
                key={`heading-${level}`}
                active={activeLevel === level}
                icon={HeadingIcon}
                onClick={() => handleHeading(level)}
              >
                <span className="fsdx-editor-button-text">{`标题${level}`}</span>
              </DropdownMenuButtonItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const TextStyleDropdownMenu = forwardRef(TextStyleDropdownMenuImpl);
TextStyleDropdownMenu.displayName = 'TextStyleDropdownMenu';
export default TextStyleDropdownMenu;
