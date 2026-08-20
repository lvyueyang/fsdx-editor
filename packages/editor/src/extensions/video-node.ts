import { Node } from '@tiptap/core';
import { createVideoNodeView } from './video-node-view';

export type VideoAlign = 'left' | 'center' | 'right';

export interface VideoNodeOptions {
  upload?: (
    file: File,
    onProgress?: (progress: number) => void,
  ) => Promise<{ url: string }>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoNode: {
      setVideo: (options: { src: string }) => ReturnType;
      setVideoAlign: (align: VideoAlign) => ReturnType;
    };
  }
}

const VideoNode = Node.create<VideoNodeOptions>({
  name: 'videoNode',

  group: 'block',

  atom: true,

  selectable: true,

  draggable: true,

  addOptions() {
    return {
      upload: undefined,
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute('src'),
        renderHTML: (attributes) => ({ src: attributes.src }),
      },
      align: {
        // 默认不写入 data-align，保持既有 HTML 内容在保存时不变；未设置时按居中渲染
        default: null,
        parseHTML: (element) =>
          element.parentElement?.getAttribute('data-align') ?? null,
        renderHTML: (attributes) =>
          attributes.align ? { 'data-align': attributes.align } : {},
      },
      poster: {
        default: null,
        parseHTML: (element) => element.getAttribute('poster'),
        renderHTML: (attributes) =>
          attributes.poster ? { poster: attributes.poster } : {},
      },
      controls: {
        // 默认显示原生控制器，与既有行为一致
        default: true,
        parseHTML: (element) => element.hasAttribute('controls'),
        renderHTML: (attributes) =>
          attributes.controls ? { controls: 'true' } : {},
      },
      autoplay: {
        default: false,
        parseHTML: (element) => element.hasAttribute('autoplay'),
        renderHTML: (attributes) =>
          attributes.autoplay ? { autoplay: 'true' } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: 'video[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { 'data-align': dataAlign, ...videoAttrs } = HTMLAttributes;
    const wrapperAttrs: Record<string, string> = {
      class: 'easyx-editor-video-wrapper',
    };
    if (dataAlign) {
      wrapperAttrs['data-align'] = String(dataAlign);
    }
    return ['div', wrapperAttrs, ['video', videoAttrs]];
  },

  addNodeView() {
    if (typeof document === 'undefined') return null;
    return (props) =>
      createVideoNodeView({
        node: props.node,
        HTMLAttributes: props.HTMLAttributes,
      });
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      setVideoAlign:
        (align) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { align });
        },
    };
  },
});

export default VideoNode;
