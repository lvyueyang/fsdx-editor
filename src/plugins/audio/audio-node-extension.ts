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
    const { src, autoplay, controls, loop, ...restAttrs } =
      HTMLAttributes as Record<string, unknown>;

    if (!src) {
      return [
        'div',
        mergeAttributes(
          {
            'data-type': 'audio',
            style:
              'padding: 24px; border: 2px dashed #d1d5db; border-radius: 8px; text-align: center; color: #9ca3af;',
          },
          restAttrs as Record<string, string>,
        ),
        '未设置音频地址',
      ];
    }

    const audioAttrs: Record<string, string> = { src: src as string };
    if (autoplay) audioAttrs.autoplay = 'true';
    if (controls !== false) audioAttrs.controls = 'true';
    if (loop) audioAttrs.loop = 'true';

    return [
      'div',
      mergeAttributes(
        { 'data-type': 'audio' },
        restAttrs as Record<string, string>,
      ),
      ['audio', audioAttrs],
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
