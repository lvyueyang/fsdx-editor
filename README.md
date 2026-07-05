# FSDX Editor

基于 Tiptap 的零框架依赖编辑器工具包，提供丰富的富文本编辑能力、表格增强套件与可定制主题系统。

## 安装

```bash
pnpm install
```

## 快速开始

```ts
import { createEditor } from '@fsdx/editor'

const editor = createEditor(document.getElementById('editor'), {
  placeholder: '请输入…',
  defaultTheme: 'light',
  image: {
    upload: async (file) => ({ id: '1', url: '...', name: file.name }),
  },
  onChange: (html) => console.log(html),
})

editor.setHTML('<p>Hello World</p>')
```

## 命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 构建 editor + table-plus，同时启动文档站点开发服务器 |
| `pnpm build` | 构建所有包（editor + table-plus + site） |
| `pnpm build:site` | 仅构建文档站点 |
| `pnpm check` | Biome 代码检查并自动修复 |
| `pnpm format` | Biome 代码格式化 |
| `pnpm test` | 运行所有包测试 |
| `pnpm test:watch` | 测试监听模式 |

## 项目结构

```
packages/
├── editor/                  # @fsdx/editor — 零框架依赖编辑器
├── tiptap-table-plus/        # @fsdx/tiptap-table-plus — 表格增强套件
site/                        # Astro + Starlight 文档站点
```

## 技术栈

- **框架**：编辑器无框架依赖，Demo 使用 React 19
- **编辑器**：Tiptap 3
- **构建**：Rslib（包）+ Astro（站点）
- **语言**：TypeScript 6（strict）
- **样式**：纯 CSS
- **Lint/Format**：Biome 2
- **测试**：Rstest + happy-dom
