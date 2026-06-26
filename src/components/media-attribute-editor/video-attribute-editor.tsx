import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { getVideoElement } from './media-dom-utils';

interface VideoAttributeEditorProps {
  editor: Editor;
}

function getWidthPercent(editor: Editor): number | null {
  const attrs = editor.getAttributes('video');
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

  const video = getVideoElement(editor);
  if (!video) return null;

  return Math.round((video.clientWidth / editorWidth) * 100);
}

export function VideoAttributeEditor({ editor }: VideoAttributeEditorProps) {
  const attrs = editor.getAttributes('video');
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const nodePosRef = useRef(0);

  const [autoplay, setAutoplay] = useState(!!attrs.autoplay);
  const [controls, setControls] = useState(attrs.controls !== false);
  const [loop, setLoop] = useState(!!attrs.loop);

  useEffect(() => {
    const handler = () => {
      if (!editor.isActive('video')) return;
      const currentAttrs = editor.getAttributes('video');
      nodePosRef.current = editor.state.selection.$from.pos;
      setAutoplay(!!currentAttrs.autoplay);
      setControls(currentAttrs.controls !== false);
      setLoop(!!currentAttrs.loop);
      forceUpdate();
    };
    editor.on('transaction', handler);
    return () => {
      editor.off('transaction', handler);
    };
  }, [editor]);

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

  const toggleHandlers = {
    autoplay: useCallback(() => {
      const next = !autoplay;
      setAutoplay(next);
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateAttributes('video', { autoplay: next })
        .run();
    }, [autoplay, editor]),
    controls: useCallback(() => {
      const next = !controls;
      setControls(next);
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateAttributes('video', { controls: next })
        .run();
    }, [controls, editor]),
    loop: useCallback(() => {
      const next = !loop;
      setLoop(next);
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateAttributes('video', { loop: next })
        .run();
    }, [loop, editor]),
  };

  const currentAlignment = editor.getAttributes('video')?.alignment;
  const widthPercent = getWidthPercent(editor);

  const [posterValue, setPosterValue] = useState(attrs.poster || '');

  const handlePosterBlur = useCallback(() => {
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('video', {
        poster: posterValue || null,
      })
      .run();
  }, [editor, posterValue]);

  const handleDelete = useCallback(() => {
    editor.chain().focus().deleteSelection().run();
  }, [editor]);

  return (
    <div className="fsdx-editor-attribute-group">
      <div className="fsdx-editor-attribute-row">
        <span className="fsdx-editor-attribute-label">对齐</span>
        <div className="fsdx-editor-attribute-btn-group">
          <button
            type="button"
            className={`fsdx-editor-attribute-btn ${currentAlignment === 'left' ? 'fsdx-editor-attribute-btn--active' : ''}`}
            onClick={() => handleAlignment('left')}
          >
            左
          </button>
          <button
            type="button"
            className={`fsdx-editor-attribute-btn ${currentAlignment === 'center' ? 'fsdx-editor-attribute-btn--active' : ''}`}
            onClick={() => handleAlignment('center')}
          >
            中
          </button>
          <button
            type="button"
            className={`fsdx-editor-attribute-btn ${currentAlignment === 'right' ? 'fsdx-editor-attribute-btn--active' : ''}`}
            onClick={() => handleAlignment('right')}
          >
            右
          </button>
        </div>
        {widthPercent !== null && (
          <span className="fsdx-editor-attribute-label">{widthPercent}%</span>
        )}
      </div>

      <div className="fsdx-editor-attribute-row">
        <label
          htmlFor="video-poster-input"
          className="fsdx-editor-attribute-label"
        >
          封面图
        </label>
        <input
          id="video-poster-input"
          type="text"
          value={posterValue}
          onChange={(e) => setPosterValue(e.target.value)}
          onBlur={handlePosterBlur}
          placeholder="https://..."
          className="fsdx-editor-attribute-text-input"
        />
      </div>

      <div className="fsdx-editor-attribute-row">
        <div className="fsdx-editor-attribute-toggles">
          <label className="fsdx-editor-attribute-toggle">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={toggleHandlers.autoplay}
            />
            自动播放
          </label>
          <label className="fsdx-editor-attribute-toggle">
            <input
              type="checkbox"
              checked={controls}
              onChange={toggleHandlers.controls}
            />
            控制条
          </label>
          <label className="fsdx-editor-attribute-toggle">
            <input
              type="checkbox"
              checked={loop}
              onChange={toggleHandlers.loop}
            />
            循环
          </label>
        </div>
      </div>

      <div className="fsdx-editor-attribute-row">
        <button
          type="button"
          className="fsdx-editor-attribute-edit-btn fsdx-editor-attribute-delete-btn"
          onClick={handleDelete}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
          删除
        </button>
      </div>
    </div>
  );
}
