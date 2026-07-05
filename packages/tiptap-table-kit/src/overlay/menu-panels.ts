import type { Editor } from '@tiptap/core';
import { setCellTextColor, unsetCellTextColor } from '../commands/table-cell';
import type { TableKitTranslations } from '../i18n/types';
import type { PaletteColor } from '../palette';
import { createColorGrid } from './color-grid-builder';
import { ICON_CHEVRON_LEFT } from './icon-svgs';
import {
  buildMainMenuItems,
  createMenuButton,
  isMenuItemDef,
  type SubMenuItem,
} from './menu-items';

/** 菜单渲染上下文 */
export interface MenuRenderContext {
  menu: HTMLDivElement;
  editor: Editor | null;
  t: TableKitTranslations;
  closeMenu: () => void;
  buildMainMenu: () => void;
}

function renderMainMenu(ctx: MenuRenderContext): void {
  const { menu, editor, t, closeMenu } = ctx;
  menu.innerHTML = '';
  const items = buildMainMenuItems(editor, t);

  let separatorPending = false;

  for (const item of items) {
    if ('type' in item && item.type === 'separator') {
      separatorPending = true;
      continue;
    }

    if (!isMenuItemDef(item)) continue;

    if (separatorPending && menu.childNodes.length > 0) {
      const sep = document.createElement('div');
      sep.className = 'tiptap-table-kit-context-menu-separator';
      menu.appendChild(sep);
      separatorPending = false;
    }

    const btn = createMenuButton(item, closeMenu);

    if (item.sub) {
      const sub = item.sub;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sub === 'color') {
          const action = item.action;
          renderColorPanel(
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
          );
        } else if (Array.isArray(sub)) {
          renderSubPanel(ctx, sub);
        }
      });
    }

    menu.appendChild(btn);
  }
}

function renderSubPanel(ctx: MenuRenderContext, subItems: SubMenuItem[]): void {
  const { menu, t } = ctx;
  menu.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'tiptap-table-kit-context-menu-back';
  backBtn.innerHTML = `<span class="tiptap-table-kit-context-menu-arrow">${ICON_CHEVRON_LEFT}</span> ${t.back}`;
  backBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    renderMainMenu(ctx);
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
      ctx.closeMenu();
    });
    menu.appendChild(btn);
  }
}

function renderColorPanel(
  ctx: MenuRenderContext,
  onSelect: (color: string) => void,
  onReset: () => void,
): void {
  const { menu, t } = ctx;
  menu.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'tiptap-table-kit-context-menu-back';
  backBtn.innerHTML = `<span class="tiptap-table-kit-context-menu-arrow">${ICON_CHEVRON_LEFT}</span> ${t.back}`;
  backBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    renderMainMenu(ctx);
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
  resetBtn.textContent = t.defaultColor;
  resetBtn.addEventListener('click', () => {
    onReset();
    ctx.closeMenu();
  });
  header.appendChild(resetBtn);
  menu.appendChild(header);

  const sep2 = document.createElement('div');
  sep2.className = 'tiptap-table-kit-context-menu-separator';
  menu.appendChild(sep2);

  const grid = createColorGrid({
    onSelect: (color: PaletteColor) => {
      onSelect(color.color);
      ctx.closeMenu();
    },
    onClose: ctx.closeMenu,
  });
  menu.appendChild(grid);
}

export { renderMainMenu };
