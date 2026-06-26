import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { EditorTheme } from '../src/core/editor';
import { Editor } from '../src/core/editor';
import type { EditorOptions } from '../src/types';

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

const initialContent = `<h1>编辑器功能演示</h1>
<p>这是一份覆盖所有编辑工具的演示文档。你可以<strong>直接编辑</strong>或使用工具栏按钮来体验各项功能。</p>
<h2>行内样式</h2>
<p>行内样式包括：<strong>加粗</strong>、<em>斜体</em>、<u>下划线</u>、<s>删除线</s>、<code>行内代码</code>、上标（x<sup>2</sup>）和下标（H<sub>2</sub>O）。</p>
<h2>颜色</h2>
<p>文字可以设置<span style="color: hsl(0, 70%, 50%)">红色</span>、<span style="color: hsl(210, 60%, 50%)">蓝色</span>、<span style="color: hsl(140, 40%, 38%)">绿色</span>等任意颜色。也可以为文本添加<mark style="background-color: var(--tt-color-highlight-yellow)">黄色高亮</mark>、<mark style="background-color: var(--tt-color-highlight-blue)">蓝色高亮</mark>、<mark style="background-color: var(--tt-color-highlight-green)">绿色高亮</mark>等多种背景色标记。</p>
<h2>字号</h2>
<p><span style="font-size: 24px">这段文字使用了 24px 的字号，</span><span style="font-size: 14px">这段是 14px，</span><span style="font-size: 36px">这段是 36px。</span>你可以在工具栏中自由调整字号。</p>
<h2>标题层级</h2>
<h3>这是三级标题</h3>
<h4>这是四级标题</h4>
<h5>这是五级标题</h5>
<h6>这是六级标题</h6>
<h2>对齐方式</h2>
<p style="text-align: left">左对齐文本——这是默认的对齐方式，文字从左侧开始排列。</p>
<p style="text-align: center">居中文本——文字在页面中间展示，常用于标题或引用。</p>
<p style="text-align: right">右对齐文本——文字从右侧开始排列，适用于落款或日期。</p>
<p style="text-align: justify">两端对齐文本——文字在左右两侧均匀排列，在排版长段落时显得更加整齐美观。你可以通过工具栏中的对齐按钮来切换不同的对齐方式。</p>
<h2>首行缩进</h2>
<p data-indent="2" style="text-indent: 2em">这段文字设置了首行缩进 2em。中文排版习惯中，正文段落通常需要首行缩进两字符。你可以点击工具栏中的缩进按钮来切换段落的首行缩进效果。</p>
<h2>引用块</h2>
<blockquote><p><em>"学而不思则罔，思而不学则殆。"——孔子</em></p></blockquote>
<h2>代码块</h2>
<pre><code>function greet(name) {
  console.log(\`你好，\${name}！\`);
}

greet('世界');</code></pre>
<hr>
<h2>列表</h2>
<h3>无序列表</h3>
<ul>
  <li><p><strong>富文本编辑</strong>：支持丰富的行内样式和块级结构</p></li>
  <li><p><strong>响应式设计</strong>：适配桌面端和移动端</p></li>
  <li><p><strong>深色模式</strong>：通过 Editor 的 theme 属性控制</p></li>
</ul>
<h3>有序列表</h3>
<ol>
  <li><p>打开编辑器</p></li>
  <li><p>使用工具栏格式化内容</p></li>
  <li><p>导出或分享文档</p></li>
</ol>
<h3>任务列表</h3>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true"><p>完成项目初始化</p></li>
  <li data-type="taskItem" data-checked="true"><p>集成 Tiptap 编辑器</p></li>
  <li data-type="taskItem" data-checked="false"><p>编写单元测试</p></li>
  <li data-type="taskItem" data-checked="false"><p><strong>发布上线</strong>（加粗强调）</p></li>
</ul>
<hr>
<h2>表格</h2>
<table>
  <tr>
    <th><p><strong>功能</strong></p></th>
    <th><p><strong>快捷键</strong></p></th>
    <th><p><strong>说明</strong></p></th>
  </tr>
  <tr>
    <td><p>加粗</p></td>
    <td><p style="text-align: center"><code>⌘+B</code></p></td>
    <td><p>切换加粗样式</p></td>
  </tr>
  <tr>
    <td><p>斜体</p></td>
    <td><p style="text-align: center"><code>⌘+I</code></p></td>
    <td><p>切换斜体样式</p></td>
  </tr>
  <tr>
    <td><p>下划线</p></td>
    <td><p style="text-align: center"><code>⌘+U</code></p></td>
    <td><p>切换下划线样式</p></td>
  </tr>
  <tr>
    <td><p>删除线</p></td>
    <td><p style="text-align: center"><code>⌘+⇧+S</code></p></td>
    <td><p>切换删除线样式</p></td>
  </tr>
</table>
<h2>图片</h2>
<p>点击工具栏图片按钮或拖拽图片到编辑器中，可以插入图片。选中图片后可以调整宽度、对齐方式和滤镜效果。</p>
<img src="https://template.tiptap.dev/images/tiptap-ui-placeholder-image.jpg" alt="示例图片" data-width="400px" data-alignment="center" />
<h2>视频</h2>
<p>支持插入视频资源，可设置封面图、播放控件等选项。</p>
<video data-type="video" data-src="https://09597157-0eab-4d78-9f1b-3dc3e4ddc353.mdnplay.dev/shared-assets/videos/flower.webm" data-poster="https://picsum.photos/seed/video/200/150" data-width="720" data-alignment="center"></video>
<h2>音频</h2>
<p>支持插入音频资源，以卡片形式展示音频信息和播放控件。</p>
<div data-type="audio" data-src="https://a65c28c1-a726-4e4b-aac3-b94931f43200.mdnplay.dev/shared-assets/audio/t-rex-roar.mp3"></div>
<h2>附件</h2>
<p>支持以卡片形式插入文件附件，显示文件名、类型和大小，并提供下载按钮。</p>
<div data-type="attachment" data-src="https://picsum.photos/seed/1/400/300" data-file-name="示例附件.pdf" data-file-size="2097152" data-file-type="application/pdf"></div>
<hr>
<h2>链接与排版</h2>
<p>这是一段包含<a href="https://tiptap.dev" target="_blank" rel="noopener noreferrer nofollow">超链接</a>的文本，点击可以跳转到 Tiptap 官网。</p>
<p>编辑器内置了智能排版功能：输入 <code>(c)</code> 自动变为 ©，输入 <code>-></code> 自动变为 →，输入 <code>1/2</code> 自动变为 ½。</p>
<p style="text-align: center"><em>—— 选中文字后，点击链接按钮即可添加超链接 ——</em></p>`;

function Demo() {
  const [html, setHtml] = useState(initialContent);
  const [theme, setTheme] = useState<EditorTheme>('auto');

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
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
          borderBottom: '1px solid var(--tt-color-border)',
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
                  ? '1px solid var(--tt-color-primary)'
                  : '1px solid var(--tt-color-border)',
              borderRadius: 4,
              background:
                theme === t ? 'var(--tt-color-primary)' : 'transparent',
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
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Demo />);
}
