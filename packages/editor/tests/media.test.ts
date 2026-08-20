import { expect, test } from '@rstest/core';
import { createEditorInstance } from '../src/core/create-editor';
import { createEditor } from '../src/index';

const waitReady = () => new Promise((resolve) => setTimeout(resolve, 30));
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function openDropdown(container: HTMLElement, tooltip: string) {
  const toolbar = container.querySelector('.easyx-editor-toolbar');
  const btn = Array.from(
    toolbar?.querySelectorAll<HTMLButtonElement>('.easyx-editor-toolbar-btn') ??
      [],
  ).find((b) => b.dataset.tooltip === tooltip);
  btn?.click();
  return container.querySelector('.easyx-editor-media-dropdown');
}

test('媒体下拉：Tab 切换上传/网络地址/媒体库', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const editor = createEditor(container, {
    image: {
      upload: async () => ({ url: 'u' }),
      getList: async () => ({ items: [], total: 0 }),
    },
  });
  await waitReady();

  const dropdown = openDropdown(container, '插入图片');
  const tabs = dropdown?.querySelectorAll('.easyx-editor-media-dropdown-tab');
  expect(tabs?.length).toBe(3);

  const visiblePanel = () =>
    Array.from(
      dropdown?.querySelectorAll('.easyx-editor-media-dropdown-panel') ?? [],
    ).find((p) => !(p as HTMLElement).hidden);

  // 默认激活上传
  expect(
    visiblePanel()?.querySelector('.easyx-editor-media-dropdown-upload-btn'),
  ).not.toBeNull();

  // 切换到网络地址
  const urlTab = dropdown?.querySelector<HTMLButtonElement>(
    '.easyx-editor-media-dropdown-tab[data-tab="url"]',
  );
  urlTab?.click();
  expect(
    visiblePanel()?.querySelector('.easyx-editor-media-dropdown-url-input'),
  ).not.toBeNull();

  // 切换到媒体库
  const libTab = dropdown?.querySelector<HTMLButtonElement>(
    '.easyx-editor-media-dropdown-tab[data-tab="library"]',
  );
  libTab?.click();
  expect(
    visiblePanel()?.querySelector('.easyx-editor-media-dropdown-grid'),
  ).not.toBeNull();

  editor.destroy();
});

test('媒体下拉：URL 方式插入图片', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const editor = createEditor(container, {
    image: { upload: async () => ({ url: 'u' }) },
  });
  await waitReady();

  const dropdown = openDropdown(container, '插入图片');
  expect(dropdown).not.toBeNull();

  const input = dropdown?.querySelector<HTMLInputElement>(
    '.easyx-editor-media-dropdown-url-input',
  );
  input!.value = 'https://example.com/remote.png';
  input!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
  );

  expect(editor.getHTML()).toContain('https://example.com/remote.png');
  editor.destroy();
});

test('媒体下拉：未配置 getList 时不渲染媒体库', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const editor = createEditor(container, {
    image: { upload: async () => ({ url: 'u' }) },
  });
  await waitReady();

  const dropdown = openDropdown(container, '插入图片');
  expect(
    dropdown?.querySelector('.easyx-editor-media-dropdown-search-row'),
  ).toBe(null);
  expect(dropdown?.querySelector('.easyx-editor-media-dropdown-grid')).toBe(
    null,
  );

  editor.destroy();
});

test('媒体下拉：媒体库网格渲染并点击插入（切到媒体库 Tab 才加载）', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const items = [
    { id: '1', url: 'https://example.com/1.png', name: '图一', size: 1024 },
    { id: '2', url: 'https://example.com/2.png', name: '图二' },
  ];
  const editor = createEditor(container, {
    image: {
      upload: async () => ({ url: 'u' }),
      getList: async () => ({ items, total: 2 }),
    },
  });
  await waitReady();

  const dropdown = openDropdown(container, '插入图片');
  // 默认在「上传」Tab，媒体库尚未加载
  expect(
    dropdown?.querySelectorAll('.easyx-editor-media-dropdown-item'),
  ).toHaveLength(0);

  dropdown
    ?.querySelector<HTMLButtonElement>(
      '.easyx-editor-media-dropdown-tab[data-tab="library"]',
    )
    ?.click();
  await flush();

  const cards = dropdown?.querySelectorAll('.easyx-editor-media-dropdown-item');
  expect(cards?.length).toBe(2);

  (cards?.[0] as HTMLButtonElement).click();
  expect(editor.getHTML()).toContain('1.png');

  editor.destroy();
});

