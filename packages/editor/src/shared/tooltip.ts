import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';

const TOOLTIP_CLASS = 'fsdx-editor-tooltip';
const SHOW_DELAY = 150;

/** 已绑定事件委托的容器 → 其 tooltip 宿主元素 */
const hosts = new WeakMap<HTMLElement, HTMLElement>();

/** 取事件目标上最近的 data-tooltip 元素 */
function getTarget(e: Event): HTMLElement | null {
  const target = e.target as HTMLElement | null;
  return target?.closest?.('[data-tooltip]') ?? null;
}

/**
 * 为容器内所有带 data-tooltip 属性的元素绑定自定义 tooltip（事件委托）。
 * 每个容器共享一个 tooltip 宿主，hover 与键盘 focus 均可触发；
 * 宿主随容器被移除时自动清理，避免 floating-ui 观察器泄漏。
 */
export function bindTooltips(container: HTMLElement): void {
  const existing = hosts.get(container);
  if (existing?.isConnected) return;

  const tooltip = document.createElement('div');
  tooltip.className = TOOLTIP_CLASS;
  tooltip.hidden = true;
  container.appendChild(tooltip);
  hosts.set(container, tooltip);

  let hoverTarget: HTMLElement | null = null;
  let focusTarget: HTMLElement | null = null;
  let shownFor: HTMLElement | null = null;
  let cleanup: (() => void) | null = null;
  let showTimer: ReturnType<typeof setTimeout> | null = null;

  const hideNow = () => {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }
    cleanup?.();
    cleanup = null;
    tooltip.hidden = true;
    tooltip.textContent = '';
    shownFor = null;
  };

  /** 当前应展示 tooltip 的目标：hover 优先，其次键盘 focus */
  const activeTarget = () => hoverTarget ?? focusTarget ?? null;

  const refresh = () => {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }
    const el = activeTarget();
    const text = el?.getAttribute('data-tooltip') ?? null;
    if (!el || !text) {
      hideNow();
      return;
    }
    if (el === shownFor) return;
    hideNow();
    showTimer = setTimeout(() => {
      shownFor = el;
      tooltip.textContent = text;
      tooltip.hidden = false;
      cleanup = autoUpdate(el, tooltip, () => {
        if (!el.isConnected || !tooltip.isConnected) {
          hideNow();
          return;
        }
        computePosition(el, tooltip, {
          placement: 'bottom',
          middleware: [offset(6), flip(), shift({ padding: 8 })],
        }).then(({ x, y }) => {
          Object.assign(tooltip.style, {
            position: 'fixed',
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      });
    }, SHOW_DELAY);
  };

  const isStillInside = (e: Event, t: HTMLElement) => {
    const related = (e as MouseEvent).relatedTarget as Node | null;
    return !!(related && t.contains(related));
  };

  const onHover = (e: Event) => {
    const t = getTarget(e);
    if (t) {
      hoverTarget = t;
      refresh();
    }
  };

  const onHoverOut = (e: Event) => {
    const t = getTarget(e);
    if (t && !isStillInside(e, t)) {
      hoverTarget = null;
      refresh();
    }
  };

  const onFocus = (e: Event) => {
    const t = getTarget(e);
    if (t) {
      focusTarget = t;
      refresh();
    }
  };

  const onFocusOut = (e: Event) => {
    const t = getTarget(e);
    if (t && !isStillInside(e, t)) {
      focusTarget = null;
      refresh();
    }
  };

  container.addEventListener('mouseover', onHover);
  container.addEventListener('mouseout', onHoverOut);
  container.addEventListener('focusin', onFocus);
  container.addEventListener('focusout', onFocusOut);

  // 宿主被移除（容器 innerHTML 清空或气泡菜单隐藏）时彻底清理并解除绑定
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.removedNodes) {
        if (node === tooltip) {
          observer.disconnect();
          container.removeEventListener('mouseover', onHover);
          container.removeEventListener('mouseout', onHoverOut);
          container.removeEventListener('focusin', onFocus);
          container.removeEventListener('focusout', onFocusOut);
          hideNow();
          hosts.delete(container);
          return;
        }
      }
    }
  });
  observer.observe(container, { childList: true });
}
