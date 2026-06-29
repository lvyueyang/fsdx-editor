import { flip, offset, shift, useFloating } from '@floating-ui/react';
import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePortalContainer } from '../../core/editor-context';

export type BubbleMenuActiveType =
  | 'text'
  | 'link'
  | 'image'
  | 'video'
  | 'audio'
  | 'attachment'
  | null;

export interface UseBubbleMenuManagerConfig {
  editor: Editor | null;
}

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

function coordsToRect(pos: {
  top: number;
  bottom: number;
  left: number;
  right: number;
}): DOMRect {
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

/**
 * 统一悬浮菜单 hook：合并文字/链接和媒体节点的定位逻辑，
 * 按优先级确定当前活跃的菜单类型，保证同一时刻只显示一种悬浮菜单
 */
export function useBubbleMenuManager({ editor }: UseBubbleMenuManagerConfig): {
  visible: boolean;
  activeType: BubbleMenuActiveType;
  hideMenu: () => void;
  refs: { setFloating: (node: HTMLElement | null) => void };
  floatingStyles: React.CSSProperties;
  nodePosRef: React.MutableRefObject<number>;
} {
  const [visible, setVisible] = useState(false);
  const [activeType, setActiveType] = useState<BubbleMenuActiveType>(null);
  const [rect, setRect] = useState<DOMRect>(EMPTY_RECT);
  const nodePosRef = useRef(0);
  const portalContainerRef = usePortalContainer();

  const computeRect = useCallback(() => {
    if (!editor || editor.isDestroyed) {
      setVisible(false);
      setActiveType(null);
      return;
    }

    if (editor.isActive('link')) {
      const { $from } = editor.state.selection;
      try {
        setRect(coordsToRect(editor.view.coordsAtPos($from.pos)));
        setActiveType('link');
        setVisible(true);
        return;
      } catch {
        // coordsAtPos 可能对某些位置抛出异常，回退到后续检测
      }
    }

    const { $from } = editor.state.selection;

    if (editor.isActive('customImage') || editor.isActive('image')) {
      nodePosRef.current = $from.pos;
      setRect(coordsToRect(editor.view.coordsAtPos($from.pos)));
      setActiveType('image');
      setVisible(true);
      return;
    }

    if (editor.isActive('video')) {
      nodePosRef.current = $from.pos;
      setRect(coordsToRect(editor.view.coordsAtPos($from.pos)));
      setActiveType('video');
      setVisible(true);
      return;
    }

    if (editor.isActive('audio')) {
      nodePosRef.current = $from.pos;
      setRect(coordsToRect(editor.view.coordsAtPos($from.pos)));
      setActiveType('audio');
      setVisible(true);
      return;
    }

    if (editor.isActive('attachment')) {
      nodePosRef.current = $from.pos;
      setRect(coordsToRect(editor.view.coordsAtPos($from.pos)));
      setActiveType('attachment');
      setVisible(true);
      return;
    }

    // 悬浮菜单内的 popover/dropdown 打开时保持当前状态
    const activeEl = document.activeElement as HTMLElement | null;
    if (
      activeEl?.closest(
        '.fsdx-editor-popover, .fsdx-editor-dropdown-menu-content, .fsdx-editor-tooltip',
      )
    ) {
      return;
    }

    const { selection } = editor.state;
    if (selection.empty) {
      setVisible(false);
      setActiveType(null);
      return;
    }

    const domSelection = window.getSelection();
    if (
      !domSelection ||
      domSelection.isCollapsed ||
      domSelection.rangeCount === 0
    ) {
      setVisible(false);
      setActiveType(null);
      return;
    }

    const range = domSelection.getRangeAt(0);
    const domRect = range.getBoundingClientRect();
    if (domRect.width === 0 && domRect.height === 0) {
      setVisible(false);
      setActiveType(null);
      return;
    }

    setRect(domRect);
    setActiveType('text');
    setVisible(true);
  }, [editor]);

  const hideMenu = useCallback(() => {
    setVisible(false);
    setActiveType(null);
  }, []);

  const virtualRef = useMemo(
    () => ({
      getBoundingClientRect: () => (visible ? rect : EMPTY_RECT),
    }),
    [visible, rect],
  );

  const { refs, floatingStyles } = useFloating({
    open: true,
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
  });

  useEffect(() => {
    refs.setReference(virtualRef as unknown as Element);
  }, [refs, virtualRef]);

  useEffect(() => {
    if (!editor) return;

    computeRect();

    editor.on('selectionUpdate', computeRect);
    editor.on('transaction', computeRect);

    const scrollHost = findScrollableAncestor(editor.view.dom.parentElement);
    if (scrollHost) {
      scrollHost.addEventListener('scroll', computeRect, { passive: true });
    }
    window.addEventListener('scroll', computeRect, {
      passive: true,
      capture: true,
    });
    window.addEventListener('resize', computeRect, { passive: true });

    const handleDocumentMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (editor.view.dom.contains(target)) return;
      if (refs.floating.current?.contains(target)) return;
      if (portalContainerRef?.current?.contains(target)) return;
      if (
        target.closest(
          '.fsdx-editor-popover, .fsdx-editor-dropdown-menu-content, .fsdx-editor-tooltip',
        )
      ) {
        return;
      }

      hideMenu();
    };

    document.addEventListener('mousedown', handleDocumentMouseDown, true);

    return () => {
      editor.off('selectionUpdate', computeRect);
      editor.off('transaction', computeRect);
      if (scrollHost) {
        scrollHost.removeEventListener('scroll', computeRect);
      }
      window.removeEventListener('scroll', computeRect, true);
      window.removeEventListener('resize', computeRect);
      document.removeEventListener('mousedown', handleDocumentMouseDown, true);
    };
  }, [editor, computeRect, hideMenu, refs, portalContainerRef]);

  return { visible, activeType, hideMenu, refs, floatingStyles, nodePosRef };
}
