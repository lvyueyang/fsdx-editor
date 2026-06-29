import { useCallback, useRef, useState } from 'react';
import { MediaDragArea } from '../../components/media-drag-area';
import { Badge } from '../../components/ui/badge';
import { useEditorOptions } from '../../core/editor-context';
import { formatFileSize } from '../../lib/format-file-size';
import type { MediaType } from '../../types';

interface FileItem {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

interface MediaUploadTabProps {
  mediaType: MediaType;
  accept: string;
  onInsert: (url: string, extraAttrs?: Record<string, unknown>) => void;
}

export function MediaUploadTab({
  mediaType,
  accept,
  onInsert,
}: MediaUploadTabProps) {
  const options = useEditorOptions();
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadConfig = options?.[mediaType];

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      if (!uploadConfig) return;

      const fileArray = Array.from(files);
      const newItems = fileArray.map((file) => ({
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: 'uploading' as const,
      }));

      setFileItems((prev) => [...prev, ...newItems]);

      newItems.forEach((item) => {
        uploadConfig
          .upload(item.file, (progress) => {
            setFileItems((prev) =>
              prev.map((fi) => (fi.id === item.id ? { ...fi, progress } : fi)),
            );
          })
          .then((result) => {
            setFileItems((prev) =>
              prev.map((fi) =>
                fi.id === item.id ? { ...fi, status: 'success' } : fi,
              ),
            );
            const extraAttrs: Record<string, unknown> = {
              fileName: result.name || item.file.name,
            };
            if (mediaType === 'attachment') {
              extraAttrs.fileSize = result.size || item.file.size;
              extraAttrs.fileType = result.fileType || item.file.type;
            }
            onInsert(result.url, extraAttrs);
          })
          .catch(() => {
            setFileItems((prev) =>
              prev.map((fi) =>
                fi.id === item.id ? { ...fi, status: 'error' } : fi,
              ),
            );
          });
      });
    },
    [uploadConfig, mediaType, onInsert],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
        e.target.value = '';
      }
    },
    [handleFiles],
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  if (!uploadConfig) {
    return (
      <div className="fsdx-editor-media-upload-placeholder">
        未配置 {mediaType} 上传功能
      </div>
    );
  }

  return (
    <div className="fsdx-editor-media-upload-tab-content">
      <MediaDragArea onFile={handleFiles}>
        <div
          className="fsdx-editor-media-drag-content"
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="fsdx-editor-media-drag-text">
            拖拽文件到此处，或点击上传
          </span>
        </div>
      </MediaDragArea>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleInputChange}
        className="fsdx-editor-media-hidden-input"
      />

      {fileItems.length > 0 && (
        <div className="fsdx-editor-media-upload-preview-list">
          {fileItems.map((item) => (
            <div
              key={item.id}
              className="fsdx-editor-media-upload-preview-item"
            >
              <span className="fsdx-editor-media-upload-file-name">
                {item.file.name}
              </span>
              <span className="fsdx-editor-media-upload-file-size">
                {formatFileSize(item.file.size)}
              </span>
              {item.status === 'uploading' && (
                <div className="fsdx-editor-media-upload-progress">
                  <div
                    className="fsdx-editor-media-upload-progress-bar"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
              {item.status === 'success' && (
                <Badge variant="green" size="small">
                  完成
                </Badge>
              )}
              {item.status === 'error' && (
                <Badge variant="red" size="small">
                  失败
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
