import { Node } from '@tiptap/core';

export interface AudioNodeOptions {
  upload?: (
    file: File,
    onProgress?: (progress: number) => void,
  ) => Promise<{ url: string }>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    audioNode: {
      setAudio: (options: { src: string }) => ReturnType;
    };
  }
}

const AudioNode = Node.create<AudioNodeOptions>({
  name: 'audioNode',

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
    return [{ tag: 'audio[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'fsdx-editor-audio-wrapper' },
      ['audio', { ...HTMLAttributes, controls: 'true' }],
    ];
  },

  addCommands() {
    return {
      setAudio:
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

export default AudioNode;
