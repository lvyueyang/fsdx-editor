/**
 * 表情选择器内容区域，包含分类标签和表情网格
 * 支持桌面端 Popover 内嵌和移动端工具栏直接渲染
 * 通过键盘方向键可在表情网格内导航选择
 */
import type { Editor } from '@tiptap/react';
import { useMemo, useRef, useState } from 'react';
import { Card } from '../../components/ui/card';
import { useIsBreakpoint } from '../../hooks/use-is-breakpoint';
import { useMenuNavigation } from '../../hooks/use-menu-navigation';
import { useTiptapEditor } from '../../hooks/use-tiptap-editor';
import { EMOJI_CATEGORIES, type EmojiCategory } from './emoji-data';
import './emoji.scss';

export interface EmojiPopoverContentProps {
  editor?: Editor | null;
  onEmojiSelect?: (emoji: string) => void;
}

export function EmojiPopoverContent({
  editor: providedEditor,
  onEmojiSelect,
}: EmojiPopoverContentProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const isMobile = useIsBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);

  const activeCategory = EMOJI_CATEGORIES[activeCategoryIndex];

  const menuItems = useMemo(
    () => activeCategory?.items.map((emoji) => ({ emoji })) ?? [],
    [activeCategory],
  );

  const { selectedIndex } = useMenuNavigation({
    containerRef,
    items: menuItems,
    orientation: 'both',
    onSelect: (item) => {
      if (!containerRef.current) return false;
      const highlightedElement = containerRef.current.querySelector(
        '[data-highlighted="true"]',
      ) as HTMLElement;
      if (highlightedElement) highlightedElement.click();
      handleEmojiClick(item.emoji);
      return true;
    },
    autoSelectFirstItem: false,
  });

  const handleEmojiClick = (emoji: string) => {
    if (editor) {
      editor.chain().focus().insertContent(emoji).run();
    }
    onEmojiSelect?.(emoji);
  };

  return (
    <Card
      ref={containerRef}
      tabIndex={0}
      className="tiptap-emoji-popover"
      style={isMobile ? { boxShadow: 'none', border: 0 } : {}}
    >
      <div className="tiptap-emoji-categories">
        {EMOJI_CATEGORIES.map((category: EmojiCategory, idx: number) => (
          <button
            key={category.label}
            type="button"
            className="tiptap-emoji-category-btn"
            data-active={idx === activeCategoryIndex}
            onClick={() => setActiveCategoryIndex(idx)}
            aria-label={category.label}
            title={category.label}
          >
            {category.icon}
          </button>
        ))}
      </div>

      <div className="tiptap-emoji-grid">
        {activeCategory?.items.map((emoji: string, idx: number) => (
          <button
            key={`${emoji}-${idx}`}
            type="button"
            className="tiptap-emoji-item"
            data-highlighted={selectedIndex === idx}
            tabIndex={selectedIndex === idx ? 0 : -1}
            onClick={() => handleEmojiClick(emoji)}
            aria-label={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </Card>
  );
}

export default EmojiPopoverContent;
