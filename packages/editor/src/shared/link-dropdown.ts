import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';
import { updateBtnStates } from './controls';

const POPOVER_CLASS = 'fsdx-editor-link-popover';
const ROW_CLASS = 'fsdx-editor-link-popover-row';
const INPUT_CLASS = 'fsdx-editor-link-popover-input';
const BTN_CLASS = 'fsdx-editor-link-popover-btn';
const TEXT_BTN_CLASS = 'fsdx-editor-link-popover-text-btn';
const DIVIDER_CLASS = 'fsdx-editor-link-popover-divider';
const TEXT_BTN_ACTIVE_CLASS = 'is-active';

/** 简单 URL 清理，仅允许白名单协议 */
function sanitizeUrl(inputUrl: string, baseUrl: string): string | null {
  try {
    const url = new URL(inputUrl, baseUrl);
    const allowed = ['http:', 'https:', 'ftp:', 'mailto:', 'tel:', 'sms:'];
    if (allowed.includes(url.protocol)) {
      return url.href;
    }
  } catch {
    // 无效 URL
  }
  return null;
}

/** 获取当前链接的 href */
function getLinkHref(editor: Editor): string {
  const attrs = editor.getAttributes('link');
  return (attrs.href as string) || '';
}

/** 获取当前链接的 target */
function getLinkTarget(editor: Editor): string | null {
  const attrs = editor.getAttributes('link');
  return (attrs.target as string) || null;
}

/** 获取当前链接是否新窗口打开 */
function isLinkBlank(editor: Editor): boolean {
  return getLinkTarget(editor) === '_blank';
}

/**
 * 创建链接下拉面板按钮。
 * 点击按钮弹出浮动面板，包含 URL 输入、应用、新窗口切换、打开链接、取消链接。
 */
export function createLinkDropdown(
  container: HTMLElement,
  btnClassName: string,
  editor: Editor,
  icon: string,
  title: string,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = btnClassName;
  btn.title = title;
  btn.innerHTML = icon;

  (btn as unknown as Record<string, unknown>)._check = (e: Editor) =>
    e.isActive('link');

  let cleanup: (() => void) | null = null;
  let popover: HTMLElement | null = null;

  let closePopover = () => {
    cleanup?.();
    cleanup = null;
    popover?.remove();
    popover = null;
  };

  const buildPopover = (): HTMLElement => {
    const panel = document.createElement('div');
    panel.className = POPOVER_CLASS;

    // ---- 输入行：URL 输入框 + 应用按钮 ----
    const inputRow = document.createElement('div');
    inputRow.className = ROW_CLASS;

    const input = document.createElement('input');
    input.type = 'url';
    input.className = INPUT_CLASS;
    input.placeholder = '粘贴链接...';
    input.value = getLinkHref(editor);

    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.className = BTN_CLASS;
    applyBtn.title = '应用链接';
    applyBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.0001 13.9999L19.0002 5L17.0002 4.99997L17.0001 11.9999L6.8283 12L10.778 8.05024L9.36382 6.63603L2.99986 13L9.36382 19.364L10.778 17.9497L6.82826 14L19.0001 13.9999Z"/></svg>';

    const applyLink = () => {
      const url = input.value.trim();
      if (!url) return;
      const linkAttrs: { href: string; target?: string } = { href: url };
      if (isLinkBlank(editor)) {
        linkAttrs.target = '_blank';
      }
      editor.chain().focus().extendMarkRange('link').setLink(linkAttrs).run();
      closePopover();
      updateBtnStates(container, btnClassName, editor);
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyLink();
      }
    });

    applyBtn.addEventListener('mousedown', (e) => e.preventDefault());
    applyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      applyLink();
    });

    inputRow.appendChild(input);
    inputRow.appendChild(applyBtn);
    panel.appendChild(inputRow);

    // ---- 分隔线 ----
    const divider1 = document.createElement('div');
    divider1.className = DIVIDER_CLASS;
    panel.appendChild(divider1);

    // ---- 新窗口切换行 ----
    const toggleRow = document.createElement('div');
    toggleRow.className = ROW_CLASS;

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = TEXT_BTN_CLASS;
    toggleBtn.textContent = '新窗口';
    toggleBtn.title = '新窗口打开';

    const updateToggleState = () => {
      if (isLinkBlank(editor)) {
        toggleBtn.classList.add(TEXT_BTN_ACTIVE_CLASS);
      } else {
        toggleBtn.classList.remove(TEXT_BTN_ACTIVE_CLASS);
      }
    };
    updateToggleState();

    toggleBtn.addEventListener('mousedown', (e) => e.preventDefault());
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const next = !isLinkBlank(editor);
      const url = input.value.trim() || getLinkHref(editor);
      if (!url) return;
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: next ? '_blank' : null })
        .run();
      updateToggleState();
      updateBtnStates(container, btnClassName, editor);
    });

    toggleRow.appendChild(toggleBtn);
    panel.appendChild(toggleRow);

    // ---- 分隔线 ----
    const divider2 = document.createElement('div');
    divider2.className = DIVIDER_CLASS;
    panel.appendChild(divider2);

    // ---- 操作行：打开链接 + 取消链接 ----
    const actionRow = document.createElement('div');
    actionRow.className = ROW_CLASS;

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = BTN_CLASS;
    openBtn.title = '打开链接';
    openBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"/></svg>';

    openBtn.addEventListener('mousedown', (e) => e.preventDefault());
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const href = getLinkHref(editor);
      if (!href) return;
      const safeUrl = sanitizeUrl(href, window.location.href);
      if (safeUrl) {
        window.open(safeUrl, '_blank', 'noopener,noreferrer');
      }
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = BTN_CLASS;
    removeBtn.title = '取消链接';
    removeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"/></svg>';

    removeBtn.addEventListener('mousedown', (e) => e.preventDefault());
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .setMeta('preventAutolink', true)
        .run();
      closePopover();
      updateBtnStates(container, btnClassName, editor);
    });

    actionRow.appendChild(openBtn);
    actionRow.appendChild(removeBtn);
    panel.appendChild(actionRow);

    container.appendChild(panel);

    // 自动聚焦输入框
    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });

    return panel;
  };

  const openPopover = () => {
    if (popover) return;

    popover = buildPopover();

    cleanup = autoUpdate(btn, popover, () => {
      if (!popover?.isConnected || !btn.isConnected) {
        cleanup?.();
        closePopover();
        return;
      }
      computePosition(btn, popover, {
        placement: 'bottom-start',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        if (!popover) return;
        Object.assign(popover.style, {
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        popover?.isConnected &&
        !popover.contains(e.target as Node) &&
        !btn.contains(e.target as Node)
      ) {
        closePopover();
      }
    };
    setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick, true);
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePopover();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.removedNodes) {
          if (node === popover) {
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

    const origClosePopover = closePopover;
    closePopover = () => {
      observer.disconnect();
      document.removeEventListener('mousedown', handleOutsideClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      origClosePopover();
    };
  };

  btn.addEventListener('mousedown', (e) => e.preventDefault());
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (popover) {
      closePopover();
    } else {
      openPopover();
    }
  });

  (btn as unknown as Record<string, unknown>)._destroy = () => {
    closePopover();
  };

  container.appendChild(btn);
  return btn;
}
