import { useMemo, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { cn } from '../../core/editor-utils';
import type { MediaPopupTab, MediaType } from '../../types';
import { MediaLibraryTab } from './media-library-tab';
import { MediaUploadTab } from './media-upload-tab';
import { MediaUrlTab } from './media-url-tab';
import './media-upload-popover.scss';

const TAB_LABELS: Record<MediaType, Record<MediaPopupTab, string>> = {
  image: { upload: '本地上传', library: '图片素材', url: '图片链接' },
  video: { upload: '本地上传', library: '视频素材', url: '视频链接' },
  audio: { upload: '本地上传', library: '音频素材', url: '音频链接' },
  attachment: { upload: '本地上传', library: '附件库', url: '附件链接' },
};

export interface MediaUploadPopoverProps {
  mediaType: MediaType;
  children: React.ReactNode;
  onInserted?: (url: string, extraAttrs?: Record<string, unknown>) => void;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TABS: MediaPopupTab[] = ['upload', 'library', 'url'];

export function MediaUploadPopover({
  mediaType,
  children,
  onInserted,
  className,
  open,
  onOpenChange,
}: MediaUploadPopoverProps) {
  const [activeTab, setActiveTab] = useState<MediaPopupTab>('upload');

  const accept = useMemo(() => {
    switch (mediaType) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      default:
        return '*';
    }
  }, [mediaType]);

  const handleInsert = (url: string, extraAttrs?: Record<string, unknown>) => {
    onInserted?.(url, extraAttrs);
    onOpenChange?.(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn('fsdx-editor-media-upload-popover', className)}
        align="start"
        sideOffset={8}
      >
        <div className="fsdx-editor-media-upload-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={cn('fsdx-editor-media-upload-tab', {
                'fsdx-editor-media-upload-tab--active': activeTab === tab,
              })}
              onClick={() => setActiveTab(tab)}
            >
              {TAB_LABELS[mediaType][tab]}
            </button>
          ))}
        </div>

        <div className="fsdx-editor-media-upload-content">
          {activeTab === 'upload' && (
            <MediaUploadTab
              mediaType={mediaType}
              accept={accept}
              onInsert={handleInsert}
            />
          )}
          {activeTab === 'library' && (
            <MediaLibraryTab mediaType={mediaType} onInsert={handleInsert} />
          )}
          {activeTab === 'url' && (
            <MediaUrlTab mediaType={mediaType} onInsert={handleInsert} />
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
