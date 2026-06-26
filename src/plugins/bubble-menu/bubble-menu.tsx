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
import { useBubbleMenu } from './use-bubble-menu';
import './bubble-menu.scss';

/**
 * 悬浮工具栏：文字选中后显示，提供常用文字格式化操作
 */
export function BubbleMenu() {
  const { editor } = useCurrentEditor();
  const { rect, visible, hideMenu, containerRef } = useBubbleMenu({ editor });

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
          // 阻止点击悬浮菜单内按钮时编辑器失焦
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            hideMenu();
          }
        }}
      >
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
      </div>
    </FloatingPortal>
  );
}
