import { FloatingPortal } from '@floating-ui/react';
import type { Editor } from '@tiptap/core';
import { useCallback, useState } from 'react';
import { Toolbar } from '../../components/ui/toolbar';
import { useMediaBubbleMenu } from './use-media-bubble-menu';
import './media-bubble-menu.scss';

interface AudioBubbleMenuProps {
  editor: Editor | null;
}

/**
 * 音频悬浮菜单栏：音频选中时显示横向气泡菜单
 * 包含播放控制开关、删除等操作
 */
export function AudioBubbleMenu({ editor }: AudioBubbleMenuProps) {
  const [autoplay, setAutoplay] = useState(false);
  const [controls, setControls] = useState(true);
  const [loop, setLoop] = useState(false);

  const { visible, nodePosRef, hideMenu, refs, floatingStyles } =
    useMediaBubbleMenu({
      editor,
      nodeTypes: ['audio'],
      onActive: useCallback((attrs: Record<string, unknown>) => {
        setAutoplay(!!attrs.autoplay);
        setControls(attrs.controls !== false);
        setLoop(!!attrs.loop);
      }, []),
    });

  const toggleAutoplay = useCallback(() => {
    if (!editor) return;
    const next = !autoplay;
    setAutoplay(next);
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('audio', { autoplay: next })
      .run();
  }, [autoplay, editor, nodePosRef]);

  const toggleControls = useCallback(() => {
    if (!editor) return;
    const next = !controls;
    setControls(next);
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('audio', { controls: next })
      .run();
  }, [controls, editor, nodePosRef]);

  const toggleLoop = useCallback(() => {
    if (!editor) return;
    const next = !loop;
    setLoop(next);
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('audio', { loop: next })
      .run();
  }, [loop, editor, nodePosRef]);

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
          <Toolbar.Group>
            <button
              type="button"
              className={`fsdx-editor-button fsdx-editor-media-bubble-menu-toggle ${autoplay ? 'fsdx-editor-media-bubble-menu-btn--active' : ''}`}
              data-active-state={autoplay ? 'on' : 'off'}
              onClick={toggleAutoplay}
              aria-label="自动播放"
            >
              自动播放
            </button>
            <button
              type="button"
              className={`fsdx-editor-button fsdx-editor-media-bubble-menu-toggle ${controls ? 'fsdx-editor-media-bubble-menu-btn--active' : ''}`}
              data-active-state={controls ? 'on' : 'off'}
              onClick={toggleControls}
              aria-label="控制条"
            >
              控制条
            </button>
            <button
              type="button"
              className={`fsdx-editor-button fsdx-editor-media-bubble-menu-toggle ${loop ? 'fsdx-editor-media-bubble-menu-btn--active' : ''}`}
              data-active-state={loop ? 'on' : 'off'}
              onClick={toggleLoop}
              aria-label="循环播放"
            >
              循环
            </button>
          </Toolbar.Group>

          <Toolbar.Separator />

          <Toolbar.Group>
            <button
              type="button"
              className="fsdx-editor-button fsdx-editor-media-bubble-menu-btn--danger"
              onClick={handleDelete}
              aria-label="删除音频"
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
          </Toolbar.Group>
        </Toolbar>
      </div>
    </FloatingPortal>
  );
}
