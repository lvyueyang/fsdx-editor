import { forwardRef, useCallback, useState } from 'react';
import { MediaUploadPopover } from '../../components/media-upload-popover';
import type { ButtonProps } from '../../components/ui/button';
import { Button } from '../../components/ui/button';
import { Tooltip } from '../../components/ui/tooltip';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { ChevronDownIcon } from '../../icons/chevron-down-icon';
import { ImagePlusIcon } from '../../icons/image-plus-icon';

export interface ImageUploadPopoverButtonProps extends ButtonProps {
  text?: string;
}

export const ImageUploadPopoverButton = forwardRef<
  HTMLButtonElement,
  ImageUploadPopoverButtonProps
>(({ text, ...props }, ref) => {
  const { editor } = useFsdxEditor();
  const [open, setOpen] = useState(false);

  const handleInserted = useCallback(
    (url: string, extraAttrs?: Record<string, unknown>) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertCustomImage?.({
          src: url,
          alt: (extraAttrs?.fileName as string) || '',
        })
        .run();
    },
    [editor],
  );

  return (
    <MediaUploadPopover
      mediaType="image"
      open={open}
      onOpenChange={setOpen}
      onInserted={handleInserted}
    >
      <Tooltip title="添加图片">
        <Button ref={ref} variant="ghost" size="small" {...props}>
          <ImagePlusIcon className="fsdx-editor-button-icon" />
          {text && <span>{text}</span>}
          <ChevronDownIcon className="fsdx-editor-button-dropdown-small" />
        </Button>
      </Tooltip>
    </MediaUploadPopover>
  );
});

ImageUploadPopoverButton.displayName = 'ImageUploadPopoverButton';
