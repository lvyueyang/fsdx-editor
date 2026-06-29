import type { Editor } from '@tiptap/core';
import { useCallback, useEffect } from 'react';
import { Toolbar } from '../../components/ui/toolbar';
import { TrashIcon } from '../../icons/trash-icon';
import { useAudioPlayback } from '../audio';

interface AudioBubbleMenuContentProps {
  editor: Editor;
  nodePosRef: React.MutableRefObject<number>;
  hideMenu: () => void;
}

/**
 * 音频悬浮菜单内容：播放选项、删除
 */
export function AudioBubbleMenuContent({
  editor,
  nodePosRef,
  hideMenu,
}: AudioBubbleMenuContentProps) {
  const {
    autoplay,
    controls,
    loop,
    syncAttrs,
    toggleAutoplay,
    toggleControls,
    toggleLoop,
  } = useAudioPlayback({ editor, nodePosRef });

  useEffect(() => {
    const sync = () => {
      const attrs = editor.getAttributes('audio');
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
  );
}
