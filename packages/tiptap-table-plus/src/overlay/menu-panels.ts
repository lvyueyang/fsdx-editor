import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';
import { cellAround } from '@tiptap/pm/tables';
import { setCellTextColor, unsetCellTextColor } from '../commands/table-cell';
import type { TablePlusTranslations } from '../i18n/types';
import type { PaletteColor } from '../palette';
import { createColorGrid } from './color-grid-builder';
import {
  buildMainMenuItems,
  createMenuButton,
  isMenuItemDef,
  type MenuListDef,
  type SubMenuItem,
} from './menu-items';

/** 菜单渲染上下文 */
export interface MenuRenderContext {
  menu: HTMLDivElement;
  editor: Editor | null;
  t: TablePlusTranslations;
  closeMenu: () => void;
  buildMainMenu: () => void;
  contextMenu?: (items: MenuListDef) => MenuListDef;
}

let activeSubMenu: HTMLElement | null = null;
let activeParentBtn: HTMLButtonElement | null = null;
let subMenuPositionCleanup: (() => void) | null = null;

export function closeSubMenu() {
  subMenuPositionCleanup?.();
  subMenuPositionCleanup = null;
  if (activeSubMenu) {
    activeSubMenu.remove();
    activeSubMenu = null;
  }
  if (activeParentBtn) {
    activeParentBtn.classList.remove(
      'tiptap-table-plus-context-menu-item--active',
    );
    activeParentBtn = null;
  }
}

export function isClickInSubMenu(target: Node): boolean {
  return !!activeSubMenu?.contains(target);
}

function positionSubMenu(
  parentBtn: HTMLButtonElement,
  subMenu: HTMLElement,
): () => void {
  return autoUpdate(parentBtn, subMenu, () => {
    if (!subMenu.isConnected) return;
    computePosition(parentBtn, subMenu, {
      placement: 'right-start',
      middleware: [offset({ mainAxis: 4 }), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      Object.assign(subMenu.style, {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: '101',
      });
    });
  });
}

function openCascadingSubMenu(
  parentBtn: HTMLButtonElement,
  subItems: SubMenuItem[],
  ctx: MenuRenderContext,
) {
  closeSubMenu();

  const subMenu = document.createElement('div');
  subMenu.className = 'tiptap-table-plus tiptap-table-plus-context-submenu';
  if (ctx.menu.classList.contains('tiptap-table-plus-dark')) {
    subMenu.classList.add('tiptap-table-plus-dark');
  }

  for (const subItem of subItems) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tiptap-table-plus-context-menu-item';
    btn.innerHTML = `
      <span class="tiptap-table-plus-menu-item-icon">${subItem.iconHtml}</span>
      <span class="tiptap-table-plus-context-menu-item-label">${subItem.label}</span>
    `;
    btn.addEventListener('click', () => {
      subItem.onClick();
      ctx.closeMenu();
    });
    subMenu.appendChild(btn);
  }

  document.body.appendChild(subMenu);
  subMenuPositionCleanup = positionSubMenu(parentBtn, subMenu);

  activeSubMenu = subMenu;
  activeParentBtn = parentBtn;
  parentBtn.classList.add('tiptap-table-plus-context-menu-item--active');
}

