# @easyx/tiptap-table-plus

Tiptap 表格增强套件，集成单元格样式、选区覆盖层、节点背景色和丰富的表格操作命令，不依赖任何 UI 框架。

## 安装

```bash
pnpm add @easyx/tiptap-table-plus
```

## 使用

`TablePlus` 需搭配 `TableKit`（`@tiptap/extension-table`）使用，推荐启用 `resizable` 以支持列宽拖拽：

```ts
import { Editor } from '@tiptap/core'
import { TableKit } from '@tiptap/extension-table'
import { TablePlus } from '@easyx/tiptap-table-plus'

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

## 配置

`TablePlus.configure()` 接受以下选项：

```ts
interface TablePlusOptions {
  /** 主题模式，影响选区覆盖层和上下文菜单的配色 */
  theme?: 'light' | 'dark'
  /** 语言区域，内置 zh-CN / en-US */
  locale?: 'zh-CN' | 'en-US'
  /** 局部翻译覆盖，与内置语言包浅合并 */
  translations?: Partial<TablePlusTranslations>
  /** 自定义上下文菜单回调，接收默认菜单项列表，返回修改后的列表 */
  contextMenu?: (items: MenuList) => MenuList
}
```

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |
| `locale` | `'zh-CN' \| 'en-US'` | `'zh-CN'` | 语言区域 |
| `translations` | `Partial<TablePlusTranslations>` | — | 局部翻译覆盖 |
| `contextMenu` | `(items: MenuList) => MenuList` | — | 自定义上下文菜单 |

配置示例：

```ts
TablePlus.configure({
  theme: 'dark',
  locale: 'en-US',
  translations: { deleteRow: 'Remove Row' },
  contextMenu: (items) => items.filter(
    (item) => !('variant' in item && item.variant === 'destructive'),
  ),
})
```

## 命令

所有命令通过 `editor.chain()` 调用。标准表格命令（插入行列、合并拆分、删除行列等）由 `@tiptap/extension-table` 提供，扩展命令由 `TablePlus` 及其子扩展提供。

### tablePlus 命名空间

| 命令 | 参数 | 说明 |
|------|------|------|
| `clearSelectedCells()` | — | 清除选中单元格内容及样式 |
| `clearRowColumnContent(orientation)` | `orientation: 'row' \| 'column'` | 清除当前行或列内容（保留样式） |
| `setTablePlusTheme(theme)` | `theme: 'light' \| 'dark'` | 动态切换主题 |

### tableCellStyle 命名空间

| 命令 | 参数 | 说明 |
|------|------|------|
| `setCellTextColor(color)` | `color: string` | 设置文字颜色 |
| `unsetCellTextColor()` | — | 取消文字颜色 |
| `setCellTextAlign(align)` | `align: string \| null` | 设置水平对齐 |
| `setCellVerticalAlign(align)` | `align: 'top' \| 'middle' \| 'bottom' \| null` | 设置/取消垂直对齐 |

### nodeBackground 命名空间

| 命令 | 参数 | 说明 |
|------|------|------|
| `setNodeBackgroundColor(color)` | `color: string` | 设置节点背景色 |
| `unsetNodeBackgroundColor()` | — | 取消节点背景色 |

## 运行时 API

通过编辑器实例读取当前运行状态：

```ts
import {
  getTablePlusTranslations,
  getTablePlusTheme,
  getTablePlusLocale,
} from '@easyx/tiptap-table-plus'

