import { forwardRef, useCallback, useState } from 'react';
import { MediaUploadPopover } from '../../components/media-upload-popover';
import type { ButtonProps } from '../../components/ui/button';
import { Button } from '../../components/ui/button';
import { Tooltip } from '../../components/ui/tooltip';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { AttachmentIcon } from '../../icons/attachment-icon';
import { ChevronDownIcon } from '../../icons/chevron-down-icon';

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
      <Tooltip title="添加附件">
        <Button ref={ref} variant="ghost" size="small" {...props}>
          <AttachmentIcon className="fsdx-editor-button-icon" />
          {text && <span>{text}</span>}
          <ChevronDownIcon className="fsdx-editor-button-dropdown-small" />
        </Button>
      </Tooltip>
    </MediaUploadPopover>
  );
});

AttachmentUploadButton.displayName = 'AttachmentUploadButton';
