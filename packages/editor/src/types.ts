export type ContentType = string;

export type ThemeType = 'light' | 'dark';

/** 图片配置：在通用媒体配置基础上增加图片专属选项 */
export type ImageMediaUploadConfig = MediaUploadConfig & {
  /** 是否开启图片拖拽缩放，默认 true */
  resizable?: boolean;
};

/** 编辑器初始化配置 */
export interface FsdxEditorOptions {
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  defaultContent?: ContentType;
  defaultTheme?: ThemeType;
  image?: ImageMediaUploadConfig;
  video?: MediaUploadConfig;
  audio?: MediaUploadConfig;
  attachment?: MediaUploadConfig;
  onChange?: (content: ContentType) => void;
  onReady?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onDestroy?: () => void;
}

/** 媒体列表项 */
export interface MediaItem {
  id: string;
  url: string;
  name: string;
  size?: number;
  thumbnailUrl?: string;
  duration?: number;
  fileType?: string;
}

/** 媒体列表分页参数 */
export interface MediaListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

/** 媒体列表分页结果 */
export interface MediaListResult {
  items: MediaItem[];
  total: number;
}

/** 上传进度回调 */
export type UploadProgressCallback = (progress: number) => void;

/** 单个媒体类型的上传 + 列表配置 */
export interface MediaUploadConfig {
  upload: (
    file: File,
    onProgress?: UploadProgressCallback,
  ) => Promise<MediaItem>;
  getList?: (params: MediaListParams) => Promise<MediaListResult>;
}
