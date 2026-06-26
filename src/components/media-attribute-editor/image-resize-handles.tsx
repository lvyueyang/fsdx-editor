import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePortalContainer } from '../../core/editor-context';
import { getImageElement } from './media-dom-utils';
import './image-resize-handles.scss';

interface ImageResizeHandlesProps {
  editor: Editor;
}

const HANDLE_WIDTH = 6;
const HANDLE_INSET = 6;
const MIN_IMAGE_WIDTH = 30;

export function ImageResizeHandles({ editor }: ImageResizeHandlesProps) {
  const [imgRect, setImgRect] = useState<DOMRect | null>(null);
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef({ startX: 0, startWidth: 0, nodePos: 0 });
  const portalContainerRef = usePortalContainer();

  const computeRect = useCallback(() => {
    if (!editor || editor.isDestroyed) {
      setImgRect(null);
      return;
    }
    if (!editor.isActive('customImage')) {
      setImgRect(null);
      imgElRef.current = null;
      return;
    }

    const img = getImageElement(editor);
    if (!img) {
      setImgRect(null);
      imgElRef.current = null;
      return;
    }

    imgElRef.current = img;
    setImgRect(img.getBoundingClientRect());
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

      if (!imgRect || !imgElRef.current) return;

      setDragging(side);
      dragRef.current = {
        startX: e.clientX,
        startWidth: imgRect.width,
        nodePos: editor.state.selection.$from.pos,
      };

      document.documentElement.classList.add('fsdx-editor-resizing');
    },
    [imgRect, editor],
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

      newWidth = Math.max(MIN_IMAGE_WIDTH, Math.round(newWidth));

      const { nodePos } = dragRef.current;
      if (nodePos >= editor.state.doc.nodeSize) return;

      editor
        .chain()
        .setNodeSelection(nodePos)
        .updateImageWidth?.(`${newWidth}px`)
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

  if (!imgRect) return null;

  const handleHeight = imgRect.height > 150 ? 80 : imgRect.height * 0.9;
  const handleTop = imgRect.top + (imgRect.height - handleHeight) / 2;

  const portalTarget = portalContainerRef?.current ?? document.body;

  return createPortal(
    <>
      <div
        className={`fsdx-editor-image-resize-handle ${dragging === 'left' ? 'fsdx-editor-image-resize-handle--active' : ''}`}
        style={{
          position: 'fixed',
          left: imgRect.left + HANDLE_INSET,
          top: handleTop,
          width: HANDLE_WIDTH,
          height: handleHeight,
        }}
        onMouseDown={(e) => handleMouseDown('left', e)}
      />
      <div
        className={`fsdx-editor-image-resize-handle ${dragging === 'right' ? 'fsdx-editor-image-resize-handle--active' : ''}`}
        style={{
          position: 'fixed',
          left: imgRect.right - HANDLE_INSET - HANDLE_WIDTH,
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
