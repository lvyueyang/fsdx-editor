import { Node, ReactNodeViewRenderer } from '@tiptap/react';
import { formatFileSize } from '../../lib/format-file-size';
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
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute('href'),
        renderHTML: (attributes) => {
          if (!attributes.src) return {};
          return { href: attributes.src };
        },
      },
      fileName: {
        default: '',
        parseHTML: (element) => element.getAttribute('download'),
        renderHTML: (attributes) => {
          if (!attributes.fileName) return {};
          return { download: attributes.fileName };
        },
      },
      fileSize: {
        default: 0,
        parseHTML: (element) => {
          const val = element.getAttribute('data-file-size');
          return val ? Number.parseInt(val, 10) : 0;
        },
        renderHTML: (attributes) => {
          if (!attributes.fileSize) return {};
          return { 'data-file-size': String(attributes.fileSize) };
        },
      },
      fileType: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-file-type'),
        renderHTML: (attributes) => {
          if (!attributes.fileType) return {};
          return { 'data-file-type': attributes.fileType };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'a[data-type="attachment"]', priority: 100 }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, fileName, fileSize, fileType } =
      node.attrs as AttachmentNodeAttributes;

    if (!src) {
      return [
        'div',
        {
          style:
            'padding: 24px; border: 2px dashed #d1d5db; border-radius: 8px; text-align: center; color: #9ca3af;',
        },
        '未设置附件地址',
      ];
    }

    const displayName = fileName || '未知文件';
    const typeLabel = fileType ? fileType.split('/').pop() || fileType : '文件';
    const sizeText =
      (fileSize ?? 0) > 0 ? ` · ${formatFileSize(fileSize ?? 0)}` : '';

    return [
      'a',
      {
        ...(HTMLAttributes as Record<string, string>),
        'data-type': 'attachment',
        style:
          'display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; color: inherit; text-decoration: none;',
      },
      [
        'svg',
        {
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: '#6b7280',
          'stroke-width': '1.5',
        },
        [
          'path',
          { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
        ],
        ['polyline', { points: '14 2 14 8 20 8' }],
        ['line', { x1: '16', y1: '13', x2: '8', y2: '13' }],
        ['line', { x1: '16', y1: '17', x2: '8', y2: '17' }],
      ],
      [
        'div',
        { style: 'flex: 1; min-width: 0;' },
        [
          'span',
          {
            style:
              'display: block; font-size: 14px; color: #111827; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
          },
          displayName,
        ],
        [
          'span',
          {
            style:
              'display: block; font-size: 12px; color: #6b7280; margin-top: 2px;',
          },
          `${typeLabel}${sizeText}`,
        ],
      ],
      [
        'svg',
        {
          width: '16',
          height: '16',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
        },
        ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
        ['polyline', { points: '7 10 12 15 17 10' }],
        ['line', { x1: '12', y1: '15', x2: '12', y2: '3' }],
      ],
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
