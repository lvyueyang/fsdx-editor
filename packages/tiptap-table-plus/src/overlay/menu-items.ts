import type { Editor } from '@tiptap/core';
import {
  clearSelectedCells,
  setCellVerticalAlign,
} from '../commands/table-cell';
import type { TablePlusTranslations } from '../i18n/types';
import {
  ICON_ALIGN_CENTER,
  ICON_ALIGN_JUSTIFY,
  ICON_ALIGN_LEFT,
  ICON_ALIGN_RIGHT,
  ICON_BACKGROUND_COLOR,
  ICON_CHEVRON_RIGHT,
  ICON_ERASER,
  ICON_MERGE_CELLS,
  ICON_PLUS,
  ICON_SPLIT_CELLS,
  ICON_TABLE_HEADER,
  ICON_TEXT_COLOR,
  ICON_TRASH,
  ICON_VERTICAL_ALIGN_BOTTOM,
  ICON_VERTICAL_ALIGN_MIDDLE,
  ICON_VERTICAL_ALIGN_TOP,
} from './icon-svgs';

export interface MenuItemDef {
  label: string;
  iconHtml: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
  onClick?: () => void;
  action?: 'textColor' | 'backgroundColor';
  sub?: 'color' | SubMenuItem[];
}

export type SubMenuItem = {
  label: string;
  iconHtml: string;
  onClick: () => void;
};

export type MenuListDef = (MenuItemDef | { type: 'separator' })[];

export function isMenuItemDef(item: MenuListDef[number]): item is MenuItemDef {
  return !('type' in item && item.type === 'separator');
}

export function createMenuButton(
  item: MenuItemDef,
  closeMenu: () => void,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'tiptap-table-plus-context-menu-item';
  if (item.variant === 'destructive') {
    btn.classList.add('tiptap-table-plus-context-menu-item--destructive');
  }
  if (item.disabled) btn.disabled = true;

  btn.innerHTML = `
    <span class="tiptap-table-plus-menu-item-icon">${item.iconHtml}</span>
    <span class="tiptap-table-plus-context-menu-item-label">${item.label}</span>
    ${item.sub ? `<span class="tiptap-table-plus-context-menu-arrow">${ICON_CHEVRON_RIGHT}</span>` : ''}
  `;

  if (item.onClick && !item.sub) {
    btn.addEventListener('click', () => {
      item.onClick!();
      closeMenu();
    });
  }

  return btn;
}

export function buildMainMenuItems(
  editor: Editor | null,
  t: TablePlusTranslations,
): MenuListDef {
  const canSplit = editor?.can().splitCell() ?? false;

  return [
    {
      label: t.insertRowAbove,
      iconHtml: ICON_PLUS,
      onClick: () => editor?.chain().focus().addRowBefore().run(),
    },
    {
      label: t.insertRowBelow,
      iconHtml: ICON_PLUS,
      onClick: () => editor?.chain().focus().addRowAfter().run(),
    },
    {
      label: t.insertColumnLeft,
      iconHtml: ICON_PLUS,
      onClick: () => editor?.chain().focus().addColumnBefore().run(),
    },
    {
      label: t.insertColumnRight,
      iconHtml: ICON_PLUS,
      onClick: () => editor?.chain().focus().addColumnAfter().run(),
    },
    { type: 'separator' as const },
    {
      label: t.mergeCells,
      iconHtml: ICON_MERGE_CELLS,
      onClick: () => editor?.chain().focus().mergeCells().run(),
    },
    {
      label: t.splitCell,
      iconHtml: ICON_SPLIT_CELLS,
      onClick: () => editor?.chain().focus().splitCell().run(),
      disabled: !canSplit,
    },
    { type: 'separator' as const },
    {
      label: t.textColor,
      iconHtml: ICON_TEXT_COLOR,
      action: 'textColor',
      sub: 'color' as const,
    },
    {
      label: t.backgroundColor,
      iconHtml: ICON_BACKGROUND_COLOR,
      action: 'backgroundColor',
      sub: 'color' as const,
    },
    {
      label: t.horizontalAlign,
      iconHtml: ICON_ALIGN_LEFT,
      sub: [
        {
          label: t.alignLeft,
          iconHtml: ICON_ALIGN_LEFT,
          onClick: () => editor?.chain().focus().setCellTextAlign('left').run(),
        },
        {
          label: t.alignCenter,
          iconHtml: ICON_ALIGN_CENTER,
          onClick: () =>
            editor?.chain().focus().setCellTextAlign('center').run(),
        },
        {
          label: t.alignRight,
          iconHtml: ICON_ALIGN_RIGHT,
          onClick: () =>
            editor?.chain().focus().setCellTextAlign('right').run(),
        },
        {
          label: t.alignJustify,
          iconHtml: ICON_ALIGN_JUSTIFY,
          onClick: () =>
            editor?.chain().focus().setCellTextAlign('justify').run(),
        },
      ],
    },
    {
      label: t.verticalAlign,
      iconHtml: ICON_VERTICAL_ALIGN_TOP,
      sub: [
        {
          label: t.alignTop,
          iconHtml: ICON_VERTICAL_ALIGN_TOP,
          onClick: () => setCellVerticalAlign(editor, 'top'),
        },
        {
          label: t.alignMiddle,
          iconHtml: ICON_VERTICAL_ALIGN_MIDDLE,
          onClick: () => setCellVerticalAlign(editor, 'middle'),
        },
        {
          label: t.alignBottom,
          iconHtml: ICON_VERTICAL_ALIGN_BOTTOM,
          onClick: () => setCellVerticalAlign(editor, 'bottom'),
        },
      ],
    },
    { type: 'separator' as const },
    {
      label: t.clearContent,
      iconHtml: ICON_ERASER,
      onClick: () => clearSelectedCells(editor),
    },
    {
      label: t.toggleHeaderRow,
      iconHtml: ICON_TABLE_HEADER,
      onClick: () => editor?.chain().focus().toggleHeaderRow().run(),
    },
    {
      label: t.toggleHeaderColumn,
      iconHtml: ICON_TABLE_HEADER,
      onClick: () => editor?.chain().focus().toggleHeaderColumn().run(),
    },
    { type: 'separator' as const },
    {
      label: t.deleteRow,
      iconHtml: ICON_TRASH,
      onClick: () => editor?.chain().focus().deleteRow().run(),
      variant: 'destructive',
    },
    {
      label: t.deleteColumn,
      iconHtml: ICON_TRASH,
      onClick: () => editor?.chain().focus().deleteColumn().run(),
      variant: 'destructive',
    },
  ];
}
