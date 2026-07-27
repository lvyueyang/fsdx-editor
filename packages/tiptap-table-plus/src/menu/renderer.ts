/**
 * 上下文菜单渲染层：负责主菜单与级联子菜单（含色板）的 DOM 构建。
 * 每次打开菜单创建一个 session，子菜单状态随 session 生命周期回收，
 * 避免模块级可变状态在多编辑器实例间串扰。
 */
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';
import { cellAround } from '@tiptap/pm/tables';
import type { TablePlusTranslations } from '../i18n/types';
import { createColorGrid } from './color-grid';
import {
  buildMainMenuItems,
  createMenuButton,
  isMenuSeparator,
  type MenuItem,
  type MenuList,
  type SubMenuItem,
} from './items';

/** 创建菜单 session 所需的上下文 */
export interface MenuSessionOptions {
  editor: Editor;
  t: TablePlusTranslations;
  dark: boolean;
  contextMenu?: (items: MenuList) => MenuList;
  closeMenu: () => void;
}

/** 一次菜单打开的会话：菜单元素与子菜单管理 */
export interface MenuSession {
  menu: HTMLDivElement;
  closeSubMenu: () => void;
  isClickInSubMenu: (target: Node) => boolean;
}

/** 色板作用目标（与单元格属性名一致） */
type ColorAction = 'textColor' | 'backgroundColor';

