import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableCellStyle: {
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
      setCellVerticalAlign:
        (verticalAlign: string | null) =>
        ({ commands }) =>
          commands.updateAttributes('tableCell', { verticalAlign }),
      unsetCellVerticalAlign:
        () =>
        ({ commands }) =>
          commands.updateAttributes('tableCell', { verticalAlign: null }),
    };
  },
});
