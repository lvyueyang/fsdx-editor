import { useCallback, useEffect, useRef, useState } from 'react';
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

const BUTTON_BASE: React.CSSProperties = {
  padding: '4px 12px',
  border: '1px solid var(--fsdx-editor-border-color)',
  borderRadius: 4,
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: 13,
};

const BUTTON_ACTIVE: React.CSSProperties = {
  ...BUTTON_BASE,
  border: '1px solid var(--fsdx-editor-brand-color-500)',
  background: 'var(--fsdx-editor-brand-color-500)',
  color: '#fff',
};

const CONTROL_LABEL: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 13,
};

function buildPreviewDoc(html: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --fsdx-editor-color-highlight-yellow: #fef08a;
      --fsdx-editor-color-highlight-blue: #93c5fd;
      --fsdx-editor-color-highlight-green: #86efac;
      --fsdx-editor-content-max-width: 860px;
    }
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 48px 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC", "Microsoft YaHei", sans-serif;
      font-size: 16px;
      line-height: 1.75;
      color: #1a1a2e;
      background: #fff;
    }
    .preview-container {
      max-width: var(--fsdx-editor-content-max-width);
      margin: 0 auto;
    }
    h1 { font-size: 2em; margin: 0.67em 0; font-weight: 700; }
    h2 { font-size: 1.5em; margin: 0.75em 0; font-weight: 600; }
    h3 { font-size: 1.17em; margin: 0.83em 0; font-weight: 600; }
    h4 { font-size: 1em; margin: 1em 0; font-weight: 600; }
    h5 { font-size: 0.83em; margin: 1em 0; font-weight: 600; }
    h6 { font-size: 0.67em; margin: 1em 0; font-weight: 600; }
    p { margin: 0.5em 0; }
    blockquote {
      margin: 1em 0;
      padding: 0.5em 1em;
      border-left: 3px solid #e2e8f0;
      color: #64748b;
    }
    pre {
      margin: 1em 0;
      padding: 1em;
      background: #1e293b;
      color: #e2e8f0;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 14px;
      line-height: 1.6;
    }
    code {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      background: #f1f5f9;
      padding: 0.15em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }
    pre code {
      background: none;
      padding: 0;
      font-size: inherit;
    }
    hr {
      margin: 2em 0;
      border: none;
      border-top: 1px solid #e2e8f0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background: #f8fafc;
      font-weight: 600;
    }
    ul, ol {
      margin: 0.5em 0;
      padding-left: 1.5em;
    }
    li { margin: 0.25em 0; }
    img, video {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    mark { padding: 0 0.2em; border-radius: 2px; }
    [data-alignment="center"] { display: block; margin: 1em auto; }
    [data-type="taskList"] { list-style: none; padding-left: 0; }
    [data-checked="true"] { text-decoration: line-through; opacity: 0.6; }
  </style>
</head>
<body>
  <div class="preview-container">${html}</div>
</body>
</html>`;
}

const themeLabels: Record<EditorTheme, string> = {
  light: '浅色',
  dark: '深色',
  auto: '跟随系统',
};

function ControlPanel() {
  const [html, setHtml] = useState(initialContent);
  const [theme, setTheme] = useState<EditorTheme>('auto');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updatePreview = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(buildPreviewDoc(html));
    doc.close();
  }, [html]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleReset = useCallback(() => {
    setHtml(initialContent);
  }, []);

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
            gap: 12,
            padding: '8px 16px',
            borderBottom: '1px solid var(--fsdx-editor-border-color)',
            flexShrink: 0,
          }}
        >
          <span style={CONTROL_LABEL}>主题：</span>
          {(['light', 'dark', 'auto'] as EditorTheme[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              style={theme === t ? BUTTON_ACTIVE : BUTTON_BASE}
            >
              {themeLabels[t]}
            </button>
          ))}
          <span style={{ marginLeft: 12, ...CONTROL_LABEL }}>操作：</span>
          <button type="button" onClick={handleReset} style={BUTTON_BASE}>
            重置内容
          </button>
          <span style={{ flex: 1 }} />
          <span
            style={{
              fontSize: 11,
              color: 'var(--fsdx-editor-text-muted, #888)',
            }}
          >
            左侧编辑，右侧实时预览
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 0,
              borderRight: '1px solid var(--fsdx-editor-border-color)',
            }}
          >
            <Editor
              value={html}
              onChange={setHtml}
              options={demoOptions}
              theme={theme}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <iframe
              ref={iframeRef}
              title="实时预览"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </DemoNav>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<ControlPanel />);
}
