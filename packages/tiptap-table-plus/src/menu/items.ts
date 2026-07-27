/**
 * 上下文菜单的菜单项定义：公开类型、按钮工厂与默认菜单项构建。
 * 默认 MenuList 可通过 TablePlus 的 contextMenu 配置项增删自定义。
 */
import type { Editor } from '@tiptap/core';
import type { CellVerticalAlign } from '../extensions/table-cell-style';
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
} from '../icons';

/** 单个子菜单项 */
export interface SubMenuItem {
  label: string;
  iconHtml: string;
  onClick: () => void;
}

/** 单个菜单项定义 */
export interface MenuItem {
  label: string;
  iconHtml: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
  onClick?: () => void;
  /** sub 为 'color' 时，决定色板作用目标 */
  action?: 'textColor' | 'backgroundColor';
  /** 子菜单：'color' 打开 70 色色板，数组打开级联菜单 */
  sub?: 'color' | SubMenuItem[];
}

/** 菜单分隔符 */
export interface MenuSeparator {
  type: 'separator';
}

/** 完整菜单列表定义 */
export type MenuList = (MenuItem | MenuSeparator)[];

const separator: MenuSeparator = { type: 'separator' };

/** 判断菜单项是否为分隔符 */
export function isMenuSeparator(item: MenuList[number]): item is MenuSeparator {
  return 'type' in item && item.type === 'separator';
}

/** 创建菜单项按钮（子菜单交互由渲染层接管） */
export function createMenuButton(
  item: MenuItem,
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
      item.onClick?.();
      closeMenu();
    });
  }

  return btn;
}

/** 插入行列菜单组 */
function buildInsertItems(editor: Editor, t: TablePlusTranslations): MenuList {
  return [
    {
      label: t.insertRowAbove,
      iconHtml: ICON_PLUS,
      onClick: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      label: t.insertRowBelow,
      iconHtml: ICON_PLUS,
      onClick: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      label: t.insertColumnLeft,
      iconHtml: ICON_PLUS,
      onClick: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      label: t.insertColumnRight,
      iconHtml: ICON_PLUS,
      onClick: () => editor.chain().focus().addColumnAfter().run(),
    },
  ];
}

/** 合并/拆分单元格菜单组 */
function buildMergeItems(editor: Editor, t: TablePlusTranslations): MenuList {
  return [
    {
      label: t.mergeCells,
      iconHtml: ICON_MERGE_CELLS,
      onClick: () => editor.chain().focus().mergeCells().run(),
    },
    {
      label: t.splitCell,
      iconHtml: ICON_SPLIT_CELLS,
      disabled: !editor.can().splitCell(),
      onClick: () => editor.chain().focus().splitCell().run(),
    },
  ];
}

/** 颜色与对齐菜单组 */
function buildStyleItems(editor: Editor, t: TablePlusTranslations): MenuList {
  const hAlign = (align: 'left' | 'center' | 'right' | 'justify') => () =>
    editor.chain().focus().setCellTextAlign(align).run();
  const vAlign = (align: CellVerticalAlign) => () =>
    editor.chain().focus().setCellVerticalAlign(align).run();

  return [
    {
      label: t.textColor,
      iconHtml: ICON_TEXT_COLOR,
      action: 'textColor',
      sub: 'color',
    },
    {
      label: t.backgroundColor,
      iconHtml: ICON_BACKGROUND_COLOR,
      action: 'backgroundColor',
      sub: 'color',
    },
    {
      label: t.horizontalAlign,
      iconHtml: ICON_ALIGN_LEFT,
      sub: [
        {
          label: t.alignLeft,
          iconHtml: ICON_ALIGN_LEFT,
          onClick: hAlign('left'),
        },
        {
          label: t.alignCenter,
          iconHtml: ICON_ALIGN_CENTER,
          onClick: hAlign('center'),
        },
        {
          label: t.alignRight,
          iconHtml: ICON_ALIGN_RIGHT,
          onClick: hAlign('right'),
        },
        {
          label: t.alignJustify,
          iconHtml: ICON_ALIGN_JUSTIFY,
          onClick: hAlign('justify'),
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
          onClick: vAlign('top'),
        },
        {
          label: t.alignMiddle,
          iconHtml: ICON_VERTICAL_ALIGN_MIDDLE,
          onClick: vAlign('middle'),
        },
        {
          label: t.alignBottom,
          iconHtml: ICON_VERTICAL_ALIGN_BOTTOM,
          onClick: vAlign('bottom'),
        },
      ],
    },
  ];
}

/** 清除内容与表头切换菜单组 */
function buildMiscItems(editor: Editor, t: TablePlusTranslations): MenuList {
  return [
    {
      label: t.clearContent,
      iconHtml: ICON_ERASER,
      onClick: () => editor.chain().focus().clearSelectedCells().run(),
    },
    {
      label: t.toggleHeaderRow,
      iconHtml: ICON_TABLE_HEADER,
      onClick: () => editor.chain().focus().toggleHeaderRow().run(),
    },
    {
      label: t.toggleHeaderColumn,
      iconHtml: ICON_TABLE_HEADER,
      onClick: () => editor.chain().focus().toggleHeaderColumn().run(),
    },
  ];
}

/** 删除行列菜单组（危险操作） */
function buildDeleteItems(editor: Editor, t: TablePlusTranslations): MenuList {
  return [
    {
      label: t.deleteRow,
      iconHtml: ICON_TRASH,
      variant: 'destructive',
      onClick: () => editor.chain().focus().deleteRow().run(),
    },
    {
      label: t.deleteColumn,
      iconHtml: ICON_TRASH,
      variant: 'destructive',
      onClick: () => editor.chain().focus().deleteColumn().run(),
    },
  ];
}

/** 构建完整的主菜单项列表 */
export function buildMainMenuItems(
  editor: Editor,
  t: TablePlusTranslations,
): MenuList {
  return [
    ...buildInsertItems(editor, t),
    separator,
    ...buildMergeItems(editor, t),
    separator,
    ...buildStyleItems(editor, t),
    separator,
    ...buildMiscItems(editor, t),
    separator,
    ...buildDeleteItems(editor, t),
  ];
}
