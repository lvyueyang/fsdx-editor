import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePortalContainer } from '../../core/editor-context';
import { getVideoElement } from './media-dom-utils';
import './video-resize-handles.scss';

interface VideoResizeHandlesProps {
  editor: Editor;
}

const HANDLE_WIDTH = 6;
const HANDLE_INSET = 6;
const MIN_VIDEO_WIDTH = 100;

export function VideoResizeHandles({ editor }: VideoResizeHandlesProps) {
  const [videoRect, setVideoRect] = useState<DOMRect | null>(null);
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const dragRef = useRef({ startX: 0, startWidth: 0, nodePos: 0 });
  const portalContainerRef = usePortalContainer();

  const computeRect = useCallback(() => {
    if (!editor || editor.isDestroyed) {
      setVideoRect(null);
      return;
    }
    if (!editor.isActive('video')) {
      setVideoRect(null);
      videoElRef.current = null;
      return;
    }

    const video = getVideoElement(editor);
    if (!video) {
      setVideoRect(null);
      videoElRef.current = null;
      return;
    }

    videoElRef.current = video;
    setVideoRect(video.getBoundingClientRect());
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    computeRect();

    editor.on('selectionUpdate', computeRect);
    editor.on('transaction', computeRect);
    window.addEventListener('scroll', computeRect, {
      passive: true,
      capture: true,
    });
    window.addEventListener('resize', computeRect, { passive: true });

    return () => {
      editor.off('selectionUpdate', computeRect);
      editor.off('transaction', computeRect);
      window.removeEventListener('scroll', computeRect, true);
      window.removeEventListener('resize', computeRect);
    };
  }, [editor, computeRect]);

  const handleMouseDown = useCallback(
    (side: 'left' | 'right', e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!videoRect || !videoElRef.current) return;

      setDragging(side);
      dragRef.current = {
        startX: e.clientX,
        startWidth: videoRect.width,
        nodePos: editor.state.selection.$from.pos,
      };

      document.documentElement.classList.add('fsdx-editor-resizing');
    },
    [videoRect, editor],
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragRef.current.startX;
      let newWidth: number;

      if (dragging === 'left') {
        newWidth = dragRef.current.startWidth - dx;
      } else {
        newWidth = dragRef.current.startWidth + dx;
      }

      newWidth = Math.max(MIN_VIDEO_WIDTH, Math.round(newWidth));

      const { nodePos } = dragRef.current;
      if (nodePos >= editor.state.doc.nodeSize) return;

      editor
        .chain()
        .setNodeSelection(nodePos)
        .updateAttributes('video', { width: `${newWidth}px` })
        .run();
    };

    const handleMouseUp = () => {
      setDragging(null);
      document.documentElement.classList.remove('fsdx-editor-resizing');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, editor]);

  if (!videoRect) return null;

  const handleHeight = videoRect.height > 150 ? 80 : videoRect.height * 0.9;
  const handleTop = videoRect.top + (videoRect.height - handleHeight) / 2;

  const portalTarget = portalContainerRef?.current ?? document.body;

  return createPortal(
    <>
      <div
        className={`fsdx-editor-video-resize-handle ${dragging === 'left' ? 'fsdx-editor-video-resize-handle--active' : ''}`}
        style={{
          position: 'fixed',
          left: videoRect.left + HANDLE_INSET,
          top: handleTop,
          width: HANDLE_WIDTH,
          height: handleHeight,
        }}
        onMouseDown={(e) => handleMouseDown('left', e)}
      />
      <div
        className={`fsdx-editor-video-resize-handle ${dragging === 'right' ? 'fsdx-editor-video-resize-handle--active' : ''}`}
        style={{
          position: 'fixed',
          left: videoRect.right - HANDLE_INSET - HANDLE_WIDTH,
          top: handleTop,
          width: HANDLE_WIDTH,
          height: handleHeight,
        }}
        onMouseDown={(e) => handleMouseDown('right', e)}
      />
    </>,
    portalTarget,
  );
}
