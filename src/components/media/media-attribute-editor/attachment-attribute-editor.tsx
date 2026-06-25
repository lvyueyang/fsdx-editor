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

  return (
    <div className="tiptap-attribute-group">
      <div className="tiptap-attribute-row">
        <label
          htmlFor="attachment-name-input"
          className="tiptap-attribute-label"
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
          className="tiptap-attribute-text-input"
        />
      </div>
    </div>
  );
}
