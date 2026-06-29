import type { Editor } from '@tiptap/core';
import { useCallback, useState } from 'react';

interface UseAudioPlaybackConfig {
  editor: Editor | null;
  nodePosRef: React.MutableRefObject<number>;
}

/**
 * 音频播放控制状态：自动播放 / 控制条 / 循环播放的读写和切换
 */
export function useAudioPlayback({
  editor,
  nodePosRef,
}: UseAudioPlaybackConfig) {
  const [autoplay, setAutoplay] = useState(false);
  const [controls, setControls] = useState(true);
  const [loop, setLoop] = useState(false);

  const syncAttrs = useCallback((attrs: Record<string, unknown>) => {
    setAutoplay(!!attrs.autoplay);
    setControls(attrs.controls !== false);
    setLoop(!!attrs.loop);
  }, []);

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

  return {
    autoplay,
    controls,
    loop,
    syncAttrs,
    toggleAutoplay,
    toggleControls,
    toggleLoop,
  };
}
