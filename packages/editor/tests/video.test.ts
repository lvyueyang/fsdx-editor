import { expect, test } from '@rstest/core';
import { createEditorInstance } from '../src/core/create-editor';

const VIDEO_URL = 'https://example.com/a.mp4';
const wait = () => new Promise((resolve) => setTimeout(resolve, 20));

type RawEditor = ReturnType<typeof createEditorInstance>['editor'];

/** 插入一个视频并返回其在文档中的位置 */
function insertVideo(editor: RawEditor): number {
  editor.commands.setContent('<p></p>');
  editor.commands.insertContent({
    type: 'videoNode',
    attrs: { src: VIDEO_URL },
  });
  let pos = -1;
  editor.state.doc.descendants((node, p) => {
    if (node.type.name === 'videoNode') {
      pos = p;
      return false;
    }
    return true;
  });
  return pos;
}

test('视频默认显示控制器，不显示自动播放', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    video: { upload: async () => ({ url: VIDEO_URL }) },
  });

  insertVideo(editor);
  const html = editor.getHTML();
  expect(html).toContain('controls');
  expect(html).not.toContain('autoplay');

  editor.destroy();
});

test('视频对齐/封面/控制器/自动播放属性可解析与序列化', () => {
  const container = document.createElement('div');
  const { editor } = createEditorInstance(container, {
    video: { upload: async () => ({ url: VIDEO_URL }) },
  });

  editor.commands.setContent(
    `<div class="fsdx-editor-video-wrapper" data-align="right"><video src="${VIDEO_URL}" poster="https://example.com/p.jpg" controls autoplay></video></div>`,
  );
  let attrs: Record<string, unknown> | null = null;
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'videoNode') {
      attrs = node.attrs as Record<string, unknown>;
      return false;
    }
    return true;
  });
  expect(attrs?.align).toBe('right');
  expect(attrs?.poster).toBe('https://example.com/p.jpg');
  expect(attrs?.controls).toBe(true);
  expect(attrs?.autoplay).toBe(true);

  const html = editor.getHTML();
  expect(html).toContain('data-align="right"');
  expect(html).toContain('poster="https://example.com/p.jpg"');
  expect(html).toContain('controls');
  expect(html).toContain('autoplay');

  editor.destroy();
});

test('选中视频时显示视频选中浮层', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    video: { upload: async () => ({ url: VIDEO_URL }) },
  });
  await wait();

  const pos = insertVideo(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.fsdx-editor-video-menu');
  expect(menu).not.toBeNull();
  expect(menu?.isConnected).toBe(true);
  expect(menu?.querySelector('button[aria-label="左对齐"]')).not.toBeNull();
  expect(menu?.querySelector('button[aria-label="居中"]')).not.toBeNull();
  expect(menu?.querySelector('button[aria-label="右对齐"]')).not.toBeNull();
  expect(menu?.querySelector('button[aria-label="显示控制器"]')).not.toBeNull();
  expect(menu?.querySelector('button[aria-label="自动播放"]')).not.toBeNull();
  expect(menu?.querySelector('button[aria-label="删除视频"]')).not.toBeNull();
  expect(
    menu?.querySelector('input[aria-label="设置封面地址"]'),
  ).not.toBeNull();

  editor.destroy();
});

test('视频选中浮层对齐按钮更新对齐方式', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    video: { upload: async () => ({ url: VIDEO_URL }) },
  });
  await wait();

  const pos = insertVideo(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.fsdx-editor-video-menu');
  menu
    ?.querySelector<HTMLButtonElement>('button[aria-label="右对齐"]')
    ?.click();

  expect(editor.getHTML()).toContain('data-align="right"');

  editor.destroy();
});

test('视频选中浮层封面输入框设置封面地址', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    video: { upload: async () => ({ url: VIDEO_URL }) },
  });
  await wait();

  const pos = insertVideo(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.fsdx-editor-video-menu');
  const input = menu?.querySelector<HTMLInputElement>(
    'input[aria-label="设置封面地址"]',
  );
  expect(input).not.toBeNull();
  input!.value = 'https://example.com/poster.jpg';
  input!.dispatchEvent(new Event('change'));

  expect(editor.getHTML()).toContain('poster="https://example.com/poster.jpg"');

  // 清空封面
  input!.value = '';
  input!.dispatchEvent(new Event('change'));
  expect(editor.getHTML()).not.toContain('poster=');

  editor.destroy();
});

test('视频选中浮层控制器按钮切换 controls 属性', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    video: { upload: async () => ({ url: VIDEO_URL }) },
  });
  await wait();

  const pos = insertVideo(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.fsdx-editor-video-menu');
  const controlsBtn = menu?.querySelector<HTMLButtonElement>(
    'button[aria-label="显示控制器"]',
  );
  controlsBtn?.click();
  expect(editor.getHTML()).not.toContain('controls');

  controlsBtn?.click();
  expect(editor.getHTML()).toContain('controls');

  editor.destroy();
});

