import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';
import {
  clearSelectedCells,
  setCellBackgroundColor,
  setCellTextColor,
  setCellVerticalAlign,
  unsetCellBackgroundColor,
  unsetCellTextColor,
} from '../commands/table-cell';
import type { PaletteColor } from '../palette';
import { createColorGrid } from './color-grid-builder';
import {
  ICON_ALIGN_CENTER,
  ICON_ALIGN_JUSTIFY,
  ICON_ALIGN_LEFT,
  ICON_ALIGN_RIGHT,
  ICON_BG_COLOR,
  ICON_CHEVRON_LEFT,
  ICON_CHEVRON_RIGHT,
  ICON_ERASER,
  ICON_MERGE_CELLS,
  ICON_PLUS,
  ICON_SPLIT_CELLS,
  ICON_TABLE_HEADER,
  ICON_TEXT_COLOR,
  ICON_TRASH,
  ICON_VA_BOTTOM,
  ICON_VA_MIDDLE,
  ICON_VA_TOP,
} from './icon-svgs';

interface MenuItemDef {
  label: string;
  iconHtml: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
  onClick?: () => void;
  action?: 'textColor' | 'backgroundColor';
  sub?: 'color' | { label: string; iconHtml: string; onClick: () => void }[];
}

type MenuListDef = (MenuItemDef | { type: 'separator' })[];

function createMenuButton(
  item: MenuItemDef,
  _editor: Editor | null,
  closeMenu: () => void,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'tiptap-table-kit-context-menu-item';
  if (item.variant === 'destructive') {
    btn.classList.add('tiptap-table-kit-context-menu-item--destructive');
  }
  if (item.disabled) btn.disabled = true;

  btn.innerHTML = `
    <span class="tiptap-table-kit-menu-item-icon">${item.iconHtml}</span>
    <span class="tiptap-table-kit-context-menu-item-label">${item.label}</span>
    ${item.sub ? `<span class="tiptap-table-kit-context-menu-arrow">${ICON_CHEVRON_RIGHT}</span>` : ''}
  `;

  if (item.onClick && !item.sub) {
    btn.addEventListener('click', () => {
      item.onClick!();
      closeMenu();
    });
  }

  return btn;
}

const MAIN_MENU_ITEMS = (editor: Editor | null): MenuListDef => {
  const canSplit = editor?.can().splitCell() ?? false;

  return [
    {
      label: '上方插入行',
      iconHtml: ICON_PLUS,
      onClick: () => editor?.chain().focus().addRowBefore().run(),
    },
    {
      label: '下方插入行',
      iconHtml: ICON_PLUS,
      onClick: () => editor?.chain().focus().addRowAfter().run(),
    },
    {
      label: '左侧插入列',
      iconHtml: ICON_PLUS,
      onClick: () => editor?.chain().focus().addColumnBefore().run(),
    },
    {
      label: '右侧插入列',
      iconHtml: ICON_PLUS,
      onClick: () => editor?.chain().focus().addColumnAfter().run(),
    },
    { type: 'separator' as const },
    {
      label: '合并单元格',
      iconHtml: ICON_MERGE_CELLS,
      onClick: () => editor?.chain().focus().mergeCells().run(),
    },
    {
      label: '拆分单元格',
      iconHtml: ICON_SPLIT_CELLS,
      onClick: () => editor?.chain().focus().splitCell().run(),
      disabled: !canSplit,
    },
    { type: 'separator' as const },
    {
      label: '文字颜色',
      iconHtml: ICON_TEXT_COLOR,
      action: 'textColor',
      sub: 'color' as const,
    },
    {
      label: '背景色',
      iconHtml: ICON_BG_COLOR,
      action: 'backgroundColor',
      sub: 'color' as const,
    },
    {
      label: '水平对齐',
      iconHtml: ICON_ALIGN_LEFT,
      sub: [
        {
          label: '左对齐',
          iconHtml: ICON_ALIGN_LEFT,
          onClick: () =>
            (editor?.chain().focus() as any).setTextAlign('left').run(),
        },
        {
          label: '居中',
          iconHtml: ICON_ALIGN_CENTER,
          onClick: () =>
            (editor?.chain().focus() as any).setTextAlign('center').run(),
        },
        {
          label: '右对齐',
          iconHtml: ICON_ALIGN_RIGHT,
          onClick: () =>
            (editor?.chain().focus() as any).setTextAlign('right').run(),
        },
        {
          label: '两端对齐',
          iconHtml: ICON_ALIGN_JUSTIFY,
          onClick: () =>
            (editor?.chain().focus() as any).setTextAlign('justify').run(),
        },
      ],
    },
    {
      label: '垂直对齐',
      iconHtml: ICON_VA_TOP,
      sub: [
        {
          label: '顶端对齐',
          iconHtml: ICON_VA_TOP,
          onClick: () => setCellVerticalAlign(editor, 'top'),
        },
        {
          label: '居中',
          iconHtml: ICON_VA_MIDDLE,
          onClick: () => setCellVerticalAlign(editor, 'middle'),
        },
        {
          label: '底端对齐',
          iconHtml: ICON_VA_BOTTOM,
          onClick: () => setCellVerticalAlign(editor, 'bottom'),
        },
      ],
    },
    { type: 'separator' as const },
    {
      label: '清除内容',
      iconHtml: ICON_ERASER,
      onClick: () => clearSelectedCells(editor),
    },
    {
      label: '切换标题行',
      iconHtml: ICON_TABLE_HEADER,
      onClick: () => editor?.chain().focus().toggleHeaderRow().run(),
    },
    {
      label: '切换标题列',
      iconHtml: ICON_TABLE_HEADER,
      onClick: () => editor?.chain().focus().toggleHeaderColumn().run(),
    },
    { type: 'separator' as const },
    {
      label: '删除行',
      iconHtml: ICON_TRASH,
      onClick: () => editor?.chain().focus().deleteRow().run(),
      variant: 'destructive',
    },
    {
      label: '删除列',
      iconHtml: ICON_TRASH,
      onClick: () => editor?.chain().focus().deleteColumn().run(),
      variant: 'destructive',
    },
  ];
};

