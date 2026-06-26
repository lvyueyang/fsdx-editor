import { forwardRef, useCallback, useState } from 'react';
import { MediaUploadPopover } from '../../components/media-upload-popover';
import type { ButtonProps } from '../../components/ui/button';
import { Button } from '../../components/ui/button';
import { useTiptapEditor } from '../../hooks/use-tiptap-editor';
import { ChevronDownIcon } from '../../icons/chevron-down-icon';
import { VideoIcon } from '../../icons/video-icon';

export interface VideoUploadButtonProps extends ButtonProps {
  text?: string;
}

export const VideoUploadButton = forwardRef<
  HTMLButtonElement,
  VideoUploadButtonProps
>(({ text, ...props }, ref) => {
  const { editor } = useTiptapEditor();
  const [open, setOpen] = useState(false);

  const handleInserted = useCallback(
    (url: string, extraAttrs?: Record<string, unknown>) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertVideo?.({ src: url, ...extraAttrs })
        .run();
    },
    [editor],
  );

  return (
    <MediaUploadPopover
      mediaType="video"
      open={open}
      onOpenChange={setOpen}
      onInserted={handleInserted}
    >
      <Button
        ref={ref}
        variant="ghost"
        size="small"
        tooltip="添加视频"
        {...props}
      >
        <VideoIcon className="tiptap-button-icon" />
        {text && <span>{text}</span>}
        <ChevronDownIcon className="tiptap-button-dropdown-small" />
      </Button>
    </MediaUploadPopover>
  );
});

VideoUploadButton.displayName = 'VideoUploadButton';
