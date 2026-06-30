import type { Editor } from '@tiptap/core';
import {
  addBtn,
  createDivider,
  ICONS,
  triggerMediaUpload,
  updateBtnStates,
} from './toolbar-shared';
import type { MediaUploadConfig } from './types';

const BTN_CLASS = 'fsdx-editor-bubble-btn';
const DIVIDER_CLASS = 'fsdx-editor-bubble-divider';

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
): void {
  menuEl.innerHTML = '';

  const add = (
    icon: string,
    title: string,
    check: (e: Editor) => boolean,
    action: (e: Editor) => void,
  ) => addBtn(menuEl, BTN_CLASS, editor, icon, title, check, action);

  const div = () => menuEl.appendChild(createDivider(DIVIDER_CLASS));

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

  div();

  add(
    ICONS.h1,
    '一级标题',
    (e) => e.isActive('heading', { level: 1 }),
    (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
  );
  add(
    ICONS.h2,
    '二级标题',
    (e) => e.isActive('heading', { level: 2 }),
    (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  );
  add(
    ICONS.h3,
    '三级标题',
    (e) => e.isActive('heading', { level: 3 }),
    (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  );

  div();

  add(
    ICONS.blockquote,
    '引用',
    (e) => e.isActive('blockquote'),
    (e) => e.chain().focus().toggleBlockquote().run(),
  );

  div();

  add(
    ICONS.link,
    '插入/编辑链接',
    () => false,
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

  updateBtnStates(menuEl, BTN_CLASS, editor);
}
