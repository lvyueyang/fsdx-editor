import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { sanitizeUrl } from '../utils/link';

/** 在可编辑态用 Cmd/Ctrl+Click 或 Alt+Enter 打开光标/点击处的链接 */
export const LinkOpen = Extension.create({
  name: 'linkOpen',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('linkOpenOnModifierClick'),
        props: {
          handleClick: (view, _pos, event) => {
            if (event.button !== 0) return false;
            if (!(event.metaKey || event.ctrlKey)) return false;
            if (!view.editable) return false;
            const target = event.target as HTMLElement | null;
            const anchor = target?.closest?.('a');
            if (!anchor || !view.dom.contains(anchor)) return false;
            const href = anchor.getAttribute('href');
            if (!href) return false;
            const safeUrl = sanitizeUrl(href, window.location.href);
            if (safeUrl) {
              window.open(safeUrl, '_blank', 'noopener,noreferrer');
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      'Alt-Enter': () => {
        const editor = this.editor;
        if (!editor.isEditable) return false;
        const attrs = editor.getAttributes('link');
        const href = (attrs.href as string) || '';
        if (!href) return false;
        const safeUrl = sanitizeUrl(href, window.location.href);
        if (safeUrl) {
          window.open(safeUrl, '_blank', 'noopener,noreferrer');
          return true;
        }
        return false;
      },
    };
  },
});
