import type { Editor } from '@tiptap/react';
import { type ForwardedRef, forwardRef, useCallback, useState } from 'react';
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
import type { ListType } from './use-list';
import { useListDropdownMenu } from './use-list-dropdown-menu';

export interface ListDropdownMenuProps extends Omit<ButtonProps, 'type'> {
  editor?: Editor;
  types?: ListType[];
  hideWhenUnavailable?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  modal?: boolean;
}

function ListDropdownMenuImpl(
  {
    editor: providedEditor,
    types = ['bulletList', 'orderedList', 'taskList'],
    hideWhenUnavailable = false,
    onOpenChange,
    modal = true,
    ...props
  }: ListDropdownMenuProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { editor } = useFsdxEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);

  const { filteredLists, canToggle, isActive, isVisible, label, Icon } =
    useListDropdownMenu({
      editor,
      types,
      hideWhenUnavailable,
    });

  const handleOnOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange],
  );

  const handleList = useCallback(
    (type: ListType) => {
      editor?.chain().focus().toggleList(type, 'listItem').run();
    },
    [editor],
  );

  if (!isVisible) {
    return null;
  }

  return (
    <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Toolbar.Button
          label={label}
          active={isActive}
          showDropdown
          disabled={!canToggle}
          data-disabled={!canToggle}
          aria-label={label}
          {...props}
          ref={ref}
        >
          <Icon className="fsdx-editor-button-icon" />
        </Toolbar.Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {filteredLists.map((option) => (
            <DropdownMenuButtonItem
              key={option.type}
              icon={option.icon}
              onClick={() => handleList(option.type)}
            >
              <span className="fsdx-editor-button-text">{option.label}</span>
            </DropdownMenuButtonItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const ListDropdownMenu = forwardRef(ListDropdownMenuImpl);

ListDropdownMenu.displayName = 'ListDropdownMenu';

export default ListDropdownMenu;
