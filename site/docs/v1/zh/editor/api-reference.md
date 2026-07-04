---
title: API 参考
description: FSDX Editor createEditor 完整 API 类型定义与说明
---

# API 参考

`createEditor()` 的完整参数、返回值与相关类型定义。

## createEditor

```ts
import { createEditor } from '@fsdx/editor'

const editor = createEditor(container: HTMLElement, options: FsdxEditorOptions)
```

在指定 DOM 容器中创建编辑器实例，返回一个包含 API 方法和事件系统的 `EditorInstance` 对象。

## FsdxEditorOptions

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `defaultContent` | `string` | `''` | 编辑器初始 HTML 内容 |
| `defaultTheme` | `'light' \| 'dark'` | `'light'` | 编辑器默认主题 |
| `placeholder` | `string` | — | 编辑器为空时显示的占位文字 |
| `readOnly` | `boolean` | `false` | 是否只读 |
| `autoFocus` | `boolean` | `false` | 是否自动聚焦 |
| `image` | `MediaUploadConfig` | — | 图片上传与列表配置 |
| `video` | `MediaUploadConfig` | — | 视频上传与列表配置 |
| `audio` | `MediaUploadConfig` | — | 音频上传与列表配置 |
| `attachment` | `MediaUploadConfig` | — | 附件上传与列表配置 |
| `onChange` | `EventCallback` | — | 内容变更回调 |
| `onFocus` | `EventCallback` | — | 编辑器聚焦回调 |
| `onBlur` | `EventCallback` | — | 编辑器失焦回调 |

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

## MediaUploadConfig

| 字段 | 类型 | 说明 |
|------|------|------|
| `upload` | `(file: File, onProgress?: (progress: number) => void) => Promise<MediaItem>` | 文件上传函数 |
| `getList` | `(params: MediaListParams) => Promise<MediaListResult>` | 媒体列表分页查询 |

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

`createEditor` 内建 20 个 Tiptap 扩展，开箱即用：

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
| TableKit | 表格（可调整列宽） |
| Placeholder | 占位符提示 |
| BubbleMenu | 选中文字气泡菜单 |
| ImageUpload | 图片上传与插入 |
| VideoNode | 视频插入 |
| AudioNode | 音频插入 |
| AttachmentNode | 附件插入 |
