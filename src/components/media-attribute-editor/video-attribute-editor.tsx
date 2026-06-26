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

  return (
    <div className="tiptap-attribute-group">
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
        {widthPercent !== null && (
          <span className="tiptap-attribute-label">{widthPercent}%</span>
        )}
      </div>

      <div className="tiptap-attribute-row">
        <label htmlFor="video-poster-input" className="tiptap-attribute-label">
          封面图
        </label>
        <input
          id="video-poster-input"
          type="text"
          value={posterValue}
          onChange={(e) => setPosterValue(e.target.value)}
          onBlur={handlePosterBlur}
          placeholder="https://..."
          className="tiptap-attribute-text-input"
        />
      </div>

      <div className="tiptap-attribute-row">
        <div className="tiptap-attribute-toggles">
          <label className="tiptap-attribute-toggle">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={toggleHandlers.autoplay}
            />
            自动播放
          </label>
          <label className="tiptap-attribute-toggle">
            <input
              type="checkbox"
              checked={controls}
              onChange={toggleHandlers.controls}
            />
            控制条
          </label>
          <label className="tiptap-attribute-toggle">
            <input
              type="checkbox"
              checked={loop}
              onChange={toggleHandlers.loop}
            />
            循环
          </label>
        </div>
      </div>
    </div>
  );
}