test('媒体下拉：媒体库分页', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const calls: { page: number; pageSize: number }[] = [];
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: String(i),
    url: `https://example.com/${i}.png`,
    name: `图${i}`,
  }));
  const editor = createEditor(container, {
    image: {
      upload: async () => ({ url: 'u' }),
      getList: async ({ page, pageSize }) => {
        calls.push({ page, pageSize });
        return {
          items: page === 1 ? items : items.slice(0, 3),
          total: 15,
        };
      },
    },
  });
  await waitReady();

  const dropdown = openDropdown(container, '插入图片');
  // 未切到媒体库 Tab 前不应发起 getList
  expect(calls).toHaveLength(0);

  dropdown
    ?.querySelector<HTMLButtonElement>(
      '.easyx-editor-media-dropdown-tab[data-tab="library"]',
    )
    ?.click();
  await flush();
  expect(calls).toHaveLength(1);
  expect(calls[0]).toEqual({ page: 1, pageSize: 12 });
  expect(
    dropdown?.querySelectorAll('.easyx-editor-media-dropdown-item'),
  ).toHaveLength(12);

  const nextBtn = dropdown?.querySelector<HTMLButtonElement>(
    '.easyx-editor-media-dropdown-page-btn:last-child',
  );
  nextBtn?.click();
  await flush();
  expect(calls).toHaveLength(2);
  expect(calls[1].page).toBe(2);
  expect(
    dropdown?.querySelectorAll('.easyx-editor-media-dropdown-item'),
  ).toHaveLength(3);

  editor.destroy();
});

test('媒体下拉：URL 插入过滤非白名单协议', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const editor = createEditor(container, {
    image: { upload: async () => ({ url: 'u' }) },
  });
  await waitReady();

  const dropdown = openDropdown(container, '插入图片');
  const input = dropdown?.querySelector<HTMLInputElement>(
    '.easyx-editor-media-dropdown-url-input',
  );
  input!.value = 'javascript:alert(1)';
  input!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
  );
  expect(editor.getHTML()).not.toContain('javascript:');

  editor.destroy();
});

test('媒体下拉：上传方式触发 upload 并插入', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let uploaded = false;
  const editor = createEditor(container, {
    image: {
      upload: async (file) => {
        uploaded = true;
        return { url: `https://example.com/${file.name}` };
      },
    },
  });
  await waitReady();

  const dropdown = openDropdown(container, '插入图片');
  const fileInput =
    dropdown?.querySelector<HTMLInputElement>('input[type="file"]');
  expect(fileInput?.accept).toBe('image/*');

  const file = new File(['data'], 'photo.png', { type: 'image/png' });
  Object.defineProperty(fileInput, 'files', {
    value: [file],
    configurable: true,
  });
  fileInput!.dispatchEvent(new Event('change'));
  await flush();

  expect(uploaded).toBe(true);
  expect(editor.getHTML()).toContain('photo.png');

  editor.destroy();
});

test('媒体下拉：上传 Tab 支持拖拽上传', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let uploaded = false;
  const editor = createEditor(container, {
    image: {
      upload: async (file) => {
        uploaded = true;
        return { url: `https://example.com/${file.name}` };
      },
    },
  });
  await waitReady();

  const dropdown = openDropdown(container, '插入图片');
  const uploadBtn = dropdown?.querySelector<HTMLButtonElement>(
    '.easyx-editor-media-dropdown-upload-btn',
  );

  // dragover 高亮放置目标
  uploadBtn?.dispatchEvent(new Event('dragover', { bubbles: true }));
  expect(uploadBtn?.classList.contains('is-dragover')).toBe(true);

  // drop 文件触发上传
  const file = new File(['data'], 'drop.png', { type: 'image/png' });
  const dropEvent = new Event('drop', { bubbles: true });
  Object.defineProperty(dropEvent, 'dataTransfer', {
    value: { files: [file] },
    configurable: true,
  });
  uploadBtn?.dispatchEvent(dropEvent);
  await flush();

  expect(uploaded).toBe(true);
  expect(editor.getHTML()).toContain('drop.png');

  editor.destroy();
});

