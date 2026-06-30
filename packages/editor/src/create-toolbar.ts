import type { Editor } from '@tiptap/core';
import {
  addBtn,
  createDivider,
  ICONS,
  triggerMediaUpload,
  updateBtnStates,
} from './toolbar-shared';
import type { MediaUploadConfig } from './types';

const BTN_CLASS = 'fsdx-editor-toolbar-btn';
const DIVIDER_CLASS = 'fsdx-editor-toolbar-divider';

export function createToolbarElement(): HTMLElement {
  const toolbarEl = document.createElement('div');
  toolbarEl.className = 'fsdx-editor-toolbar';
  return toolbarEl;
}

export function populateToolbar(
  toolbarEl: HTMLElement,
  editor: Editor,
  mediaConfig?: {
    image?: MediaUploadConfig;
    video?: MediaUploadConfig;
    audio?: MediaUploadConfig;
    attachment?: MediaUploadConfig;
  },
): void {
  toolbarEl.innerHTML = '';

  const add = (
    icon: string,
    title: string,
    check: (e: Editor) => boolean,
    action: (e: Editor) => void,
  ) => addBtn(toolbarEl, BTN_CLASS, editor, icon, title, check, action);

  const div = () => toolbarEl.appendChild(createDivider(DIVIDER_CLASS));

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
  add(
    ICONS.codeBlock,
    '代码块',
    (e) => e.isActive('codeBlock'),
    (e) => e.chain().focus().toggleCodeBlock().run(),
  );

  div();

  add(
    ICONS.bulletList,
    '无序列表',
    (e) => e.isActive('bulletList'),
    (e) => e.chain().focus().toggleBulletList().run(),
  );
  add(
    ICONS.orderedList,
    '有序列表',
    (e) => e.isActive('orderedList'),
    (e) => e.chain().focus().toggleOrderedList().run(),
  );

  div();

  add(
    ICONS.hr,
    '分割线',
    () => false,
    (e) => e.chain().focus().setHorizontalRule().run(),
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

  updateBtnStates(toolbarEl, BTN_CLASS, editor);
}
