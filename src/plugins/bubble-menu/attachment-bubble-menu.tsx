import type { Editor } from '@tiptap/core';
import { useCallback, useRef } from 'react';
import { Toolbar } from '../../components/ui/toolbar';
import { TrashIcon } from '../../icons/trash-icon';
import { useAttachmentState } from '../attachment';
import { BubbleMenuWrapper } from './bubble-menu-wrapper';
import { useMediaBubbleMenu } from './use-media-bubble-menu';
import './media-bubble-menu.scss';

interface AttachmentBubbleMenuProps {
  editor: Editor | null;
}

/**
 * 附件悬浮菜单：调用 attachment 插件 hook 获取状态，内联组装 UI
 */
export function AttachmentBubbleMenu({ editor }: AttachmentBubbleMenuProps) {
  const nodePosRef = useRef(0);

  const { nameValue, setNameValue, syncAttrs, commitName } = useAttachmentState(
    { editor, nodePosRef },
  );

  const { visible, hideMenu, refs, floatingStyles } = useMediaBubbleMenu({
    editor,
    nodeTypes: ['attachment'],
    onActive: syncAttrs,
    nodePosRef,
  });

  const handleDelete = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().deleteSelection().run();
  }, [editor]);

  if (!editor) return null;

  return (
    <BubbleMenuWrapper
      className="fsdx-editor-media-bubble-menu"
      visible={visible}
      refs={refs}
      floatingStyles={floatingStyles}
      hideMenu={hideMenu}
    >
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
    </BubbleMenuWrapper>
  );
}
