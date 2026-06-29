import { Node, ReactNodeViewRenderer } from '@tiptap/react';
import { VideoNodeView } from './video-node-view';

export interface VideoNodeAttributes {
  src?: string;
  poster?: string;
  width?: string | null;
  alignment?: 'left' | 'center' | 'right';
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
}

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    video: {
      insertVideo: (attrs: VideoNodeAttributes) => ReturnType;
    };
  }
}

export const VideoNode = Node.create<VideoNodeAttributes>({
  name: 'video',

  group: 'block',

  draggable: true,

  selectable: true,

  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      poster: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.poster) return {};
          return { poster: attributes.poster };
        },
      },
      width: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      alignment: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-alignment'),
        renderHTML: (attributes) => {
          if (!attributes.alignment || attributes.alignment === 'center')
            return {};
          return { 'data-alignment': attributes.alignment };
        },
      },
      autoplay: {
        default: false,
        parseHTML: (element) => element.hasAttribute('autoplay'),
        renderHTML: (attributes) => {
          if (!attributes.autoplay) return {};
          return { autoplay: '' };
        },
      },
      controls: {
        default: true,
        parseHTML: (element) => {
          const val = element.getAttribute('controls');
          if (val === null) return true;
          return val !== 'false';
        },
        renderHTML: (attributes) => {
          if (attributes.controls === false) return { controls: 'false' };
          return { controls: '' };
        },
      },
      loop: {
        default: false,
        parseHTML: (element) => element.hasAttribute('loop'),
        renderHTML: (attributes) => {
          if (!attributes.loop) return {};
          return { loop: '' };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'video' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, alignment } = node.attrs as VideoNodeAttributes;

    if (!src) {
      return [
        'div',
        {
          style:
            'padding: 24px; border: 2px dashed #d1d5db; border-radius: 8px; text-align: center; color: #9ca3af;',
        },
        '未设置视频地址',
      ];
    }

    const styleParts: string[] = [];
    if (alignment === 'left') {
      styleParts.push('display: block; margin-left: 0; margin-right: auto');
    } else if (alignment === 'right') {
      styleParts.push('display: block; margin-left: auto; margin-right: 0');
    } else {
      styleParts.push('display: block; margin-left: auto; margin-right: auto');
    }

    const existingStyle =
      (HTMLAttributes as Record<string, string>).style || '';
    const mergedStyle = [existingStyle, ...styleParts]
      .filter(Boolean)
      .join('; ');

    const attrs = {
      ...(HTMLAttributes as Record<string, string>),
    };
    if (mergedStyle) attrs.style = mergedStyle;

    return ['video', attrs];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView);
  },

  addCommands() {
    return {
      insertVideo:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs });
        },
    };
  },
});

export default VideoNode;
