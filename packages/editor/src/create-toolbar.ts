import type { Editor } from '@tiptap/core';
import {
  addBtn,
  createColorBtn,
  createDivider,
  createIndentInput,
  createSelect,
  createTableBtn,
  FONT_SIZE_OPTIONS,
  ICONS,
  LINE_HEIGHT_OPTIONS,
  triggerMediaUpload,
  updateBtnStates,
  updateColorIndicators,
  updateSelectStates,
} from './toolbar-shared';
import type { MediaUploadConfig } from './types';

const BTN_CLASS = 'fsdx-editor-toolbar-btn';
const DIVIDER_CLASS = 'fsdx-editor-toolbar-divider';
const SELECT_CLASS = 'fsdx-editor-toolbar-select';
const INDENT_INPUT_CLASS = 'fsdx-editor-toolbar-indent-input';
const TABLE_PICKER_CLASS = 'fsdx-editor-toolbar-table-picker';

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

  const refreshAll = () => {
    updateBtnStates(toolbarEl, BTN_CLASS, editor);
    updateSelectStates(toolbarEl, SELECT_CLASS, editor);
    updateColorIndicators(toolbarEl, BTN_CLASS, editor);
  };

  // ===== 撤销 / 重做 =====
  add(
    ICONS.undo,
    '撤销 (Ctrl+Z)',
    () => editor.can().undo(),
    (e) => e.chain().focus().undo().run(),
  );
  add(
    ICONS.redo,
    '重做 (Ctrl+Shift+Z)',
    () => editor.can().redo(),
    (e) => e.chain().focus().redo().run(),
  );

  div();

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
  for (const level of [1, 2, 3, 4, 5, 6] as const) {
    const key = `h${level}` as keyof typeof ICONS;
    const labels = [
      '',
      '一级标题',
      '二级标题',
      '三级标题',
      '四级标题',
      '五级标题',
      '六级标题',
    ];
    add(
      ICONS[key],
      labels[level],
      (e) => e.isActive('heading', { level }),
      (e) => e.chain().focus().toggleHeading({ level }).run(),
    );
  }

  div();

  // ===== 字体大小（下拉） =====
  const fontSizeWrapper = createSelect(
    toolbarEl,
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
  fontSizeWrapper.classList.add('fsdx-editor-toolbar-select-wrapper');

  // ===== 行高（下拉） =====
  const lineHeightWrapper = createSelect(
    toolbarEl,
    SELECT_CLASS,
    editor,
    ICONS.lineHeight,
    '行高',
    LINE_HEIGHT_OPTIONS,
    (e) => {
      const attrs = e.getAttributes('textStyle');
      return (attrs.lineHeight as string) || null;
    },
    (e, value) => e.chain().focus().setLineHeight(value).run(),
    (e) => e.chain().focus().unsetLineHeight().run(),
  );
  lineHeightWrapper.classList.add('fsdx-editor-toolbar-select-wrapper');

  div();

  // ===== 文本对齐 =====
  const alignBtns = [
    { icon: ICONS.alignLeft, title: '左对齐', align: 'left' as const },
    { icon: ICONS.alignCenter, title: '居中', align: 'center' as const },
    { icon: ICONS.alignRight, title: '右对齐', align: 'right' as const },
    {
      icon: ICONS.alignJustify,
      title: '两端对齐',
      align: 'justify' as const,
    },
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

  // ===== 文字颜色 =====
  createColorBtn(
    toolbarEl,
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
    toolbarEl,
    BTN_CLASS,
    editor,
    ICONS.highlight,
    '背景高亮色',
    (e) => !!e.getAttributes('textStyle').backgroundColor,
    (e, color) => e.chain().focus().setBackgroundColor(color).run(),
    'backgroundColor',
  );

  div();

  // ===== 块级 =====
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

  // ===== 列表 =====
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
  add(
    ICONS.taskList,
    '任务列表',
    (e) => e.isActive('taskList'),
    (e) => e.chain().focus().toggleTaskList().run(),
  );

  div();

  // ===== 缩进 =====
  const indentBtn = add(
    ICONS.indentIncrease,
    '缩进',
    (e) => {
      const attrs = e.getAttributes('paragraph');
      const headingAttrs = e.getAttributes('heading');
      return (
        ((attrs.indent as number) || 0) > 0 ||
        ((headingAttrs.indent as number) || 0) > 0
      );
    },
    (e) => {
      e.chain().focus().toggleIndent(2).run();
      refreshAll();
    },
  );
  indentBtn.classList.add('fsdx-editor-toolbar-btn--indent');

  createIndentInput(
    toolbarEl,
    INDENT_INPUT_CLASS,
    editor,
    '缩进值（em）',
    (e) => {
      const pAttrs = e.getAttributes('paragraph');
      const hAttrs = e.getAttributes('heading');
      return Math.max(
        (pAttrs.indent as number) || 0,
        (hAttrs.indent as number) || 0,
      );
    },
    (e, value) => {
      e.chain().focus().setIndent(value).run();
      refreshAll();
    },
  );

  div();

  // ===== 插入 =====
  add(
    ICONS.hr,
    '分割线',
    () => false,
    (e) => e.chain().focus().setHorizontalRule().run(),
  );

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

  createTableBtn(
    toolbarEl,
    BTN_CLASS,
    TABLE_PICKER_CLASS,
    editor,
    ICONS.table,
    '插入表格',
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
}
