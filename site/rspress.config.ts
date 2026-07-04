import { defineConfig } from '@rspress/core';
import { pluginPreview } from '@rspress/plugin-preview';

export default defineConfig({
  root: 'docs',
  base: '/fsdx-editor/',
  lang: 'zh',
  title: 'FSDX Editor',
  description:
    '基于 Tiptap 的零框架依赖表格扩展套件，提供丰富的媒体编辑能力与可定制主题系统',
  locales: [
    {
      lang: 'zh',
      label: '简体中文',
      title: 'FSDX Editor',
      description:
        '基于 Tiptap 的零框架依赖表格扩展套件，提供丰富的媒体编辑能力与可定制主题系统',
    },
  ],
  multiVersion: {
    default: 'v1',
    versions: ['v1'],
  },
  plugins: [
    pluginPreview({
      defaultPreviewMode: 'iframe-follow',
      iframeOptions: {
        builderConfig: {
          source: {
            preEntry: ['./preview.css'],
          },
        },
      },
    }),
  ],
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
