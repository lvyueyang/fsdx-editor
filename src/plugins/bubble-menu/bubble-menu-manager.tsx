import { useCurrentEditor } from '@tiptap/react';
import { ImageResizeHandles } from '../../components/media-attribute-editor/image-resize-handles';
import { VideoResizeHandles } from '../../components/media-attribute-editor/video-resize-handles';
import { AttachmentBubbleMenuContent } from './attachment-bubble-menu-content';
import { AudioBubbleMenuContent } from './audio-bubble-menu-content';
import { BubbleMenuWrapper } from './bubble-menu-wrapper';
import { ImageBubbleMenuContent } from './image-bubble-menu-content';
import { LinkBubbleMenuContent } from './link-bubble-menu-content';
import { TextBubbleMenuContent } from './text-bubble-menu-content';
import { useBubbleMenuManager } from './use-bubble-menu-manager';
import { VideoBubbleMenuContent } from './video-bubble-menu-content';
import './bubble-menu.scss';
import './media-bubble-menu.scss';

/**
 * 统一悬浮菜单管理器：单一 Portal 容器，根据选区类型切换内容，
 * 保证同一时刻只显示一种悬浮菜单
 */
export function BubbleMenuManager() {
  const { editor } = useCurrentEditor();
  const { visible, activeType, hideMenu, refs, floatingStyles, nodePosRef } =
    useBubbleMenuManager({ editor });

  if (!editor) return null;

  const isTextOrLink = activeType === 'text' || activeType === 'link';

  return (
    <>
      {activeType === 'image' && <ImageResizeHandles editor={editor} />}
      {activeType === 'video' && <VideoResizeHandles editor={editor} />}
      <BubbleMenuWrapper
        className={
          isTextOrLink
            ? 'fsdx-editor-bubble-menu'
            : 'fsdx-editor-media-bubble-menu'
        }
        visible={visible}
        refs={refs}
        floatingStyles={floatingStyles}
        hideMenu={hideMenu}
      >
        {activeType === 'link' && (
          <LinkBubbleMenuContent editor={editor} onAction={hideMenu} />
        )}
        {activeType === 'text' && <TextBubbleMenuContent />}
        {activeType === 'image' && (
          <ImageBubbleMenuContent
            editor={editor}
            nodePosRef={nodePosRef}
            hideMenu={hideMenu}
          />
        )}
        {activeType === 'video' && (
          <VideoBubbleMenuContent
            editor={editor}
            nodePosRef={nodePosRef}
            hideMenu={hideMenu}
          />
        )}
        {activeType === 'audio' && (
          <AudioBubbleMenuContent
            editor={editor}
            nodePosRef={nodePosRef}
            hideMenu={hideMenu}
          />
        )}
        {activeType === 'attachment' && (
          <AttachmentBubbleMenuContent
            editor={editor}
            nodePosRef={nodePosRef}
            hideMenu={hideMenu}
          />
        )}
      </BubbleMenuWrapper>
    </>
  );
}
