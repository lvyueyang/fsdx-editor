import { Extension } from '@tiptap/core';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import { getSelectedNodesOfType, updateNodesAttr } from '../utils/editor-utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    nodeBackground: {
      setNodeBackgroundColor: (backgroundColor: string) => ReturnType;
      unsetNodeBackgroundColor: () => ReturnType;
    };
  }
}

export interface NodeBackgroundOptions {
  /**
   * 支持背景色的节点类型
   * @default ["paragraph", "heading", "blockquote", "taskList", "bulletList", "orderedList", "tableCell", "tableHeader"]
   */
  types: string[];
}

export const NodeBackground = Extension.create<NodeBackgroundOptions>({
  name: 'nodeBackground',

  addOptions() {
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

            parseHTML: (element: HTMLElement) => {
              const styleColor = element.style?.backgroundColor;
              if (styleColor) return styleColor;

              const dataColor = element.getAttribute('data-background-color');
              return dataColor || null;
            },

            renderHTML: (attributes) => {
              const color = attributes.backgroundColor as string | null;
              if (!color) return {};
              return { style: `background-color: ${color}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setNodeBackgroundColor:
        (backgroundColor: string) =>
        ({ tr }: { state: EditorState; tr: Transaction }) => {
          const targets = getSelectedNodesOfType(
            tr.selection,
            this.options.types,
          );
          if (targets.length === 0) return false;
          return updateNodesAttr(
            tr,
            targets,
            'backgroundColor',
            backgroundColor,
          );
        },

      unsetNodeBackgroundColor:
        () =>
        ({ tr }: { state: EditorState; tr: Transaction }) => {
          const targets = getSelectedNodesOfType(
            tr.selection,
            this.options.types,
          );
          if (targets.length === 0) return false;
          return updateNodesAttr(tr, targets, 'backgroundColor', null);
        },
    };
  },
});
