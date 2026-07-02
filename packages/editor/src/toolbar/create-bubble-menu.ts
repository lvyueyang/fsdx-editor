import type { Editor } from '@tiptap/core';
import {
  addBtn,
  createColorBtn,
  createDivider,
  createSelect,
  updateBtnStates,
} from '../shared/controls';
import type { MediaUploadConfig } from '../types';
import { triggerMediaUpload } from '../utils/media-upload';
import {
  FONT_SIZE_OPTIONS,
  ICONS,
  updateColorIndicators,
  updateSelectStates,
} from './toolbar-shared';

const BTN_CLASS = 'fsdx-editor-bubble-btn';
const DIVIDER_CLASS = 'fsdx-editor-bubble-divider';
const SELECT_CLASS = 'fsdx-editor-bubble-select';

export function createBubbleMenuElement(): HTMLElement {
  const menuEl = document.createElement('div');
  menuEl.className = 'fsdx-editor-bubble-menu';
  return menuEl;
}

export function populateBubbleMenu(
  menuEl: HTMLElement,
  editor: Editor,
  mediaConfig?: {
    image?: MediaUploadConfig;
    video?: MediaUploadConfig;
    audio?: MediaUploadConfig;
    attachment?: MediaUploadConfig;
  },
): () => void {
  menuEl.innerHTML = '';

  const add = (
    icon: string,
    title: string,
    check: (e: Editor) => boolean,
    action: (e: Editor) => void,
  ) => addBtn(menuEl, BTN_CLASS, editor, icon, title, check, action);

  const div = () => menuEl.appendChild(createDivider(DIVIDER_CLASS));

  const refreshAll = () => {
    updateBtnStates(menuEl, BTN_CLASS, editor);
    updateSelectStates(menuEl, SELECT_CLASS, editor);
    updateColorIndicators(menuEl, BTN_CLASS, editor);
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
  add(
    ICONS.code,
    '行内代码',
    (e) => e.isActive('code'),
    (e) => e.chain().focus().toggleCode().run(),
  );
  add(
    ICONS.subscript,
    '下标',
    (e) => e.isActive('subscript'),
    (e) => e.chain().focus().toggleSubscript().run(),
  );
  add(
    ICONS.superscript,
    '上标',
    (e) => e.isActive('superscript'),
    (e) => e.chain().focus().toggleSuperscript().run(),
  );

  div();

  // ===== 标题 =====
  for (const level of [1, 2, 3] as const) {
    const key = `h${level}` as keyof typeof ICONS;
    const labels = ['', '一级标题', '二级标题', '三级标题'];
    add(
      ICONS[key],
      labels[level],
      (e) => e.isActive('heading', { level }),
      (e) => e.chain().focus().toggleHeading({ level }).run(),
    );
  }

  div();

  // ===== 字体大小 =====
  createSelect(
    menuEl,
    SELECT_CLASS,
    editor,
    ICONS.fontSize,
    '字体大小',
    FONT_SIZE_OPTIONS,
    (e) => {
      const attrs = e.getAttributes('textStyle');
      return (attrs.fontSize as string) || null;
    },
    (e, value) => e.chain().focus().setFontSize(value).run(),
    (e) => e.chain().focus().unsetFontSize().run(),
  );

  div();

  // ===== 文字颜色 =====
  createColorBtn(
    menuEl,
    BTN_CLASS,
    editor,
    ICONS.textColor,
    '文字颜色',
    (e) => !!e.getAttributes('textStyle').color,
    (e, color) => e.chain().focus().setColor(color).run(),
    'color',
  );

  // ===== 高亮背景色 =====
  createColorBtn(
    menuEl,
    BTN_CLASS,
    editor,
    ICONS.highlight,
    '背景高亮色',
    (e) => !!e.getAttributes('textStyle').backgroundColor,
    (e, color) => e.chain().focus().setBackgroundColor(color).run(),
    'backgroundColor',
  );

  div();

  // ===== 文本对齐 =====
  const alignBtns = [
    { icon: ICONS.alignLeft, title: '左对齐', align: 'left' as const },
    { icon: ICONS.alignCenter, title: '居中', align: 'center' as const },
    { icon: ICONS.alignRight, title: '右对齐', align: 'right' as const },
  ];
  for (const { icon, title, align } of alignBtns) {
    add(
      icon,
      title,
      (e) => e.isActive({ textAlign: align }),
      (e) => e.chain().focus().setTextAlign(align).run(),
    );
  }

  div();

  // ===== 块级 =====
  add(
    ICONS.blockquote,
    '引用',
    (e) => e.isActive('blockquote'),
    (e) => e.chain().focus().toggleBlockquote().run(),
  );

  div();

  // ===== 链接 =====
  add(
    ICONS.link,
    '插入/编辑链接',
    (e) => e.isActive('link'),
    (e) => {
      const previousUrl = e.getAttributes('link').href || '';
      const url = window.prompt('请输入链接地址：', previousUrl);
      if (url === null) return;
      if (url === '') {
        e.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        e.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }
    },
  );

  div();

  // ===== 清除格式 =====
  add(
    ICONS.clearFormat,
    '清除格式',
    () => false,
    (e) => e.chain().focus().clearNodes().unsetAllMarks().run(),
  );

  // ===== 媒体 =====
  if (mediaConfig) {
    const { image, video, audio, attachment } = mediaConfig;

    if (image || video || audio || attachment) {
      div();
    }

    if (image) {
      add(
        ICONS.image,
        '插入图片',
        () => false,
        (e) => {
          triggerMediaUpload('image/*', e, 'imageUpload', image.upload);
        },
      );
    }

    if (video) {
      add(
        ICONS.video,
        '插入视频',
        () => false,
        (e) => {
          triggerMediaUpload('video/*', e, 'videoNode', video.upload);
        },
      );
    }

    if (audio) {
      add(
        ICONS.audio,
        '插入音频',
        () => false,
        (e) => {
          triggerMediaUpload('audio/*', e, 'audioNode', audio.upload);
        },
      );
    }

    if (attachment) {
      add(
        ICONS.attachment,
        '插入附件',
        () => false,
        (e) => {
          triggerMediaUpload('*/*', e, 'attachmentNode', attachment.upload);
        },
      );
    }
  }

  refreshAll();
  return refreshAll;
}
