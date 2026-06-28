import { forwardRef, useCallback, useState } from 'react';
import { MediaUploadPopover } from '../../components/media-upload-popover';
import type { ButtonProps } from '../../components/ui/button';
import { Button } from '../../components/ui/button';
import { Tooltip } from '../../components/ui/tooltip';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { AudioIcon } from '../../icons/audio-icon';
import { ChevronDownIcon } from '../../icons/chevron-down-icon';

export interface AudioUploadButtonProps extends ButtonProps {
  text?: string;
}

export const AudioUploadButton = forwardRef<
  HTMLButtonElement,
  AudioUploadButtonProps
>(({ text, ...props }, ref) => {
  const { editor } = useFsdxEditor();
  const [open, setOpen] = useState(false);

  const handleInserted = useCallback(
    (url: string, extraAttrs?: Record<string, unknown>) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertAudio?.({ src: url, ...extraAttrs })
        .run();
    },
    [editor],
  );

  return (
    <MediaUploadPopover
      mediaType="audio"
      open={open}
      onOpenChange={setOpen}
      onInserted={handleInserted}
    >
      <Tooltip title="添加音频">
        <Button ref={ref} variant="ghost" size="small" {...props}>
          <AudioIcon className="fsdx-editor-button-icon" />
          {text && <span>{text}</span>}
          <ChevronDownIcon className="fsdx-editor-button-dropdown-small" />
        </Button>
      </Tooltip>
    </MediaUploadPopover>
  );
});

AudioUploadButton.displayName = 'AudioUploadButton';
