import { Node, ReactNodeViewRenderer } from '@tiptap/react';
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
    return [{ tag: 'audio' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src } = node.attrs as AudioNodeAttributes;

    if (!src) {
      return [
        'div',
        {
          style:
            'padding: 24px; border: 2px dashed #d1d5db; border-radius: 8px; text-align: center; color: #9ca3af;',
        },
        '未设置音频地址',
      ];
    }

    return [
      'audio',
      {
        ...(HTMLAttributes as Record<string, string>),
        style: 'display: block; width: 100%;',
      },
    ];
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
