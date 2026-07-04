/**
 * Demo 源码预加载模块
 * 通过 import.meta.glob 在构建时预加载所有 demo 组件源码，支持按 slug 获取
 */

const sources = import.meta.glob('./demos/*.tsx', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

export function getDemoSource(slug: string): string | undefined {
  for (const [path, content] of Object.entries(sources)) {
    const filename = path.split('/').pop()?.replace('.tsx', '');
    if (filename === slug) {
      return content;
    }
  }
  return undefined;
}
