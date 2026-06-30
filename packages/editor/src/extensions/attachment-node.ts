import { Node } from '@tiptap/core';

export interface AttachmentNodeOptions {
  upload?: (
    file: File,
    onProgress?: (progress: number) => void,
  ) => Promise<{ url: string; name?: string; size?: number }>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    attachmentNode: {
      setAttachment: (options: {
        src: string;
        name?: string;
        size?: number;
      }) => ReturnType;
    };
  }
}

const AttachmentNode = Node.create<AttachmentNodeOptions>({
  name: 'attachmentNode',

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
        parseHTML: (element) =>
          element.getAttribute('href') || element.getAttribute('data-src'),
      },
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-name'),
      },
      size: {
        default: null,
        parseHTML: (element) => {
          const val = element.getAttribute('data-size');
          return val ? Number(val) : null;
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'a[href][data-type="attachment"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, name, size } = HTMLAttributes;
    return [
      'a',
      {
        href: src,
        'data-type': 'attachment',
        'data-name': name,
        'data-size': size,
        class: 'fsdx-editor-attachment',
        download: name || true,
      },
      ['span', { class: 'fsdx-editor-attachment-icon' }, '📎'],
      ['span', { class: 'fsdx-editor-attachment-name' }, name || '未知文件'],
      size
        ? [
            'span',
            { class: 'fsdx-editor-attachment-size' },
            `(${formatSize(size as number)})`,
          ]
        : null,
    ].filter(Boolean) as [string, Record<string, string>];
  },

  addCommands() {
    return {
      setAttachment:
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

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default AttachmentNode;
