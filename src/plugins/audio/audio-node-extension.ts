import { mergeAttributes, Node, ReactNodeViewRenderer } from '@tiptap/react';
import { AudioNodeView } from './audio-node-view';

export interface AudioNodeAttributes {
  src?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
}

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    audio: {
      insertAudio: (attrs: AudioNodeAttributes) => ReturnType;
    };
  }
}

export const AudioNode = Node.create<AudioNodeAttributes>({
  name: 'audio',

  group: 'block',

  draggable: true,

  selectable: true,

  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      autoplay: { default: false },
      controls: { default: true },
      loop: { default: false },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="audio"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'audio' }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioNodeView);
  },

  addCommands() {
    return {
      insertAudio:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs });
        },
    };
  },
});

export default AudioNode;
