import type { Editor } from '@tiptap/core';

/**
 * 计算视频节点宽度相对于编辑器宽度的百分比
 */
export function getVideoWidthPercent(editor: Editor): number | null {
  const attrs = editor.getAttributes('video');
  const rawWidth = attrs?.width;
  if (rawWidth == null || rawWidth === '') return null;
  const widthAttr = String(rawWidth);

  const editorWidth = editor.view.dom.clientWidth;
  if (editorWidth <= 0) return null;

  if (widthAttr.endsWith('%')) {
    return Math.round(Number.parseFloat(widthAttr));
  }

  const pxValue = Number.parseFloat(widthAttr);
  if (Number.isNaN(pxValue)) return null;
  return Math.round((pxValue / editorWidth) * 100);
}
