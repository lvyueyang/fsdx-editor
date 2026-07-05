# @fsdx/tiptap-table-plus

Tiptap 表格增强套件，集成单元格样式、选区覆盖层、节点背景色和丰富的表格操作命令，不依赖任何 UI 框架。

## 安装

```bash
pnpm add @fsdx/tiptap-table-plus
```

## 使用

`TablePlus` 需搭配 `TableKit`（`@tiptap/extension-table`）使用。

```ts
import { Editor } from '@tiptap/core'
import { TableKit } from '@tiptap/extension-table'
import { TablePlus } from '@fsdx/tiptap-table-plus'

const editor = new Editor({
  extensions: [
    TableKit.configure({
      table: {
        resizable: true,
      },
    }),
    TablePlus.configure(),
  ],
})
```

## 命令

所有命令通过 `editor.chain()` 调用，标准表格命令由 `TableKit` 提供，扩展命令由 `TablePlus` 提供：

### 单元格

| 命令 | 说明 |
|------|------|
| `clearSelectedCells()` | 清除选中单元格内容及样式 |
| `setCellTextColor(color)` | 设置文字颜色 |
| `unsetCellTextColor()` | 取消文字颜色 |
| `setCellBackgroundColor(color)` | 设置背景色 |
| `unsetCellBackgroundColor()` | 取消背景色 |
| `setCellVerticalAlign(align)` | 设置垂直对齐 (`'top' \| 'middle' \| 'bottom'`) |
| `clearRowContent()` | 清除当前行内容 |
| `clearColumnContent()` | 清除当前列内容 |
| `clearRowColumnContent(orientation)` | 清除当前行/列内容 |

### 节点背景色

| 命令 | 说明 |
|------|------|
| `setNodeBackgroundColor(color)` | 设置节点背景色 |
| `unsetNodeBackgroundColor()` | 取消节点背景色 |

## 样式

引入 `@fsdx/tiptap-table-plus/styles/table.css` 以加载表格增强样式（选区覆盖层、操作手柄、上下文菜单、加行加列控件等）。

所有颜色/间距通过 CSS 自定义属性控制：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--fsdx-tiptap-table-plus-accent` | `#7c3aed` | 品牌色 |
| `--fsdx-tiptap-table-plus-border` | `#d4d4d8` | 边框色 |
| `--fsdx-tiptap-table-plus-bg` | `#fff` | 背景色 |
| `--fsdx-tiptap-table-plus-bg-hover` | `#f4f4f5` | 悬停背景色 |
| `--fsdx-tiptap-table-plus-text` | `#1a1a2e` | 主文字色 |
| `--fsdx-tiptap-table-plus-radius` | `2px` | 圆角 |

## 自定义上下文菜单

通过 `contextMenu` 配置项可增删改上下文菜单项。回调接收默认菜单项列表，返回新的菜单项列表。

```ts
import type { MenuListDef } from '@fsdx/tiptap-table-plus'
import { TablePlus } from '@fsdx/tiptap-table-plus'

TablePlus.configure({
  contextMenu(items: MenuListDef) {
    // 过滤掉删除行/列项
    const filtered = items.filter(
      (item) => !('variant' in item && item.variant === 'destructive'),
    )
    // 追加自定义菜单项
    filtered.push(
      { type: 'separator' },
      {
        label: '自定义操作',
        iconHtml: '<svg>...</svg>',
        onClick: () => console.log('自定义操作'),
      },
    )
    return filtered
  },
})
```

### 相关类型

```ts
// 主菜单项
type MenuItemDef = {
  label: string
  iconHtml: string
  disabled?: boolean
  variant?: 'default' | 'destructive'
  onClick?: () => void
  sub?: 'color' | SubMenuItem[]  // 'color' = 颜色面板，SubMenuItem[] = 级联子菜单
}

// 子菜单项
type SubMenuItem = {
  label: string
  iconHtml: string
  onClick: () => void
}

// 菜单项列表（含分隔符）
type MenuListDef = (MenuItemDef | { type: 'separator' })[]
```

## 许可

MIT
