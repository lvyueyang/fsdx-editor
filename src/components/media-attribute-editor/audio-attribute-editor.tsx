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

  return (
    <div className="tiptap-attribute-group">
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
