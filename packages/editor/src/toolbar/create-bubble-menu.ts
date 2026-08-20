import type { Editor } from '@tiptap/core';
import {
  addBtn,
  createColorDropdown,
  createDivider,
  updateBtnStates,
} from '../shared/controls';
import { createLinkDropdown } from '../shared/link-dropdown';
import { bindTooltips } from '../shared/tooltip';
import { ICONS } from './toolbar-shared';

const BTN_CLASS = 'easyx-editor-bubble-btn';
const DIVIDER_CLASS = 'easyx-editor-bubble-divider';

export function createBubbleMenuElement(): HTMLElement {
  const menuEl = document.createElement('div');
  menuEl.className = 'easyx-editor-bubble-menu';
  return menuEl;
}

/**
 * 气泡菜单：仅承载行内文本格式化高频操作，
 * 块级操作与媒体插入留在顶部工具栏。
 */
export function populateBubbleMenu(
  menuEl: HTMLElement,
  editor: Editor,
): () => void {
  menuEl.innerHTML = '';
  bindTooltips(menuEl);

  const add = (
    icon: string,
    title: string,
    check: (e: Editor) => boolean,
    action: (e: Editor) => void,
  ) => addBtn(menuEl, BTN_CLASS, editor, icon, title, check, action);

  const div = () => menuEl.appendChild(createDivider(DIVIDER_CLASS));

  const refreshAll = () => {
    updateBtnStates(menuEl, BTN_CLASS, editor);
  };

  // ===== 文本样式 =====
  add(
    ICONS.bold,
    '加粗 (Ctrl+B)',
    (e) => e.isActive('bold'),
    (e) => e.chain().focus().toggleBold().run(),
  );
  add(
    ICONS.italic,
    '斜体 (Ctrl+I)',
    (e) => e.isActive('italic'),
    (e) => e.chain().focus().toggleItalic().run(),
  );
  add(
    ICONS.underline,
    '下划线 (Ctrl+U)',
    (e) => e.isActive('underline'),
    (e) => e.chain().focus().toggleUnderline().run(),
  );
  add(
    ICONS.strike,
    '删除线',
    (e) => e.isActive('strike'),
    (e) => e.chain().focus().toggleStrike().run(),
  );

  div();

  // ===== 文字颜色 =====
  createColorDropdown(
    menuEl,
    BTN_CLASS,
    editor,
    ICONS.textColor,
    '文字颜色',
    'textColor',
  );

  // ===== 高亮背景色 =====
  createColorDropdown(
    menuEl,
    BTN_CLASS,
    editor,
    ICONS.highlight,
    '背景高亮色',
    'highlight',
  );

  div();

  // ===== 链接 =====
  createLinkDropdown(menuEl, BTN_CLASS, editor, ICONS.link, '插入/编辑链接');

  // ===== 清除格式 =====
  add(
    ICONS.clearFormat,
    '清除格式',
    () => false,
    (e) => e.chain().focus().clearNodes().unsetAllMarks().run(),
  );

  refreshAll();
  return refreshAll;
}
