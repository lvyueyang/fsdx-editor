import { mergeAttributes, Node, ReactNodeViewRenderer } from '@tiptap/react';
import { AttachmentNodeView } from './attachment-node-view';

export interface AttachmentNodeAttributes {
  src?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    attachment: {
      insertAttachment: (attrs: AttachmentNodeAttributes) => ReturnType;
    };
  }
}

export const AttachmentNode = Node.create<AttachmentNodeAttributes>({
  name: 'attachment',

  group: 'block',

  draggable: true,

  selectable: true,

  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      fileName: { default: '' },
      fileSize: { default: 0 },
      fileType: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="attachment"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes({ 'data-type': 'attachment' }, HTMLAttributes),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AttachmentNodeView);
  },

  addCommands() {
    return {
      insertAttachment:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs });
        },
    };
  },
});

export default AttachmentNode;