test('四种媒体按钮统一使用三方式下拉', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const editor = createEditor(container, {
    image: { upload: async () => ({ url: 'i' }) },
    video: { upload: async () => ({ url: 'v' }) },
    audio: { upload: async () => ({ url: 'a' }) },
    attachment: { upload: async () => ({ url: 'f' }) },
  });
  await waitReady();

  for (const tooltip of ['插入图片', '插入视频', '插入音频', '插入附件']) {
    const dropdown = openDropdown(container, tooltip);
    expect(dropdown).not.toBeNull();
    expect(
      dropdown?.querySelector('.easyx-editor-media-dropdown-url-input'),
    ).not.toBeNull();
    expect(
      dropdown?.querySelector('.easyx-editor-media-dropdown-upload-btn'),
    ).not.toBeNull();
  }

  editor.destroy();
});

test('视频通过 URL 插入 videoNode 节点', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const editor = createEditor(container, {
    video: { upload: async () => ({ url: 'v' }) },
  });
  await waitReady();

  const dropdown = openDropdown(container, '插入视频');
  const input = dropdown?.querySelector<HTMLInputElement>(
    '.easyx-editor-media-dropdown-url-input',
  );
  input!.value = 'https://example.com/movie.mp4';
  input!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
  );

  expect(editor.getHTML()).toContain('movie.mp4');
  expect(editor.getHTML()).toContain('<video');
  editor.destroy();
});

test('编辑器内容区粘贴图片触发上传并插入', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let uploaded = false;
  const { editor } = createEditorInstance(container, {
    image: {
      upload: async (file) => {
        uploaded = true;
        return {
          id: '1',
          url: `https://example.com/${file.name}`,
          name: file.name,
        };
      },
    },
  });
  await waitReady();
  editor.commands.setContent('<p>文本</p>');
  editor.commands.setTextSelection({ from: 1, to: 1 });

  const file = new File(['data'], 'paste.png', { type: 'image/png' });
  const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(pasteEvent, 'clipboardData', {
    value: { files: [file] },
    configurable: true,
  });

  let handled: boolean | undefined;
  editor.view.someProp('handlePaste', (fn) => {
    handled = fn(editor.view, pasteEvent) as boolean;
    return true;
  });
  await flush();

  expect(handled).toBe(true);
  expect(uploaded).toBe(true);
  expect(editor.getHTML()).toContain('paste.png');
  editor.destroy();
});

test('编辑器内容区拖入视频文件触发上传并插入', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let uploaded = false;
  const { editor } = createEditorInstance(container, {
    video: {
      upload: async (file) => {
        uploaded = true;
        return {
          id: '1',
          url: `https://example.com/${file.name}`,
          name: file.name,
        };
      },
    },
  });
  await waitReady();
  editor.commands.setContent('<p>文本</p>');

  const file = new File(['data'], 'movie.mp4', { type: 'video/mp4' });
  const dropEvent = new Event('drop', { bubbles: true, cancelable: true });
  Object.defineProperty(dropEvent, 'dataTransfer', {
    value: { files: [file] },
    configurable: true,
  });

  let handled: boolean | undefined;
  editor.view.someProp('handleDrop', (fn) => {
    handled = fn(editor.view, dropEvent) as boolean;
    return true;
  });
  await flush();

  expect(handled).toBe(true);
  expect(uploaded).toBe(true);
  expect(editor.getHTML()).toContain('movie.mp4');
  editor.destroy();
});

