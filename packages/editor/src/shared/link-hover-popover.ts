import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';
import { getHrefFromAnchor, sanitizeUrl } from '../utils/link';
import { bindTooltips } from './tooltip';

const HOVER_CLASS = 'fsdx-editor-link-hover';
const BTN_CLASS = 'fsdx-editor-link-hover-btn';
const COPIED_CLASS = 'is-copied';
const HIDE_DELAY = 150;

const OPEN_ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"/></svg>';
const COPY_ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7H6C4.89543 7 4 7.89543 4 9V18C4 19.1046 4.89543 20 6 20H15C16.1046 20 17 19.1046 17 18V17H19C20.1046 17 21 16.1046 21 15V6C21 4.89543 20.1046 4 19 4H10C8.89543 4 8 4.89543 8 6V7H7ZM10 6V8H15C16.1046 8 17 8.89543 17 10V15H19V6H10Z"/></svg>';
const CHECK_ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.99997 15.5858L19.2929 6.29289L20.7071 7.70711L9.99997 18.4142L3.29297 11.7072L4.70718 10.293L9.99997 15.5858Z"/></svg>';
const UNLINK_ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.3638 15.5355L16.9496 14.1213L18.3638 12.7071C20.3164 10.7545 20.3164 7.58866 18.3638 5.63604C16.4112 3.68341 13.2453 3.68341 11.2927 5.63604L9.87849 7.05025L8.46428 5.63604L9.87849 4.22182C12.6122 1.48815 17.0443 1.48815 19.778 4.22182C22.5117 6.95549 22.5117 11.3876 19.778 14.1213L18.3638 15.5355ZM15.5353 18.364L14.1211 19.7782C11.3875 22.5118 6.95531 22.5118 4.22164 19.7782C1.48797 17.0445 1.48797 12.6123 4.22164 9.87868L5.63585 8.46446L7.05007 9.87868L5.63585 11.2929C3.68323 13.2455 3.68323 16.4113 5.63585 18.364C7.58847 20.3166 10.7543 20.3166 12.7069 18.364L14.1211 16.9497L15.5353 18.364ZM14.8282 7.75736L16.2425 9.17157L9.17139 16.2426L7.75717 14.8284L14.8282 7.75736Z"/></svg>';

/**
 * 链接 hover 快速操作浮层：编辑态悬停链接时显示打开/复制/移除。
 * 浮层挂载在编辑器根容器内，通过事件委托监听 hover，随编辑器销毁自动清理。
 */
