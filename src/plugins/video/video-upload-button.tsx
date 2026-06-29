import { forwardRef, useCallback, useState } from 'react';
import { MediaUploadPopover } from '../../components/media-upload-popover';
import type { ButtonProps } from '../../components/ui/button';
import { Toolbar } from '../../components/ui/toolbar';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
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
      <Toolbar.Button label="添加视频" showDropdown {...props} ref={ref}>
        <VideoIcon className="fsdx-editor-button-icon" />
        {text && <span>{text}</span>}
      </Toolbar.Button>
    </MediaUploadPopover>
  );
});

VideoUploadButton.displayName = 'VideoUploadButton';
