---
title: Table Kit 概览
description: FSDX Editor Table Kit 表格增强套件功能概览
---

# Table Kit 概览

`@fsdx/tiptap-table-kit` 是基于 Tiptap 的表格增强扩展包，提供以下核心能力：

## 核心特性

- **零 UI 框架依赖**：选区边框、操作手柄和上下文菜单均使用原生 DOM 构建
- **暗色主题**：通过 CSS 自定义属性实现，支持运行时 `setTheme()` 动态切换
- **国际化**：内置简体中文和 English 语言包，支持自定义翻译覆盖
- **70 色调色板**：10 种色相 × 7 级明度，支持方向键导航
- **丰富的操作**：行列插入/删除/移动，单元格合并/拆分，自适应列宽等

## 快速上手

```ts
import { TableKit } from '@fsdx/tiptap-table-kit'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'

const editor = useEditor({
  extensions: [
    StarterKit,
    TableKit.configure({
      resizable: true,
      theme: 'dark',
      locale: 'zh-CN',
    }),
    TableRow, TableCell, TableHeader,
  ],
})
```

## 演示页面

- [表格编辑](/table-kit/demo) — 完整的功能演示
- [主题配置](/table-kit/theme) — 浅色/深色主题切换
- [国际化](/table-kit/i18n) — 多语言支持与自定义翻译
