---
title: API 参考
description: FSDX Editor 完整 API 类型定义与说明
---

# API 参考

`<Editor />` 组件的完整 Props 说明，以及相关类型定义。

## EditorProps

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | `string` | — | 编辑器的初始或受控 HTML 内容 |
| onChange | `(html: string) => void` | — | 编辑器内容变更回调，返回当前 HTML 字符串 |
| options | `EditorOptions` | `{}` | 编辑器功能配置，覆盖媒体上传、列表查询等可选能力 |
| theme | `EditorTheme` | `'auto'` | 编辑器视觉主题，可选 `'light'` \| `'dark'` \| `'auto'` |
| className | `string` | `undefined` | 编辑器根元素的额外 CSS 类名 |
| placeholder | `string` | `undefined` | 编辑器为空时显示的占位文字 |

## EditorOptions

| 字段 | 类型 | 说明 |
|------|------|------|
| image | `MediaUploadConfig` | 图片上传与列表配置 |
| video | `MediaUploadConfig` | 视频上传与列表配置 |
| audio | `MediaUploadConfig` | 音频上传与列表配置 |
| attachment | `MediaUploadConfig` | 附件上传与列表配置 |

## MediaUploadConfig

| 字段 | 类型 | 说明 |
|------|------|------|
| upload | `(file: File, onProgress?: UploadProgressCallback) => Promise<MediaItem>` | 文件上传函数，支持进度回调 |
| getList | `(params: MediaListParams) => Promise<MediaListResult>` | 媒体列表分页查询函数 |

## MediaItem

| 字段 | 类型 | 说明 |
|------|------|------|
| id | `string` | 媒体唯一标识 |
| url | `string` | 媒体资源地址 |
| name | `string` | 媒体显示名称 |
| size | `number` | 文件大小（字节） |
| thumbnailUrl | `string` | 缩略图地址（可选） |
