import type { Editor } from '@tiptap/react';
import type { RefObject } from 'react';
import { useEffect } from 'react';
import { useBodyRect } from './use-element-rect';
import { useWindowSize } from './use-window-size';

export interface CursorVisibilityOptions {
  /**
   * The Tiptap editor instance
   */
  editor?: Editor | null;
  /**
   * Reference to the toolbar element that may obscure the cursor
   */
  overlayHeight?: number;
  /**
   * Ref to the scroll container element (defaults to window)
   */
  scrollContainerRef?: RefObject<HTMLElement | null>;
}

/**
 * Custom hook that ensures the cursor remains visible when typing in a Tiptap editor.
 * Automatically scrolls the scroll container when the cursor would be hidden by the toolbar.
 *
 * @param options.editor The Tiptap editor instance
 * @param options.overlayHeight Toolbar height to account for
 * @param options.scrollContainerRef Ref to the element that scrolls (defaults to window)
 * @returns The bounding rect of the body
 */
export function useCursorVisibility({
  editor,
  overlayHeight = 0,
  scrollContainerRef,
}: CursorVisibilityOptions) {
  const { height: windowHeight } = useWindowSize();
  const rect = useBodyRect({
    enabled: true,
    throttleMs: 100,
    useResizeObserver: true,
  });

  useEffect(() => {
    const ensureCursorVisibility = () => {
      if (!editor) return;

      const { state, view } = editor;
      if (!view.hasFocus()) return;

      const { from } = state.selection;
      const cursorCoords = view.coordsAtPos(from);

      if (windowHeight < rect.height && cursorCoords) {
        const availableSpace = windowHeight - cursorCoords.top;

        if (availableSpace < overlayHeight) {
          const targetCursorY = Math.max(windowHeight / 2, overlayHeight);
          const container = scrollContainerRef?.current;
          const currentScrollY = container
            ? container.scrollTop
            : window.scrollY;
          const cursorAbsoluteY = cursorCoords.top + currentScrollY;
          const newScrollY = cursorAbsoluteY - targetCursorY;

          if (container) {
            container.scrollTo({
              top: Math.max(0, newScrollY),
              behavior: 'smooth',
            });
          }
        }
      }
    };

    ensureCursorVisibility();
  }, [editor, overlayHeight, windowHeight, rect.height, scrollContainerRef]);

  return rect;
}
