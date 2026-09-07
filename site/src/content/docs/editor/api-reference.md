---
title: API 参考
description: EasyX Editor createEditor 完整 API 类型定义与说明
---

# API 参考

`createEditor()` 的完整参数、返回值与相关类型定义。

## createEditor

```ts
import { createEditor } from '@easyx/editor'

const editor = createEditor(container: HTMLElement, options: EasyxEditorOptions)
```

在指定 DOM 容器中创建编辑器实例，返回一个包含 API 方法和事件系统的 `EditorInstance` 对象。

## EasyxEditorOptions

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `defaultContent` | `string` | `''` | 编辑器初始 HTML 内容 |
| `defaultTheme` | `'light' \| 'dark'` | `'light'` | 编辑器默认主题 |
| `placeholder` | `string` | — | 编辑器为空时显示的占位文字 |
| `readOnly` | `boolean` | `false` | 是否只读 |
| `autoFocus` | `boolean` | `false` | 是否自动聚焦 |
| `height` | `number \| 'auto' \| string` | `'auto'` | 编辑器高度。`'auto'`/缺省随内容伸缩；给定值为定高并内部滚动；number 视为 px |
| `minHeight` | `number \| string` | — | 最小高度，内容撑开时保底 |
| `maxHeight` | `number \| string` | — | 最大高度，内容撑到上限后内部滚动 |
| `resizable` | `boolean` | `false` | 是否启用右下角拖拽手柄调节高度，受 `minHeight`/`maxHeight` 约束 |
| `image` | `ImageMediaUploadConfig` | — | 图片上传、列表与缩放配置 |
| `video` | `MediaUploadConfig` | — | 视频上传与列表配置 |
| `audio` | `MediaUploadConfig` | — | 音频上传与列表配置 |
| `attachment` | `MediaUploadConfig` | — | 附件上传与列表配置 |
| `onChange` | `(content: string) => void` | — | 内容变更回调 |
| `onFocus` | `() => void` | — | 编辑器聚焦回调 |
| `onBlur` | `() => void` | — | 编辑器失焦回调 |
| `onReady` | `() => void` | — | 编辑器初始化完成回调 |
| `onDestroy` | `() => void` | — | 编辑器销毁回调 |

## EditorInstance API

### 内容操作

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `getHTML()` | `string` | 获取编辑器 HTML 内容 |
| `getText()` | `string` | 获取编辑器纯文本内容 |
| `setHTML(html)` | `void` | 设置 HTML 内容 |
| `setJSON(json)` | `void` | 设置 ProseMirror JSON 文档 |
| `getJSON()` | `object` | 获取 ProseMirror JSON 文档 |
| `clear()` | `void` | 清空编辑器内容 |

### 状态查询

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `isEmpty()` | `boolean` | 编辑器是否为空 |
| `isFocused()` | `boolean` | 编辑器是否聚焦 |
| `isDisabled()` | `boolean` | 编辑器是否禁用 |

### 编辑器控制

| 方法 | 说明 |
|------|------|
| `focus()` | 聚焦编辑器 |
| `blur()` | 失焦编辑器 |
| `enable()` | 启用编辑器 |
| `disable()` | 禁用编辑器 |
| `setTheme(theme)` | 切换主题（`'light'` \| `'dark'`） |
| `getContainer()` | 获取容器 DOM 元素 |
| `destroy()` | 销毁编辑器实例 |

### 事件系统

| 方法 | 说明 |
|------|------|
| `on(event, handler)` | 监听事件 |
| `off(event, handler)` | 取消事件监听 |
| `once(event, handler)` | 单次事件监听 |
| `emit(event, ...args)` | 触发事件 |

**内置事件：**

| 事件 | 说明 |
|------|------|
| `change` | 编辑器内容变更 |
| `focus` | 编辑器聚焦 |
| `blur` | 编辑器失焦 |
| `ready` | 编辑器初始化完成 |
| `destroy` | 编辑器销毁 |
| `uploadError` | 粘贴 / 拖入上传失败，参数为 `(file, error)` |

## 粘贴与拖入上传

编辑器内容区支持直接**粘贴**或**拖入**文件自动上传：仅当剪贴板/拖放仅包含文件（无富文本）时接管，按文件类型路由到对应媒体的 `upload`（图片 / 视频 / 音频 / 附件）。上传失败时触发 `uploadError` 事件。

