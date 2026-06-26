import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

interface AudioAttributeEditorProps {
  editor: Editor;
}

export function AudioAttributeEditor({ editor }: AudioAttributeEditorProps) {
  const attrs = editor.getAttributes('audio');
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const nodePosRef = useRef(0);

  const [autoplay, setAutoplay] = useState(!!attrs.autoplay);
  const [controls, setControls] = useState(attrs.controls !== false);
  const [loop, setLoop] = useState(!!attrs.loop);

  useEffect(() => {
    const handler = () => {
      if (!editor.isActive('audio')) return;
      const currentAttrs = editor.getAttributes('audio');
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

  const toggleHandlers = {
    autoplay: useCallback(() => {
      const next = !autoplay;
      setAutoplay(next);
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateAttributes('audio', { autoplay: next })
        .run();
    }, [autoplay, editor]),
    controls: useCallback(() => {
      const next = !controls;
      setControls(next);
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateAttributes('audio', { controls: next })
        .run();
    }, [controls, editor]),
    loop: useCallback(() => {
      const next = !loop;
      setLoop(next);
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateAttributes('audio', { loop: next })
        .run();
    }, [loop, editor]),
  };

  const handleDelete = useCallback(() => {
    editor.chain().focus().deleteSelection().run();
  }, [editor]);

  return (
    <div className="fsdx-editor-attribute-group">
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
