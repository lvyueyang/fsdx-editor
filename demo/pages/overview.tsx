import { Link } from 'wouter';
import { CodeBlock } from '../components/code-block';

export function Overview() {
  return (
    <div className="demo-content">
      <div className="demo-cover">
        <span className="demo-cover-badge">v1.0.0</span>
        <h1 className="demo-cover-title">FSDX Editor</h1>
        <p className="demo-cover-desc">
          基于 Tiptap + React
          19构建的功能型富文本编辑器，内置文本样式、媒体处理、表格、代码块等19个功能插件，支持浅色/深色主题切换。
        </p>
        <div className="demo-cover-actions">
          <Link href="/demo" className="demo-btn demo-btn-primary">
            在线演示
          </Link>
          <Link href="/api" className="demo-btn demo-btn-secondary">
            查看 API
          </Link>
        </div>
      </div>

      <div className="demo-features">
        <div className="demo-feature-card">
          <div className="demo-feature-card-icon">⚡</div>
          <h3 className="demo-feature-card-title">19 个功能插件</h3>
          <p className="demo-feature-card-desc">
            文本样式、标题、字号、颜色、高亮、列表、表格、代码块、图片、视频、音频、附件、链接、对齐、缩进、行高、引用、分割线、撤销重做
          </p>
        </div>
        <div className="demo-feature-card">
          <div className="demo-feature-card-icon">🎨</div>
          <h3 className="demo-feature-card-title">主题支持</h3>
          <p className="demo-feature-card-desc">
            内置浅色、深色两种视觉方案，并支持跟随系统自动切换。所有 CSS
            变量均使用统一设计 Token。
          </p>
        </div>
        <div className="demo-feature-card">
          <div className="demo-feature-card-icon">📦</div>
          <h3 className="demo-feature-card-title">TypeScript 优先</h3>
          <p className="demo-feature-card-desc">
            完整的类型定义，为所有组件
            Props、编辑器选项、媒体接口提供严格的类型约束。
          </p>
        </div>
        <div className="demo-feature-card">
          <div className="demo-feature-card-icon">📷</div>
          <h3 className="demo-feature-card-title">媒体处理</h3>
          <p className="demo-feature-card-desc">
            图片、视频、音频、附件四大媒体类型的上传、列表选择、属性编辑完整支持。
          </p>
        </div>
      </div>

      <h2 className="demo-section-title">快速开始</h2>

      <CodeBlock title="安装" language="bash" code={'pnpm add fsdx-editor'} />

      <CodeBlock
        title="基础用法"
        language="tsx"
        code={`import { Editor } from 'fsdx-editor';
import { useState } from 'react';

function App() {
  const [html, setHtml] = useState('<p>开始编辑</p>');

  return (
    <Editor
      value={html}
      onChange={setHtml}
    />
  );
}`}
      />

      <h2 className="demo-section-title">核心导出</h2>
      <table className="demo-props-table">
        <thead>
          <tr>
            <th>导出</th>
            <th>类型</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Editor</td>
            <td>
              <span className="demo-prop-type">Component</span>
            </td>
            <td>编辑器组件，接收 value、onChange 等属性</td>
          </tr>
          <tr>
            <td>EditorProps</td>
            <td>
              <span className="demo-prop-type">Type</span>
            </td>
            <td>Editor 组件的 Props 类型</td>
          </tr>
          <tr>
            <td>EditorTheme</td>
            <td>
              <span className="demo-prop-type">Type</span>
            </td>
            <td>
              主题类型：&apos;light&apos; | &apos;dark&apos; | &apos;auto&apos;
            </td>
          </tr>
          <tr>
            <td>EditorOptions</td>
            <td>
              <span className="demo-prop-type">Type</span>
            </td>
            <td>编辑器功能配置（媒体上传、列表接口等）</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
