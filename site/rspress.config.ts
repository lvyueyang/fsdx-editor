import { defineConfig } from '@rspress/core';
import { pluginPreview } from '@rspress/plugin-preview';

export default defineConfig({
  root: 'docs',
  base: '/fsdx-editor/',
  title: 'FSDX Editor',
  description:
    '基于 Tiptap 的零框架依赖表格扩展套件，提供丰富的媒体编辑能力与可定制主题系统',
  lang: 'zh',
  plugins: [pluginPreview({ defaultPreviewMode: 'iframe-follow' })],
  themeConfig: {
    darkMode: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/fsdx/fsdx-editor',
      },
    ],
  },
  markdown: {
    checkDeadLinks: true,
  },
});
