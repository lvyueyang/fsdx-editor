import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      /** 直接设置缩进 em 值 */
      setIndent: (value: number) => ReturnType;
      /** 切换缩进：有缩进则清除，无缩进则应用 step em */
      toggleIndent: (step: number) => ReturnType;
    };
  }
}

const DEFAULT_STEP = 2;

function getBlockAttrs({
  state,
}: {
  state: {
    selection: {
      $from: {
        depth: number;
        node(d: number): {
          type: { name: string };
          attrs: Record<string, unknown>;
        };
      };
    };
  };
}) {
  const { $from } = state.selection;
  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth);
    if (node.type.name === 'paragraph' || node.type.name === 'heading') {
      return {
        nodeType: node.type.name,
        indent: (node.attrs.indent as number) || 0,
      };
    }
  }
  return null;
}

export const Indent = Extension.create({
  name: 'indent',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const value = element.getAttribute('data-indent');
              if (value === null) return 0;
              const parsed = Number.parseFloat(value);
              return Number.isNaN(parsed) ? 0 : parsed;
            },
            renderHTML: (attributes) => {
              const indent = (attributes.indent as number) || 0;
              if (indent === 0) return {};
              return {
                'data-indent': String(indent),
                style: `text-indent: ${indent}em`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setIndent:
        (value: number) =>
        ({ state, chain }) => {
          const block = getBlockAttrs({ state });
          if (!block) return false;
          const clamped = Math.max(0, value);
          return chain()
            .updateAttributes(block.nodeType, { indent: clamped })
            .run();
        },
      toggleIndent:
        (step: number = DEFAULT_STEP) =>
        ({ state, chain }) => {
          const block = getBlockAttrs({ state });
          if (!block) return false;
          const newIndent = block.indent > 0 ? 0 : step;
          return chain()
            .updateAttributes(block.nodeType, { indent: newIndent })
            .run();
        },
    };
  },
});
