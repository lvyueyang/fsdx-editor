import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { EditorTheme } from '../src/core/editor';
import { Editor } from '../src/core/editor';
import type { EditorOptions } from '../src/types';
import { DemoNav } from './demo-nav';
import { initialContent } from './initial-content';

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function simulateUpload(file: File, onProgress?: (progress: number) => void) {
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

const MOCK_IMAGE_LIST = [
  {
    id: '1',
    url: 'https://template.tiptap.dev/images/tiptap-ui-placeholder-image.jpg',
    name: '示例图片',
    size: 204800,
    thumbnailUrl:
      'https://template.tiptap.dev/images/tiptap-ui-placeholder-image.jpg',
  },
];

const MOCK_VIDEO_LIST = [
  {
    id: '1',
    url: 'https://09597157-0eab-4d78-9f1b-3dc3e4ddc353.mdnplay.dev/shared-assets/videos/flower.webm',
    name: '花（示例视频）',
    size: 5242880,
    thumbnailUrl: 'https://picsum.photos/seed/video/200/150',
  },
];

const MOCK_AUDIO_LIST = [
  {
    id: '1',
    url: 'https://a65c28c1-a726-4e4b-aac3-b94931f43200.mdnplay.dev/shared-assets/audio/t-rex-roar.mp3',
    name: '霸王龙吼叫（示例音频）',
    size: 1048576,
    thumbnailUrl: 'https://picsum.photos/seed/audio/200/150',
  },
];

const MOCK_ATTACHMENT_LIST = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  url: `https://picsum.photos/seed/${i + 1}/400/300`,
  name: `示例附件 ${i + 1}`,
  size: Math.round(Math.random() * 5 * 1024 * 1024),
  thumbnailUrl: `https://picsum.photos/seed/${i + 1}/200/150`,
}));

function simulateGetList(params: {
  page: number;
  pageSize: number;
  keyword?: string;
}) {
  return new Promise<{ items: typeof MOCK_IMAGE_LIST; total: number }>(
    (resolve) => {
      setTimeout(() => {
        const filtered = params.keyword
          ? MOCK_IMAGE_LIST.filter((item) =>
              item.name.includes(params.keyword!),
            )
          : MOCK_IMAGE_LIST;
        const start = (params.page - 1) * params.pageSize;
        const items = filtered.slice(start, start + params.pageSize);
        resolve({ items, total: filtered.length });
      }, 300);
    },
  );
}

function simulateVideoGetList(params: {
  page: number;
  pageSize: number;
  keyword?: string;
}) {
  return new Promise<{ items: typeof MOCK_VIDEO_LIST; total: number }>(
    (resolve) => {
      setTimeout(() => {
        const filtered = params.keyword
          ? MOCK_VIDEO_LIST.filter((item) =>
              item.name.includes(params.keyword!),
            )
          : MOCK_VIDEO_LIST;
        const start = (params.page - 1) * params.pageSize;
        const items = filtered.slice(start, start + params.pageSize);
        resolve({ items, total: filtered.length });
      }, 300);
    },
  );
}

function simulateAudioGetList(params: {
  page: number;
  pageSize: number;
  keyword?: string;
}) {
  return new Promise<{ items: typeof MOCK_AUDIO_LIST; total: number }>(
    (resolve) => {
      setTimeout(() => {
        const filtered = params.keyword
          ? MOCK_AUDIO_LIST.filter((item) =>
              item.name.includes(params.keyword!),
            )
          : MOCK_AUDIO_LIST;
        const start = (params.page - 1) * params.pageSize;
        const items = filtered.slice(start, start + params.pageSize);
        resolve({ items, total: filtered.length });
      }, 300);
    },
  );
}

function simulateAttachmentGetList(params: {
  page: number;
  pageSize: number;
  keyword?: string;
}) {
  return new Promise<{ items: typeof MOCK_ATTACHMENT_LIST; total: number }>(
    (resolve) => {
      setTimeout(() => {
        const filtered = params.keyword
          ? MOCK_ATTACHMENT_LIST.filter((item) =>
              item.name.includes(params.keyword!),
            )
          : MOCK_ATTACHMENT_LIST;
        const start = (params.page - 1) * params.pageSize;
        const items = filtered.slice(start, start + params.pageSize);
        resolve({ items, total: filtered.length });
      }, 300);
    },
  );
}

const demoOptions: EditorOptions = {
  image: { upload: simulateUpload, getList: simulateGetList },
  video: { upload: simulateUpload, getList: simulateVideoGetList },
  audio: { upload: simulateUpload, getList: simulateAudioGetList },
  attachment: { upload: simulateUpload, getList: simulateAttachmentGetList },
};

function Demo() {
  const [html, setHtml] = useState(initialContent);
  const [theme, setTheme] = useState<EditorTheme>('auto');

  return (
    <DemoNav>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderBottom: '1px solid var(--fsdx-editor-border-color)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: 600, marginRight: 8 }}>主题：</span>
          {(['light', 'dark', 'auto'] as EditorTheme[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              style={{
                padding: '4px 12px',
                border:
                  theme === t
                    ? '1px solid var(--fsdx-editor-brand-color-500)'
                    : '1px solid var(--fsdx-editor-border-color)',
                borderRadius: 4,
                background:
                  theme === t
                    ? 'var(--fsdx-editor-brand-color-500)'
                    : 'transparent',
                color: theme === t ? '#fff' : 'inherit',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              {t === 'light' ? '浅色' : t === 'dark' ? '深色' : '跟随系统'}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <Editor
            value={html}
            onChange={setHtml}
            options={demoOptions}
            theme={theme}
          />
        </div>
      </div>
    </DemoNav>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Demo />);
}
