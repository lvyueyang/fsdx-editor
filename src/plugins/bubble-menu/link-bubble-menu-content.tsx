import type { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Toolbar } from '../../components/ui/toolbar';
import { Tooltip } from '../../components/ui/tooltip';
import { sanitizeUrl } from '../../core/editor-utils';
import { CornerDownLeftIcon } from '../../icons/corner-down-left-icon';
import { ExternalLinkIcon } from '../../icons/external-link-icon';
import { TrashIcon } from '../../icons/trash-icon';

interface LinkBubbleMenuContentProps {
  editor: Editor | null;
  onAction?: () => void;
}

/**
 * 链接悬浮菜单：URL 输入框 + 新窗口切换 + 打开链接 + 取消链接
 */
export function LinkBubbleMenuContent({
  editor,
  onAction,
}: LinkBubbleMenuContentProps) {
  const [url, setUrl] = useState('');
  const [isBlank, setIsBlank] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const syncLinkAttrs = () => {
      const attrs = editor.getAttributes('link');
      setUrl(attrs.href || '');
      setIsBlank(attrs.target === '_blank');
    };

    syncLinkAttrs();
    editor.on('selectionUpdate', syncLinkAttrs);

    return () => {
      editor.off('selectionUpdate', syncLinkAttrs);
    };
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor || !url) return;
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: isBlank ? '_blank' : null })
      .run();
    onAction?.();
  }, [editor, url, isBlank, onAction]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .setMeta('preventAutolink', true)
      .run();
    onAction?.();
  }, [editor, onAction]);

  const openLink = useCallback(() => {
    if (!url) return;
    const safeUrl = sanitizeUrl(url, window.location.href);
    if (safeUrl !== '#') {
      window.open(safeUrl, '_blank', 'noopener,noreferrer');
    }
  }, [url]);

  const toggleTarget = useCallback(() => {
    const next = !isBlank;
    setIsBlank(next);
    if (!editor || !url) return;
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: next ? '_blank' : null })
      .run();
  }, [editor, url, isBlank]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyLink();
    }
  };

  return (
    <Toolbar variant="floating">
      <Toolbar.Group>
        <Input
          type="url"
          placeholder="粘贴链接..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="fsdx-bubble-menu-link-input"
        />
        <Tooltip title="应用链接">
          <Button
            type="button"
            variant="ghost"
            aria-label="应用链接"
            disabled={!url}
            onClick={applyLink}
          >
            <CornerDownLeftIcon className="fsdx-editor-button-icon" />
          </Button>
        </Tooltip>
      </Toolbar.Group>

      <Toolbar.Separator />

      <Toolbar.Group>
        <Tooltip title="新窗口打开">
          <Button
            type="button"
            variant="ghost"
            size="small"
            data-active-state={isBlank ? 'on' : 'off'}
            aria-label="新窗口打开"
            onClick={toggleTarget}
          >
            新窗口
          </Button>
        </Tooltip>
      </Toolbar.Group>

      <Toolbar.Separator />

      <Toolbar.Group>
        <Tooltip title="打开链接">
          <Button
            type="button"
            variant="ghost"
            aria-label="打开链接"
            disabled={!url}
            onClick={openLink}
          >
            <ExternalLinkIcon className="fsdx-editor-button-icon" />
          </Button>
        </Tooltip>
        <Tooltip title="取消链接">
          <Button
            type="button"
            variant="ghost"
            aria-label="取消链接"
            onClick={removeLink}
          >
            <TrashIcon className="fsdx-editor-button-icon" />
          </Button>
        </Tooltip>
      </Toolbar.Group>
    </Toolbar>
  );
}
