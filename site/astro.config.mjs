import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  base: '/fsdx-editor/',
  site: 'https://lvyueyang.github.io/fsdx-editor/',
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
          href: 'https://github.com/lvyueyang/fsdx-editor',
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
          label: 'Table Plus',
          items: [{ slug: 'table-plus' }, { slug: 'table-plus/api-reference' }],
        },
      ],
    }),
  ],
});
