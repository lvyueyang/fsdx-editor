import { forwardRef, useCallback, useState } from 'react';
import { useTiptapEditor } from '../../../hooks/use-tiptap-editor';
import { AudioIcon } from '../../icons/audio-icon';
import { ChevronDownIcon } from '../../icons/chevron-down-icon';
import { MediaUploadPopover } from '../../media/media-upload-popover';
import type { ButtonProps } from '../../primitives/button';
import { Button } from '../../primitives/button';

export interface AudioUploadButtonProps extends ButtonProps {
  text?: string;
}

export const AudioUploadButton = forwardRef<
  HTMLButtonElement,
  AudioUploadButtonProps
>(({ text, ...props }, ref) => {
  const { editor } = useTiptapEditor();
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
      <Button
        ref={ref}
        variant="ghost"
        size="small"
        tooltip="添加音频"
        {...props}
      >
        <AudioIcon className="tiptap-button-icon" />
        {text && <span>{text}</span>}
        <ChevronDownIcon className="tiptap-button-dropdown-small" />
      </Button>
    </MediaUploadPopover>
  );
});

AudioUploadButton.displayName = 'AudioUploadButton';
