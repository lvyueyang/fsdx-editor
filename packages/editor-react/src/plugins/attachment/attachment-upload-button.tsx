import { forwardRef, useCallback, useState } from 'react';
import { MediaUploadPopover } from '../../components/media-upload-popover';
import type { ButtonProps } from '../../components/ui/button';
import { Toolbar } from '../../components/ui/toolbar';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { AttachmentIcon } from '../../icons/attachment-icon';

export interface AttachmentUploadButtonProps extends ButtonProps {
  text?: string;
}

export const AttachmentUploadButton = forwardRef<
  HTMLButtonElement,
  AttachmentUploadButtonProps
>(({ text, ...props }, ref) => {
  const { editor } = useFsdxEditor();
  const [open, setOpen] = useState(false);

  const handleInserted = useCallback(
    (url: string, extraAttrs?: Record<string, unknown>) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertAttachment?.({ src: url, ...extraAttrs })
        .run();
    },
    [editor],
  );

  return (
    <MediaUploadPopover
      mediaType="attachment"
      open={open}
      onOpenChange={setOpen}
      onInserted={handleInserted}
    >
      <Toolbar.Button label="添加附件" showDropdown {...props} ref={ref}>
        <AttachmentIcon className="fsdx-editor-button-icon" />
        {text && <span>{text}</span>}
      </Toolbar.Button>
    </MediaUploadPopover>
  );
});

AttachmentUploadButton.displayName = 'AttachmentUploadButton';
