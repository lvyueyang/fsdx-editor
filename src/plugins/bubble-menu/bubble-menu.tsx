import { FloatingPortal } from '@floating-ui/react';
import { useCurrentEditor } from '@tiptap/react';
import { MarkButton } from '../../components/mark-button';
import { Toolbar } from '../../components/ui/toolbar';
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
  const { visible, selectionType, hideMenu, refs, floatingStyles } =
    useBubbleMenu({ editor });

  if (!editor) return null;

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
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
            <Toolbar.Group>
              <TextStyleDropdownMenu modal={false} />
              <FontSizeButton />
            </Toolbar.Group>

            <Toolbar.Separator />

            <Toolbar.Group>
              <MarkButton type="bold" />
              <MarkButton type="italic" />
              <MarkButton type="underline" />
              <MarkButton type="strike" />
              <MarkButton type="code" />
            </Toolbar.Group>

            <Toolbar.Separator />

            <Toolbar.Group>
              <ColorTextDropdownMenu modal={false} />
              <ColorHighlightDropdownMenu modal={false} />
            </Toolbar.Group>

            <Toolbar.Separator />

            <Toolbar.Group>
              <LinkPopover />
            </Toolbar.Group>

            <Toolbar.Separator />

            <Toolbar.Group>
              <ClearFormattingButton />
            </Toolbar.Group>
          </Toolbar>
        )}
      </div>
    </FloatingPortal>
  );
}