const t = getTablePlusTranslations(editor) // 获取合并后的翻译对象
const theme = getTablePlusTheme(editor)    // 'light' | 'dark'
const locale = getTablePlusLocale(editor)  // 'zh-CN' | 'en-US'
```

## 国际化

内置简体中文（`zh-CN`）和英文（`en-US`）两个语言包，可通过 `locale` 切换，通过 `translations` 局部覆盖。

### 内置语言包

```ts
import { zhCN, enUS } from '@easyx/tiptap-table-plus'
```

### 翻译字段

`TablePlusTranslations` 完整接口：

| 字段 | 说明 | 中文默认值 |
|------|------|-----------|
| `insertRowAbove` | 上方插入行 | 上方插入行 |
| `insertRowBelow` | 下方插入行 | 下方插入行 |
| `insertColumnLeft` | 左侧插入列 | 左侧插入列 |
| `insertColumnRight` | 右侧插入列 | 右侧插入列 |
| `mergeCells` | 合并单元格 | 合并单元格 |
| `splitCell` | 拆分单元格 | 拆分单元格 |
| `textColor` | 文字颜色 | 文字颜色 |
| `backgroundColor` | 背景色 | 背景色 |
| `horizontalAlign` | 水平对齐 | 水平对齐 |
| `verticalAlign` | 垂直对齐 | 垂直对齐 |
| `alignLeft` | 左对齐 | 左对齐 |
| `alignCenter` | 居中 | 居中 |
| `alignRight` | 右对齐 | 右对齐 |
| `alignJustify` | 两端对齐 | 两端对齐 |
| `alignTop` | 顶端对齐 | 顶端对齐 |
| `alignMiddle` | 居中（垂直） | 居中 |
| `alignBottom` | 底端对齐 | 底端对齐 |
| `clearContent` | 清除内容 | 清除内容 |
| `toggleHeaderRow` | 切换标题行 | 切换标题行 |
| `toggleHeaderColumn` | 切换标题列 | 切换标题列 |
| `deleteRow` | 删除行 | 删除行 |
| `deleteColumn` | 删除列 | 删除列 |
| `defaultColor` | 默认颜色 | 默认颜色 |
| `tableActions` | 操作手柄 aria-label | 表格操作 |
| `addColumn` | 添加列 | 添加列 |
| `addRow` | 添加行 | 添加行 |
| `customColor` | 自定义颜色 | 自定义颜色 |

## 自定义上下文菜单

通过 `contextMenu` 配置项可增删改上下文菜单项。回调接收默认菜单项列表，返回新的菜单项列表。

### 类型定义

```ts
type SubMenuItem = {
  label: string
  iconHtml: string
  onClick: () => void
}

type MenuItem = {
  label: string
  iconHtml: string
  disabled?: boolean
  variant?: 'default' | 'destructive'
  onClick?: () => void
  /** sub === 'color' 时，决定点击色块后触发的操作 */
  action?: 'textColor' | 'backgroundColor'
  /** 子菜单：'color' 打开 70 色色板，SubMenuItem[] 打开级联菜单 */
  sub?: 'color' | SubMenuItem[]
}

type MenuSeparator = { type: 'separator' }

type MenuList = (MenuItem | MenuSeparator)[]
```

### 使用示例

```ts
import type { MenuList } from '@easyx/tiptap-table-plus'
import { TablePlus } from '@easyx/tiptap-table-plus'

TablePlus.configure({
  contextMenu(items: MenuList) {
    // 过滤掉危险操作
    const filtered = items.filter(
      (item) => !('variant' in item && item.variant === 'destructive'),
    )
    // 追加自定义操作
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

## 样式

引入 `@easyx/tiptap-table-plus/styles/table.css` 以加载表格增强样式（选区覆盖层、操作手柄、上下文菜单、加行加列控件等）。

所有颜色 / 间距通过 CSS 自定义属性控制：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--easyx-tiptap-table-plus-accent` | `#7c3aed` | 品牌色 |
| `--easyx-tiptap-table-plus-border` | `#d4d4d8` | 边框色 |
| `--easyx-tiptap-table-plus-bg` | `#fff` | 背景色 |
| `--easyx-tiptap-table-plus-bg-hover` | `#f4f4f5` | 悬停背景色 |
| `--easyx-tiptap-table-plus-text` | `#1a1a2e` | 主文字色 |
| `--easyx-tiptap-table-plus-radius` | `2px` | 圆角 |

## 许可

MIT