export function createLinkHoverPopover(
  container: HTMLElement,
  editor: Editor,
): { destroy: () => void } {
  const popover = document.createElement('div');
  popover.className = HOVER_CLASS;
  popover.hidden = true;

  let shownAnchor: HTMLAnchorElement | null = null;
  const currentAnchor = () => shownAnchor;

  const openBtn = createActionBtn('打开链接', OPEN_ICON, () => {
    const href = currentAnchor()?.getAttribute('href') ?? null;
    if (!href) return;
    const safeUrl = sanitizeUrl(href, window.location.href);
    if (safeUrl) {
      window.open(safeUrl, '_blank', 'noopener,noreferrer');
    }
  });

  const copyBtn = createActionBtn('复制链接', COPY_ICON, () => {
    const href = currentAnchor()?.getAttribute('href') ?? null;
    if (!href) return;
    navigator.clipboard
      .writeText(href)
      .then(() => {
        copyBtn.innerHTML = CHECK_ICON;
        copyBtn.dataset.tooltip = '已复制';
        copyBtn.classList.add(COPIED_CLASS);
        setTimeout(() => {
          copyBtn.innerHTML = COPY_ICON;
          copyBtn.dataset.tooltip = '复制链接';
          copyBtn.classList.remove(COPIED_CLASS);
        }, 1200);
      })
      .catch(() => {
        // 剪贴板不可用时静默失败
      });
  });

  const removeBtn = createActionBtn('移除链接', UNLINK_ICON, () => {
    const anchor = currentAnchor();
    // posAtDOM 对不在文档中的节点会抛 RangeError，先确认链接仍在文档内
    if (!anchor || !anchor.isConnected) return;
    const view = editor.view;
    const start = view.posAtDOM(anchor, 0);
    const end = view.posAtDOM(anchor, anchor.childNodes.length);
    if (start === end) return;
    editor
      .chain()
      .focus()
      .setTextSelection({ from: start, to: end })
      .extendMarkRange('link')
      .unsetLink()
      .setMeta('preventAutolink', true)
      .run();
    hide();
  });

  popover.appendChild(openBtn);
  popover.appendChild(copyBtn);
  popover.appendChild(removeBtn);
  container.appendChild(popover);
  bindTooltips(popover);

  const view = editor.view;
  let positionCleanup: (() => void) | null = null;
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const cancelHide = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  };

  const scheduleHide = () => {
    cancelHide();
    // 延迟隐藏：鼠标在链接与浮层之间的间隙移动时留出进入浮层的时间
    hideTimer = setTimeout(() => {
      hideTimer = null;
      hide();
    }, HIDE_DELAY);
  };

  const getAnchor = (el: EventTarget | null): HTMLAnchorElement | null => {
    if (!editor.isEditable) return null;
    const node = el instanceof Element ? el : null;
    const anchor = node?.closest?.('a');
    if (!anchor) return null;
    if (!view.dom.contains(anchor)) return null;
    if (!getHrefFromAnchor(anchor)) return null;
    return anchor;
  };

  const inRegion = (el: EventTarget | null): boolean => {
    if (!el || !(el instanceof Node)) return false;
    return (
      (shownAnchor !== null && shownAnchor.contains(el)) || popover.contains(el)
    );
  };

  const hide = () => {
    cancelHide();
    positionCleanup?.();
    positionCleanup = null;
    shownAnchor = null;
    popover.hidden = true;
  };

  const show = (anchor: HTMLAnchorElement) => {
    hide();
    shownAnchor = anchor;
    popover.hidden = false;
    positionCleanup = autoUpdate(anchor, popover, () => {
      if (!anchor.isConnected || !popover.isConnected) {
        hide();
        return;
      }
      computePosition(anchor, popover, {
        placement: 'bottom',
        strategy: 'fixed',
        middleware: [offset(6), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        Object.assign(popover.style, {
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });
  };

  const onMouseover = (e: Event) => {
    const anchor = getAnchor(e.target);
    if (anchor) {
      if (anchor !== shownAnchor) {
        show(anchor);
      } else {
        // 重新悬停同一链接，取消即将执行的隐藏
        cancelHide();
      }
      return;
    }
    // 鼠标移入浮层或其内部时取消即将执行的隐藏
    if (shownAnchor && popover.contains(e.target as Node)) {
      cancelHide();
    }
  };

  const onMouseout = (e: Event) => {
    const ev = e as MouseEvent;
    if (inRegion(ev.target) && !inRegion(ev.relatedTarget)) {
      scheduleHide();
    }
  };

  const onClick = (e: Event) => {
    // 点击链接（选中进入编辑态）时隐藏 hover 浮层，避免与气泡菜单叠影
    if (getAnchor(e.target)) {
      hide();
    }
  };

  container.addEventListener('mouseover', onMouseover);
  container.addEventListener('mouseout', onMouseout);
  container.addEventListener('click', onClick);

  const destroy = () => {
    hide();
    container.removeEventListener('mouseover', onMouseover);
    container.removeEventListener('mouseout', onMouseout);
    container.removeEventListener('click', onClick);
    popover.remove();
  };

  return { destroy };
}

/** 创建浮层操作按钮（图标 + tooltip） */
function createActionBtn(
  title: string,
  icon: string,
  action: () => void,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = BTN_CLASS;
  btn.dataset.tooltip = title;
  btn.setAttribute('aria-label', title);
  btn.innerHTML = icon;
  btn.addEventListener('mousedown', (e) => e.preventDefault());
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  });
  return btn;
}
