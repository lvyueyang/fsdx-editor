/**
 * 上下文菜单入口：管理菜单的打开、跟随定位与外部点击关闭。
 * 同一时刻最多存在一个菜单；再次点击手柄或选区销毁时关闭。
 */
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';
import {
  getTablePlusStorage,
  resolveTheme,
  resolveTranslations,
} from '../storage';
import { createMenuSession } from './renderer';

/** 当前打开菜单的关闭函数（全局唯一菜单） */
let closeActiveMenu: (() => void) | null = null;

/** 关闭当前打开的上下文菜单（如有） */
export function closeActiveContextMenu(): void {
  closeActiveMenu?.();
}

/** 打开上下文菜单，定位在操作手柄旁边 */
export function openContextMenu(handleEl: HTMLElement, editor: Editor): void {
  // 菜单已打开时再次点击手柄：切换为关闭
  if (closeActiveMenu) {
    closeActiveContextMenu();
    return;
  }

  const session = createMenuSession({
    editor,
    t: resolveTranslations(editor),
    dark: resolveTheme(editor) === 'dark',
    contextMenu: getTablePlusStorage(editor)?.contextMenu,
    closeMenu,
  });

  const menu = session.menu;
  document.body.appendChild(menu);

  const stopPositioning = autoUpdate(handleEl, menu, () => {
    if (!menu.isConnected) return;
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
    const target = e.target as Node;
    if (
      menu.isConnected &&
      !menu.contains(target) &&
      !session.isClickInSubMenu(target) &&
      !handleEl.contains(target)
    ) {
      closeMenu();
    }
  };
  document.addEventListener('mousedown', handleOutsideClick, true);

  /** 关闭菜单并释放定位、子菜单与外部监听 */
  function closeMenu() {
    if (closeActiveMenu !== closeMenu) return;
    closeActiveMenu = null;
    session.closeSubMenu();
    stopPositioning();
    document.removeEventListener('mousedown', handleOutsideClick, true);
    menu.remove();
  }

  closeActiveMenu = closeMenu;
}
