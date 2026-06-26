import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useRef, useState } from 'react';

interface AttachmentAttributeEditorProps {
  editor: Editor;
}

export function AttachmentAttributeEditor({
  editor,
}: AttachmentAttributeEditorProps) {
  const attrs = editor.getAttributes('attachment');
  const [nameValue, setNameValue] = useState(attrs.fileName || '');
  const nodePosRef = useRef(0);

  useEffect(() => {
    const handler = () => {
      if (!editor.isActive('attachment')) return;
      nodePosRef.current = editor.state.selection.$from.pos;
    };
    editor.on('transaction', handler);
    return () => {
      editor.off('transaction', handler);
    };
  }, [editor]);

  const handleNameBlur = useCallback(() => {
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('attachment', {
        fileName: nameValue || null,
      })
      .run();
  }, [editor, nameValue]);

  const handleDelete = useCallback(() => {
    editor.chain().focus().deleteSelection().run();
  }, [editor]);

  return (
    <div className="fsdx-editor-attribute-group">
      <div className="fsdx-editor-attribute-row">
        <label
          htmlFor="attachment-name-input"
          className="fsdx-editor-attribute-label"
        >
          文件名
        </label>
        <input
          id="attachment-name-input"
          type="text"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onBlur={handleNameBlur}
          placeholder="文件名"
          className="fsdx-editor-attribute-text-input"
        />
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
