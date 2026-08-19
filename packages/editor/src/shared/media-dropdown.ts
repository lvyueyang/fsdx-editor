import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';
import { ICONS } from '../toolbar/toolbar-shared';
import type { MediaUploadConfig } from '../types';
import { sanitizeUrl } from '../utils/link';

const DROPDOWN_CLASS = 'fsdx-editor-media-dropdown';
const TABS_CLASS = 'fsdx-editor-media-dropdown-tabs';
const TAB_CLASS = 'fsdx-editor-media-dropdown-tab';
const PANEL_CLASS = 'fsdx-editor-media-dropdown-panel';
const UPLOAD_BTN_CLASS = 'fsdx-editor-media-dropdown-upload-btn';
const UPLOAD_PROGRESS_CLASS = 'fsdx-editor-media-dropdown-upload-progress';
const URL_ROW_CLASS = 'fsdx-editor-media-dropdown-url-row';
const URL_INPUT_CLASS = 'fsdx-editor-media-dropdown-url-input';
const URL_INSERT_BTN_CLASS = 'fsdx-editor-media-dropdown-url-insert-btn';
const SEARCH_ROW_CLASS = 'fsdx-editor-media-dropdown-search-row';
const SEARCH_INPUT_CLASS = 'fsdx-editor-media-dropdown-search-input';
const SEARCH_BTN_CLASS = 'fsdx-editor-media-dropdown-search-btn';
const GRID_CLASS = 'fsdx-editor-media-dropdown-grid';
const ITEM_CLASS = 'fsdx-editor-media-dropdown-item';
const ITEM_THUMB_CLASS = 'fsdx-editor-media-dropdown-item-thumb';
const ITEM_INFO_CLASS = 'fsdx-editor-media-dropdown-item-info';
const ITEM_NAME_CLASS = 'fsdx-editor-media-dropdown-item-name';
const ITEM_SIZE_CLASS = 'fsdx-editor-media-dropdown-item-size';
const PAGINATION_CLASS = 'fsdx-editor-media-dropdown-pagination';
const PAGE_BTN_CLASS = 'fsdx-editor-media-dropdown-page-btn';
const PAGE_INFO_CLASS = 'fsdx-editor-media-dropdown-page-info';
const STATUS_CLASS = 'fsdx-editor-media-dropdown-status';

/** 媒体插入载荷 */
export interface MediaInsertItem {
  src: string;
  name?: string;
  size?: number;
}

export interface CreateMediaDropdownOptions {
  /** 文件选择 accept 类型，如 image/*、video/* */
  accept: string;
  /** 插入回调，由调用方决定调用 setImage/setVideo 等命令 */
  insert: (item: MediaInsertItem) => void;
  /** 按钮选中态判断，默认恒为 false */
  isActive?: (e: Editor) => boolean;
}

const LIB_PAGE_SIZE = 12;

/**
 * 通用媒体插入下拉：上传 / 网络地址 / 媒体库 通过 Tab 切换。
 * 媒体库仅在配置了 getList 时显示，支持搜索与分页。
 */
