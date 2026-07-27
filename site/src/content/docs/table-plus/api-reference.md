---
title: API 参考
description: Table Kit 完整 API 配置项、命令与类型定义
---

# API 参考

`@fsdx/tiptap-table-plus` 的完整 API 文档，包括扩展配置、命令链和类型定义。

## TablePlus 配置项

`TablePlus.configure()` 支持以下参数：

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `theme` | `'light' \| 'dark'` | `'light'` | 覆盖层 / 菜单的视觉主题 |
| `locale` | `'zh-CN' \| 'en-US'` | `'zh-CN'` | 默认语言 |
| `translations` | `Partial<TablePlusTranslations>` | — | 自定义翻译覆盖 |
| `contextMenu` | `(items: MenuList) => MenuList` | — | 自定义上下文菜单 |

## 命令

所有命令通过 `editor.chain()` 调用：

### 单元格操作（tablePlus 命名空间）

| 命令 | 参数 | 说明 |
|------|------|------|
| `clearSelectedCells()` | — | 清除选中单元格内容并重置样式 |
| `clearRowColumnContent(orientation)` | `'row' \| 'column'` | 清除当前行或列内容（保留样式） |
| `setTablePlusTheme(theme)` | `'light' \| 'dark'` | 运行时动态切换主题 |

### 单元格样式（tableCellStyle 命名空间）

| 命令 | 参数 | 说明 |
|------|------|------|
| `setCellTextColor(color)` | `string` | 设置文字颜色 |
| `unsetCellTextColor()` | — | 移除文字颜色 |
| `setCellTextAlign(align)` | `string \| null` | 设置水平对齐 |
| `setCellVerticalAlign(align)` | `'top' \| 'middle' \| 'bottom' \| null` | 设置/移除垂直对齐 |

### 节点背景色（nodeBackground 命名空间）

| 命令 | 参数 | 说明 |
|------|------|------|
| `setNodeBackgroundColor(color)` | `string` | 设置节点背景色 |
| `unsetNodeBackgroundColor()` | — | 移除节点背景色 |

:::tip
原生 Tiptap `Table` 扩展的行列增删、合并拆分、表头切换等命令仍然可用，TablePlus 在此基础上扩展了上述命令。
:::

## 辅助函数

| 函数 | 签名 | 说明 |
|------|------|------|
| `getTablePlusTranslations` | `(editor) => TablePlusTranslations` | 获取当前翻译对象 |
| `getTablePlusTheme` | `(editor) => 'light' \| 'dark'` | 获取当前主题 |
| `getTablePlusLocale` | `(editor) => string` | 获取当前 locale |

## 内置语言包

| 导出 | 说明 |
|------|------|
| `zhCN` | 简体中文翻译对象 |
| `enUS` | 英文翻译对象 |
| `getBuiltinTranslations(locale)` | 根据 locale 键返回对应语言包 |

## TablePlusTranslations

所有可翻译字段的接口定义：

| 字段 | 中文 | 英文 |
|------|------|------|
| `insertRowAbove` | 上方插入行 | Insert Row Above |
| `insertRowBelow` | 下方插入行 | Insert Row Below |
| `insertColumnLeft` | 左侧插入列 | Insert Column Left |
| `insertColumnRight` | 右侧插入列 | Insert Column Right |
| `mergeCells` | 合并单元格 | Merge Cells |
| `splitCell` | 拆分单元格 | Split Cell |
| `textColor` | 文字颜色 | Text Color |
| `backgroundColor` | 背景色 | Background Color |
| `horizontalAlign` | 水平对齐 | Horizontal Align |
| `verticalAlign` | 垂直对齐 | Vertical Align |
| `alignLeft` | 左对齐 | Align Left |
| `alignCenter` | 居中 | Align Center |
| `alignRight` | 右对齐 | Align Right |
| `alignJustify` | 两端对齐 | Align Justify |
| `alignTop` | 顶端对齐 | Align Top |
| `alignMiddle` | 居中 | Align Middle |
| `alignBottom` | 底端对齐 | Align Bottom |
| `clearContent` | 清除内容 | Clear Content |
| `toggleHeaderRow` | 切换标题行 | Toggle Header Row |
| `toggleHeaderColumn` | 切换标题列 | Toggle Header Column |
| `deleteRow` | 删除行 | Delete Row |
| `deleteColumn` | 删除列 | Delete Column |
| `defaultColor` | 默认颜色 | Default |
| `tableActions` | 表格操作 | Table Actions |
| `addColumn` | 添加列 | Add Column |
| `addRow` | 添加行 | Add Row |
| `customColor` | 自定义颜色 | Custom Color |
