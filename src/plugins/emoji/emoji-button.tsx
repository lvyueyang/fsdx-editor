/**
 * 表情插入工具栏按钮，点击弹出表情选择器 Popover
 * 选择表情后通过 editor.chain().insertContent() 插入到光标位置
 */
import type { Editor } from '@tiptap/react';
import { forwardRef, useState } from 'react';
import type { ButtonProps } from '../../components/ui/button';
import { Button } from '../../components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';
import { useTiptapEditor } from '../../hooks/use-tiptap-editor';
import { SmileIcon } from '../../icons/smile-icon';
import { EmojiPopoverContent } from './emoji-popover-content';

export interface EmojiButtonProps extends Omit<ButtonProps, 'type'> {
  editor?: Editor | null;
}

export const EmojiPopoverButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      type="button"
      className={className}
      variant="ghost"
      role="button"
      tabIndex={-1}
      aria-label="插入表情"
      tooltip="表情"
      ref={ref}
      {...props}
    >
      {children ?? <SmileIcon className="tiptap-button-icon" />}
    </Button>
  ),
);

EmojiPopoverButton.displayName = 'EmojiPopoverButton';

export function EmojiButton({
  editor: providedEditor,
  ...props
}: EmojiButtonProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);

  if (!editor) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <EmojiPopoverButton {...props} />
      </PopoverTrigger>
      <PopoverContent aria-label="表情选择">
        <EmojiPopoverContent
          editor={editor}
          onEmojiSelect={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

export default EmojiButton;