## MediaUploadConfig

| 字段 | 类型 | 说明 |
|------|------|------|
| `upload` | `(file: File, onProgress?: (progress: number) => void) => Promise<MediaItem>` | 文件上传函数 |
| `getList` | `(params: MediaListParams) => Promise<MediaListResult>` | 媒体列表分页查询 |

## ImageMediaUploadConfig

图片配置在通用媒体配置基础上增加图片专属选项：

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `upload` | 同 `MediaUploadConfig.upload` | — | 图片上传函数 |
| `getList` | 同 `MediaUploadConfig.getList` | — | 图片列表分页查询 |
| `resizable` | `boolean` | `true` | 是否开启图片拖拽缩放（四角手柄） |

## 图片能力

图片节点（`imageUpload`）具备业内主流的富文本操作能力：

- **三种插入方式**：点击工具栏媒体按钮弹出下拉，通过 **Tab 切换**「上传」（调 `upload`）、「网络地址」（直接粘贴 URL）、「媒体库」（调 `getList` 浏览并选择，未配置 `getList` 时隐藏该入口）；媒体库列表限高滚动并支持分页
- **拖拽缩放**：选中图片后拖动四角手柄调整尺寸（像素），也可通过选中浮层按 **百分比** 设置宽度；`resizable: false` 可关闭缩放
- **对齐方式**：选中图片后浮层可切换左对齐 / 居中 / 右对齐，渲染为 `data-align` 属性
- **选中浮层**：选中图片时在图片上方弹出操作浮层，提供对齐、宽度百分比、替代文本（alt）输入、删除、查看原图

## 视频能力

视频节点（`videoNode`）支持在选中浮层中设置以下属性，序列化到 `<video>` 标签：

| 属性 | 说明 |
|------|------|
| `data-align` | 对齐方式（左 / 中 / 右），渲染在 wrapper 上 |
| `poster` | 封面地址，浮层中输入框填写，空值清除 |
| `controls` | 是否显示原生控制器（默认开启） |
| `autoplay` | 是否自动播放（默认关闭） |

视频 / 音频 / 附件同样支持上传、网络地址、媒体库三种插入方式。

## MediaItem

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 媒体唯一标识 |
| `url` | `string` | 媒体资源地址 |
| `name` | `string` | 媒体显示名称 |
| `size` | `number` | 文件大小（字节） |
| `thumbnailUrl` | `string` | 缩略图地址（可选） |
| `duration` | `number` | 时长（音频/视频，可选） |
| `fileType` | `string` | 文件类型（可选） |

## MediaListParams

| 字段 | 类型 | 说明 |
|------|------|------|
| `page` | `number` | 页码（从 1 开始） |
| `pageSize` | `number` | 每页条数 |
| `keyword` | `string` | 搜索关键词 |

## MediaListResult

| 字段 | 类型 | 说明 |
|------|------|------|
| `items` | `MediaItem[]` | 媒体列表数据 |
| `total` | `number` | 总数 |

## 内置扩展

`createEditor` 内建 21 个 Tiptap 扩展，开箱即用：

| 扩展 | 能力 |
|------|------|
| StarterKit | 基础编辑能力（加粗、斜体、标题、列表等） |
| TextStyle | 文本样式基础 |
| Color | 文字前景色 |
| BackgroundColor | 文字背景高亮色 |
| FontSize | 字号 12px～48px |
| FontFamily | 字体选择 |
| LineHeight | 行高 1～3 |
| TextAlign | 文本对齐（左/中/右/两端） |
| Subscript / Superscript | 下标 / 上标 |
| Typography | 印刷符号智能替换 |
| TaskList / TaskItem | 任务列表 |
| Indent | 段落缩进 |
| TablePlus | 表格（可调整列宽） |
| Placeholder | 占位符提示 |
| BubbleMenu | 选中文字气泡菜单 |
| ImageMenu | 图片选中浮层（对齐/宽度/替代文本/删除/查看原图） |
| VideoMenu | 视频选中浮层（对齐/封面/控制器/自动播放/删除） |
| ImageUpload | 图片插入（上传/URL/媒体库）、拖拽缩放、对齐 |
| VideoNode | 视频插入（对齐/封面/控制器/自动播放） |
| AudioNode | 音频插入 |
| AttachmentNode | 附件插入 |
