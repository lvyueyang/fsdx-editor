import type { Editor } from '@tiptap/core';

interface AttachmentAttributeEditorProps {
  editor: Editor;
}

export function AttachmentAttributeEditor({
  editor,
}: AttachmentAttributeEditorProps) {
  const attrs = editor.getAttributes('attachment');

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
          value={attrs.fileName || ''}
          onChange={(e) =>
            editor
              .chain()
              .focus()
              .updateAttributes('attachment', {
                fileName: e.target.value,
              })
              .run()
          }
          placeholder="文件名"
          className="tiptap-attribute-text-input"
        />
      </div>
    </div>
  );
}
