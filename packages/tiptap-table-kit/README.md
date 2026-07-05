# @fsdx/tiptap-table-kit

Tiptap 表格增强套件，集成自定义视图、单元格样式、选区覆盖层、节点背景色和丰富的表格操作命令，不依赖任何 UI 框架。

## 安装

```bash
pnpm add @fsdx/tiptap-table-kit
```

## 使用

`TableKit` 是唯一的公开导出，通过 `TableKit.configure()` 传入配置即可自动集成所有子扩展和命令。

```ts
import { Editor } from '@tiptap/core'
import { TableKit } from '@fsdx/tiptap-table-kit'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

const editor = new Editor({
  extensions: [
    TableKit.configure({ resizable: true }),
    TableRow,
    TableCell,
    TableHeader,
  ],
})
```

## 命令

所有命令通过 `editor.chain()` 调用：

### 行操作

| 命令 | 说明 |
|------|------|
| `moveRowUp()` | 上移当前行 |
| `moveRowDown()` | 下移当前行 |
| `duplicateRow()` | 复制当前行 |

### 列操作

| 命令 | 说明 |
|------|------|
| `moveColumnLeft()` | 左移当前列 |
| `moveColumnRight()` | 右移当前列 |
| `duplicateColumn()` | 复制当前列 |
| `sortColumnAsc()` | 升序排列 |
| `sortColumnDesc()` | 降序排列 |

### 单元格

| 命令 | 说明 |
|------|------|
| `clearSelectedCells()` | 清除选中单元格内容及样式 |
| `setCellTextColor(color)` | 设置文字颜色 |
| `unsetCellTextColor()` | 取消文字颜色 |
| `setCellBackgroundColor(color)` | 设置背景色 |
| `unsetCellBackgroundColor()` | 取消背景色 |
| `setCellVerticalAlign(align)` | 设置垂直对齐 (`'top' \| 'middle' \| 'bottom'`) |
| `unsetCellVerticalAlign()` | 取消垂直对齐 |
| `fitToWidth()` | 自适应列宽 |
| `copySelectedCells()` | 复制选中内容 |
| `clearRowContent()` | 清除当前行内容 |
| `clearColumnContent()` | 清除当前列内容 |
| `clearRowColumnContent(orientation)` | 清除当前行/列内容 |

### 节点背景色

| 命令 | 说明 |
|------|------|
| `setNodeBackgroundColor(color)` | 设置节点背景色 |
| `unsetNodeBackgroundColor()` | 取消节点背景色 |

## 样式

提供的样式包括选区覆盖层、操作手柄和上下文菜单。样式已内联于主入口，无需额外导入。

所有颜色/间距通过 CSS 自定义属性控制：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--fsdx-tiptap-table-kit-accent` | `#7c3aed` | 品牌色 |
| `--fsdx-tiptap-table-kit-border` | `#d4d4d8` | 边框色 |
| `--fsdx-tiptap-table-kit-bg` | `#fff` | 背景色 |
| `--fsdx-tiptap-table-kit-bg-hover` | `#f4f4f5` | 悬停背景色 |
| `--fsdx-tiptap-table-kit-text` | `#1a1a2e` | 主文字色 |
| `--fsdx-tiptap-table-kit-radius` | `2px` | 圆角 |

## 许可

MIT