/** 创建菜单 session 并渲染主菜单 */
export function createMenuSession(options: MenuSessionOptions): MenuSession {
  const { editor, t, dark, contextMenu, closeMenu } = options;

  let subMenuEl: HTMLElement | null = null;
  let parentBtn: HTMLButtonElement | null = null;
  let stopPositioning: (() => void) | null = null;

  /** 关闭当前打开的子菜单并清理定位 */
  function closeSubMenu() {
    stopPositioning?.();
    stopPositioning = null;
    subMenuEl?.remove();
    subMenuEl = null;
    parentBtn?.classList.remove('tiptap-table-plus-context-menu-item--active');
    parentBtn = null;
  }

  /** 判断点击是否发生在子菜单内（用于外部点击关闭的排除） */
  function isClickInSubMenu(target: Node): boolean {
    return !!subMenuEl?.contains(target);
  }

  /** 将子菜单挂载到 body 并跟随父按钮定位 */
  function mountSubMenu(btn: HTMLButtonElement, el: HTMLElement) {
    el.className = 'tiptap-table-plus tiptap-table-plus-context-submenu';
    if (dark) el.classList.add('tiptap-table-plus-dark');
    document.body.appendChild(el);

    stopPositioning = autoUpdate(btn, el, () => {
      if (!el.isConnected) return;
      computePosition(btn, el, {
        placement: 'right-start',
        middleware: [offset({ mainAxis: 4 }), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        Object.assign(el.style, {
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
          zIndex: '101',
        });
      });
    });

    subMenuEl = el;
    parentBtn = btn;
    btn.classList.add('tiptap-table-plus-context-menu-item--active');
  }

  /** 打开级联列表子菜单 */
  function openSubMenu(btn: HTMLButtonElement, subItems: SubMenuItem[]) {
    closeSubMenu();
    const el = document.createElement('div');
    for (const subItem of subItems) {
      const subBtn = document.createElement('button');
      subBtn.type = 'button';
      subBtn.className = 'tiptap-table-plus-context-menu-item';
      subBtn.innerHTML = `
        <span class="tiptap-table-plus-menu-item-icon">${subItem.iconHtml}</span>
        <span class="tiptap-table-plus-context-menu-item-label">${subItem.label}</span>
      `;
      subBtn.addEventListener('click', () => {
        subItem.onClick();
        closeMenu();
      });
      el.appendChild(subBtn);
    }
    mountSubMenu(btn, el);
  }

  /** 创建分隔线元素 */
  function createSeparatorEl(): HTMLDivElement {
    const el = document.createElement('div');
    el.className = 'tiptap-table-plus-context-menu-separator';
    return el;
  }

  /** 读取当前单元格的颜色属性，作为自定义颜色输入的初始值 */
  function getCurrentCellColor(action: ColorAction): string {
    const fallback = action === 'textColor' ? '#000000' : '#ffffff';
    const cell = cellAround(editor.state.selection.$anchor);
    const node = cell ? editor.state.doc.nodeAt(cell.pos) : null;
    const value = node?.attrs[action];
    // input[type=color] 只接受 #rrggbb，其他格式回退到默认色
    return typeof value === 'string' && value.startsWith('#')
      ? value
      : fallback;
  }

  /** 应用颜色（color 为 null 时重置为默认色），随后关闭菜单 */
  function applyColor(action: ColorAction, color: string | null) {
    const chain = editor.chain().focus();
    if (action === 'textColor') {
      if (color) chain.setCellTextColor(color).run();
      else chain.unsetCellTextColor().run();
    } else {
      if (color) chain.setNodeBackgroundColor(color).run();
      else chain.unsetNodeBackgroundColor().run();
    }
    closeMenu();
  }

  /** 打开颜色子菜单（默认色重置 + 色板 + 自定义颜色） */
  function openColorSubMenu(btn: HTMLButtonElement, action: ColorAction) {
    closeSubMenu();
    const el = document.createElement('div');

    const header = document.createElement('div');
    header.className = 'tiptap-table-plus-context-menu-color-header';
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'tiptap-table-plus-color-reset-btn';
    resetBtn.textContent = t.defaultColor;
    resetBtn.addEventListener('click', () => applyColor(action, null));
    header.appendChild(resetBtn);

    const grid = createColorGrid({
      onSelect: (color) => applyColor(action, color.color),
      onClose: closeMenu,
    });

    const customRow = document.createElement('div');
    customRow.className = 'tiptap-table-plus-custom-color-row';
    const customLabel = document.createElement('span');
    customLabel.className = 'tiptap-table-plus-custom-color-label';
    customLabel.textContent = t.customColor;
    const customInput = document.createElement('input');
    customInput.type = 'color';
    customInput.className = 'tiptap-table-plus-custom-color-input';
    customInput.value = getCurrentCellColor(action);
    customInput.addEventListener('input', () =>
      applyColor(action, customInput.value),
    );
    customRow.append(customLabel, customInput);

    el.append(
      header,
      createSeparatorEl(),
      grid,
      createSeparatorEl(),
      customRow,
    );
    mountSubMenu(btn, el);
  }

  /** 创建主菜单项按钮并接管子菜单展开交互 */
  function createItemButton(item: MenuItem): HTMLButtonElement {
    const btn = createMenuButton(item, closeMenu);
    if (!item.sub) return btn;

    const sub = item.sub;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      // 再次点击同一按钮：收起子菜单
      if (parentBtn === btn) {
        closeSubMenu();
        return;
      }
      if (sub === 'color') {
        openColorSubMenu(btn, item.action ?? 'textColor');
      } else {
        openSubMenu(btn, sub);
      }
    });
    return btn;
  }

  /** 渲染主菜单；开头/连续/结尾的分隔符不渲染 */
  function renderMainMenu(menu: HTMLDivElement) {
    const items = contextMenu
      ? contextMenu(buildMainMenuItems(editor, t))
      : buildMainMenuItems(editor, t);

    let separatorPending = false;
    for (const item of items) {
      if (isMenuSeparator(item)) {
        separatorPending = true;
        continue;
      }
      if (separatorPending && menu.childNodes.length > 0) {
        menu.appendChild(createSeparatorEl());
      }
      separatorPending = false;
      menu.appendChild(createItemButton(item));
    }
  }

  const menu = document.createElement('div');
  menu.className = 'tiptap-table-plus tiptap-table-plus-context-menu';
  if (dark) menu.classList.add('tiptap-table-plus-dark');
  renderMainMenu(menu);

  return { menu, closeSubMenu, isClickInSubMenu };
}