/**
 * 打开原生上下文菜单，定位在 handleEl 旁边
 */
export function openContextMenu(
  handleEl: HTMLElement,
  editor: Editor | null,
): void {
  const existing = document.querySelector('.tiptap-table-kit-context-menu');
  if (existing) {
    existing.remove();
    return;
  }

  if (!editor) return;

  const menu = document.createElement('div');
  menu.className = 'tiptap-table-kit-context-menu';

  let closeMenu = () => {
    cleanup?.();
    menu.remove();
  };

  function buildMainMenu() {
    menu.innerHTML = '';
    const items = MAIN_MENU_ITEMS(editor);

    let separatorPending = false;

    for (const item of items) {
      if ('type' in item && item.type === 'separator') {
        separatorPending = true;
        continue;
      }

      if (separatorPending && menu.childNodes.length > 0) {
        const sep = document.createElement('div');
        sep.className = 'tiptap-table-kit-context-menu-separator';
        menu.appendChild(sep);
        separatorPending = false;
      }

      const btn = createMenuButton(item as MenuItemDef, editor, closeMenu);

      if ((item as MenuItemDef).sub) {
        const sub = (item as MenuItemDef).sub!;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (sub === 'color') {
            const action = (item as MenuItemDef).action;
            buildColorPanel(
              (item as MenuItemDef).label,
              (color) => {
                if (action === 'textColor') {
                  setCellTextColor(editor, color);
                } else {
                  setCellBackgroundColor(editor, color);
                }
                closeMenu();
              },
              () => {
                if (action === 'textColor') {
                  unsetCellTextColor(editor);
                } else {
                  unsetCellBackgroundColor(editor);
                }
                closeMenu();
              },
            );
          } else if (Array.isArray(sub)) {
            buildSubPanel((item as MenuItemDef).label, sub);
          }
        });
      }

      menu.appendChild(btn);
    }
  }

  function buildSubPanel(
    _title: string,
    subItems: { label: string; iconHtml: string; onClick: () => void }[],
  ) {
    menu.innerHTML = '';

    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'tiptap-table-kit-context-menu-back';
    backBtn.innerHTML = `<span class="tiptap-table-kit-context-menu-arrow">${ICON_CHEVRON_LEFT}</span> 返回`;
    backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      buildMainMenu();
    });
    menu.appendChild(backBtn);

    const sep = document.createElement('div');
    sep.className = 'tiptap-table-kit-context-menu-separator';
    menu.appendChild(sep);

    for (const subItem of subItems) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tiptap-table-kit-context-menu-item';
      btn.innerHTML = `
        <span class="tiptap-table-kit-menu-item-icon">${subItem.iconHtml}</span>
        <span class="tiptap-table-kit-context-menu-item-label">${subItem.label}</span>
      `;
      btn.addEventListener('click', () => {
        subItem.onClick();
        closeMenu();
      });
      menu.appendChild(btn);
    }
  }

  function buildColorPanel(
    _title: string,
    onSelect: (color: string) => void,
    onReset: () => void,
  ) {
    menu.innerHTML = '';

    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'tiptap-table-kit-context-menu-back';
    backBtn.innerHTML = `<span class="tiptap-table-kit-context-menu-arrow">${ICON_CHEVRON_LEFT}</span> 返回`;
    backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      buildMainMenu();
    });
    menu.appendChild(backBtn);

    const sep = document.createElement('div');
    sep.className = 'tiptap-table-kit-context-menu-separator';
    menu.appendChild(sep);

    const header = document.createElement('div');
    header.className = 'tiptap-table-kit-context-menu-color-header';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'tiptap-table-kit-color-reset-btn';
    resetBtn.textContent = '默认颜色';
    resetBtn.addEventListener('click', () => {
      onReset();
      closeMenu();
    });
    header.appendChild(resetBtn);
    menu.appendChild(header);

    const sep2 = document.createElement('div');
    sep2.className = 'tiptap-table-kit-context-menu-separator';
    menu.appendChild(sep2);

    const grid = createColorGrid({
      onSelect: (color: PaletteColor) => {
        onSelect(color.color);
        closeMenu();
      },
      onClose: closeMenu,
    });
    menu.appendChild(grid);
  }

  buildMainMenu();

  document.body.appendChild(menu);

  const cleanup = autoUpdate(handleEl, menu, () => {
    if (!menu.isConnected) {
      cleanup?.();
      return;
    }
    computePosition(handleEl, menu, {
      placement: 'bottom-start',
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      Object.assign(menu.style, {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: '100',
      });
    });
  });

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      menu.isConnected &&
      !menu.contains(e.target as Node) &&
      e.target !== handleEl &&
      !handleEl.contains(e.target as Node)
    ) {
      closeMenu();
    }
  };

  document.addEventListener('mousedown', handleOutsideClick, true);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.removedNodes) {
        if (node === menu) {
          cleanup?.();
          document.removeEventListener('mousedown', handleOutsideClick, true);
          observer.disconnect();
          return;
        }
      }
    }
  });
  observer.observe(document.body, { childList: true });

  const origCloseMenu = closeMenu;
  closeMenu = () => {
    observer.disconnect();
    origCloseMenu();
  };
}
