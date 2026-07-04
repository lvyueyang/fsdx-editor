---
title: API 参考
description: Table Kit 完整 API 配置项、命令与类型定义
---

# API 参考

`@fsdx/tiptap-table-kit` 的完整 API 文档，包括扩展配置、命令链和类型定义。

## TableKit 配置项

`TableKit.configure()` 继承 `@tiptap/extension-table` 的全部选项，并新增以下参数：

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `theme` | `'light' \| 'dark'` | `'light'` | 覆盖层 / 菜单的视觉主题 |
| `locale` | `'zh-CN' \| 'en-US'` | `'zh-CN'` | 默认语言 |
| `translations` | `Partial<TableKitTranslations>` | — | 自定义翻译覆盖 |
| `resizable` | `boolean` | — | 表格是否可调整列宽（继承自 Table） |
| `cellMinWidth` | `number` | — | 单元格最小宽度（继承自 Table） |

## 命令

所有命令通过 `editor.commands.tableKit.*` 调用：

### 行操作

| 命令 | 参数 | 说明 |
|------|------|------|
| `moveRowUp()` | — | 上移当前行 |
| `moveRowDown()` | — | 下移当前行 |
| `duplicateRow()` | — | 复制当前行 |

### 列操作

| 命令 | 参数 | 说明 |
|------|------|------|
| `moveColumnLeft()` | — | 左移当前列 |
| `moveColumnRight()` | — | 右移当前列 |
| `duplicateColumn()` | — | 复制当前列 |
| `sortColumnAsc()` | — | 当前列升序排序 |
| `sortColumnDesc()` | — | 当前列降序排序 |

### 单元格操作

| 命令 | 参数 | 说明 |
|------|------|------|
| `clearSelectedCells()` | — | 清除选中单元格内容并重置样式 |
| `setCellTextColor(color)` | `string` | 设置文字颜色 |
| `unsetCellTextColor()` | — | 移除文字颜色 |
| `setCellBackgroundColor(color)` | `string` | 设置背景色 |
| `unsetCellBackgroundColor()` | — | 移除背景色 |
| `fitToWidth()` | — | 移除 colwidth 实现自适应列宽 |
| `copySelectedCells()` | — | 以 TSV 格式复制到剪贴板 |

### 行/列内容清除

| 命令 | 参数 | 说明 |
|------|------|------|
| `clearRowContent()` | — | 清除当前行内容 |
| `clearColumnContent()` | — | 清除当前列内容 |
| `clearRowColumnContent(orientation)` | `'row' \| 'column'` | 清除指定方向的内容 |

### 主题

| 命令 | 参数 | 说明 |
|------|------|------|
| `setTheme(theme)` | `'light' \| 'dark'` | 运行时动态切换主题 |

:::tip 提示
原生 Tiptap `Table` 扩展的行列增删、合并拆分、表头切换等命令仍然可用，TableKit 在此基础上扩展了上述命令。
:::

## 辅助函数

| 函数 | 签名 | 说明 |
|------|------|------|
| `getTableKitTranslations` | `(editor) => TableKitTranslations` | 获取当前翻译对象 |
| `getTableKitTheme` | `(editor) => 'light' \| 'dark'` | 获取当前主题 |
| `getTableKitLocale` | `(editor) => string` | 获取当前 locale |

## 内置语言包

| 导出 | 说明 |
|------|------|
| `zhCN` | 简体中文翻译对象 |
| `enUS` | 英文翻译对象 |
| `getBuiltinTranslations(locale)` | 根据 locale 键返回对应语言包 |

## TableKitTranslations

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
| `back` | 返回 | Back |
| `defaultColor` | 默认颜色 | Default |
| `tableActions` | 表格操作 | Table Actions |
