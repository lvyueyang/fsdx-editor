import { CellSelection, cellAround } from '@tiptap/pm/tables';
import type { Editor } from '@tiptap/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { useTiptapEditor } from '../../hooks/use-tiptap-editor';
import { MoreIcon } from '../../icons/more-icon';
import { ColorGrid } from '../color/color-grid';
import { PALETTE_COLUMNS, type PaletteColor } from '../color/color-palette';
import {
  isColorSubMenu,
  isSubMenu,
  useTableMenuItems,
} from './table-selection-menu';

import './table-selection-overlay.scss';

const COLOR_GRID_WIDTH =
  PALETTE_COLUMNS * 20 + (PALETTE_COLUMNS - 1) * 4 + 2 * 8;

interface CellRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function getCellsRect(editor: Editor): CellRect | null {
  const cells: DOMRect[] = [];
  try {
    (editor.state.selection as CellSelection).forEachCell((_node, pos) => {
      const dom = editor.view.nodeDOM(pos);
      if (dom instanceof HTMLElement) {
        cells.push(dom.getBoundingClientRect());
      }
    });
  } catch {
    return null;
  }

  if (cells.length === 0) return null;

  return {
    left: Math.min(...cells.map((r) => r.left)),
    top: Math.min(...cells.map((r) => r.top)),
    right: Math.max(...cells.map((r) => r.right)),
    bottom: Math.max(...cells.map((r) => r.bottom)),
  };
}

/**
 * 获取单个聚焦单元格的 viewport 尺寸及所在 tableWrapper
 */
function getSingleCellRect(
  editor: Editor,
): { rect: CellRect; wrapper: HTMLElement } | null {
  const cell = cellAround(editor.state.selection.$anchor);
  if (!cell) return null;

  const dom = editor.view.nodeDOM(cell.pos);
  if (!(dom instanceof HTMLElement)) return null;

  const wrapper = dom.closest('.tableWrapper') as HTMLElement | null;
  if (!wrapper) return null;

  const cellDom = dom.getBoundingClientRect();
  return {
    rect: {
      left: cellDom.left,
      top: cellDom.top,
      right: cellDom.right,
      bottom: cellDom.bottom,
    },
    wrapper,
  };
}

/**
 * 从第一个选中单元格向上查找 .tableWrapper
 */
function findWrapperEl(editor: Editor): HTMLElement | null {
  const { selection } = editor.state;
  if (!(selection instanceof CellSelection)) return null;

  let wrapper: HTMLElement | null = null;
  (selection as CellSelection).forEachCell((_node, pos) => {
    if (!wrapper) {
      const dom = editor.view.nodeDOM(pos);
      if (dom instanceof HTMLElement) {
        wrapper = dom.closest('.tableWrapper') as HTMLElement | null;
      }
    }
  });
  return wrapper;
}

function findOverlayContainer(wrapper: HTMLElement | null): HTMLElement | null {
  if (!wrapper) return null;
  return wrapper.querySelector(
    '.table-selection-overlay-container',
  ) as HTMLElement | null;
}

