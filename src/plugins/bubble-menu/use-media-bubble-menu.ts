import { flip, offset, shift, useFloating } from '@floating-ui/react';
import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePortalContainer } from '../../core/editor-context';

export interface UseMediaBubbleMenuConfig {
  editor: Editor | null;
  nodeTypes: string[];
  /** 当节点激活时同步属性到本地状态 */
  onActive?: (attrs: Record<string, unknown>, pos: number) => void;
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

/**
 * 媒体节点悬浮菜单共享 hook：所有媒体类型（图片/视频/音频/附件）复用相同的
 * FloatingUI 定位、选区计算、滚动/resize 监听、外部点击隐藏逻辑
 */
export function useMediaBubbleMenu({
  editor,
  nodeTypes,
  onActive,
}: UseMediaBubbleMenuConfig) {
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<DOMRect>(EMPTY_RECT);
  const nodePosRef = useRef(0);
  const portalContainerRef = usePortalContainer();

  // 使用 ref 持有回调/配置避免 computeRect 依赖变化导致事件重复订阅
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;
  const nodeTypesRef = useRef(nodeTypes);
  nodeTypesRef.current = nodeTypes;

  const computeRect = useCallback(() => {
    if (!editor || editor.isDestroyed) {
      setVisible(false);
      return;
    }

    const activeType = nodeTypesRef.current.find((t) => editor.isActive(t));
    if (!activeType) {
      setVisible(false);
      return;
    }

    const { $from } = editor.state.selection;
    nodePosRef.current = $from.pos;

    const attrs = editor.getAttributes(activeType);
    onActiveRef.current?.(attrs, $from.pos);

    const pos = editor.view.coordsAtPos($from.pos);
    const nodeRect: DOMRect = {
      x: pos.left,
      y: pos.top,
      width: pos.right - pos.left,
      height: pos.bottom - pos.top,
      top: pos.top,
      left: pos.left,
      right: pos.right,
      bottom: pos.bottom,
    } as DOMRect;

    setRect(nodeRect);
    setVisible(true);
  }, [editor]);

  const hideMenu = useCallback(() => {
    setVisible(false);
  }, []);

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
    if (!editor) return;

    computeRect();

    editor.on('selectionUpdate', computeRect);
    editor.on('transaction', computeRect);

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
          '[data-radix-popper-content-wrapper], [data-radix-popover-content], [data-radix-dropdown-menu-content], [data-radix-tooltip-content]',
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
      window.removeEventListener('scroll', computeRect, true);
      window.removeEventListener('resize', computeRect);
      document.removeEventListener('mousedown', handleDocumentMouseDown, true);
    };
  }, [editor, computeRect, hideMenu, refs, portalContainerRef]);

  const virtualRef = useMemo(
    () => ({
      getBoundingClientRect: () => (visible ? rect : EMPTY_RECT),
    }),
    [visible, rect],
  );

  useEffect(() => {
    refs.setReference(virtualRef as unknown as Element);
  }, [refs, virtualRef]);

  return {
    visible,
    rect,
    nodePosRef,
    hideMenu,
    refs,
    floatingStyles,
  };
}
