import type { EditorTheme } from '@fsdx/editor-react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DemoEditor } from '../components/demo-editor';
import { initialContent } from '../initial-content';
import { DemoThemeContext } from '../shared/demo-theme-context';

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

export function ControlPanel() {
  const [html, setHtml] = useState(initialContent);
  const { theme, setTheme } = useContext(DemoThemeContext);
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

  const handleExportHtml = useCallback(() => {
    const blob = new Blob([buildPreviewDoc(html)], {
      type: 'text/html;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'editor-export.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [html]);

  return (
    <div className="demo-editor-container">
      <div className="demo-control-bar">
        <span style={{ fontWeight: 600, fontSize: 13, marginRight: 4 }}>
          主题：
        </span>
        {(['light', 'dark', 'auto'] as EditorTheme[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTheme(t)}
            style={
              theme === t
                ? {
                    border: '1px solid var(--fsdx-editor-brand-500)',
                    background: 'var(--fsdx-editor-brand-500)',
                    color: '#fff',
                  }
                : {}
            }
          >
            {themeLabels[t]}
          </button>
        ))}
        <span style={{ marginLeft: 12, fontWeight: 600, fontSize: 13 }}>
          操作：
        </span>
        <button type="button" onClick={handleReset}>
          重置内容
        </button>
        <button type="button" onClick={handleExportHtml}>
          导出 HTML
        </button>
        <span className="demo-control-bar-hint">左侧编辑，右侧实时预览</span>
      </div>
      <div className="demo-split-pane">
        <div className="demo-split-pane-left">
          <DemoEditor html={html} onChange={setHtml} theme={theme} />
        </div>
        <div className="demo-split-pane-right">
          <iframe
            ref={iframeRef}
            title="实时预览"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
