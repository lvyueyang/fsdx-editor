import type { Editor } from '@tiptap/core';
import { useCallback, useState } from 'react';

// ======== useVideoBubbleState ========

interface UseVideoBubbleStateConfig {
  editor: Editor | null;
  nodePosRef: React.MutableRefObject<number>;
}

/**
 * 视频悬浮菜单状态管理：封面图的读写和提交
 */
export function useVideoBubbleState({
  editor,
  nodePosRef,
}: UseVideoBubbleStateConfig) {
  const [posterValue, setPosterValue] = useState('');

  const syncAttrs = useCallback((attrs: Record<string, unknown>) => {
    setPosterValue((attrs.poster as string) || '');
  }, []);

  const commitPoster = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('video', { poster: posterValue || null })
      .run();
  }, [editor, posterValue, nodePosRef]);

  return { posterValue, setPosterValue, syncAttrs, commitPoster };
}

// ======== useVideoPlayback ========

interface UseVideoPlaybackConfig {
  editor: Editor | null;
  nodePosRef: React.MutableRefObject<number>;
}

/**
 * 视频播放控制状态：自动播放 / 控制条 / 循环播放的读写和切换
 */
export function useVideoPlayback({
  editor,
  nodePosRef,
}: UseVideoPlaybackConfig) {
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
