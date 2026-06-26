import { FloatingPortal } from '@floating-ui/react';
import type { Editor } from '@tiptap/core';
import { useCallback, useState } from 'react';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '../../components/ui/toolbar';
import { useMediaBubbleMenu } from './use-media-bubble-menu';
import './media-bubble-menu.scss';

interface AttachmentBubbleMenuProps {
  editor: Editor | null;
}

/**
 * 附件悬浮菜单栏：附件选中时显示横向气泡菜单
 * 包含文件名编辑、删除等操作
 */
export function AttachmentBubbleMenu({ editor }: AttachmentBubbleMenuProps) {
  const [nameValue, setNameValue] = useState('');

  const { visible, nodePosRef, hideMenu, refs, floatingStyles } =
    useMediaBubbleMenu({
      editor,
      nodeTypes: ['attachment'],
      onActive: useCallback((attrs: Record<string, unknown>) => {
        setNameValue((attrs.fileName as string) || '');
      }, []),
    });

  const handleNameBlur = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('attachment', {
        fileName: nameValue || null,
      })
      .run();
  }, [editor, nameValue, nodePosRef]);

  const handleDelete = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().deleteSelection().run();
  }, [editor]);

  if (!editor) return null;

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        className="fsdx-editor-media-bubble-menu"
        data-visible={visible ? '' : undefined}
        style={{
          ...floatingStyles,
          visibility: visible ? 'visible' : 'hidden',
        }}
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;
          if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT'
          )
            return;
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            hideMenu();
          }
        }}
      >
        <Toolbar variant="floating">
          <ToolbarGroup>
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="文件名"
              className="fsdx-editor-media-bubble-menu-input"
              aria-label="文件名"
            />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <button
              type="button"
              className="fsdx-editor-button fsdx-editor-media-bubble-menu-btn--danger"
              onClick={handleDelete}
              aria-label="删除附件"
            >
              <svg
                width="16"
                height="16"
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
            </button>
          </ToolbarGroup>
        </Toolbar>
      </div>
    </FloatingPortal>
  );
}
