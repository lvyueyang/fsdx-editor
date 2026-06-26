import { mergeAttributes, Node, ReactNodeViewRenderer } from '@tiptap/react';
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
      poster: { default: null },
      width: { default: null },
      alignment: { default: 'center' },
      autoplay: { default: false },
      controls: { default: true },
      loop: { default: false },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="video"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const {
      src,
      poster,
      width,
      autoplay,
      controls,
      loop,
      alignment,
      ...restAttrs
    } = HTMLAttributes as Record<string, unknown>;
    const divBaseAttrs: Record<string, unknown> = { 'data-type': 'video' };
    const divStyleParts: string[] = [];

    if (alignment === 'left') {
      divStyleParts.push('display: flex; justify-content: flex-start');
    } else if (alignment === 'right') {
      divStyleParts.push('display: flex; justify-content: flex-end');
    } else {
      divStyleParts.push('display: flex; justify-content: center');
    }

    if (!src) {
      divStyleParts.push(
        'padding: 24px; border: 2px dashed #d1d5db; border-radius: 8px; text-align: center; color: #9ca3af; align-items: center',
      );
    }

    if (divStyleParts.length > 0) {
      divBaseAttrs.style = divStyleParts.join('; ');
    }

    const divAttrs = mergeAttributes(
      divBaseAttrs,
      restAttrs as Record<string, string>,
    );

    if (!src) {
      return ['div', divAttrs, '未设置视频地址'];
    }

    const videoAttrs: Record<string, string> = { src: src as string };
    if (poster) videoAttrs.poster = poster as string;
    if (width) videoAttrs.width = width as string;
    if (autoplay) videoAttrs.autoplay = 'true';
    if (controls !== false) videoAttrs.controls = 'true';
    if (loop) videoAttrs.loop = 'true';

    return ['div', divAttrs, ['video', videoAttrs]];
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
