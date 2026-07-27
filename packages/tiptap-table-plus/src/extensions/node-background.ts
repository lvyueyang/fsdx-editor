/**
 * 节点背景色扩展：为常见块级节点提供 backgroundColor 属性
 * （以行内 style 序列化），并注册设置/清除命令。
 */
import type { Command } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { getSelectedNodesOfType, updateNodesAttr } from '../utils/node-utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    nodeBackground: {
      setNodeBackgroundColor: (backgroundColor: string) => ReturnType;
      unsetNodeBackgroundColor: () => ReturnType;
    };
  }
}

export interface NodeBackgroundOptions {
  /** 支持背景色的节点类型 */
  types: string[];
}

export const NodeBackground = Extension.create<NodeBackgroundOptions>({
  name: 'nodeBackground',

  addOptions(): NodeBackgroundOptions {
    return {
      types: [
        'paragraph',
        'heading',
        'blockquote',
        'taskList',
        'bulletList',
        'orderedList',
        'tableCell',
        'tableHeader',
      ],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null as string | null,
            parseHTML: (element: HTMLElement) =>
              element.style.backgroundColor ||
              element.getAttribute('data-background-color'),
            renderHTML: (attributes: Record<string, unknown>) => {
              const color = attributes.backgroundColor as string | null;
              return color ? { style: `background-color: ${color}` } : {};
            },
          },
        },
      },
    ];
  },

  addCommands() {
    const setBackground =
      (color: string | null): Command =>
      ({ tr }) => {
        const targets = getSelectedNodesOfType(
          tr.selection,
          this.options.types,
        );
        return updateNodesAttr(tr, targets, 'backgroundColor', color);
      };

    return {
      setNodeBackgroundColor: (color) => setBackground(color),
      unsetNodeBackgroundColor: () => setBackground(null),
    };
  },
});
