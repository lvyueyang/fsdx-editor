import type { Editor } from '@tiptap/core';
import { useCallback, useEffect } from 'react';
import { Toolbar } from '../../components/ui/toolbar';
import { TrashIcon } from '../../icons/trash-icon';
import { useAttachmentState } from '../attachment';

interface AttachmentBubbleMenuContentProps {
  editor: Editor;
  nodePosRef: React.MutableRefObject<number>;
  hideMenu: () => void;
}

/**
 * 附件悬浮菜单内容：文件名、删除
 */
export function AttachmentBubbleMenuContent({
  editor,
  nodePosRef,
  hideMenu,
}: AttachmentBubbleMenuContentProps) {
  const { nameValue, setNameValue, syncAttrs, commitName } = useAttachmentState(
    { editor, nodePosRef },
  );

  useEffect(() => {
    const sync = () => {
      const attrs = editor.getAttributes('attachment');
      syncAttrs(attrs);
    };
    sync();
    editor.on('selectionUpdate', sync);
    return () => {
      editor.off('selectionUpdate', sync);
    };
  }, [editor, syncAttrs]);

  const handleDelete = useCallback(() => {
    editor.chain().focus().deleteSelection().run();
    hideMenu();
  }, [editor, hideMenu]);

  return (
    <Toolbar variant="floating">
      <Toolbar.Group>
        <Toolbar.Input
          type="text"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onBlur={commitName}
          placeholder="文件名"
          className="fsdx-editor-media-bubble-menu-input"
          aria-label="文件名"
        />
      </Toolbar.Group>

      <Toolbar.Separator />

      <Toolbar.Group>
        <Toolbar.Button
          label="删除附件"
          variant="danger"
          onClick={handleDelete}
        >
          <TrashIcon className="fsdx-editor-button-icon" />
        </Toolbar.Button>
      </Toolbar.Group>
    </Toolbar>
  );
}
