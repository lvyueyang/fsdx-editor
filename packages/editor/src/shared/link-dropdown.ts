import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';
import { sanitizeUrl } from '../utils/link';
import { updateBtnStates } from './controls';

const POPOVER_CLASS = 'fsdx-editor-link-popover';
const INPUT_ROW_CLASS = 'fsdx-editor-link-popover-input-row';
const INPUT_ICON_CLASS = 'fsdx-editor-link-popover-input-icon';
const INPUT_CLASS = 'fsdx-editor-link-popover-input';
const NEW_WINDOW_BTN_CLASS = 'fsdx-editor-link-popover-new-window';
const ACTIONS_CLASS = 'fsdx-editor-link-popover-actions';
const ACTION_BTN_CLASS = 'fsdx-editor-link-popover-actions-btn';
const DANGER_BTN_CLASS = 'fsdx-editor-link-popover-actions-btn--danger';
const NEW_WINDOW_ACTIVE_CLASS = 'is-active';

const NEW_WINDOW_ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.99989 10.0001L4.99976 19L6.99976 19L6.99986 12.0001L17.1717 12L13.222 15.9498L14.6362 17.364L21.0001 11L14.6362 4.63605L13.222 6.05026L17.1717 10L4.99989 10.0001Z"/></svg>';

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
  btn.dataset.tooltip = title;
  btn.setAttribute('aria-label', title);
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
    panel.style.position = 'fixed';
    panel.style.visibility = 'hidden';

    // ---- 输入行：链接图标 + URL 输入框（Enter 应用） ----
    const inputRow = document.createElement('div');
    inputRow.className = INPUT_ROW_CLASS;

    const inputIcon = document.createElement('span');
    inputIcon.className = INPUT_ICON_CLASS;
    inputIcon.setAttribute('aria-hidden', 'true');
    inputIcon.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.3638 15.5355L16.9496 14.1213L18.3638 12.7071C20.3164 10.7545 20.3164 7.58866 18.3638 5.63604C16.4112 3.68341 13.2453 3.68341 11.2927 5.63604L9.87849 7.05025L8.46428 5.63604L9.87849 4.22182C12.6122 1.48815 17.0443 1.48815 19.778 4.22182C22.5117 6.95549 22.5117 11.3876 19.778 14.1213L18.3638 15.5355ZM15.5353 18.364L14.1211 19.7782C11.3875 22.5118 6.95531 22.5118 4.22164 19.7782C1.48797 17.0445 1.48797 12.6123 4.22164 9.87868L5.63585 8.46446L7.05007 9.87868L5.63585 11.2929C3.68323 13.2455 3.68323 16.4113 5.63585 18.364C7.58847 20.3166 10.7543 20.3166 12.7069 18.364L14.1211 16.9497L15.5353 18.364ZM14.8282 7.75736L16.2425 9.17157L9.17139 16.2426L7.75717 14.8284L14.8282 7.75736Z"/></svg>';

    const input = document.createElement('input');
    input.type = 'url';
    input.className = INPUT_CLASS;
    input.placeholder = '粘贴链接...';
    input.value = getLinkHref(editor);

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
    input.addEventListener('mousedown', (e) => e.stopPropagation());

    // ---- 新窗口打开图标按钮（与输入框并列） ----
    const newWindowBtn = document.createElement('button');
    newWindowBtn.type = 'button';
    newWindowBtn.className = NEW_WINDOW_BTN_CLASS;
    newWindowBtn.dataset.tooltip = '新窗口打开';
    newWindowBtn.setAttribute('aria-label', '新窗口打开');
    newWindowBtn.innerHTML = NEW_WINDOW_ICON;

    const updateNewWindowState = () => {
      newWindowBtn.classList.toggle(
        NEW_WINDOW_ACTIVE_CLASS,
        isLinkBlank(editor),
      );
    };
    updateNewWindowState();

    newWindowBtn.addEventListener('mousedown', (e) => e.preventDefault());
    newWindowBtn.addEventListener('click', (e) => {
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
      updateNewWindowState();
      updateBtnStates(container, btnClassName, editor);
    });

    inputRow.appendChild(inputIcon);
    inputRow.appendChild(input);
    inputRow.appendChild(newWindowBtn);
    panel.appendChild(inputRow);

    // ---- 操作区：打开链接 + 取消链接 ----
    const actions = document.createElement('div');
    actions.className = ACTIONS_CLASS;

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = ACTION_BTN_CLASS;
    openBtn.dataset.tooltip = '打开链接';
    openBtn.setAttribute('aria-label', '打开链接');
    openBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"/></svg>打开链接';

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
    removeBtn.className = `${ACTION_BTN_CLASS} ${DANGER_BTN_CLASS}`;
    removeBtn.dataset.tooltip = '取消链接';
    removeBtn.setAttribute('aria-label', '取消链接');
    removeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"/></svg>取消链接';

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

    actions.appendChild(openBtn);
    actions.appendChild(removeBtn);
    panel.appendChild(actions);

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
        strategy: 'fixed',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        if (!popover) return;
        Object.assign(popover.style, {
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
        });
        popover.style.visibility = 'visible';
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
