import { Extension } from '@tiptap/core';
import { getSelectedNodesOfType, updateNodesAttr } from '../utils/editor-utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableCellStyle: {
      setCellTextAlign: (textAlign: string | null) => ReturnType;
      setCellVerticalAlign: (verticalAlign: string | null) => ReturnType;
      unsetCellVerticalAlign: () => ReturnType;
    };
  }
}

export const TableCellStyle = Extension.create({
  name: 'tableCellStyle',

  addGlobalAttributes() {
    return [
      {
        types: ['tableCell', 'tableHeader'],
        attributes: {
          textColor: {
            default: null as string | null,
            parseHTML: (element: HTMLElement) => element.style.color || null,
            renderHTML: (attributes) => {
              const tc = attributes.textColor as string | null;
              if (!tc) return {};
              return { style: `color: ${tc}` };
            },
          },
          textAlign: {
            default: null as string | null,
            parseHTML: (element: HTMLElement) =>
              element.style.textAlign || null,
            renderHTML: (attributes) => {
              const ta = attributes.textAlign as string | null;
              if (!ta) return {};
              return { style: `text-align: ${ta}` };
            },
          },
          verticalAlign: {
            default: null as string | null,
            parseHTML: (element: HTMLElement) =>
              element.style.verticalAlign || null,
            renderHTML: (attributes) => {
              const va = attributes.verticalAlign as string | null;
              if (!va) return {};
              return { style: `vertical-align: ${va}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setCellTextAlign:
        (textAlign: string | null) =>
        ({ tr }) => {
          const targets = getSelectedNodesOfType(tr.selection, [
            'tableCell',
            'tableHeader',
          ]);
          return updateNodesAttr(tr, targets, 'textAlign', textAlign);
        },
      setCellVerticalAlign:
        (verticalAlign: string | null) =>
        ({ tr }) => {
          const targets = getSelectedNodesOfType(tr.selection, [
            'tableCell',
            'tableHeader',
          ]);
          return updateNodesAttr(tr, targets, 'verticalAlign', verticalAlign);
        },
      unsetCellVerticalAlign:
        () =>
        ({ tr }) => {
          const targets = getSelectedNodesOfType(tr.selection, [
            'tableCell',
            'tableHeader',
          ]);
          return updateNodesAttr(tr, targets, 'verticalAlign', null);
        },
    };
  },
});
