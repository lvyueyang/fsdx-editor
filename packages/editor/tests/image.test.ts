import { expect, test } from '@rstest/core';
import { createEditorInstance } from '../src/core/create-editor';
import { createEditor } from '../src/index';

const IMAGE_URL = 'https://example.com/a.png';
const wait = () => new Promise((resolve) => setTimeout(resolve, 20));

type RawEditor = ReturnType<typeof createEditorInstance>['editor'];

/** 插入一张图片并返回其在文档中的位置 */
function insertImage(editor: RawEditor): number {
  editor.commands.setContent('<p></p>');
  editor.commands.insertContent({
    type: 'imageUpload',
    attrs: { src: IMAGE_URL },
  });
  let pos = -1;
  editor.state.doc.descendants((node, p) => {
    if (node.type.name === 'imageUpload') {
      pos = p;
      return false;
    }
    return true;
  });
  return pos;
}

test('图片默认不写 data-align，保存时保持既有 HTML 不变', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });

  insertImage(editor);
  // 默认对齐为居中但不落地到 HTML，避免改写既有内容
  expect(editor.getHTML()).not.toContain('data-align');

  editor.destroy();
});

test('setImageAlign 命令更新选中图片的对齐方式', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });

  const pos = insertImage(editor);
  expect(pos).toBeGreaterThanOrEqual(0);
  editor.commands.setNodeSelection(pos);
  editor.commands.setImageAlign('left');
  expect(editor.getHTML()).toContain('data-align="left"');

  editor.commands.setImageAlign('right');
  expect(editor.getHTML()).toContain('data-align="right"');

  editor.destroy();
});

test('图片缩放默认开启，渲染拖拽容器', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });

  insertImage(editor);
  expect(
    editor.view.dom.querySelector('[data-resize-container]'),
  ).not.toBeNull();
  expect(editor.view.dom.querySelector('[data-resize-handle]')).not.toBeNull();

  editor.destroy();
});

test('配置 resizable:false 时关闭图片缩放', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }), resizable: false },
  });

  insertImage(editor);
  expect(editor.view.dom.querySelector('[data-resize-container]')).toBeNull();

  editor.destroy();
});

test('选中图片时显示图片选中浮层（含对齐与删除按钮）', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });
  await wait();

  const pos = insertImage(editor);
  editor.commands.setNodeSelection(pos);

  // BubbleMenu 默认 250ms 防抖后定位显示
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.easyx-editor-image-menu');
  expect(menu).not.toBeNull();
  expect(menu?.isConnected).toBe(true);
  expect(menu?.querySelector('button[aria-label="删除图片"]')).not.toBeNull();
  expect(menu?.querySelector('button[aria-label="左对齐"]')).not.toBeNull();

  editor.destroy();
});

test('图片选中浮层删除按钮删除图片', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });
  await wait();

  const pos = insertImage(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.easyx-editor-image-menu');
  const deleteBtn = menu?.querySelector<HTMLButtonElement>(
    'button[aria-label="删除图片"]',
  );
  deleteBtn?.click();

  expect(editor.getHTML()).not.toContain('a.png');

  editor.destroy();
});

test('图片选中浮层对齐按钮更新对齐方式', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });
  await wait();

  const pos = insertImage(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.easyx-editor-image-menu');
  const leftBtn = menu?.querySelector<HTMLButtonElement>(
    'button[aria-label="左对齐"]',
  );
  leftBtn?.click();

  expect(editor.getHTML()).toContain('data-align="left"');

  editor.destroy();
});

test('图片宽度支持百分比：渲染为 style 并可从 HTML 解析', () => {
  const container = document.createElement('div');
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });

  const pos = insertImage(editor);
  editor.commands.setNodeSelection(pos);
  editor.commands.updateAttributes('imageUpload', {
    width: '50%',
    height: null,
  });
  expect(editor.getHTML()).toContain('width: 50%');

  // 从 HTML 反向解析百分比宽度
  editor.commands.setContent(
    `<p><img src="${IMAGE_URL}" style="width: 75%"></p>`,
  );
  let width: unknown;
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'imageUpload') {
      width = node.attrs.width;
      return false;
    }
    return true;
  });
  expect(width).toBe('75%');

  editor.destroy();
});

test('图片宽度支持像素：渲染为 width 属性', () => {
  const container = document.createElement('div');
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });

  const pos = insertImage(editor);
  editor.commands.setNodeSelection(pos);
  editor.commands.updateAttributes('imageUpload', { width: 300, height: 200 });
  expect(editor.getHTML()).toContain('width="300"');

  editor.destroy();
});

test('图片选中浮层包含宽度百分比选择器', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });
  await wait();

  const pos = insertImage(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.easyx-editor-image-menu');
  expect(
    menu?.querySelector<HTMLElement>('.easyx-editor-bubble-select'),
  ).not.toBeNull();

  editor.destroy();
});

test('图片选中浮层宽度选择器显示像素宽度', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });
  await wait();

  editor.commands.setContent(
    `<p><img src="${IMAGE_URL}" style="width: 300px"></p>`,
  );
  let pos = -1;
  editor.state.doc.descendants((node, p) => {
    if (node.type.name === 'imageUpload') {
      pos = p;
      return false;
    }
    return true;
  });
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.easyx-editor-image-menu');
  const valueEl = menu?.querySelector<HTMLElement>(
    '.easyx-editor-bubble-select-value',
  );
  expect(valueEl?.textContent).toBe('300px');

  editor.destroy();
});

test('图片选中浮层不包含替换按钮', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });
  await wait();

  const pos = insertImage(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.easyx-editor-image-menu');
  expect(menu?.querySelector('button[aria-label="替换图片"]')).toBeNull();

  editor.destroy();
});

test('图片选中浮层输入框可设置 alt', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });
  await wait();

  const pos = insertImage(editor);
  editor.commands.setNodeSelection(pos);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const menu = container.querySelector<HTMLElement>('.easyx-editor-image-menu');
  const input = menu?.querySelector<HTMLInputElement>(
    'input[aria-label="设置替代文本"]',
  );
  expect(input).not.toBeNull();
  input!.value = '一张示例图片';
  input!.dispatchEvent(new Event('change'));

  expect(editor.getHTML()).toContain('alt="一张示例图片"');

  // 清空 alt
  input!.value = '';
  input!.dispatchEvent(new Event('change'));
  expect(editor.getHTML()).not.toContain('alt=');

  editor.destroy();
});

test('createEditor 通过 URL 配置的图片按钮可打开媒体下拉', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const editor = createEditor(container, {
    image: { upload: async () => ({ url: IMAGE_URL }) },
  });
  await wait();

  const toolbar = container.querySelector('.easyx-editor-toolbar');
  const imageBtn = Array.from(
    toolbar?.querySelectorAll<HTMLButtonElement>('.easyx-editor-toolbar-btn') ??
      [],
  ).find((b) => b.dataset.tooltip === '插入图片');

  expect(imageBtn).toBeDefined();
  imageBtn?.click();
  expect(
    container.querySelector('.easyx-editor-media-dropdown'),
  ).not.toBeNull();

  editor.destroy();
});
