import {
  FloatingPortal,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { useCurrentEditor } from '@tiptap/react';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { MarkButton } from '../../components/mark-button';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '../../components/ui/toolbar';
import { ColorHighlightDropdownMenu } from '../color/color-highlight-dropdown-menu';
import { ColorTextDropdownMenu } from '../color/color-text-dropdown-menu';
import { FontSizeButton } from '../font-size';
import { LinkPopover } from '../link';
import { ClearFormattingButton, TextStyleDropdownMenu } from '../text-style';
import { LinkBubbleMenuContent } from './link-bubble-menu-content';
import { useBubbleMenu } from './use-bubble-menu';
import './bubble-menu.scss';

/**
 * 悬浮工具栏：根据选区类型显示不同内容
 * - 链接活跃时显示链接菜单（链接地址 + 打开 + 取消）
 * - 文字选中时显示文字格式化工具栏
 */
export function BubbleMenu() {
  const { editor } = useCurrentEditor();
  const { rect, visible, selectionType, hideMenu, containerRef } =
    useBubbleMenu({ editor });

  const virtualRef = useMemo(
    () => ({
      getBoundingClientRect: () => rect,
    }),
    [rect],
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

  useLayoutEffect(() => {
    refs.setReference(virtualRef as unknown as Element);
  }, [refs, virtualRef]);

  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
        node;
    },
    [refs, containerRef],
  );

  if (!editor) return null;

  return (
    <FloatingPortal>
      <div
        ref={setFloatingRef}
        className="fsdx-editor-bubble-menu"
        data-visible={visible ? '' : undefined}
        style={{
          ...floatingStyles,
          visibility: visible ? 'visible' : 'hidden',
        }}
        onMouseDown={(e) => {
          // 允许 input/textarea 正常聚焦，其他元素阻止编辑器失焦
          const target = e.target as HTMLElement;
          if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT'
          )
            return;
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            hideMenu();
          }
        }}
      >
        {selectionType === 'link' ? (
          <LinkBubbleMenuContent editor={editor} onAction={hideMenu} />
        ) : (
          <Toolbar variant="floating">
            <ToolbarGroup>
              <TextStyleDropdownMenu modal={false} />
              <FontSizeButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <MarkButton type="bold" />
              <MarkButton type="italic" />
              <MarkButton type="underline" />
              <MarkButton type="strike" />
              <MarkButton type="code" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <ColorTextDropdownMenu modal={false} />
              <ColorHighlightDropdownMenu modal={false} />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <LinkPopover />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <ClearFormattingButton />
            </ToolbarGroup>
          </Toolbar>
        )}
      </div>
    </FloatingPortal>
  );
}
