import {
  FloatingPortal,
  flip,
  offset,
  shift,
  type UseFloatingOptions,
  useFloating,
} from '@floating-ui/react';
import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const EMPTY_RECT = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as DOMRect;

export interface FloatingElementProps {
  editor: Editor | null;
  shouldShow?: boolean;
  floatingOptions?: Partial<UseFloatingOptions>;
  zIndex?: number;
  closeOnEscape?: boolean;
  children: React.ReactNode;
  getBoundingClientRect?: (editor: Editor) => DOMRect | null;
}

export function getSelectionBoundingRect(editor: Editor): DOMRect | null {
  const { selection } = editor.state;
  const { $from } = selection;

  if (!$from.nodeAfter) return null;

  const pos = editor.view.coordsAtPos($from.pos);

  return {
    x: pos.left,
    y: pos.top,
    width: pos.right - pos.left,
    height: pos.bottom - pos.top,
    top: pos.top,
    left: pos.left,
    right: pos.right,
    bottom: pos.bottom,
  } as DOMRect;
}

export function isElementWithinEditor(editor: Editor, element: Node): boolean {
  return editor.view.dom.contains(element);
}

function findScrollableAncestor(el: HTMLElement | null): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current) {
    const style = getComputedStyle(current);
    if (/(auto|scroll)/.test(style.overflow + style.overflowY)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

export function FloatingElement({
  editor,
  shouldShow,
  floatingOptions,
  zIndex = 50,
  closeOnEscape = true,
  children,
  getBoundingClientRect,
}: FloatingElementProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const visible = shouldShow ?? !!rect;

  const scrollHostRef = useRef<HTMLElement | null>(null);

  const computeRect = useCallback(() => {
    if (!editor || editor.isDestroyed) return;
    const fn = getBoundingClientRect || getSelectionBoundingRect;
    setRect(fn(editor));
  }, [editor, getBoundingClientRect]);

  useEffect(() => {
    if (!editor) return;

    computeRect();

    editor.on('selectionUpdate', computeRect);
    editor.on('transaction', computeRect);

    const scrollHost = findScrollableAncestor(editor.view.dom.parentElement);
    scrollHostRef.current = scrollHost;

    if (scrollHost) {
      scrollHost.addEventListener('scroll', computeRect, { passive: true });
    }
    window.addEventListener('scroll', computeRect, {
      passive: true,
      capture: true,
    });
    window.addEventListener('resize', computeRect, { passive: true });

    return () => {
      editor.off('selectionUpdate', computeRect);
      editor.off('transaction', computeRect);
      if (scrollHost) {
        scrollHost.removeEventListener('scroll', computeRect);
      }
      window.removeEventListener('scroll', computeRect, true);
      window.removeEventListener('resize', computeRect);
    };
  }, [editor, computeRect]);

  const currentRect = rect ?? EMPTY_RECT;

  const virtualRef = useMemo(
    () => ({
      getBoundingClientRect: () => currentRect,
    }),
    [currentRect],
  );

  const { refs, floatingStyles, update } = useFloating({
    open: visible,
    placement: 'top',
    middleware: [
      offset(8),
      flip({
        crossAxis: false,
        fallbackAxisSideDirection: 'start',
        padding: 8,
      }),
      shift({ padding: 8 }),
    ],
    ...floatingOptions,
  });

  const updateRef = useRef(update);
  updateRef.current = update;

  useEffect(() => {
    refs.setReference(virtualRef as unknown as Element);
    updateRef.current();
  }, [refs, virtualRef]);

  if (!visible || !editor) return null;

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          zIndex,
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && closeOnEscape) {
            setRect(null);
          }
        }}
      >
        {children}
      </div>
    </FloatingPortal>
  );
}
