# @fsdx/tiptap-table-kit

Tiptap 表格自定义扩展，提供纯函数式命令 API，不依赖任何 UI 框架。

## 安装

```bash
pnpm add @fsdx/tiptap-table-kit
```

## 注册扩展

```ts
import { Editor } from '@tiptap/core'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { TableCellStyle, NodeBackground } from '@fsdx/tiptap-table-kit'
import '@fsdx/tiptap-table-kit/styles/table.css'

const editor = new Editor({
  extensions: [
    Table.configure({ resizable: true }),
    TableRow,
    TableCell,
    TableHeader,
    TableCellStyle,       // 文字颜色 / 垂直对齐
    NodeBackground,       // 节点背景色
  ],
})
```

## 命令函数

所有函数签名为 `(editor: Editor, ...args) => boolean`，可直接在任何环境中调用。

### 表格

| 函数 | 说明 |
|------|------|
| `insertTable(editor, rows, cols)` | 插入 rows × cols 的表格 |
| `isInTable(editor)` | 判断是否在表格内 |
| `canInsertTable(editor)` | 判断是否可以插入表格 |

### 单元格

| 函数 | 说明 |
|------|------|
| `mergeCells(editor)` | 合并选中单元格 |
| `splitCell(editor)` | 拆分单元格 |
| `clearSelectedCells(editor)` | 清除选中单元格内容及样式 |
| `setCellTextColor(editor, color)` | 设置文字颜色 |
| `unsetCellTextColor(editor)` | 取消文字颜色 |
| `setCellBackgroundColor(editor, color)` | 设置背景色 |
| `unsetCellBackgroundColor(editor)` | 取消背景色 |
| `setCellTextAlign(editor, align)` | 设置水平对齐 (`'left' \| 'center' \| 'right' \| 'justify'`) |
| `setCellVerticalAlign(editor, align)` | 设置垂直对齐 (`'top' \| 'middle' \| 'bottom'`) |
| `toggleHeaderRow(editor)` | 切换标题行 |
| `toggleHeaderColumn(editor)` | 切换标题列 |
| `fitToWidth(editor)` | 自适应列宽（移除固定列宽） |
| `copySelectedCells(editor)` | 复制选中单元格内容 |
| `clearRowContent(editor)` | 清除当前行内容 |
| `clearColumnContent(editor)` | 清除当前列内容 |

### 行操作

| 函数 | 说明 |
|------|------|
| `addRowBefore(editor)` | 上方插入行 |
| `addRowAfter(editor)` | 下方插入行 |
| `deleteRow(editor)` | 删除当前行 |
| `moveRowUp(editor)` | 上移当前行 |
| `moveRowDown(editor)` | 下移当前行 |
| `duplicateRow(editor)` | 复制当前行 |

### 列操作

| 函数 | 说明 |
|------|------|
| `addColumnBefore(editor)` | 左侧插入列 |
| `addColumnAfter(editor)` | 右侧插入列 |
| `deleteColumn(editor)` | 删除当前列 |
| `moveColumnLeft(editor)` | 左移当前列 |
| `moveColumnRight(editor)` | 右移当前列 |
| `duplicateColumn(editor)` | 复制当前列 |
| `sortColumnAsc(editor)` | 升序排列 |
| `sortColumnDesc(editor)` | 降序排列 |

## CustomTableView

扩展 Tiptap 内置 `TableView`，在 `tableWrapper` 内注入两个容器：

- `.table-controls` — 供扩展按钮渲染
- `.table-selection-overlay-container` — 供选区覆盖层渲染

```ts
import { CustomTableView } from '@fsdx/tiptap-table-kit'
import Table from '@tiptap/extension-table'

Table.configure({
  resizable: true,
  View: CustomTableView,
})
```

## 工具函数

| 函数 | 说明 |
|------|------|
| `canDoInTable(editor)` | 是否在表格内且可编辑 |
| `findTableDepth($pos)` | 查找 table 节点深度 |
| `findRowDepth($pos)` | 查找 tableRow 节点深度 |
| `isNodeInSchema(name, editor)` | 节点是否在 schema 中 |
| `getSelectedNodesOfType(selection, types)` | 获取选区指定类型节点 |
| `updateNodesAttr(tr, targets, attr, value)` | 批量更新节点属性 |

## 色板

```ts
import { PALETTE_COLORS, PALETTE_COLUMNS, PALETTE_ROWS } from '@fsdx/tiptap-table-kit'
```

70 色色板（10 色相 × 7 明度），可用于色盘选择器。

## 样式

```ts
import '@fsdx/tiptap-table-kit/styles/table.css'
```

提供选区覆盖层、操作手柄和上下文菜单的样式。**表格渲染样式（table/td/th 等）需要用户自行提供**，配合 `@tiptap/extension-table` 使用。

所有颜色/间距通过 CSS 自定义属性控制，默认有硬编码 fallback：

| 变量 | 默认值 |
|------|--------|
| `--fsdx-tiptap-table-kit-space-1` | `4px` |
| `--fsdx-tiptap-table-kit-space-2` | `6px` |
| `--fsdx-tiptap-table-kit-space-3` | `10px` |
| `--fsdx-tiptap-table-kit-space-6` | `28px` |
| `--fsdx-tiptap-table-kit-border-default` | `#d4d4d8` |
| `--fsdx-tiptap-table-kit-brand-200` | `#c4b5fd` |
| `--fsdx-tiptap-table-kit-brand-400` | `#a78bfa` |
| `--fsdx-tiptap-table-kit-radius-xs` | `4px` |
| `--fsdx-tiptap-table-kit-font-weight-semibold` | `600` |
| `--fsdx-tiptap-table-kit-content-table-header-bg` | `#f4f4f5` |

## 许可

MIT
