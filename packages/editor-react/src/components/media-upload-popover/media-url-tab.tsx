import { useCallback, useState } from 'react';
import type { MediaType } from '../../types';
import { Input } from '../ui/input';

interface MediaUrlTabProps {
  mediaType: MediaType;
  onInsert: (url: string, extraAttrs?: Record<string, unknown>) => void;
}

export function MediaUrlTab({ mediaType, onInsert }: MediaUrlTabProps) {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = url.trim();
      if (!trimmed) {
        setIsValid(false);
        return;
      }
      setIsValid(true);
      const name = trimmed.split('/').pop() || trimmed;
      onInsert(trimmed, { fileName: name });
    },
    [url, onInsert],
  );

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
      if (!isValid) setIsValid(true);
    },
    [isValid],
  );

  return (
    <div className="fsdx-editor-media-url-tab">
      <form onSubmit={handleSubmit}>
        <div className="fsdx-editor-media-url-input-group">
          <label
            htmlFor="media-url-input"
            className="fsdx-editor-media-url-label"
          >
            输入
            {mediaType === 'image'
              ? '图片'
              : mediaType === 'video'
                ? '视频'
                : mediaType === 'audio'
                  ? '音频'
                  : '附件'}
            地址
          </label>
          <Input
            id="media-url-input"
            type="url"
            placeholder="https://example.com/file"
            value={url}
            onChange={handleUrlChange}
            data-invalid={!isValid}
          />
          {!isValid && (
            <span className="fsdx-editor-media-url-error">
              请输入有效的 URL
            </span>
          )}
        </div>

        {url.trim() && isValid && (
          <div className="fsdx-editor-media-url-preview">
            {mediaType === 'image' && (
              <img
                src={url}
                alt="预览"
                className="fsdx-editor-media-url-preview-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            {mediaType === 'video' && (
              // biome-ignore lint/a11y/useMediaCaption: URL preview only
              <video
                src={url}
                controls
                className="fsdx-editor-media-url-preview-video"
              />
            )}
            {mediaType === 'audio' && (
              // biome-ignore lint/a11y/useMediaCaption: URL preview only
              <audio
                src={url}
                controls
                className="fsdx-editor-media-url-preview-audio"
              />
            )}
          </div>
        )}

        <button type="submit" className="fsdx-editor-media-url-submit">
          确认插入
        </button>
      </form>
    </div>
  );
}
