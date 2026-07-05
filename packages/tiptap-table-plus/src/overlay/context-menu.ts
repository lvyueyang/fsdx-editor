import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';

import { getTablePlusTheme, getTablePlusTranslations } from '../table-plus';
import { type MenuRenderContext, renderMainMenu } from './menu-panels';

/**
 * 打开原生上下文菜单，定位在 handleEl 旁边
 */
export function openContextMenu(
  handleEl: HTMLElement,
  editor: Editor | null,
): void {
  const existing = document.querySelector('.tiptap-table-plus-context-menu');
  if (existing) {
    existing.remove();
    return;
  }

  if (!editor) return;

  const t = getTablePlusTranslations(editor);

  const menu = document.createElement('div');
  menu.className = 'tiptap-table-plus tiptap-table-plus-context-menu';
  if (getTablePlusTheme(editor) === 'dark') {
    menu.classList.add('tiptap-table-plus-dark');
  }

  let closeMenu = () => {
    cleanup?.();
    menu.remove();
  };

  const ctx: MenuRenderContext = {
    menu,
    editor,
    t,
    closeMenu,
    buildMainMenu: () => renderMainMenu(ctx),
  };

  renderMainMenu(ctx);

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
