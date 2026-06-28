import { forwardRef, useCallback, useState } from 'react';
import { MediaUploadPopover } from '../../components/media-upload-popover';
import type { ButtonProps } from '../../components/ui/button';
import { Button } from '../../components/ui/button';
import { Tooltip } from '../../components/ui/tooltip';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { ChevronDownIcon } from '../../icons/chevron-down-icon';
import { VideoIcon } from '../../icons/video-icon';

export interface VideoUploadButtonProps extends ButtonProps {
  text?: string;
}

export const VideoUploadButton = forwardRef<
  HTMLButtonElement,
  VideoUploadButtonProps
>(({ text, ...props }, ref) => {
  const { editor } = useFsdxEditor();
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
      <Tooltip title="添加视频">
        <Button ref={ref} variant="ghost" size="small" {...props}>
          <VideoIcon className="fsdx-editor-button-icon" />
          {text && <span>{text}</span>}
          <ChevronDownIcon className="fsdx-editor-button-dropdown-small" />
        </Button>
      </Tooltip>
    </MediaUploadPopover>
  );
});

VideoUploadButton.displayName = 'VideoUploadButton';