test('编辑器粘贴文件路由到附件上传', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let uploaded = false;
  const { editor } = createEditorInstance(container, {
    attachment: {
      upload: async (file) => {
        uploaded = true;
        return {
          id: '1',
          url: `https://example.com/${file.name}`,
          name: file.name,
          size: file.size,
        };
      },
    },
  });
  await waitReady();
  editor.commands.setContent('<p>文本</p>');

  const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' });
  const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(pasteEvent, 'clipboardData', {
    value: { files: [file] },
    configurable: true,
  });

  let handled: boolean | undefined;
  editor.view.someProp('handlePaste', (fn) => {
    handled = fn(editor.view, pasteEvent) as boolean;
    return true;
  });
  await flush();

  expect(handled).toBe(true);
  expect(uploaded).toBe(true);
  expect(editor.getHTML()).toContain('doc.pdf');
  editor.destroy();
});

test('粘贴路由：音频文件上传到 audioNode', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let uploaded = false;
  const { editor } = createEditorInstance(container, {
    audio: {
      upload: async (file) => {
        uploaded = true;
        return {
          id: '1',
          url: `https://example.com/${file.name}`,
          name: file.name,
        };
      },
    },
  });
  await waitReady();
  editor.commands.setContent('<p>文本</p>');

  const file = new File(['data'], 'sound.mp3', { type: 'audio/mpeg' });
  const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(pasteEvent, 'clipboardData', {
    value: { files: [file] },
    configurable: true,
  });
  editor.view.someProp('handlePaste', (fn) => {
    fn(editor.view, pasteEvent);
    return true;
  });
  await flush();

  expect(uploaded).toBe(true);
  expect(editor.getHTML()).toContain('sound.mp3');
  editor.destroy();
});

test('粘贴路由：无匹配媒体配置时返回 false 不接管', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor } = createEditorInstance(container, {
    image: { upload: async () => ({ id: '1', url: 'u' }) },
  });
  await waitReady();
  editor.commands.setContent('<p>文本</p>');

  // 无附件配置，非图片/视频/音频文件不接管
  const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' });
  const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(pasteEvent, 'clipboardData', {
    value: { files: [file] },
    configurable: true,
  });

  let handled: boolean | undefined;
  editor.view.someProp('handlePaste', (fn) => {
    handled = fn(editor.view, pasteEvent) as boolean;
    return true;
  });
  expect(handled).toBe(false);
  editor.destroy();
});

test('粘贴富文本（含图片）时不接管，交由默认粘贴', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let uploaded = false;
  const { editor } = createEditorInstance(container, {
    image: {
      upload: async (file) => {
        uploaded = true;
        return {
          id: '1',
          url: `https://example.com/${file.name}`,
          name: file.name,
        };
      },
    },
  });
  await waitReady();
  editor.commands.setContent('<p>文本</p>');

  const file = new File(['data'], 'web.png', { type: 'image/png' });
  const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(pasteEvent, 'clipboardData', {
    value: {
      files: [file],
      getData: (type: string) =>
        type === 'text/html' ? '<p>网页复制的内容</p>' : '',
    },
    configurable: true,
  });

  let handled: boolean | undefined;
  editor.view.someProp('handlePaste', (fn) => {
    handled = fn(editor.view, pasteEvent) as boolean;
    return true;
  });
  expect(handled).toBe(false);
  expect(uploaded).toBe(false);
  editor.destroy();
});

test('粘贴上传失败时触发 uploadError 事件', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { editor, emitter } = createEditorInstance(container, {
    image: {
      upload: async () => {
        throw new Error('upload failed');
      },
    },
  });
  await waitReady();
  editor.commands.setContent('<p>文本</p>');

  const errorEvents: unknown[] = [];
  emitter.on('uploadError', (file, error) => {
    errorEvents.push({ file: (file as File).name, error });
  });

  const file = new File(['data'], 'fail.png', { type: 'image/png' });
  const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(pasteEvent, 'clipboardData', {
    value: { files: [file] },
    configurable: true,
  });
  editor.view.someProp('handlePaste', (fn) => {
    fn(editor.view, pasteEvent);
    return true;
  });
  await flush();

  expect(errorEvents).toHaveLength(1);
  expect(errorEvents[0]).toEqual({
    file: 'fail.png',
    error: expect.any(Error),
  });
  expect(editor.getHTML()).not.toContain('fail.png');
  editor.destroy();
});
