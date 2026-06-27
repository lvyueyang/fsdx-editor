import type { MediaItem } from '../../src/types';

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function simulateUpload(
  file: File,
  onProgress?: (progress: number) => void,
) {
  return new Promise<{ id: string; url: string; name: string; size: number }>(
    (resolve) => {
      const id = crypto.randomUUID();
      let progress = 0;
      const timer = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(timer);
          readFileAsDataURL(file).then((dataUrl) => {
            resolve({ id, url: dataUrl, name: file.name, size: file.size });
          });
        }
        onProgress?.(Math.min(progress, 100));
      }, 200);
    },
  );
}

export const MOCK_IMAGE_LIST: MediaItem[] = [
  {
    id: '1',
    url: 'https://template.tiptap.dev/images/tiptap-ui-placeholder-image.jpg',
    name: '示例图片',
    size: 204800,
    thumbnailUrl:
      'https://template.tiptap.dev/images/tiptap-ui-placeholder-image.jpg',
  },
];

export const MOCK_VIDEO_LIST: MediaItem[] = [
  {
    id: '1',
    url: 'https://09597157-0eab-4d78-9f1b-3dc3e4ddc353.mdnplay.dev/shared-assets/videos/flower.webm',
    name: '花（示例视频）',
    size: 5242880,
    thumbnailUrl: 'https://picsum.photos/seed/video/200/150',
  },
];

export const MOCK_AUDIO_LIST: MediaItem[] = [
  {
    id: '1',
    url: 'https://a65c28c1-a726-4e4b-aac3-b94931f43200.mdnplay.dev/shared-assets/audio/t-rex-roar.mp3',
    name: '霸王龙吼叫（示例音频）',
    size: 1048576,
    thumbnailUrl: 'https://picsum.photos/seed/audio/200/150',
  },
];

export const MOCK_ATTACHMENT_LIST: MediaItem[] = Array.from(
  { length: 10 },
  (_, i) => ({
    id: `${i + 1}`,
    url: `https://picsum.photos/seed/${i + 1}/400/300`,
    name: `示例附件 ${i + 1}`,
    size: Math.round(Math.random() * 5 * 1024 * 1024),
    thumbnailUrl: `https://picsum.photos/seed/${i + 1}/200/150`,
  }),
);

function createSimulateGetList<T extends MediaItem>(list: T[]) {
  return (params: { page: number; pageSize: number; keyword?: string }) =>
    new Promise<{ items: T[]; total: number }>((resolve) => {
      setTimeout(() => {
        const filtered = params.keyword
          ? list.filter((item) => item.name.includes(params.keyword!))
          : list;
        const start = (params.page - 1) * params.pageSize;
        const items = filtered.slice(start, start + params.pageSize);
        resolve({ items, total: filtered.length });
      }, 300);
    });
}

export const simulateGetImageList = createSimulateGetList(MOCK_IMAGE_LIST);
export const simulateGetVideoList = createSimulateGetList(MOCK_VIDEO_LIST);
export const simulateGetAudioList = createSimulateGetList(MOCK_AUDIO_LIST);
export const simulateGetAttachmentList =
  createSimulateGetList(MOCK_ATTACHMENT_LIST);
