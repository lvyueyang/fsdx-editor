import { Editor } from '@tiptap/core';
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
import VideoNode from '../extensions/video-node';
import {
  createBubbleMenuElement,
  populateBubbleMenu,
} from '../toolbar/create-bubble-menu';
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

  const toolbarEl = createToolbarElement();
  container.appendChild(toolbarEl);

  const editorContent = document.createElement('div');
  editorContent.className = 'fsdx-editor-content';
  container.appendChild(editorContent);

  const bubbleMenuEl = createBubbleMenuElement();
  container.appendChild(bubbleMenuEl);

  const emitter = new EventEmitter();

  let refreshAllToolbar: (() => void) | null = null;

  const editor = new Editor({
    element: editorContent,
    content: options.defaultContent ?? undefined,
    editable: !options.readOnly,
    autofocus: options.autoFocus ? 'end' : false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
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
      Placeholder.configure({
        placeholder: options.placeholder ?? '输入内容…',
        dataAttribute: 'data-placeholder',
      }),
      BubbleMenu.configure({
        element: bubbleMenuEl,
        pluginKey: 'fsdxBubbleMenu',
      }),
      ImageUpload.configure({
        upload: options.image?.upload,
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
      const bubbleRefresh = populateBubbleMenu(bubbleMenuEl, editor, {
        image: options.image,
        video: options.video,
        audio: options.audio,
        attachment: options.attachment,
      });

      refreshAllToolbar = () => {
        toolbarRefresh();
        bubbleRefresh();
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
      emitter.emit('destroy');
      options.onDestroy?.();
    },
  });

  return { editor, emitter };
}
