import { Node } from '@tiptap/core';

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
    };
  },

  parseHTML() {
    return [{ tag: 'video[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'fsdx-editor-video-wrapper' },
      ['video', { ...HTMLAttributes, controls: 'true' }],
    ];
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
    };
  },
});

export default VideoNode;
