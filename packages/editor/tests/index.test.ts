import { expect, test } from '@rstest/core';
import { createEditor } from '../src/index';

test('createEditor 返回完整的编辑器 API', () => {
  const container = document.createElement('div');
  const editor = createEditor(container, {});

  expect(editor).toBeDefined();
  expect(typeof editor.isEmpty).toBe('function');
  expect(typeof editor.clear).toBe('function');
  expect(typeof editor.setHTML).toBe('function');
  expect(typeof editor.getHTML).toBe('function');
  expect(typeof editor.getText).toBe('function');
  expect(typeof editor.setJSON).toBe('function');
  expect(typeof editor.getJSON).toBe('function');
  expect(typeof editor.setTheme).toBe('function');
  expect(typeof editor.focus).toBe('function');
  expect(typeof editor.blur).toBe('function');
  expect(typeof editor.isFocused).toBe('function');
  expect(typeof editor.disable).toBe('function');
  expect(typeof editor.enable).toBe('function');
  expect(typeof editor.isDisabled).toBe('function');
  expect(typeof editor.getContainer).toBe('function');
  expect(typeof editor.destroy).toBe('function');
  expect(typeof editor.on).toBe('function');
  expect(typeof editor.off).toBe('function');
  expect(typeof editor.once).toBe('function');
  expect(typeof editor.emit).toBe('function');

  editor.destroy();
});

test('createEditor 支持初始内容', () => {
  const container = document.createElement('div');
  const editor = createEditor(container, {
    defaultContent: '<p>Hello World</p>',
  });

  expect(editor.isEmpty()).toBe(false);
  const html = editor.getHTML();
  expect(html).toContain('Hello World');

  editor.destroy();
});

test('createEditor 支持占位符', () => {
  const container = document.createElement('div');
  const editor = createEditor(container, {
    placeholder: '请输入…',
  });

  const contentEl = container.querySelector('.fsdx-editor-content');
  expect(contentEl).toBeDefined();

  const isEmpty = editor.isEmpty();
  expect(isEmpty).toBe(true);

  editor.destroy();
});

test('createEditor 支持暗色主题切换', () => {
  const container = document.createElement('div');
  const editor = createEditor(container, {
    defaultTheme: 'dark',
  });

  expect(container.classList.contains('fsdx-editor-dark')).toBe(true);

  editor.setTheme('light');
  expect(container.classList.contains('fsdx-editor-dark')).toBe(false);

  editor.setTheme('dark');
  expect(container.classList.contains('fsdx-editor-dark')).toBe(true);

  editor.destroy();
});

test('createEditor destroy 清理 DOM', () => {
  const container = document.createElement('div');
  const editor = createEditor(container, {});

  expect(container.classList.contains('fsdx-editor')).toBe(true);
  editor.destroy();
  expect(container.classList.contains('fsdx-editor')).toBe(false);
});

test('createEditor 事件系统', () => {
  const container = document.createElement('div');
  const editor = createEditor(container, {});

  let called = false;
  editor.on('test', () => {
    called = true;
  });
  editor.emit('test');
  expect(called).toBe(true);

  editor.destroy();
});

test('createEditor 支持只读模式', () => {
  const container = document.createElement('div');
  const editor = createEditor(container, {
    readOnly: true,
  });

  expect(editor.isDisabled()).toBe(true);

  editor.destroy();
});
