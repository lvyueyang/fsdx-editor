import { Link } from 'wouter';

export function HomePage() {
  return (
    <div className="demo-content">
      <div className="demo-cover">
        <span className="demo-cover-badge">@fsdx/tiptap-table-kit</span>
        <h1 className="demo-cover-title">FSDX Editor — 富文本表格增强套件</h1>
        <p className="demo-cover-desc">
          基于 Tiptap 的零框架依赖表格扩展包。内置选区覆盖层、双向上下文菜单、
          70 色调色板，支持暗色主题切换与国际化。
        </p>
        <div className="demo-cover-actions">
          <Link href="/tiptap-table-kit" className="demo-btn demo-btn-primary">
            开始演示
          </Link>
          <a href="#features" className="demo-btn demo-btn-secondary">
            查看功能
          </a>
        </div>
      </div>

      <h2 className="demo-section-title" id="features">
        Table Kit 功能
      </h2>
      <div className="demo-features">
        <div className="demo-feature-card">
          <div className="demo-feature-card-icon">⊞</div>
          <h3 className="demo-feature-card-title">零 UI 框架依赖</h3>
          <p className="demo-feature-card-desc">
            选区边框、操作手柄和上下文菜单均使用原生 DOM 构建，不依赖 React/Vue
            等任何 UI 框架，可嵌入任意前端项目。
          </p>
        </div>

        <div className="demo-feature-card">
          <div className="demo-feature-card-icon">◐</div>
          <h3 className="demo-feature-card-title">暗色主题</h3>
          <p className="demo-feature-card-desc">
            通过 CSS 自定义属性实现完整暗色模式，支持初始配置和运行时 setTheme()
            动态切换，所有组件秒级响应。
          </p>
        </div>

        <div className="demo-feature-card">
          <div className="demo-feature-card-icon">🌐</div>
          <h3 className="demo-feature-card-title">国际化</h3>
          <p className="demo-feature-card-desc">
            内置简体中文和 English
            语言包，支持部分字段的自定义翻译覆盖，轻松适配任意语言。
          </p>
        </div>

        <div className="demo-feature-card">
          <div className="demo-feature-card-icon">🎨</div>
          <h3 className="demo-feature-card-title">70 色调色板</h3>
          <p className="demo-feature-card-desc">
            10 种色相 × 7
            级明度，支持方向键导航和无障碍访问，选中颜色实时应用到单元格文字或背景。
          </p>
        </div>

        <div className="demo-feature-card">
          <div className="demo-feature-card-icon">⇅</div>
          <h3 className="demo-feature-card-title">丰富的行/列操作</h3>
          <p className="demo-feature-card-desc">
            支持行/列的插入、删除、移动、复制和排序，通过语义化的链式命令 API
            调用。
          </p>
        </div>

        <div className="demo-feature-card">
          <div className="demo-feature-card-icon">⚡</div>
          <h3 className="demo-feature-card-title">Bundleless ESM</h3>
          <p className="demo-feature-card-desc">
            每个文件独立编译输出，支持 Tree Shaking，按需加载。仅 ESM
            格式，面向现代 Web 应用。
          </p>
        </div>
      </div>

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
            <td>TableKit</td>
            <td>
              <span className="demo-prop-type">Extension</span>
            </td>
            <td>表格增强套件主扩展，配置后即可启用全部功能</td>
          </tr>
          <tr>
            <td>getTableKitTranslations</td>
            <td>
              <span className="demo-prop-type">
                () =&gt; TableKitTranslations
              </span>
            </td>
            <td>获取当前翻译对象</td>
          </tr>
          <tr>
            <td>getTableKitTheme</td>
            <td>
              <span className="demo-prop-type">() =&gt; 'light' | 'dark'</span>
            </td>
            <td>获取当前主题</td>
          </tr>
          <tr>
            <td>getTableKitLocale</td>
            <td>
              <span className="demo-prop-type">() =&gt; string</span>
            </td>
            <td>获取当前排序比较所用的 locale</td>
          </tr>
          <tr>
            <td>zhCN / enUS</td>
            <td>
              <span className="demo-prop-type">TableKitTranslations</span>
            </td>
            <td>中 / 英文内置翻译对象</td>
          </tr>
          <tr>
            <td>getBuiltinTranslations</td>
            <td>
              <span className="demo-prop-type">
                (locale) =&gt; TableKitTranslations
              </span>
            </td>
            <td>根据 locale 键返回对应内置翻译</td>
          </tr>
        </tbody>
      </table>

      <h2 className="demo-section-title">快速开始</h2>
      <p
        style={{
          fontSize: 14,
          color: 'var(--demo-text-muted)',
          lineHeight: 1.8,
          marginBottom: 16,
        }}
      >
        在 Tiptap 编辑器中一行集成表格增强套件：
      </p>
      <pre
        style={{
          background: 'var(--demo-code-bg)',
          color: 'var(--demo-code-color)',
          padding: '20px 24px',
          borderRadius: 12,
          fontSize: 13,
          lineHeight: 1.7,
          overflow: 'auto',
          marginBottom: 48,
        }}
      >
        {`import { TableKit } from '@fsdx/tiptap-table-kit'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'

const editor = useEditor({
  extensions: [
    StarterKit,
    TableKit.configure({
      resizable: true,   // 可拖拽调整列宽
      theme: 'dark',     // 暗色主题
      locale: 'en-US',   // 英文菜单
    }),
    TableRow, TableCell, TableHeader,
  ],
})

// 运行时切换主题
editor.chain().tableKit.setTheme('light').run()`}
      </pre>
    </div>
  );
}
