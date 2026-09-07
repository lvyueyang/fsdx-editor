# @easyx/editor

零框架依赖的 Tiptap 富文本编辑器工具包，提供开箱即用的工具栏、气泡菜单、媒体上传、表格增强与主题体系，不依赖 React / Vue 等任何 UI 框架。

## 特性

- **零框架依赖**：工具栏、气泡菜单、媒体浮层均以纯 DOM 构建，可接入任意技术栈
- **开箱即用**：内置文本样式、对齐缩进、上下标、任务列表、分割线等常用能力
- **表格增强**：集成 [`@easyx/tiptap-table-plus`](https://www.npmjs.com/package/@easyx/tiptap-table-plus)，支持单元格样式、选区覆盖层、上下文菜单、块级背景色
- **媒体支持**：图片（对齐 / 拖拽缩放 / 替代文本）、视频（对齐 / 封面 / 控制器 / 自动播放）、音频、附件
- **粘贴 / 拖拽上传**：按文件类型自动路由到对应媒体的 `upload` 回调
- **高度模式**：定高、最大高度、右下角拖拽调高
- **亮 / 暗主题**：通过 CSS 变量控制，可被外部覆盖

## 安装

```bash
pnpm add @easyx/editor
```

样式已内联进 JS 产物，**无需单独引入 CSS**。

## 快速上手

```ts
import { createEditor } from '@easyx/editor'

const container = document.querySelector<HTMLElement>('#editor')!

const editor = createEditor(container, {
  placeholder: '请输入…',
  defaultTheme: 'light',
  height: 320,
  minHeight: 200,
  maxHeight: 480,
  resizable: true,
  image: {
    upload: async (file) => ({
      id: '1',
      url: URL.createObjectURL(file),
      name: file.name,
    }),
  },
  onChange: (html) => console.log(html),
})
```

## 配置

`createEditor(container, options)` 的第二个参数为 `EasyxEditorOptions`：

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `placeholder` | `string` | `'输入内容…'` | 空内容占位符 |
| `readOnly` | `boolean` | `false` | 只读模式 |
| `autoFocus` | `boolean` | `false` | 创建后自动聚焦 |
| `defaultContent` | `string` | — | 初始内容（HTML） |
| `defaultTheme` | `'light' \| 'dark'` | `'light'` | 初始主题 |
| `image` | `ImageMediaUploadConfig` | — | 图片上传 / 缩放配置 |
| `video` | `MediaUploadConfig` | — | 视频上传 / 媒体库配置 |
| `audio` | `MediaUploadConfig` | — | 音频上传 / 媒体库配置 |
| `attachment` | `MediaUploadConfig` | — | 附件上传 / 媒体库配置 |
| `minHeight` | `number \| string` | — | 最小高度（number 视为 px） |
| `height` | `number \| 'auto' \| string` | `'auto'` | 定高并内部滚动；`'auto'` 随内容伸缩 |
| `maxHeight` | `number \| string` | — | 最大高度，内容撑到上限后内部滚动 |
| `resizable` | `boolean` | `false` | 右下角拖拽手柄调高 |
| `onChange` | `(html: string) => void` | — | 内容变更回调 |
| `onReady` | `() => void` | — | 初始化完成回调 |
| `onFocus` | `() => void` | — | 聚焦回调 |
| `onBlur` | `() => void` | — | 失焦回调 |
| `onDestroy` | `() => void` | — | 销毁回调 |

## 实例方法

`createEditor` 返回一个编辑器实例：

| 方法 | 说明 |
|------|------|
| `isEmpty()` | 编辑器是否为空 |
| `getHTML()` / `setHTML(html)` | 读写 HTML 内容 |
| `getJSON()` / `setJSON(json)` | 读写 JSON 内容 |
| `getText()` | 获取纯文本 |
| `clear()` | 清空内容 |
| `setTheme('light' \| 'dark')` | 切换主题（同步表格组件主题） |
| `focus()` / `blur()` / `isFocused()` | 焦点管理 |
| `disable()` / `enable()` / `isDisabled()` | 禁用 / 启用编辑器 |
| `getContainer()` | 获取挂载 DOM 元素 |
| `destroy()` | 销毁编辑器，清理 DOM 与事件监听 |
| `on(event, handler)` / `off(event, handler)` | 事件监听 |
| `once(event, handler)` | 一次性事件监听 |
| `emit(event, ...args)` | 触发自定义事件 |

各内容读写方法均以 `ContentType = string` / JSON 作为输入输出。

## 事件

| 事件 | 触发时机 | 参数 |
|------|----------|------|
| `ready` | 编辑器初始化完成 | 无 |
| `change` | 内容变更 | `html: string` |
| `focus` | 获得焦点 | 无 |
| `blur` | 失去焦点 | 无 |
| `destroy` | 销毁 | 无 |
| `uploadError` | 粘贴 / 拖入上传失败 | `file: File, error: unknown` |

```ts
editor.on('change', (html) => console.log(html))
editor.on('uploadError', (file, error) => console.error(file.name, error))
```

## 媒体上传配置

`image` / `video` / `audio` / `attachment` 均接受 `MediaUploadConfig`：

```ts
interface MediaUploadConfig {
  /** 上传单个文件，返回媒体项 */
  upload: (
    file: File,
    onProgress?: (progress: number) => void,
  ) => Promise<MediaItem>
  /** 媒体库分页列表（可选），提供后媒体下拉会出现「媒体库」Tab */
  getList?: (params: MediaListParams) => Promise<MediaListResult>
}

interface MediaItem {
  id: string
  url: string
  name: string
  size?: number
  thumbnailUrl?: string
  duration?: number
  fileType?: string
}
```

`image` 额外支持 `resizable`（默认 `true`），关闭后图片不做拖拽缩放：

```ts
image: {
  resizable: false, // 关闭图片拖拽缩放
  upload: async (file) => ({ id: '1', url: '...', name: file.name }),
}
```

## 主题

通过 `setTheme()` 在运行时切换亮 / 暗主题，编辑器自动在容器上添加 / 移除 `easyx-editor-dark` 类，并同步表格组件主题。所有颜色均由 CSS 变量控制，可在外部覆盖。

```ts
editor.setTheme('dark')
```

## 许可

MIT
