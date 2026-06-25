import type { Editor } from '@tiptap/core';

export function getImageElement(editor: Editor): HTMLImageElement | null {
  const { $from } = editor.state.selection;
  const dom = editor.view.nodeDOM($from.pos) as HTMLElement | null;
  if (!dom) return null;

  const img = dom.querySelector('img') || (dom.tagName === 'IMG' ? dom : null);
  return img as HTMLImageElement | null;
}
