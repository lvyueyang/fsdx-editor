import { FloatingPortal } from '@floating-ui/react';
import type { Editor } from '@tiptap/core';
import { useCallback, useState } from 'react';
import { VideoResizeHandles } from '../../components/media-attribute-editor/video-resize-handles';
import { Input } from '../../components/ui/input';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '../../components/ui/toolbar';
import { useMediaBubbleMenu } from './use-media-bubble-menu';
import './media-bubble-menu.scss';

interface VideoBubbleMenuProps {
  editor: Editor | null;
}

function getWidthPercent(editor: Editor): number | null {
  const attrs = editor.getAttributes('video');
  const rawWidth = attrs?.width;
  if (rawWidth == null || rawWidth === '') return null;
  const widthAttr = String(rawWidth);

  const editorWidth = editor.view.dom.clientWidth;
  if (editorWidth <= 0) return null;

  if (widthAttr.endsWith('%')) {
    return Math.round(Number.parseFloat(widthAttr));
  }

  const pxValue = Number.parseFloat(widthAttr);
  if (Number.isNaN(pxValue)) return null;
  return Math.round((pxValue / editorWidth) * 100);
}

/**
 * 视频悬浮菜单栏：视频选中时显示横向气泡菜单，替代原来的纵向属性编辑面板
 * 包含对齐、封面图输入、播放控制开关、删除等操作
 */
export function VideoBubbleMenu({ editor }: VideoBubbleMenuProps) {
  const [posterValue, setPosterValue] = useState('');
  const [autoplay, setAutoplay] = useState(false);
  const [controls, setControls] = useState(true);
  const [loop, setLoop] = useState(false);

  const { visible, nodePosRef, hideMenu, refs, floatingStyles } =
    useMediaBubbleMenu({
      editor,
      nodeTypes: ['video'],
      onActive: useCallback((attrs: Record<string, unknown>) => {
        setPosterValue((attrs.poster as string) || '');
        setAutoplay(!!attrs.autoplay);
        setControls(attrs.controls !== false);
        setLoop(!!attrs.loop);
      }, []),
    });

  const handleAlignment = useCallback(
    (alignment: 'left' | 'center' | 'right') => {
      if (!editor) return;
      const current = editor.getAttributes('video')?.alignment;
      const next = current === alignment ? null : alignment;
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateAttributes('video', { alignment: next })
        .run();
    },
    [editor, nodePosRef],
  );

  const handlePosterBlur = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('video', {
        poster: posterValue || null,
      })
      .run();
  }, [editor, posterValue, nodePosRef]);

  const toggleAutoplay = useCallback(() => {
    if (!editor) return;
    const next = !autoplay;
    setAutoplay(next);
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('video', { autoplay: next })
      .run();
  }, [autoplay, editor, nodePosRef]);

  const toggleControls = useCallback(() => {
    if (!editor) return;
    const next = !controls;
    setControls(next);
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('video', { controls: next })
      .run();
  }, [controls, editor, nodePosRef]);

  const toggleLoop = useCallback(() => {
    if (!editor) return;
    const next = !loop;
    setLoop(next);
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('video', { loop: next })
      .run();
  }, [loop, editor, nodePosRef]);

  const handleDelete = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().deleteSelection().run();
  }, [editor]);

  if (!editor) return null;

  const currentAlignment = editor.getAttributes('video')?.alignment;
  const widthPercent = getWidthPercent(editor);

  return (
    <>
      {visible && <VideoResizeHandles editor={editor} />}
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
              <button
                type="button"
                className={`fsdx-editor-button ${currentAlignment === 'left' ? 'fsdx-editor-media-bubble-menu-btn--active' : ''}`}
                data-active-state={currentAlignment === 'left' ? 'on' : 'off'}
                onClick={() => handleAlignment('left')}
                aria-label="左对齐"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="17" y1="10" x2="3" y2="10" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="17" y1="18" x2="3" y2="18" />
                </svg>
              </button>
              <button
                type="button"
                className={`fsdx-editor-button ${currentAlignment === 'center' ? 'fsdx-editor-media-bubble-menu-btn--active' : ''}`}
                data-active-state={currentAlignment === 'center' ? 'on' : 'off'}
                onClick={() => handleAlignment('center')}
                aria-label="居中对齐"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="18" y1="10" x2="6" y2="10" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="18" y1="18" x2="6" y2="18" />
                </svg>
              </button>
              <button
                type="button"
                className={`fsdx-editor-button ${currentAlignment === 'right' ? 'fsdx-editor-media-bubble-menu-btn--active' : ''}`}
                data-active-state={currentAlignment === 'right' ? 'on' : 'off'}
                onClick={() => handleAlignment('right')}
                aria-label="右对齐"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="19" y1="10" x2="7" y2="10" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="19" y1="18" x2="7" y2="18" />
                </svg>
              </button>
              {widthPercent !== null && (
                <span className="fsdx-editor-media-bubble-menu-width-label">
                  {widthPercent}%
                </span>
              )}
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <Input
                type="text"
                value={posterValue}
                onChange={(e) => setPosterValue(e.target.value)}
                onBlur={handlePosterBlur}
                placeholder="封面图"
                className="fsdx-editor-media-bubble-menu-input"
                aria-label="视频封面图"
              />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
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
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <button
                type="button"
                className="fsdx-editor-button fsdx-editor-media-bubble-menu-btn--danger"
                onClick={handleDelete}
                aria-label="删除视频"
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
    </>
  );
}
