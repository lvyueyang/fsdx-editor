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
    return ['div', mergeAttributes({ 'data-type': 'video' }, HTMLAttributes)];
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
