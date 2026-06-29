import type { Editor } from '@tiptap/core';
import { useCallback, useRef } from 'react';
import { VideoResizeHandles } from '../../components/media-attribute-editor/video-resize-handles';
import { Toolbar } from '../../components/ui/toolbar';
import { AlignCenterIcon } from '../../icons/align-center-icon';
import { AlignLeftIcon } from '../../icons/align-left-icon';
import { AlignRightIcon } from '../../icons/align-right-icon';
import { TrashIcon } from '../../icons/trash-icon';
import {
  getVideoWidthPercent,
  useVideoBubbleState,
  useVideoPlayback,
} from '../video';
import { BubbleMenuWrapper } from './bubble-menu-wrapper';
import { useMediaBubbleMenu } from './use-media-bubble-menu';
import './media-bubble-menu.scss';

interface VideoBubbleMenuProps {
  editor: Editor | null;
}

/**
 * 视频悬浮菜单：调用 video 插件 hooks 获取状态，内联组装 UI
 */
export function VideoBubbleMenu({ editor }: VideoBubbleMenuProps) {
  const nodePosRef = useRef(0);

  const {
    posterValue,
    setPosterValue,
    syncAttrs: syncState,
    commitPoster,
  } = useVideoBubbleState({ editor, nodePosRef });

  const {
    autoplay,
    controls,
    loop,
    syncAttrs: syncPlayback,
    toggleAutoplay,
    toggleControls,
    toggleLoop,
  } = useVideoPlayback({ editor, nodePosRef });

  const { visible, hideMenu, refs, floatingStyles } = useMediaBubbleMenu({
    editor,
    nodeTypes: ['video'],
    onActive: useCallback(
      (attrs: Record<string, unknown>) => {
        syncState(attrs);
        syncPlayback(attrs);
      },
      [syncState, syncPlayback],
    ),
    nodePosRef,
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

  const handleDelete = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().deleteSelection().run();
  }, [editor]);

  if (!editor) return null;

  const currentAlignment = editor.getAttributes('video')?.alignment;
  const widthPercent = getVideoWidthPercent(editor);

  return (
    <>
      {visible && <VideoResizeHandles editor={editor} />}
      <BubbleMenuWrapper
        className="fsdx-editor-media-bubble-menu"
        visible={visible}
        refs={refs}
        floatingStyles={floatingStyles}
        hideMenu={hideMenu}
      >
        <Toolbar variant="floating">
          <Toolbar.Group>
            <Toolbar.Button
              label="左对齐"
              active={currentAlignment === 'left'}
              onClick={() => handleAlignment('left')}
            >
              <AlignLeftIcon className="fsdx-editor-button-icon" />
            </Toolbar.Button>
            <Toolbar.Button
              label="居中对齐"
              active={currentAlignment === 'center'}
              onClick={() => handleAlignment('center')}
            >
              <AlignCenterIcon className="fsdx-editor-button-icon" />
            </Toolbar.Button>
            <Toolbar.Button
              label="右对齐"
              active={currentAlignment === 'right'}
              onClick={() => handleAlignment('right')}
            >
              <AlignRightIcon className="fsdx-editor-button-icon" />
            </Toolbar.Button>
            {widthPercent !== null && (
              <span className="fsdx-editor-media-bubble-menu-width-label">
                {widthPercent}%
              </span>
            )}
          </Toolbar.Group>

          <Toolbar.Separator />

          <Toolbar.Group>
            <Toolbar.Input
              type="text"
              value={posterValue}
              onChange={(e) => setPosterValue(e.target.value)}
              onBlur={commitPoster}
              placeholder="封面图"
              className="fsdx-editor-media-bubble-menu-input"
              aria-label="视频封面图"
            />
          </Toolbar.Group>

          <Toolbar.Separator />

          <Toolbar.Group>
            <Toolbar.Button
              label="自动播放"
              active={autoplay}
              className="fsdx-editor-media-bubble-menu-toggle"
              onClick={toggleAutoplay}
            >
              自动播放
            </Toolbar.Button>
            <Toolbar.Button
              label="控制条"
              active={controls}
              className="fsdx-editor-media-bubble-menu-toggle"
              onClick={toggleControls}
            >
              控制条
            </Toolbar.Button>
            <Toolbar.Button
              label="循环播放"
              active={loop}
              className="fsdx-editor-media-bubble-menu-toggle"
              onClick={toggleLoop}
            >
              循环
            </Toolbar.Button>
          </Toolbar.Group>

          <Toolbar.Separator />

          <Toolbar.Group>
            <Toolbar.Button
              label="删除视频"
              variant="danger"
              onClick={handleDelete}
            >
              <TrashIcon className="fsdx-editor-button-icon" />
            </Toolbar.Button>
          </Toolbar.Group>
        </Toolbar>
      </BubbleMenuWrapper>
    </>
  );
}
