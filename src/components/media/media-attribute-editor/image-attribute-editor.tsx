import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { ImageEditor } from '../image-editor';
import type { FilterValues } from '../image-editor/image-filter-panel';
import { getImageElement } from './media-dom-utils';

interface ImageAttributeEditorProps {
  editor: Editor;
}

function filterValuesToStyle(values: FilterValues): string {
  return [
    `brightness(${values.brightness}%)`,
    `contrast(${values.contrast}%)`,
    `saturate(${values.saturation}%)`,
    `blur(${values.blur}px)`,
    `grayscale(${values.grayscale}%)`,
    `sepia(${values.sepia}%)`,
  ].join(' ');
}

function dataUrlFromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getWidthPercent(editor: Editor): number | null {
  const attrs = editor.getAttributes('customImage');
  const widthAttr: string | null = attrs?.width || null;
  const editorWidth = editor.view.dom.clientWidth;
  if (editorWidth <= 0) return null;

  if (widthAttr) {
    if (widthAttr.endsWith('%')) {
      return Math.round(Number.parseFloat(widthAttr));
    }
    const pxValue = Number.parseFloat(widthAttr);
    if (Number.isNaN(pxValue)) return null;
    return Math.round((pxValue / editorWidth) * 100);
  }

  const img = getImageElement(editor);
  if (!img) return null;

  return Math.round(
    ((img as HTMLImageElement).clientWidth / editorWidth) * 100,
  );
}

export function ImageAttributeEditor({ editor }: ImageAttributeEditorProps) {
  const attrs =
    editor.getAttributes('customImage') || editor.getAttributes('image');

  const [srcValue, setSrcValue] = useState(attrs.src || '');
  const [altValue, setAltValue] = useState(attrs.alt || '');
  const [linkValue, setLinkValue] = useState(attrs.link || '');
  const [showEditor, setShowEditor] = useState(false);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const nodePosRef = useRef(0);

  useEffect(() => {
    const handler = () => {
      if (!editor.isActive('customImage')) return;
      nodePosRef.current = editor.state.selection.$from.pos;
      forceUpdate();
    };
    editor.on('transaction', handler);
    return () => {
      editor.off('transaction', handler);
    };
  }, [editor]);

  const handleAlignment = useCallback(
    (alignment: 'left' | 'center' | 'right') => {
      const current = editor.getAttributes('customImage')?.alignment;
      const next = current === alignment ? null : alignment;
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateImageAlignment?.(next)
        .run();
    },
    [editor],
  );

  const handleSrcBlur = useCallback(() => {
    if (srcValue && srcValue.trim()) {
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateImageSrc?.(srcValue.trim())
        .run();
    }
  }, [editor, srcValue]);

  const handleAltBlur = useCallback(() => {
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('customImage', {
        alt: altValue || null,
      })
      .run() ||
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateAttributes('image', {
          alt: altValue || null,
        })
        .run();
  }, [editor, altValue]);

  const handleLinkBlur = useCallback(() => {
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateImageLink?.(linkValue || null)
      .run();
  }, [editor, linkValue]);

  const handleOpenEditor = useCallback(() => {
    setShowEditor(true);
  }, []);

  const handleEditorCancel = useCallback(() => {
    setShowEditor(false);
  }, []);

  const handleEditorConfirm = useCallback(
    async (blob: Blob, filterValues?: FilterValues) => {
      try {
        const dataUrl = await dataUrlFromBlob(blob);
        editor.chain().focus().updateImageSrc?.(dataUrl).run();
        if (filterValues) {
          const filterStyle = filterValuesToStyle(filterValues);
          editor.chain().focus().updateImageFilter?.(filterStyle).run();
        }
        setSrcValue(dataUrl);
      } catch {
        // 裁剪处理失败，不做任何更改
      }
      setShowEditor(false);
    },
    [editor],
  );

  const currentAlignment = editor.getAttributes('customImage')?.alignment;
  const widthPercent = getWidthPercent(editor);

  return (
    <>
      <div className="tiptap-attribute-group">
        {/* 对齐 */}
        <div className="tiptap-attribute-row">
          <span className="tiptap-attribute-label">对齐</span>
          <div className="tiptap-attribute-btn-group">
            <button
              type="button"
              className={`tiptap-attribute-btn ${currentAlignment === 'left' ? 'tiptap-attribute-btn--active' : ''}`}
              onClick={() => handleAlignment('left')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="17" y1="10" x2="3" y2="10" />
                <line x1="21" y1="14" x2="3" y2="14" />
                <line x1="17" y1="18" x2="3" y2="18" />
              </svg>
            </button>
            <button
              type="button"
              className={`tiptap-attribute-btn ${currentAlignment === 'center' ? 'tiptap-attribute-btn--active' : ''}`}
              onClick={() => handleAlignment('center')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="18" y1="10" x2="6" y2="10" />
                <line x1="21" y1="14" x2="3" y2="14" />
                <line x1="18" y1="18" x2="6" y2="18" />
              </svg>
            </button>
            <button
              type="button"
              className={`tiptap-attribute-btn ${currentAlignment === 'right' ? 'tiptap-attribute-btn--active' : ''}`}
              onClick={() => handleAlignment('right')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="19" y1="10" x2="7" y2="10" />
                <line x1="21" y1="14" x2="3" y2="14" />
                <line x1="19" y1="18" x2="7" y2="18" />
              </svg>
            </button>
          </div>
          {widthPercent !== null && (
            <span className="tiptap-attribute-label">{widthPercent}%</span>
          )}
        </div>
      </div>

      <div className="tiptap-attribute-group">
        {/* Alt */}
        <div className="tiptap-attribute-row">
          <label htmlFor="image-alt-input" className="tiptap-attribute-label">
            Alt
          </label>
          <input
            id="image-alt-input"
            type="text"
            value={altValue}
            onChange={(e) => setAltValue(e.target.value)}
            onBlur={handleAltBlur}
            placeholder="图片描述"
            className="tiptap-attribute-text-input"
          />
        </div>

        {/* 图片源 */}
        <div className="tiptap-attribute-row">
          <label htmlFor="image-src-input" className="tiptap-attribute-label">
            源地址
          </label>
          <input
            id="image-src-input"
            type="text"
            value={srcValue}
            onChange={(e) => setSrcValue(e.target.value)}
            onBlur={handleSrcBlur}
            placeholder="https://..."
            className="tiptap-attribute-text-input tiptap-attribute-src-input"
          />
        </div>

        {/* 链接 */}
        <div className="tiptap-attribute-row">
          <label htmlFor="image-link-input" className="tiptap-attribute-label">
            链接
          </label>
          <input
            id="image-link-input"
            type="text"
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            onBlur={handleLinkBlur}
            placeholder="https://..."
            className="tiptap-attribute-text-input"
          />
        </div>
      </div>

      {/* 编辑图片 */}
      <div className="tiptap-attribute-group">
        <button
          type="button"
          className="tiptap-attribute-edit-btn"
          onClick={handleOpenEditor}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          编辑图片
        </button>
      </div>

      {showEditor && attrs.src && (
        <ImageEditor
          src={attrs.src}
          onConfirm={handleEditorConfirm}
          onCancel={handleEditorCancel}
        />
      )}
    </>
  );
}
