import { MarkButton } from '../../components/mark-button';
import { Toolbar } from '../../components/ui/toolbar';
import { ColorHighlightDropdownMenu } from '../color/color-highlight-dropdown-menu';
import { ColorTextDropdownMenu } from '../color/color-text-dropdown-menu';
import { FontSizeButton } from '../font-size';
import { LinkPopover } from '../link';
import { ClearFormattingButton, TextStyleDropdownMenu } from '../text-style';

/**
 * 文字悬浮菜单内容：文本样式、字体大小、B/I/U/S/C、颜色、链接、清除格式
 */
export function TextBubbleMenuContent() {
  return (
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
  );
}
