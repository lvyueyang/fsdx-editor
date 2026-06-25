import type { Editor } from '@tiptap/core';
import { useCallback } from 'react';

interface AudioAttributeEditorProps {
  editor: Editor;
}

export function AudioAttributeEditor({ editor }: AudioAttributeEditorProps) {
  const attrs = editor.getAttributes('audio');

  const handleToggle = useCallback(
    (attr: string) => {
      const current = !!editor.getAttributes('audio')?.[attr];
      editor
        .chain()
        .focus()
        .updateAttributes('audio', { [attr]: !current })
        .run();
    },
    [editor],
  );

  return (
    <div className="tiptap-attribute-group">
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
