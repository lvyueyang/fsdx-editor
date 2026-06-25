import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { type FilterValues, ImageFilterPanel } from './image-filter-panel';
import { createImage, getCroppedImg } from './image-utils';
import './image-editor.scss';

export interface ImageEditorProps {
  src: string;
  onConfirm: (blob: Blob, filterValues?: FilterValues) => void;
  onCancel: () => void;
}

type ViewMode = 'crop' | 'filter';

export function ImageEditor({ src, onConfirm, onCancel }: ImageEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('crop');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
  });
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const image = await createImage(src);
      const blob = await getCroppedImg(image, croppedAreaPixels, rotation);
      onConfirm(blob, filterValues);
    } catch {
      setProcessing(false);
    }
  }, [src, croppedAreaPixels, rotation, filterValues, onConfirm]);

  const aspects = [
    { label: '自由', value: undefined },
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4 / 3 },
    { label: '16:9', value: 16 / 9 },
  ];

  return (
    <div
      className="tiptap-image-editor-overlay"
      onClick={onCancel}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel();
      }}
      role="button"
      tabIndex={-1}
    >
      <div
        className="tiptap-image-editor"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCancel();
        }}
      >
        <div className="tiptap-image-editor-header">
          <div className="tiptap-image-editor-tabs">
            <button
              type="button"
              className={`tiptap-image-editor-tab ${viewMode === 'crop' ? 'tiptap-image-editor-tab--active' : ''}`}
              onClick={() => setViewMode('crop')}
            >
              裁切
            </button>
            <button
              type="button"
              className={`tiptap-image-editor-tab ${viewMode === 'filter' ? 'tiptap-image-editor-tab--active' : ''}`}
              onClick={() => setViewMode('filter')}
            >
              滤镜
            </button>
          </div>
          <button
            type="button"
            className="tiptap-image-editor-close"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>

        <div className="tiptap-image-editor-body">
          {viewMode === 'crop' ? (
            <div className="tiptap-image-editor-crop-area">
              <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect ?? 0}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>
          ) : (
            <div className="tiptap-image-editor-filter-area">
              <div className="tiptap-image-editor-filter-preview">
                <img
                  src={src}
                  alt="滤镜预览"
                  style={{
                    filter: Object.entries(filterValues)
                      .map(([key, val]) => {
                        switch (key) {
                          case 'brightness':
                            return `brightness(${val}%)`;
                          case 'contrast':
                            return `contrast(${val}%)`;
                          case 'saturation':
                            return `saturate(${val}%)`;
                          case 'blur':
                            return `blur(${val}px)`;
                          case 'grayscale':
                            return `grayscale(${val}%)`;
                          case 'sepia':
                            return `sepia(${val}%)`;
                          default:
                            return '';
                        }
                      })
                      .join(' '),
                  }}
                />
              </div>
              <ImageFilterPanel
                values={filterValues}
                onChange={setFilterValues}
              />
            </div>
          )}
        </div>

        <div className="tiptap-image-editor-footer">
          {viewMode === 'crop' && (
            <div className="tiptap-image-editor-crop-controls">
              <div className="tiptap-image-editor-control-row">
                <label
                  htmlFor="crop-zoom"
                  className="tiptap-image-editor-label"
                >
                  缩放
                </label>
                <input
                  id="crop-zoom"
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
                <span className="tiptap-image-editor-value">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <div className="tiptap-image-editor-control-row">
                <label
                  htmlFor="crop-rotation"
                  className="tiptap-image-editor-label"
                >
                  旋转
                </label>
                <input
                  id="crop-rotation"
                  type="range"
                  min={-180}
                  max={180}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                />
                <span className="tiptap-image-editor-value">{rotation}°</span>
              </div>
              <div className="tiptap-image-editor-control-row">
                <span className="tiptap-image-editor-label">比例</span>
                <div className="tiptap-image-editor-aspect-btns">
                  {aspects.map((a) => (
                    <button
                      key={a.label}
                      type="button"
                      className={`tiptap-image-editor-aspect-btn ${aspect === a.value ? 'tiptap-image-editor-aspect-btn--active' : ''}`}
                      onClick={() => setAspect(a.value)}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {viewMode === 'filter' && (
            <div className="tiptap-image-editor-filter-actions">
              <button
                type="button"
                className="tiptap-image-editor-btn tiptap-image-editor-btn--ghost"
                onClick={() =>
                  setFilterValues({
                    brightness: 100,
                    contrast: 100,
                    saturation: 100,
                    blur: 0,
                    grayscale: 0,
                    sepia: 0,
                  })
                }
              >
                重置
              </button>
            </div>
          )}
          <div className="tiptap-image-editor-actions">
            <button
              type="button"
              className="tiptap-image-editor-btn tiptap-image-editor-btn--ghost"
              onClick={onCancel}
            >
              取消
            </button>
            <button
              type="button"
              className="tiptap-image-editor-btn tiptap-image-editor-btn--primary"
              onClick={handleConfirm}
              disabled={processing}
            >
              {processing ? '处理中...' : '确认'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
