import type { Editor } from '@tiptap/react';
import { useCallback, useMemo, useState } from 'react';
import type { ButtonProps } from '../../components/ui/button';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { useTiptapEditor } from '../../hooks/use-tiptap-editor';
import { BackgroundColorIcon } from '../../icons/background-color-icon';
import { ColorGrid } from './color-grid';
import { PALETTE_COLUMNS, type PaletteColor } from './color-palette';

const GRID_WIDTH = PALETTE_COLUMNS * 20 + (PALETTE_COLUMNS - 1) * 4 + 2 * 8;

export interface ColorHighlightDropdownMenuProps
  extends Omit<ButtonProps, 'type'> {
  editor?: Editor;
  modal?: boolean;
}

export function ColorHighlightDropdownMenu({
  editor: providedEditor,
  modal = true,
  ...props
}: ColorHighlightDropdownMenuProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [open, setOpen] = useState(false);

  const currentHighlightColor = useMemo(() => {
    if (!editor) return null;
    if (!editor.isActive('highlight')) return null;
    const attrs = editor.getAttributes('highlight');
    return (attrs?.color as string) || null;
  }, [editor]);

  const handleClearHighlight = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetHighlight().run();
    setOpen(false);
  }, [editor]);

  const handleSelectColor = useCallback(
    (color: PaletteColor) => {
      if (!editor) return;
      editor.chain().focus().toggleHighlight({ color: color.color }).run();
      setOpen(false);
    },
    [editor],
  );

  return (
    <DropdownMenu modal={modal} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          data-active-state={currentHighlightColor ? 'on' : 'off'}
          role="button"
          tabIndex={-1}
          aria-label="背景色"
          tooltip="背景色"
          {...props}
        >
          <BackgroundColorIcon className="tiptap-button-icon" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent style={{ minWidth: GRID_WIDTH }}>
        <div style={{ padding: '4px 8px' }}>
          <button
            type="button"
            className="tiptap-color-grid-action-btn"
            onClick={handleClearHighlight}
          >
            清除背景色
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
            activeColor={currentHighlightColor}
            onSelectColor={handleSelectColor}
            onClose={() => setOpen(false)}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

ColorHighlightDropdownMenu.displayName = 'ColorHighlightDropdownMenu';
