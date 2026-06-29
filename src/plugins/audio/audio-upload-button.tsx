import { forwardRef, useCallback, useState } from 'react';
import { MediaUploadPopover } from '../../components/media-upload-popover';
import type { ButtonProps } from '../../components/ui/button';
import { Toolbar } from '../../components/ui/toolbar';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { AudioIcon } from '../../icons/audio-icon';

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
      <Toolbar.Button label="添加音频" showDropdown {...props} ref={ref}>
        <AudioIcon className="fsdx-editor-button-icon" />
        {text && <span>{text}</span>}
      </Toolbar.Button>
    </MediaUploadPopover>
  );
});

AudioUploadButton.displayName = 'AudioUploadButton';