export function createMediaDropdown(
  container: HTMLElement,
  btnClassName: string,
  icon: string,
  title: string,
  config: MediaUploadConfig,
  opts: CreateMediaDropdownOptions,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = btnClassName;
  btn.dataset.tooltip = title;
  btn.setAttribute('aria-label', title);
  btn.innerHTML = icon;

  (btn as unknown as Record<string, unknown>)._check =
    opts.isActive ?? (() => false);

  let cleanup: (() => void) | null = null;
  let dropdown: HTMLElement | null = null;

  let closeDropdown = () => {
    cleanup?.();
    cleanup = null;
    dropdown?.remove();
    dropdown = null;
  };

  /** 上传按钮：弹出文件选择并上传，上传成功插入后关闭 */
  const createUploadControl = (section: HTMLElement) => {
    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = UPLOAD_BTN_CLASS;
    uploadBtn.innerHTML = `<span class="${UPLOAD_BTN_CLASS}-icon">${ICONS.upload}</span>上传文件`;

    const progress = document.createElement('div');
    progress.className = UPLOAD_PROGRESS_CLASS;
    progress.hidden = true;

    const progressBar = document.createElement('div');
    progressBar.className = `${UPLOAD_PROGRESS_CLASS}-bar`;
    progress.appendChild(progressBar);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = opts.accept;
    input.style.display = 'none';

    const setUploading = (active: boolean, ratio: number) => {
      uploadBtn.classList.toggle('is-loading', active);
      uploadBtn.disabled = active;
      progress.hidden = !active;
      progressBar.style.width = `${Math.round(ratio * 100)}%`;
    };

    uploadBtn.addEventListener('mousedown', (e) => e.preventDefault());
    uploadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      input.click();
    });

    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        setUploading(true, 0);
        const result = await config.upload(file, (p) => setUploading(true, p));
        opts.insert({
          src: result.url,
          name: result.name ?? file.name,
          size: result.size ?? file.size,
        });
        closeDropdown();
      } catch {
        setUploading(false, 0);
        // 清空已选文件，允许再次选择同一文件重试
        input.value = '';
      }
    });

    section.appendChild(uploadBtn);
    section.appendChild(progress);
    section.appendChild(input);
  };

  /** 网络地址输入：Enter 或按钮插入 */
  const createUrlControl = (section: HTMLElement) => {
    const row = document.createElement('div');
    row.className = URL_ROW_CLASS;

    const input = document.createElement('input');
    input.type = 'url';
    input.className = URL_INPUT_CLASS;
    input.placeholder = '粘贴图片/文件链接…';

    const insertBtn = document.createElement('button');
    insertBtn.type = 'button';
    insertBtn.className = URL_INSERT_BTN_CLASS;
    insertBtn.textContent = '插入';

    const insertUrl = () => {
      const url = input.value.trim();
      if (!url) return;
      // 用户输入属于不可信来源，过滤非白名单协议（如 javascript:）
      const safeUrl = sanitizeUrl(url, window.location.href);
      if (!safeUrl) return;
      opts.insert({ src: safeUrl });
      closeDropdown();
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        insertUrl();
      }
    });
    input.addEventListener('mousedown', (e) => e.stopPropagation());
    insertBtn.addEventListener('mousedown', (e) => e.preventDefault());
    insertBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      insertUrl();
    });

    row.appendChild(input);
    row.appendChild(insertBtn);
    section.appendChild(row);
  };

  /** 媒体库：搜索 + 网格 + 分页。返回首次激活时加载列表的函数（懒加载） */
  const createLibraryControl = (
    section: HTMLElement,
  ): (() => void) | undefined => {
    if (!config.getList) return undefined;

    let page = 1;
    let total = 0;
    let keyword = '';
    let requestSeq = 0;
    let loaded = false;

    const searchRow = document.createElement('div');
    searchRow.className = SEARCH_ROW_CLASS;

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.className = SEARCH_INPUT_CLASS;
    searchInput.placeholder = '搜索媒体…';

    const searchBtn = document.createElement('button');
    searchBtn.type = 'button';
    searchBtn.className = SEARCH_BTN_CLASS;
    searchBtn.dataset.tooltip = '搜索';
    searchBtn.setAttribute('aria-label', '搜索');
    searchBtn.innerHTML = ICONS.search;

    const grid = document.createElement('div');
    grid.className = GRID_CLASS;

    const status = document.createElement('div');
    status.className = STATUS_CLASS;

    const pagination = document.createElement('div');
    pagination.className = PAGINATION_CLASS;
    pagination.hidden = true;

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = PAGE_BTN_CLASS;
    prevBtn.dataset.tooltip = '上一页';
    prevBtn.setAttribute('aria-label', '上一页');
    prevBtn.innerHTML = ICONS.chevronLeft;

    const pageInfo = document.createElement('span');
    pageInfo.className = PAGE_INFO_CLASS;

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = PAGE_BTN_CLASS;
    nextBtn.dataset.tooltip = '下一页';
    nextBtn.setAttribute('aria-label', '下一页');
    nextBtn.innerHTML = ICONS.chevronRight;

    const showStatus = (
      message: string,
      kind: 'loading' | 'empty' | 'error',
    ) => {
      status.textContent = message;
      status.className = `${STATUS_CLASS} ${STATUS_CLASS}--${kind}`;
      status.hidden = false;
      grid.hidden = true;
    };

    const hideStatus = () => {
      status.hidden = true;
      grid.hidden = false;
    };

    const renderItems = (
      items: {
        url: string;
        name: string;
        size?: number;
        thumbnailUrl?: string;
      }[],
    ) => {
      grid.innerHTML = '';
      for (const item of items) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = ITEM_CLASS;
        card.dataset.tooltip = item.name;
        card.setAttribute('aria-label', `插入 ${item.name}`);

        const thumb = document.createElement('span');
        thumb.className = ITEM_THUMB_CLASS;
        const img = document.createElement('img');
        img.src = item.thumbnailUrl ?? item.url;
        img.alt = item.name;
        img.loading = 'lazy';
        thumb.appendChild(img);

        const info = document.createElement('span');
        info.className = ITEM_INFO_CLASS;

        const name = document.createElement('span');
        name.className = ITEM_NAME_CLASS;
        name.textContent = item.name;
        name.title = item.name;

        const size = document.createElement('span');
        size.className = ITEM_SIZE_CLASS;
        size.textContent = item.size != null ? formatSize(item.size) : '';

        info.appendChild(name);
        info.appendChild(size);
        card.appendChild(thumb);
        card.appendChild(info);

        card.addEventListener('mousedown', (e) => e.preventDefault());
        card.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          opts.insert({ src: item.url, name: item.name, size: item.size });
          closeDropdown();
        });
        grid.appendChild(card);
      }
    };

    const updatePagination = () => {
      const pageCount = Math.max(1, Math.ceil(total / LIB_PAGE_SIZE));
      pagination.hidden = total === 0;
      prevBtn.disabled = page <= 1;
      nextBtn.disabled = page >= pageCount;
      pageInfo.textContent = `${page} / ${pageCount} · 共 ${total} 项`;
    };

    const load = async (targetPage: number) => {
      if (!config.getList) return;
      page = targetPage;
      const seq = ++requestSeq;
      showStatus('加载中…', 'loading');
      try {
        const res = await config.getList({
          page,
          pageSize: LIB_PAGE_SIZE,
          keyword: keyword || undefined,
        });
        if (seq !== requestSeq) return;
        total = res.total;
        if (res.items.length === 0) {
          showStatus('暂无媒体，试试搜索或上传', 'empty');
          grid.innerHTML = '';
          grid.hidden = true;
        } else {
          hideStatus();
          renderItems(res.items);
        }
        updatePagination();
      } catch {
        if (seq !== requestSeq) return;
        showStatus('加载失败，请重试', 'error');
        updatePagination();
      }
    };

    const search = () => {
      keyword = searchInput.value.trim();
      load(1);
    };

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        search();
      }
    });
    searchInput.addEventListener('mousedown', (e) => e.stopPropagation());
    searchBtn.addEventListener('mousedown', (e) => e.preventDefault());
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      search();
    });
    prevBtn.addEventListener('mousedown', (e) => e.preventDefault());
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      load(Math.max(1, page - 1));
    });
    nextBtn.addEventListener('mousedown', (e) => e.preventDefault());
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      load(page + 1);
    });

    searchRow.appendChild(searchInput);
    searchRow.appendChild(searchBtn);
    pagination.appendChild(prevBtn);
    pagination.appendChild(pageInfo);
    pagination.appendChild(nextBtn);

    section.appendChild(searchRow);
    section.appendChild(status);
    section.appendChild(grid);
    section.appendChild(pagination);

    // 懒加载：仅在首次切到媒体库 Tab 时请求列表
    const ensureLoaded = () => {
      if (loaded) return;
      loaded = true;
      load(1);
    };
    return ensureLoaded;
  };

  const buildDropdown = (): HTMLElement => {
    const panel = document.createElement('div');
    panel.className = DROPDOWN_CLASS;
    panel.style.position = 'fixed';
    panel.style.visibility = 'hidden';

    const tabBar = document.createElement('div');
    tabBar.className = TABS_CLASS;
    tabBar.setAttribute('role', 'tablist');

    const contentEl = document.createElement('div');
    contentEl.className = `${DROPDOWN_CLASS}-content`;

    type TabEntry = {
      key: string;
      label: string;
      icon: string;
      build: (panel: HTMLElement) => (() => void) | undefined;
    };

    const entries: TabEntry[] = [
      {
        key: 'upload',
        label: '上传',
        icon: ICONS.upload,
        build: (tabPanel) => {
          createUploadControl(tabPanel);
          return undefined;
        },
      },
      {
        key: 'url',
        label: '网络地址',
        icon: ICONS.link,
        build: (tabPanel) => {
          createUrlControl(tabPanel);
          return () =>
            tabPanel
              .querySelector<HTMLInputElement>(`.${URL_INPUT_CLASS}`)
              ?.focus();
        },
      },
    ];
    if (config.getList) {
      entries.push({
        key: 'library',
        label: '媒体库',
        icon: ICONS.gallery,
        build: (tabPanel) => {
          const ensureLoaded = createLibraryControl(tabPanel);
          return () => {
            ensureLoaded?.();
            tabPanel
              .querySelector<HTMLInputElement>(`.${SEARCH_INPUT_CLASS}`)
              ?.focus();
          };
        },
      });
    }

    const tabPanels = new Map<
      string,
      {
        tab: HTMLButtonElement;
        panel: HTMLElement;
        focus: (() => void) | undefined;
      }
    >();
    let activeKey = entries[0].key;

    const switchTab = (key: string) => {
      activeKey = key;
      for (const [k, { tab, panel, focus }] of tabPanels) {
        const active = k === key;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        panel.hidden = !active;
        if (active) focus?.();
      }
    };

    for (const entry of entries) {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = TAB_CLASS;
      tab.dataset.tab = entry.key;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', 'false');

      const iconSpan = document.createElement('span');
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.innerHTML = entry.icon;
      const labelSpan = document.createElement('span');
      labelSpan.textContent = entry.label;
      tab.appendChild(iconSpan);
      tab.appendChild(labelSpan);

      const tabPanel = document.createElement('div');
      tabPanel.className = PANEL_CLASS;
      tabPanel.setAttribute('role', 'tabpanel');
      const focus = entry.build(tabPanel);

      tab.addEventListener('mousedown', (e) => e.preventDefault());
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchTab(entry.key);
      });

      tabBar.appendChild(tab);
      contentEl.appendChild(tabPanel);
      tabPanels.set(entry.key, { tab, panel: tabPanel, focus });
    }

    switchTab(activeKey);

    panel.appendChild(tabBar);
    panel.appendChild(contentEl);
    container.appendChild(panel);
    return panel;
  };

  const openDropdown = () => {
    if (dropdown) return;

    dropdown = buildDropdown();

    cleanup = autoUpdate(btn, dropdown, () => {
      if (!dropdown?.isConnected || !btn.isConnected) {
        cleanup?.();
        closeDropdown();
        return;
      }
      computePosition(btn, dropdown, {
        placement: 'bottom-start',
        strategy: 'fixed',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        if (!dropdown) return;
        Object.assign(dropdown.style, {
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
        });
        dropdown.style.visibility = 'visible';
      });
    });

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdown?.isConnected &&
        !dropdown.contains(e.target as Node) &&
        !btn.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };
    setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick, true);
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.removedNodes) {
          if (node === dropdown) {
            cleanup?.();
            document.removeEventListener('mousedown', handleOutsideClick, true);
            document.removeEventListener('keydown', handleKeyDown);
            observer.disconnect();
            return;
          }
        }
      }
    });
    observer.observe(container, { childList: true });

    const origCloseDropdown = closeDropdown;
    closeDropdown = () => {
      observer.disconnect();
      document.removeEventListener('mousedown', handleOutsideClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      origCloseDropdown();
    };
  };

  btn.addEventListener('mousedown', (e) => e.preventDefault());
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdown) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  (btn as unknown as Record<string, unknown>)._destroy = () => {
    closeDropdown();
  };

  container.appendChild(btn);
  return btn;
}

/** 文件大小格式化 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
