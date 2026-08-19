import { expect, test } from '@rstest/core';
import { createEditor } from '../src/index';

const waitReady = () => new Promise((resolve) => setTimeout(resolve, 30));
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function openDropdown(container: HTMLElement, tooltip: string) {
  const toolbar = container.querySelector('.fsdx-editor-toolbar');
  const btn = Array.from(
    toolbar?.querySelectorAll<HTMLButtonElement>('.fsdx-editor-toolbar-btn') ??
      [],
  ).find((b) => b.dataset.tooltip === tooltip);
  btn?.click();
  return container.querySelector('.fsdx-editor-media-dropdown');
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
  const tabs = dropdown?.querySelectorAll('.fsdx-editor-media-dropdown-tab');
  expect(tabs?.length).toBe(3);

  const visiblePanel = () =>
    Array.from(
      dropdown?.querySelectorAll('.fsdx-editor-media-dropdown-panel') ?? [],
    ).find((p) => !(p as HTMLElement).hidden);

  // 默认激活上传
  expect(
    visiblePanel()?.querySelector('.fsdx-editor-media-dropdown-upload-btn'),
  ).not.toBeNull();

  // 切换到网络地址
  const urlTab = dropdown?.querySelector<HTMLButtonElement>(
    '.fsdx-editor-media-dropdown-tab[data-tab="url"]',
  );
  urlTab?.click();
  expect(
    visiblePanel()?.querySelector('.fsdx-editor-media-dropdown-url-input'),
  ).not.toBeNull();

  // 切换到媒体库
  const libTab = dropdown?.querySelector<HTMLButtonElement>(
    '.fsdx-editor-media-dropdown-tab[data-tab="library"]',
  );
  libTab?.click();
  expect(
    visiblePanel()?.querySelector('.fsdx-editor-media-dropdown-grid'),
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
    '.fsdx-editor-media-dropdown-url-input',
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
    dropdown?.querySelector('.fsdx-editor-media-dropdown-search-row'),
  ).toBe(null);
  expect(dropdown?.querySelector('.fsdx-editor-media-dropdown-grid')).toBe(
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
    dropdown?.querySelectorAll('.fsdx-editor-media-dropdown-item'),
  ).toHaveLength(0);

  dropdown
    ?.querySelector<HTMLButtonElement>(
      '.fsdx-editor-media-dropdown-tab[data-tab="library"]',
    )
    ?.click();
  await flush();

  const cards = dropdown?.querySelectorAll('.fsdx-editor-media-dropdown-item');
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
      '.fsdx-editor-media-dropdown-tab[data-tab="library"]',
    )
    ?.click();
  await flush();
  expect(calls).toHaveLength(1);
  expect(calls[0]).toEqual({ page: 1, pageSize: 12 });
  expect(
    dropdown?.querySelectorAll('.fsdx-editor-media-dropdown-item'),
  ).toHaveLength(12);

  const nextBtn = dropdown?.querySelector<HTMLButtonElement>(
    '.fsdx-editor-media-dropdown-page-btn:last-child',
  );
  nextBtn?.click();
  await flush();
  expect(calls).toHaveLength(2);
  expect(calls[1].page).toBe(2);
  expect(
    dropdown?.querySelectorAll('.fsdx-editor-media-dropdown-item'),
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
    '.fsdx-editor-media-dropdown-url-input',
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
      dropdown?.querySelector('.fsdx-editor-media-dropdown-url-input'),
    ).not.toBeNull();
    expect(
      dropdown?.querySelector('.fsdx-editor-media-dropdown-upload-btn'),
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
    '.fsdx-editor-media-dropdown-url-input',
  );
  input!.value = 'https://example.com/movie.mp4';
  input!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
  );

  expect(editor.getHTML()).toContain('movie.mp4');
  expect(editor.getHTML()).toContain('<video');
  editor.destroy();
});
