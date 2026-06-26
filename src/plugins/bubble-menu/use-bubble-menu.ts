import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useRef, useState } from 'react';

export type BubbleMenuSelectionType = 'text' | 'link';

export interface UseBubbleMenuConfig {
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
 * 悬浮菜单 hook：文字选区非空时显示文本菜单，
 * 光标位于链接上时显示链接菜单，
 * 媒体节点选中或选区折叠或点击外部区域后隐藏
 */
export function useBubbleMenu({ editor }: UseBubbleMenuConfig) {
  const [visible, setVisible] = useState(false);
  const [selectionType, setSelectionType] =
    useState<BubbleMenuSelectionType | null>(null);
  const [rect, setRect] = useState<DOMRect>(EMPTY_RECT);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const computeRect = useCallback(() => {
    if (!editor || editor.isDestroyed) {
      setVisible(false);
      setSelectionType(null);
      return;
    }

    // 链接优先：光标位于链接上时显示链接菜单
    if (editor.isActive('link')) {
      const { $from } = editor.state.selection;
      try {
        const pos = editor.view.coordsAtPos($from.pos);
        const linkRect: DOMRect = {
          x: pos.left,
          y: pos.top,
          width: pos.right - pos.left,
          height: pos.bottom - pos.top,
          top: pos.top,
          left: pos.left,
          right: pos.right,
          bottom: pos.bottom,
        } as DOMRect;
        setRect(linkRect);
        setSelectionType('link');
        setVisible(true);
        return;
      } catch {
        // coordsAtPos 可能对某些位置抛出异常
      }
    }

    // 媒体节点选中时隐藏文字悬浮菜单，避免与媒体悬浮菜单冲突
    if (
      editor.isActive('customImage') ||
      editor.isActive('image') ||
      editor.isActive('video') ||
      editor.isActive('audio') ||
      editor.isActive('attachment')
    ) {
      setVisible(false);
      setSelectionType(null);
      return;
    }

    // 悬浮菜单内的 popover/dropdown 打开时，Radix 会将焦点移到 portal 内容，
    // 导致编辑器选区暂时为空，此时不应隐藏悬浮菜单
    const activeEl = document.activeElement as HTMLElement | null;
    if (
      activeEl?.closest(
        '[data-radix-popover-content], [data-radix-dropdown-menu-content], [data-radix-tooltip-content]',
      )
    ) {
      return;
    }

    const { selection } = editor.state;
    if (selection.empty) {
      setVisible(false);
      setSelectionType(null);
      return;
    }

    const domSelection = window.getSelection();
    if (
      !domSelection ||
      domSelection.isCollapsed ||
      domSelection.rangeCount === 0
    ) {
      setVisible(false);
      setSelectionType(null);
      return;
    }

    const range = domSelection.getRangeAt(0);
    const domRect = range.getBoundingClientRect();
    if (domRect.width === 0 && domRect.height === 0) {
      setVisible(false);
      setSelectionType(null);
      return;
    }

    setRect(domRect);
    setSelectionType('text');
    setVisible(true);
  }, [editor]);

  const hideMenu = useCallback(() => {
    setVisible(false);
    setSelectionType(null);
  }, []);

  useEffect(() => {
    if (!editor) return;

    computeRect();

    editor.on('selectionUpdate', computeRect);
    editor.on('transaction', computeRect);

    // 页面滚动/缩放时重新计算选区位置，保证悬浮菜单跟随移动
    const scrollHost = findScrollableAncestor(editor.view.dom.parentElement);
    if (scrollHost) {
      scrollHost.addEventListener('scroll', computeRect, { passive: true });
    }
    window.addEventListener('scroll', computeRect, {
      passive: true,
      capture: true,
    });
    window.addEventListener('resize', computeRect, { passive: true });

    // 通过 mousedown 捕获阶段检测点击外部区域，
    // 同时排除悬浮菜单内的 popover/dropdown（radix portal）
    const handleDocumentMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (editor.view.dom.contains(target)) return;
      if (containerRef.current?.contains(target)) return;

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
      if (scrollHost) {
        scrollHost.removeEventListener('scroll', computeRect);
      }
      window.removeEventListener('scroll', computeRect, true);
      window.removeEventListener('resize', computeRect);
      document.removeEventListener('mousedown', handleDocumentMouseDown, true);
    };
  }, [editor, computeRect, hideMenu]);

  return { rect, visible, selectionType, hideMenu, containerRef };
}
