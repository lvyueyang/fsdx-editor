import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  base: '/fsdx-editor/',
  site: 'https://fsdx.github.io/fsdx-editor/',
  integrations: [
    react(),
    starlight({
      title: 'FSDX Editor',
      description:
        '基于 Tiptap 的零框架依赖表格扩展套件，提供丰富的媒体编辑能力与可定制主题系统',
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/fsdx/fsdx-editor',
        },
      ],
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Editor',
          items: [
            { slug: 'editor' },
            { slug: 'editor/demo' },
            { slug: 'editor/vanilla-demo' },
            { slug: 'editor/api-reference' },
          ],
        },
        {
          label: 'Table Kit',
          items: [
            { slug: 'table-kit' },
            { slug: 'table-kit/demo' },
            { slug: 'table-kit/theme' },
            { slug: 'table-kit/i18n' },
            { slug: 'table-kit/api-reference' },
          ],
        },
      ],
    }),
  ],
});
