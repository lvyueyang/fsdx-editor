import type { Editor } from '@tiptap/core';
import type { ImageAlign } from '../extensions/image-upload';
import {
  addBtn,
  createBubbleInput,
  createDivider,
  createSelect,
  updateBtnStates,
} from '../shared/controls';
import { bindTooltips } from '../shared/tooltip';
import { sanitizeUrl } from '../utils/link';
import { ICONS, updateInputs, updateSelectStates } from './toolbar-shared';

const BTN_CLASS = 'fsdx-editor-bubble-btn';
const DIVIDER_CLASS = 'fsdx-editor-bubble-divider';
const WIDTH_SELECT_CLASS = 'fsdx-editor-bubble-select';
const ALT_INPUT_CLASS = 'fsdx-editor-bubble-input';

/** 图片宽度百分比预设 */
const WIDTH_OPTIONS = [
  { label: '100%', value: '100%' },
  { label: '75%', value: '75%' },
  { label: '50%', value: '50%' },
  { label: '25%', value: '25%' },
];

/** 当前选中图片的 src */
function getSelectedImageSrc(editor: Editor): string | null {
  const attrs = editor.getAttributes('imageUpload');
  return (attrs.src as string) || null;
}

/** 当前选中图片的对齐方式 */
function getSelectedImageAlign(editor: Editor): ImageAlign {
  const attrs = editor.getAttributes('imageUpload');
  return (attrs.align as ImageAlign) || 'center';
}

/** 当前选中图片的宽度（百分比字符串、像素数字字符串或 null） */
function getSelectedImageWidth(editor: Editor): string | null {
  const attrs = editor.getAttributes('imageUpload');
  const width = attrs.width;
  if (typeof width === 'string') return width;
  return typeof width === 'number' ? String(width) : null;
}

/** 宽度下拉显示：百分比原样，像素补 px 单位，无宽度显示「原始」 */
function formatImageWidthLabel(value: string | null): string {
  if (!value) return '原始';
  return value.endsWith('%') ? value : `${value}px`;
}

/** 当前选中图片的 alt 文本 */
function getSelectedImageAlt(editor: Editor): string {
  const attrs = editor.getAttributes('imageUpload');
  return (attrs.alt as string) || '';
}

export function createImageMenuElement(): HTMLElement {
  const menuEl = document.createElement('div');
  menuEl.className = 'fsdx-editor-bubble-menu fsdx-editor-image-menu';
  return menuEl;
}

/**
 * 图片选中浮层（第二个 BubbleMenu 实例）：对齐 / 宽度 / 替代文本 / 删除 / 查看原图。
 * 仅在选中 imageUpload 节点时显示，由 create-editor 注册。
 */
export function populateImageMenu(
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
    updateSelectStates(menuEl, WIDTH_SELECT_CLASS, editor);
    updateInputs(menuEl, ALT_INPUT_CLASS, editor);
  };

  // ===== 对齐 =====
  const alignOptions: { icon: string; title: string; align: ImageAlign }[] = [
    { icon: ICONS.alignLeft, title: '左对齐', align: 'left' },
    { icon: ICONS.alignCenter, title: '居中', align: 'center' },
    { icon: ICONS.alignRight, title: '右对齐', align: 'right' },
  ];
  for (const { icon, title, align } of alignOptions) {
    add(
      icon,
      title,
      (e) => getSelectedImageAlign(e) === align,
      (e) => {
        e.chain().focus().setImageAlign(align).run();
        refreshAll();
      },
    );
  }

  // ===== 宽度（百分比） =====
  createSelect(
    menuEl,
    WIDTH_SELECT_CLASS,
    editor,
    '',
    '图片宽度',
    WIDTH_OPTIONS,
    getSelectedImageWidth,
    (e, value) => {
      e.chain()
        .focus()
        .updateAttributes('imageUpload', { width: value, height: null })
        .run();
      refreshAll();
    },
    (e) => {
      e.chain()
        .focus()
        .updateAttributes('imageUpload', { width: null, height: null })
        .run();
      refreshAll();
    },
    '原始',
    formatImageWidthLabel,
  );

  // ===== 替代文本（alt） =====
  createBubbleInput(
    menuEl,
    ALT_INPUT_CLASS,
    editor,
    '设置替代文本',
    '替代文本',
    getSelectedImageAlt,
    (e, value) => {
      e.chain()
        .focus()
        .updateAttributes('imageUpload', { alt: value || null })
        .run();
    },
  );

  div();

  // ===== 查看原图 =====
  add(
    ICONS.externalLink,
    '查看原图',
    () => false,
    (e) => {
      const src = getSelectedImageSrc(e);
      if (!src) return;
      const safeUrl = sanitizeUrl(src, window.location.href);
      if (safeUrl) {
        window.open(safeUrl, '_blank', 'noopener,noreferrer');
      }
    },
  );

  // ===== 删除图片 =====
  add(
    ICONS.delete,
    '删除图片',
    () => false,
    (e) => e.chain().focus().deleteSelection().run(),
  );

  refreshAll();
  return refreshAll;
}
