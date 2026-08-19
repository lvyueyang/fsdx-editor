import { TablePlus } from '@fsdx/tiptap-table-plus';
import { Editor, isTextSelection } from '@tiptap/core';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TableKit } from '@tiptap/extension-table';
import TextAlign from '@tiptap/extension-text-align';
import {
  BackgroundColor,
  Color,
  FontFamily,
  FontSize,
  LineHeight,
  TextStyle,
} from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import AttachmentNode from '../extensions/attachment-node';
import AudioNode from '../extensions/audio-node';
import ImageUpload from '../extensions/image-upload';
import { Indent } from '../extensions/indent-extension';
import { LinkOpen } from '../extensions/link-open';
import VideoNode from '../extensions/video-node';
import { createLinkHoverPopover } from '../shared/link-hover-popover';
import {
  createBubbleMenuElement,
  populateBubbleMenu,
} from '../toolbar/create-bubble-menu';
import {
  createImageMenuElement,
  populateImageMenu,
} from '../toolbar/create-image-menu';
import {
  createToolbarElement,
  populateToolbar,
} from '../toolbar/create-toolbar';
import type { FsdxEditorOptions } from '../types';
import { EventEmitter } from '../utils/event-emitter';

export function createEditorInstance(
  container: HTMLElement,
  options: FsdxEditorOptions,
): { editor: Editor; emitter: EventEmitter } {
  container.classList.add('fsdx-editor');
  if (options.defaultTheme === 'dark') {
    container.classList.add('fsdx-editor-dark');
  }
  if (options.readOnly) {
    container.classList.add('fsdx-editor-readonly');
  }

  const toolbarEl = createToolbarElement();
  container.appendChild(toolbarEl);

  const editorContent = document.createElement('div');
  editorContent.className = 'fsdx-editor-content';
  container.appendChild(editorContent);

  const bubbleMenuEl = createBubbleMenuElement();
  const imageMenuEl = createImageMenuElement();

  const emitter = new EventEmitter();

  let refreshAllToolbar: (() => void) | null = null;
  let linkHoverDestroy: (() => void) | null = null;

  const editor = new Editor({
    element: editorContent,
    content: options.defaultContent ?? undefined,
    editable: !options.readOnly,
    autofocus: options.autoFocus ? 'end' : false,
    extensions: [
      LinkOpen,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      FontFamily.configure({ types: ['textStyle'] }),
      BackgroundColor.configure({ types: ['textStyle'] }),
      FontSize.configure({ types: ['textStyle'] }),
      LineHeight.configure({ types: ['textStyle'] }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Subscript,
      Superscript,
      Typography,
      TaskList,
      TaskItem.configure({ nested: true }),
      Indent,
      TableKit.configure({
        table: {
          resizable: true,
        },
      }),
      TablePlus.configure({
        theme: options.defaultTheme ?? 'light',
      }),
      Placeholder.configure({
        placeholder: options.placeholder ?? '输入内容…',
        dataAttribute: 'data-placeholder',
      }),
      BubbleMenu.configure({
        element: bubbleMenuEl,
        pluginKey: 'fsdxBubbleMenu',
        options: { strategy: 'fixed' },
        shouldShow: ({ editor: e, element, view, state, from, to }) => {
          const mediaNodes = ['videoNode', 'audioNode', 'attachmentNode'];
          const isImageSelected = e.isActive('imageUpload');
          const isEmptyTextBlock =
            !state.doc.textBetween(from, to).length &&
            isTextSelection(state.selection);
          const isChildOfMenu = element.contains(document.activeElement);
          const hasEditorFocus = view.hasFocus() || isChildOfMenu;
          return (
            hasEditorFocus &&
            !isImageSelected &&
            !state.selection.empty &&
            !isEmptyTextBlock &&
            e.isEditable &&
            !mediaNodes.some((name) => e.isActive(name))
          );
        },
      }),
      BubbleMenu.extend({ name: 'imageBubbleMenu' }).configure({
        element: imageMenuEl,
        pluginKey: 'fsdxImageMenu',
        options: { strategy: 'fixed' },
        shouldShow: ({ editor: e }) =>
          e.isEditable && e.isActive('imageUpload'),
      }),
      ImageUpload.configure({
        upload: options.image?.upload,
        ...(options.image?.resizable === false ? { resize: false } : {}),
      }),
      VideoNode.configure({
        upload: options.video?.upload,
      }),
      AudioNode.configure({
        upload: options.audio?.upload,
      }),
      AttachmentNode.configure({
        upload: options.attachment?.upload,
      }),
    ],
    onCreate() {
      const toolbarRefresh = populateToolbar(toolbarEl, editor, {
        image: options.image,
        video: options.video,
        audio: options.audio,
        attachment: options.attachment,
      });
      const bubbleRefresh = populateBubbleMenu(bubbleMenuEl, editor);
      const imageMenuRefresh = populateImageMenu(
        imageMenuEl,
        editor,
        options.image?.upload,
      );
      linkHoverDestroy = createLinkHoverPopover(container, editor).destroy;

      refreshAllToolbar = () => {
        toolbarRefresh();
        bubbleRefresh();
        imageMenuRefresh();
      };

      editor.on('selectionUpdate', refreshAllToolbar);

      emitter.emit('ready');
      options.onReady?.();
    },
    onUpdate() {
      const html = editor.getHTML();
      emitter.emit('change', html);
      options.onChange?.(html);
    },
    onFocus() {
      emitter.emit('focus');
      options.onFocus?.();
    },
    onBlur() {
      emitter.emit('blur');
      options.onBlur?.();
    },
    onDestroy() {
      if (refreshAllToolbar) {
        editor.off('selectionUpdate', refreshAllToolbar);
      }
      linkHoverDestroy?.();
      emitter.emit('destroy');
      options.onDestroy?.();
    },
  });

  return { editor, emitter };
}