function openCascadingColorSubMenu(
  parentBtn: HTMLButtonElement,
  ctx: MenuRenderContext,
  onSelect: (color: string) => void,
  onReset: () => void,
  currentColor: string,
) {
  closeSubMenu();

  const subMenu = document.createElement('div');
  subMenu.className = 'tiptap-table-plus tiptap-table-plus-context-submenu';
  if (ctx.menu.classList.contains('tiptap-table-plus-dark')) {
    subMenu.classList.add('tiptap-table-plus-dark');
  }

  const header = document.createElement('div');
  header.className = 'tiptap-table-plus-context-menu-color-header';
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'tiptap-table-plus-color-reset-btn';
  resetBtn.textContent = ctx.t.defaultColor;
  resetBtn.addEventListener('click', () => {
    onReset();
    ctx.closeMenu();
  });
  header.appendChild(resetBtn);
  subMenu.appendChild(header);

  const sep = document.createElement('div');
  sep.className = 'tiptap-table-plus-context-menu-separator';
  subMenu.appendChild(sep);

  const grid = createColorGrid({
    onSelect: (color: PaletteColor) => {
      onSelect(color.color);
      ctx.closeMenu();
    },
    onClose: ctx.closeMenu,
  });
  subMenu.appendChild(grid);

  const divider = document.createElement('div');
  divider.className = 'tiptap-table-plus-context-menu-separator';
  subMenu.appendChild(divider);

  const customRow = document.createElement('div');
  customRow.className = 'tiptap-table-plus-custom-color-row';

  const customLabel = document.createElement('span');
  customLabel.className = 'tiptap-table-plus-custom-color-label';
  customLabel.textContent = ctx.t.customColor;

  const customInput = document.createElement('input');
  customInput.type = 'color';
  customInput.className = 'tiptap-table-plus-custom-color-input';
  customInput.value = currentColor;
  console.log('currentColor: ', currentColor);
  customInput.addEventListener('input', () => {
    onSelect(customInput.value);
    ctx.closeMenu();
  });

  customRow.appendChild(customLabel);
  customRow.appendChild(customInput);
  subMenu.appendChild(customRow);

  document.body.appendChild(subMenu);
  subMenuPositionCleanup = positionSubMenu(parentBtn, subMenu);

  activeSubMenu = subMenu;
  activeParentBtn = parentBtn;
  parentBtn.classList.add('tiptap-table-plus-context-menu-item--active');
}

function renderMainMenu(ctx: MenuRenderContext): void {
  const { menu, editor, t, closeMenu } = ctx;
  menu.innerHTML = '';
  let items = buildMainMenuItems(editor, t);

  if (ctx.contextMenu) {
    items = ctx.contextMenu(items);
  }

  let separatorPending = false;

  for (const item of items) {
    if ('type' in item && item.type === 'separator') {
      separatorPending = true;
      continue;
    }

    if (!isMenuItemDef(item)) continue;

    if (separatorPending && menu.childNodes.length > 0) {
      const sep = document.createElement('div');
      sep.className = 'tiptap-table-plus-context-menu-separator';
      menu.appendChild(sep);
      separatorPending = false;
    }

    const btn = createMenuButton(item, closeMenu);

    if (item.sub) {
      const sub = item.sub;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (activeParentBtn === btn) {
          closeSubMenu();
          return;
        }
        if (sub === 'color') {
          const action = item.action;
          const curColor = (() => {
            const defaultColor = action === 'textColor' ? '#000000' : '#ffffff';
            if (!editor) return defaultColor;
            const { $anchor } = editor.state.selection;
            const cell = cellAround($anchor);
            if (!cell) return defaultColor;
            const node = editor.state.doc.nodeAt(cell.pos);
            if (!node) return defaultColor;
            const attrName =
              action === 'textColor' ? 'textColor' : 'backgroundColor';
            return (node.attrs[attrName] as string) || defaultColor;
          })();
          openCascadingColorSubMenu(
            btn,
            ctx,
            (color) => {
              if (action === 'textColor') {
                setCellTextColor(editor, color);
              } else {
                editor?.chain().focus().setNodeBackgroundColor(color).run();
              }
              closeMenu();
            },
            () => {
              if (action === 'textColor') {
                unsetCellTextColor(editor);
              } else {
                editor?.chain().focus().unsetNodeBackgroundColor().run();
              }
              closeMenu();
            },
            curColor,
          );
        } else if (Array.isArray(sub)) {
          openCascadingSubMenu(btn, sub, ctx);
        }
      });
    }

    menu.appendChild(btn);
  }
}

export { renderMainMenu };
