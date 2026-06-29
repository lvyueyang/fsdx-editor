import type { Editor } from '@tiptap/react';
import { useState } from 'react';
import type { ButtonProps } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Toolbar } from '../../components/ui/toolbar';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { TextColorIcon } from '../../icons/text-color-icon';
import { ColorGrid } from './color-grid';
import { PALETTE_COLUMNS, type PaletteColor } from './color-palette';
import { useTextColor } from './use-text-color';

const GRID_WIDTH = PALETTE_COLUMNS * 20 + (PALETTE_COLUMNS - 1) * 4 + 2 * 8;

export interface ColorTextDropdownMenuProps extends Omit<ButtonProps, 'type'> {
  editor?: Editor;
  modal?: boolean;
}

export function ColorTextDropdownMenu({
  editor: providedEditor,
  modal = true,
  ...props
}: ColorTextDropdownMenuProps) {
  const { editor } = useFsdxEditor(providedEditor);
  const [open, setOpen] = useState(false);
  const { currentColor, setColor, unsetColor } = useTextColor({ editor });

  const handleResetColor = () => {
    unsetColor();
    setOpen(false);
  };

  const handleSelectColor = (color: PaletteColor) => {
    setColor(color.color);
    setOpen(false);
  };

  return (
    <DropdownMenu modal={modal} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Toolbar.Button
          label="文字颜色"
          active={!!currentColor}
          aria-label="文字颜色"
          {...props}
        >
          <TextColorIcon className="fsdx-editor-button-icon" />
        </Toolbar.Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent style={{ minWidth: GRID_WIDTH }}>
        <div style={{ padding: '4px 8px' }}>
          <button
            type="button"
            className="fsdx-editor-color-grid-action-btn"
            onClick={handleResetColor}
          >
            默认颜色
          </button>
        </div>
        <DropdownMenuSeparator />
        <div
          role="presentation"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setOpen(false);
            }
          }}
        >
          <ColorGrid
            activeColor={currentColor}
            onSelectColor={handleSelectColor}
            onClose={() => setOpen(false)}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

ColorTextDropdownMenu.displayName = 'ColorTextDropdownMenu';
