import type { Editor } from '@tiptap/core';
import type { Area } from 'react-easy-crop';

export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export function getCroppedImg(
  image: HTMLImageElement,
  croppedAreaPixels: Area,
  rotation: number,
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('Canvas context not available'));

  const maxSize = Math.max(image.naturalWidth, image.naturalHeight);
  const safeArea = 2 * maxSize;

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.naturalWidth * 0.5,
    safeArea / 2 - image.naturalHeight * 0.5,
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  ctx.putImageData(
    data,
    Math.round(
      0 - safeArea / 2 + image.naturalWidth * 0.5 - croppedAreaPixels.x,
    ),
    Math.round(
      0 - safeArea / 2 + image.naturalHeight * 0.5 - croppedAreaPixels.y,
    ),
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/png');
  });
}

export function getImageWidthPercent(editor: Editor): number | null {
  const attrs = editor.getAttributes('customImage');
  const widthAttr: string | null = attrs?.width || null;
  if (!widthAttr) return null;

  const editorWidth = editor.view.dom.clientWidth;
  if (editorWidth <= 0) return null;

  if (widthAttr.endsWith('%')) {
    return Math.round(Number.parseFloat(widthAttr));
  }

  const pxValue = Number.parseFloat(widthAttr);
  if (Number.isNaN(pxValue)) return null;
  return Math.round((pxValue / editorWidth) * 100);
}
