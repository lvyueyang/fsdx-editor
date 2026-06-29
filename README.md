# FSDX Editor

基于 Tiptap + React 19 构建的富文本编辑器组件库，提供丰富的媒体编辑能力与可定制主题系统。

## 安装

```bash
pnpm install
```

## 快速开始

```tsx
import { Editor } from 'fsdx-editor';
import type { EditorOptions } from 'fsdx-editor';

function App() {
  const options: EditorOptions = {
    image: {
      upload: async (file) => ({ id: '', url: '', name: '' }),
      getList: async () => ({ items: [], total: 0 }),
    },
  };

  return <Editor options={options} theme="light" />;
}
```

## 命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动 Demo 开发服务器 |
| `pnpm dev:lib` | 启动组件库监听构建 |
| `pnpm build` | 构建组件库（ESM + 声明文件） |
| `pnpm build:demo` | 构建 Demo 页面 |
| `pnpm check` | Biome 代码检查并自动修复 |
| `pnpm format` | Biome 代码格式化 |
| `pnpm test` | 运行测试 |
| `pnpm test:watch` | 测试监听模式 |

## 技术栈

- **框架**：React 19
- **编辑器**：Tiptap 3
- **构建**：Rslib + Rsbuild
- **语言**：TypeScript 6（strict）
- **样式**：SCSS/Sass
- **Lint/Format**：Biome 2
- **测试**：Rstest + Testing Library