test('视频选中浮层自动播放按钮切换 autoplay 属性', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    video: { upload: async () => ({ url: VIDEO_URL }) },
  });
  await wait();

  const pos = insertVideo(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.fsdx-editor-video-menu');
  const autoplayBtn = menu?.querySelector<HTMLButtonElement>(
    'button[aria-label="自动播放"]',
  );
  autoplayBtn?.click();
  expect(editor.getHTML()).toContain('autoplay');

  autoplayBtn?.click();
  expect(editor.getHTML()).not.toContain('autoplay');

  editor.destroy();
});

test('切换控制器/自动播放/封面/对齐时复用同一 video 元素，不重建 DOM', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    video: { upload: async () => ({ url: VIDEO_URL }) },
  });

  insertVideo(editor);
  const videoEl = editor.view.dom.querySelector('video');
  expect(videoEl).not.toBeNull();

  editor.commands.updateAttributes('videoNode', { controls: false });
  editor.commands.updateAttributes('videoNode', { autoplay: true });
  editor.commands.updateAttributes('videoNode', {
    poster: 'https://example.com/p.jpg',
  });
  editor.commands.updateAttributes('videoNode', { align: 'left' });

  expect(editor.view.dom.querySelector('video')).toBe(videoEl);
  const video = videoEl as HTMLVideoElement;
  expect(video.controls).toBe(false);
  expect(video.autoplay).toBe(true);
  expect(video.poster).toBe('https://example.com/p.jpg');

  const wrapper = video.parentElement;
  expect(wrapper?.dataset.align).toBe('left');

  editor.destroy();
});

test('视频选中浮层封面输入框按 Enter 提交', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    video: { upload: async () => ({ url: VIDEO_URL }) },
  });
  await wait();

  const pos = insertVideo(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.fsdx-editor-video-menu');
  const input = menu?.querySelector<HTMLInputElement>(
    'input[aria-label="设置封面地址"]',
  );
  input!.value = 'https://example.com/poster.jpg';
  input!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
  );

  expect(editor.getHTML()).toContain('poster="https://example.com/poster.jpg"');

  editor.destroy();
});

test('视频选中浮层封面输入框按 Escape 取消编辑不提交', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    video: { upload: async () => ({ url: VIDEO_URL }) },
  });
  await wait();

  const pos = insertVideo(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.fsdx-editor-video-menu');
  const input = menu?.querySelector<HTMLInputElement>(
    'input[aria-label="设置封面地址"]',
  );
  input!.value = 'https://example.com/poster.jpg';
  input!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
  );

  expect(editor.getHTML()).not.toContain('poster=');

  editor.destroy();
});

test('切换选中的视频时封面输入框同步显示对应值', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    video: { upload: async () => ({ url: VIDEO_URL }) },
  });
  await wait();

  editor.commands.setContent(
    `<div class="fsdx-editor-video-wrapper"><video src="${VIDEO_URL}" poster="https://example.com/p1.jpg" controls></video></div>` +
      `<div class="fsdx-editor-video-wrapper"><video src="https://example.com/b.mp4" poster="https://example.com/p2.jpg" controls></video></div>`,
  );
  const findPos = (src: string): number => {
    let found = -1;
    editor.state.doc.descendants((node, p) => {
      if (node.type.name === 'videoNode' && node.attrs.src === src) {
        found = p;
        return false;
      }
      return true;
    });
    return found;
  };

  const pos1 = findPos(VIDEO_URL);
  const pos2 = findPos('https://example.com/b.mp4');
  expect(pos1).toBeGreaterThanOrEqual(0);
  expect(pos2).toBeGreaterThanOrEqual(0);

  editor.commands.setNodeSelection(pos1);
  await new Promise((resolve) => setTimeout(resolve, 350));
  const menu = container.querySelector<HTMLElement>('.fsdx-editor-video-menu');
  const input = menu?.querySelector<HTMLInputElement>(
    'input[aria-label="设置封面地址"]',
  );
  expect(input?.value).toBe('https://example.com/p1.jpg');

  editor.commands.setNodeSelection(pos2);
  await new Promise((resolve) => setTimeout(resolve, 350));
  expect(input?.value).toBe('https://example.com/p2.jpg');

  editor.destroy();
});

test('视频选中浮层删除按钮删除视频', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    video: { upload: async () => ({ url: VIDEO_URL }) },
  });
  await wait();

  const pos = insertVideo(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.fsdx-editor-video-menu');
  menu
    ?.querySelector<HTMLButtonElement>('button[aria-label="删除视频"]')
    ?.click();

  expect(editor.getHTML()).not.toContain('a.mp4');

  editor.destroy();
});
