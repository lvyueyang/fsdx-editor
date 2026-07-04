---
title: FSDX Editor
description: 基于 Tiptap 的零框架依赖表格扩展套件
pageType: home
hero:
  name: FSDX Editor
  text: 富文本表格增强套件
  tagline: 基于 Tiptap 的零框架依赖表格扩展套件。内置选区覆盖层、双向上下文菜单、70 色调色板，支持暗色主题切换与国际化。
  actions:
    - text: 开始使用
      link: /table-kit/
      theme: brand
    - text: API 参考
      link: /api-reference
      theme: alt
  image:
    src: /favicon.ico
    alt: FSDX Editor
features:
  - title: 零 UI 框架依赖
    details: 选区边框、操作手柄和上下文菜单均使用原生 DOM 构建，不依赖 React/Vue 等任何 UI 框架，可嵌入任意前端项目。
    icon: ⊞
  - title: 暗色主题
    details: 通过 CSS 自定义属性实现完整暗色模式，支持初始配置和运行时 setTheme() 动态切换，所有组件秒级响应。
    icon: ◐
  - title: 国际化
    details: 内置简体中文和 English 语言包，支持部分字段的自定义翻译覆盖，轻松适配任意语言。
    icon: 🌐
  - title: 70 色调色板
    details: 10 种色相 × 7 级明度，支持方向键导航和无障碍访问，选中颜色实时应用到单元格文字或背景。
    icon: 🎨
  - title: 丰富的行/列操作
    details: 支持行/列的插入、删除、移动、复制和排序，通过语义化的链式命令 API 调用。
    icon: ⇅
  - title: Bundleless ESM
    details: 每个文件独立编译输出，支持 Tree Shaking，按需加载。仅 ESM 格式，面向现代 Web 应用。
    icon: ⚡
---

## 核心导出

| 导出 | 类型 | 说明 |
|------|------|------|
| TableKit | `Extension` | 表格增强套件主扩展，配置后即可启用全部功能 |
| getTableKitTranslations | `() => TableKitTranslations` | 获取当前翻译对象 |
| getTableKitTheme | `() => 'light' \| 'dark'` | 获取当前主题 |
| getTableKitLocale | `() => string` | 获取当前排序比较所用的 locale |
| zhCN / enUS | `TableKitTranslations` | 中 / 英文内置翻译对象 |
| getBuiltinTranslations | `(locale) => TableKitTranslations` | 根据 locale 键返回对应内置翻译 |

## 快速开始

在 Tiptap 编辑器中一行集成表格增强套件：

```ts
import { TableKit } from '@fsdx/tiptap-table-kit'
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
editor.chain().tableKit.setTheme('light').run()
```
