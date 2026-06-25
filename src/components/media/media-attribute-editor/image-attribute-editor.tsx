import type { Editor } from '@tiptap/core';
import { useCallback, useMemo, useState } from 'react';
import { ImageEditor } from '../image-editor';
import type { FilterValues } from '../image-editor/image-filter-panel';

interface ImageAttributeEditorProps {
  editor: Editor;
}

type WidthUnit = '%' | 'px';

function parseWidthValue(width: string | null | undefined): {
  value: number;
  unit: WidthUnit;
} {
  if (!width) return { value: 100, unit: '%' };
  if (width.endsWith('%')) {
    const v = Number.parseFloat(width);
    return { value: Number.isNaN(v) ? 100 : v, unit: '%' };
  }
  const v = Number.parseFloat(width);
  return { value: Number.isNaN(v) ? 100 : v, unit: 'px' };
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

export function ImageAttributeEditor({ editor }: ImageAttributeEditorProps) {
  const attrs =
    editor.getAttributes('customImage') || editor.getAttributes('image');

  const parsed = useMemo(() => parseWidthValue(attrs.width), [attrs.width]);
  const [widthUnit, setWidthUnit] = useState<WidthUnit>(parsed.unit);
  const [widthValue, setWidthValue] = useState<string>(parsed.value.toString());
  const [srcValue, setSrcValue] = useState(attrs.src || '');
  const [showEditor, setShowEditor] = useState(false);

  const commitWidth = useCallback(
    (value: string, unit: WidthUnit) => {
      if (!value) {
        editor.chain().focus().updateImageWidth?.(null).run();
        return;
      }
      const formatted = unit === '%' ? `${value}%` : `${value}px`;
      editor.chain().focus().updateImageWidth?.(formatted).run();
    },
    [editor],
  );

  const handleWidthInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setWidthValue(value);
      if (value && !Number.isNaN(Number.parseFloat(value))) {
        commitWidth(value, widthUnit);
      }
    },
    [editor, widthUnit, commitWidth],
  );

  const handleWidthUnitToggle = useCallback(() => {
    const newUnit: WidthUnit = widthUnit === '%' ? 'px' : '%';
    setWidthUnit(newUnit);
    commitWidth(widthValue, newUnit);
  }, [widthUnit, widthValue, commitWidth]);

  const handleAlignment = useCallback(
    (alignment: 'left' | 'center' | 'right') => {
      const current = editor.getAttributes('customImage')?.alignment;
      const next = current === alignment ? null : alignment;
      editor.chain().focus().updateImageAlignment?.(next).run();
    },
    [editor],
  );

  const handleSrcBlur = useCallback(() => {
    if (srcValue && srcValue.trim()) {
      editor.chain().focus().updateImageSrc?.(srcValue.trim()).run();
    }
  }, [editor, srcValue]);

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

  return (
    <>
      <div className="tiptap-attribute-group">
        {/* 宽度 */}
        <div className="tiptap-attribute-row">
          <label htmlFor="image-width-input" className="tiptap-attribute-label">
            宽度
          </label>
          <div className="tiptap-attribute-width-input">
            <input
              id="image-width-input"
              type="number"
              min={widthUnit === '%' ? 1 : 1}
              max={widthUnit === '%' ? 200 : undefined}
              step={widthUnit === '%' ? 5 : 10}
              value={widthValue}
              onChange={handleWidthInputChange}
              placeholder={widthUnit === '%' ? '100' : '自动'}
              className="tiptap-attribute-number-input"
            />
            <button
              type="button"
              className="tiptap-attribute-unit-btn"
              onClick={handleWidthUnitToggle}
              title="切换单位"
            >
              {widthUnit}
            </button>
          </div>
          {widthUnit === '%' && (
            <input
              type="range"
              min={1}
              max={200}
              step={5}
              value={Number.parseFloat(widthValue) || 100}
              onChange={handleWidthInputChange}
              className="tiptap-attribute-slider"
            />
          )}
        </div>

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
            value={attrs.alt || ''}
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .updateAttributes('customImage', {
                  alt: e.target.value,
                })
                .run() ||
              editor
                .chain()
                .focus()
                .updateAttributes('image', {
                  alt: e.target.value,
                })
                .run()
            }
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
            value={attrs.link || ''}
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .updateImageLink?.(e.target.value || null)
                .run()
            }
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
