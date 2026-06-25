import type { Editor } from '@tiptap/core';
import { useCallback, useState } from 'react';

interface VideoAttributeEditorProps {
  editor: Editor;
}

export function VideoAttributeEditor({ editor }: VideoAttributeEditorProps) {
  const attrs = editor.getAttributes('video');
  const [width, setWidth] = useState(attrs.width || '');

  const handleWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setWidth(value);
      editor
        .chain()
        .focus()
        .updateAttributes('video', { width: value || null })
        .run();
    },
    [editor],
  );

  const handleAlignment = useCallback(
    (alignment: 'left' | 'center' | 'right') => {
      const current = editor.getAttributes('video')?.alignment;
      const next = current === alignment ? null : alignment;
      editor
        .chain()
        .focus()
        .updateAttributes('video', { alignment: next })
        .run();
    },
    [editor],
  );

  const handleToggle = useCallback(
    (attr: string) => {
      const current = !!editor.getAttributes('video')?.[attr];
      editor
        .chain()
        .focus()
        .updateAttributes('video', { [attr]: !current })
        .run();
    },
    [editor],
  );

  const currentAlignment = editor.getAttributes('video')?.alignment;

  return (
    <div className="tiptap-attribute-group">
      <div className="tiptap-attribute-row">
        <label htmlFor="video-width-input" className="tiptap-attribute-label">
          宽度
        </label>
        <div className="tiptap-attribute-width-input">
          <input
            id="video-width-input"
            type="number"
            min="50"
            max="100"
            step="5"
            value={width}
            onChange={handleWidthChange}
            placeholder="100"
            className="tiptap-attribute-number-input"
          />
          <span className="tiptap-attribute-unit">%</span>
        </div>
      </div>

      <div className="tiptap-attribute-row">
        <span className="tiptap-attribute-label">对齐</span>
        <div className="tiptap-attribute-btn-group">
          <button
            type="button"
            className={`tiptap-attribute-btn ${currentAlignment === 'left' ? 'tiptap-attribute-btn--active' : ''}`}
            onClick={() => handleAlignment('left')}
          >
            左
          </button>
          <button
            type="button"
            className={`tiptap-attribute-btn ${currentAlignment === 'center' ? 'tiptap-attribute-btn--active' : ''}`}
            onClick={() => handleAlignment('center')}
          >
            中
          </button>
          <button
            type="button"
            className={`tiptap-attribute-btn ${currentAlignment === 'right' ? 'tiptap-attribute-btn--active' : ''}`}
            onClick={() => handleAlignment('right')}
          >
            右
          </button>
        </div>
      </div>

      <div className="tiptap-attribute-row">
        <label htmlFor="video-poster-input" className="tiptap-attribute-label">
          封面图
        </label>
        <input
          id="video-poster-input"
          type="text"
          value={attrs.poster || ''}
          onChange={(e) =>
            editor
              .chain()
              .focus()
              .updateAttributes('video', {
                poster: e.target.value || null,
              })
              .run()
          }
          placeholder="https://..."
          className="tiptap-attribute-text-input"
        />
      </div>

      <div className="tiptap-attribute-row">
        <div className="tiptap-attribute-toggles">
          <label className="tiptap-attribute-toggle">
            <input
              type="checkbox"
              checked={!!attrs.autoplay}
              onChange={() => handleToggle('autoplay')}
            />
            自动播放
          </label>
          <label className="tiptap-attribute-toggle">
            <input
              type="checkbox"
              checked={attrs.controls !== false}
              onChange={() => handleToggle('controls')}
            />
            控制条
          </label>
          <label className="tiptap-attribute-toggle">
            <input
              type="checkbox"
              checked={!!attrs.loop}
              onChange={() => handleToggle('loop')}
            />
            循环
          </label>
        </div>
      </div>
    </div>
  );
}