export function TableSelectionOverlay() {
  const { editor } = useTiptapEditor();
  const [rect, setRect] = useState<CellRect | null>(null);
  const [_wrapperRect, setWrapperRect] = useState<CellRect | null>(null);
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleRef = useRef<HTMLButtonElement>(null);
  const overlayContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const { selection } = editor.state;
      if (!editor.isEditable) {
        setVisible(false);
        setRect(null);
        return;
      }

      if (selection instanceof CellSelection) {
        // 多单元格选中
        requestAnimationFrame(() => {
          const wrapper = findWrapperEl(editor);
          const container = findOverlayContainer(wrapper);
          const cellsR = getCellsRect(editor);
          const wrapR = wrapper?.getBoundingClientRect() ?? null;

          if (cellsR && wrapR && container) {
            overlayContainerRef.current = container;
            setRect({
              left: cellsR.left - wrapR.left,
              top: cellsR.top - wrapR.top,
              right: cellsR.right - wrapR.left,
              bottom: cellsR.bottom - wrapR.top,
            });
            setWrapperRect(wrapR);
            setVisible(true);
          }
        });
        return;
      }

      if (editor.isActive('table')) {
        // 单个单元格聚焦
        requestAnimationFrame(() => {
          const result = getSingleCellRect(editor);
          if (!result) {
            setVisible(false);
            return;
          }
          const container = findOverlayContainer(result.wrapper);
          const wrapR = result.wrapper.getBoundingClientRect();

          if (container) {
            overlayContainerRef.current = container;
            setRect({
              left: result.rect.left - wrapR.left,
              top: result.rect.top - wrapR.top,
              right: result.rect.right - wrapR.left,
              bottom: result.rect.bottom - wrapR.top,
            });
            setWrapperRect(wrapR);
            setVisible(true);
          }
        });
        return;
      }

      setVisible(false);
      setRect(null);
    };

    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  useEffect(() => {
    if (!visible) {
      setMenuOpen(false);
    }
  }, [visible]);

  const handleOpenChange = useCallback((open: boolean) => {
    setMenuOpen(open);
  }, []);

  if (!visible || !rect || !overlayContainerRef.current) {
    return null;
  }

  return createPortal(
    <OverlayContent
      editor={editor}
      rect={rect}
      menuOpen={menuOpen}
      onMenuOpenChange={handleOpenChange}
      handleRef={handleRef}
    />,
    overlayContainerRef.current,
  );
}

interface OverlayContentProps {
  editor: Editor | null;
  rect: CellRect;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  handleRef: React.RefObject<HTMLButtonElement | null>;
}

function OverlayContent({
  editor,
  rect,
  menuOpen,
  onMenuOpenChange,
  handleRef,
}: OverlayContentProps) {
  const width = rect.right - rect.left;
  const height = rect.bottom - rect.top;

  const menuItems = useTableMenuItems(editor);

  return (
    <>
      <div
        className="table-selection-border"
        style={{
          position: 'absolute',
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      />

      <DropdownMenu
        modal={false}
        open={menuOpen}
        onOpenChange={onMenuOpenChange}
      >
        <DropdownMenuTrigger asChild>
          <button
            ref={handleRef}
            type="button"
            className="table-selection-handle"
            style={{
              position: 'absolute',
              left: `${rect.right}px`,
              top: `${rect.top + height / 2}px`,
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label="表格操作"
          >
            <div className="table-selection-handle-dot">
              <MoreIcon className="table-selection-handle-icon" />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="right"
          sideOffset={8}
          className="table-selection-menu"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuLabel>表格操作</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {menuItems.map((group, gi) => (
            <DropdownMenuGroup key={gi}>
              {gi > 0 && <DropdownMenuSeparator />}
              {group.map((item) =>
                isColorSubMenu(item) ? (
                  <DropdownMenuSub key={item.label}>
                    <DropdownMenuSubTrigger>
                      <item.icon className="table-menu-item-icon" />
                      {item.label}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent
                        style={{ minWidth: COLOR_GRID_WIDTH }}
                      >
                        <div style={{ padding: '4px 8px' }}>
                          <button
                            type="button"
                            className="tiptap-color-grid-action-btn"
                            onClick={() => {
                              item.onReset();
                              onMenuOpenChange(false);
                            }}
                          >
                            默认颜色
                          </button>
                        </div>
                        <DropdownMenuSeparator />
                        <ColorGrid
                          activeColor={item.currentColor}
                          onSelectColor={(color: PaletteColor) => {
                            item.onSelectColor(color.color);
                            onMenuOpenChange(false);
                          }}
                          onClose={() => onMenuOpenChange(false)}
                        />
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ) : isSubMenu(item) ? (
                  <DropdownMenuSub key={item.label}>
                    <DropdownMenuSubTrigger>
                      <item.icon className="table-menu-item-icon" />
                      {item.label}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {item.items.map((subItem) => (
                          <DropdownMenuItem
                            key={subItem.label}
                            onClick={() => {
                              subItem.onClick();
                              onMenuOpenChange(false);
                            }}
                            disabled={subItem.disabled}
                          >
                            <subItem.icon className="table-menu-item-icon" />
                            {subItem.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ) : (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={() => {
                      item.onClick();
                      onMenuOpenChange(false);
                    }}
                    disabled={item.disabled}
                    variant={item.variant}
                  >
                    <item.icon className="table-menu-item-icon" />
                    {item.label}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
