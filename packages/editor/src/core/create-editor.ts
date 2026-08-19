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
import { NodeSelection } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
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
import {
  createVideoMenuElement,
  populateVideoMenu,
} from '../toolbar/create-video-menu';
import type { FsdxEditorOptions } from '../types';
import { EventEmitter } from '../utils/event-emitter';
import { routeMediaUpload } from '../utils/media-upload';

/** 供 BubbleMenu 定位锚定实际的媒体元素（容器是整行宽度时避免浮层相对整行居中） */
function getMediaNodeAnchor(
  this: unknown,
  nodeType: string,
  tag: 'img' | 'video',
): HTMLElement | null {
  const { editor, view } = this as unknown as {
    editor: Editor;
    view: EditorView;
  };
  if (editor.isDestroyed) return null;
  const { selection } = editor.state;
  if (!(selection instanceof NodeSelection)) return null;
  if (selection.node.type.name !== nodeType) return null;
  try {
    const dom = view.nodeDOM(selection.from) as HTMLElement | null;
    const target =
      dom?.tagName.toLowerCase() === tag ? dom : dom?.querySelector(tag);
    return target ?? null;
  } catch {
    // 视图销毁竞态下无法取到节点 DOM，回退到默认定位
    return null;
  }
}

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
  const videoMenuEl = createVideoMenuElement();

  const emitter = new EventEmitter();

  let refreshAllToolbar: (() => void) | null = null;
  let linkHoverDestroy: (() => void) | null = null;

  let editor: Editor;
  editor = new Editor({
    element: editorContent,
    content: options.defaultContent ?? undefined,
    editable: !options.readOnly,
    autofocus: options.autoFocus ? 'end' : false,
    editorProps: {
      // 粘贴 / 拖入文件时按类型路由到对应媒体 upload
      handlePaste: (_view, event) => {
        const data = event.clipboardData;
        const file = data?.files?.[0];
        if (!file || !editor.isEditable) return false;
        // 仅接管纯文件粘贴：混有富文本（网页/文档复制）时交给默认粘贴，避免丢弃文字内容
        const getText = (type: string) =>
          typeof data.getData === 'function' ? (data.getData(type) ?? '') : '';
        if (getText('text/html').trim() || getText('text/plain').trim()) {
          return false;
        }
        return routeMediaUpload(file, editor, options, undefined, (f, error) =>
          emitter.emit('uploadError', f, error),
        );
      },
      handleDrop: (view, event) => {
        const file = event.dataTransfer?.files?.[0];
        if (!file || !editor.isEditable) return false;
        const hasCoords =
          Number.isFinite(event.clientX) && Number.isFinite(event.clientY);
        const pos = hasCoords
          ? view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos
          : undefined;
        return routeMediaUpload(file, editor, options, pos, (f, error) =>
          emitter.emit('uploadError', f, error),
        );
      },
    },
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
        // 容器是整行宽度的 flex 元素，定位必须锚定实际 img，
        // 否则浮层会相对整行居中而不是相对图片（左/右对齐时错位）。
        getReferencedVirtualElement: function () {
          return getMediaNodeAnchor.call(this, 'imageUpload', 'img');
        },
      }),
      BubbleMenu.extend({ name: 'videoBubbleMenu' }).configure({
        element: videoMenuEl,
        pluginKey: 'fsdxVideoMenu',
        options: { strategy: 'fixed' },
        shouldShow: ({ editor: e }) => e.isEditable && e.isActive('videoNode'),
        // 与图片浮层同理，锚定实际的 video 元素
        getReferencedVirtualElement: function () {
          return getMediaNodeAnchor.call(this, 'videoNode', 'video');
        },
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
      const imageMenuRefresh = populateImageMenu(imageMenuEl, editor);
      const videoMenuRefresh = populateVideoMenu(videoMenuEl, editor);
      linkHoverDestroy = createLinkHoverPopover(container, editor).destroy;

      refreshAllToolbar = () => {
        toolbarRefresh();
        bubbleRefresh();
        imageMenuRefresh();
        videoMenuRefresh();
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
