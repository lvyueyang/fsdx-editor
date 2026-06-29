import type { Editor } from '@tiptap/core';
import { useCallback, useRef } from 'react';
import { Toolbar } from '../../components/ui/toolbar';
import { TrashIcon } from '../../icons/trash-icon';
import { useAudioPlayback } from '../audio';
import { BubbleMenuWrapper } from './bubble-menu-wrapper';
import { useMediaBubbleMenu } from './use-media-bubble-menu';
import './media-bubble-menu.scss';

interface AudioBubbleMenuProps {
  editor: Editor | null;
}

/**
 * 音频悬浮菜单：调用 audio 插件 hook 获取状态，内联组装 UI
 */
export function AudioBubbleMenu({ editor }: AudioBubbleMenuProps) {
  const nodePosRef = useRef(0);

  const {
    autoplay,
    controls,
    loop,
    syncAttrs,
    toggleAutoplay,
    toggleControls,
    toggleLoop,
  } = useAudioPlayback({ editor, nodePosRef });

  const { visible, hideMenu, refs, floatingStyles } = useMediaBubbleMenu({
    editor,
    nodeTypes: ['audio'],
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
            label="删除音频"
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
