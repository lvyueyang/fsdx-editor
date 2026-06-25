/**
 * 公共类型定义，包括媒体上传配置、EditorOptions 等
 */

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
  getList: (params: MediaListParams) => Promise<MediaListResult>;
}

/** Editor 全局配置选项 */
export interface EditorOptions {
  image?: MediaUploadConfig;
  video?: MediaUploadConfig;
  audio?: MediaUploadConfig;
  attachment?: MediaUploadConfig;
}

/** 媒体类型 */
export type MediaType = 'image' | 'video' | 'audio' | 'attachment';

/** 图片对齐方式 */
export type ImageAlignment = 'left' | 'center' | 'right';

/** 媒体上传弹窗选项卡 */
export type MediaPopupTab = 'upload' | 'library' | 'url';
