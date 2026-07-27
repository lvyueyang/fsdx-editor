/**
 * 选区覆盖层扩展：跟踪表格选区变化，在表格控制插件注入的容器中
 * 维护选区边框与操作手柄；手柄点击时打开上下文菜单。
 */
import type { Editor } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { CellSelection, cellAround } from '@tiptap/pm/tables';
import { ICON_DOTS_VERTICAL } from '../icons';
import { closeActiveContextMenu, openContextMenu } from '../menu/context-menu';
import { resolveTranslations } from '../storage';

/** 矩形区域（可用于视口坐标或容器本地坐标） */
interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** 覆盖层定位目标：容器本地坐标矩形 + 挂载容器 */
interface OverlayTarget {
  rect: Rect;
  container: HTMLElement;
}

/** 计算单元格选区所有单元格的视口外接矩形 */
function getCellsViewportRect(editor: Editor): Rect | null {
  const { selection } = editor.state;
  if (!(selection instanceof CellSelection)) return null;

  const rects: DOMRect[] = [];
  selection.forEachCell((_node, pos) => {
    const dom = editor.view.nodeDOM(pos);
    if (dom instanceof HTMLElement) {
      rects.push(dom.getBoundingClientRect());
    }
  });
  if (rects.length === 0) return null;

  return {
    left: Math.min(...rects.map((r) => r.left)),
    top: Math.min(...rects.map((r) => r.top)),
    right: Math.max(...rects.map((r) => r.right)),
    bottom: Math.max(...rects.map((r) => r.bottom)),
  };
}

/** 找到单元格选区所属的表格包装器 */
function findWrapperEl(editor: Editor): HTMLElement | null {
  const { selection } = editor.state;
  if (!(selection instanceof CellSelection)) return null;

  let wrapper: HTMLElement | null = null;
  selection.forEachCell((_node, pos) => {
    if (wrapper) return;
    const dom = editor.view.nodeDOM(pos);
    if (dom instanceof HTMLElement) {
      const el = dom.closest('.tableWrapper');
      wrapper = el instanceof HTMLElement ? el : null;
    }
  });
  return wrapper;
}

/** 在表格包装器内查找覆盖层容器（由表格控制插件注入） */
function findOverlayContainer(wrapper: HTMLElement | null): HTMLElement | null {
  const el = wrapper?.querySelector(
    '.tiptap-table-plus-selection-overlay-container',
  );
  return el instanceof HTMLElement ? el : null;
}

/** 将视口矩形换算为相对容器的本地坐标 */
function toLocalRect(
  rect: Rect | null,
  container: HTMLElement | null,
): OverlayTarget | null {
  if (!rect || !container) return null;
  const base = container.getBoundingClientRect();
  return {
    container,
    rect: {
      left: rect.left - base.left,
      top: rect.top - base.top,
      right: rect.right - base.left,
      bottom: rect.bottom - base.top,
    },
  };
}

/** 根据当前选区解析覆盖层定位目标，不在表格中时返回 null */
function resolveOverlayTarget(editor: Editor): OverlayTarget | null {
  const { selection } = editor.state;

  if (selection instanceof CellSelection) {
    return toLocalRect(
      getCellsViewportRect(editor),
      findOverlayContainer(findWrapperEl(editor)),
    );
  }

  if (editor.isActive('table')) {
    const cell = cellAround(selection.$anchor);
    const dom = cell ? editor.view.nodeDOM(cell.pos) : null;
    if (!(dom instanceof HTMLElement)) return null;
    const wrapperEl = dom.closest('.tableWrapper');
    return toLocalRect(
      dom.getBoundingClientRect(),
      findOverlayContainer(wrapperEl instanceof HTMLElement ? wrapperEl : null),
    );
  }

  return null;
}

/**
 * Tiptap Extension：自动管理表格选区的边框、操作手柄和上下文菜单入口
 */
export const TableSelectionOverlay = Extension.create(() => {
  let borderEl: HTMLDivElement | null = null;
  let handleEl: HTMLButtonElement | null = null;
  let currentContainer: HTMLElement | null = null;
  let editorRef: Editor | null = null;

  /** 移除覆盖层元素并关闭可能打开的上下文菜单 */
  function destroyOverlay() {
    borderEl?.remove();
    borderEl = null;
    handleEl?.remove();
    handleEl = null;
    currentContainer = null;
    closeActiveContextMenu();
  }

  /** 创建选区操作手柄按钮 */
  function createHandleEl(editor: Editor): HTMLButtonElement {
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'tiptap-table-plus-selection-handle';
    handle.setAttribute('aria-label', resolveTranslations(editor).tableActions);
    handle.innerHTML = `<span class="tiptap-table-plus-selection-handle-dot">${ICON_DOTS_VERTICAL}</span>`;
    handle.addEventListener('click', (e) => {
      e.stopPropagation();
      openContextMenu(handle, editor);
    });
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    return handle;
  }

  /** 确保边框与手柄挂载到目标容器 */
  function mountOverlayElements(editor: Editor, container: HTMLElement) {
    if (!borderEl) {
      borderEl = document.createElement('div');
      borderEl.className = 'tiptap-table-plus-selection-border';
    }
    if (borderEl.parentNode !== container) {
      container.appendChild(borderEl);
    }

    if (!handleEl) {
      handleEl = createHandleEl(editor);
    }
    if (handleEl.parentNode !== container) {
      container.appendChild(handleEl);
    }

    currentContainer = container;
  }

  /** 按目标矩形摆放边框与手柄 */
  function positionOverlayElements(target: OverlayTarget) {
    const { rect } = target;
    if (borderEl) {
      Object.assign(borderEl.style, {
        position: 'absolute',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.right - rect.left}px`,
        height: `${rect.bottom - rect.top}px`,
      });
    }
    if (handleEl) {
      Object.assign(handleEl.style, {
        position: 'absolute',
        left: `${rect.right}px`,
        top: `${rect.top + (rect.bottom - rect.top) / 2}px`,
      });
    }
  }

  /** 根据当前选区状态刷新覆盖层 */
  function updateOverlay() {
    const editor = editorRef;
    if (!editor) return;

    if (!editor.isEditable) {
      destroyOverlay();
      return;
    }

    const target = resolveOverlayTarget(editor);
    if (!target) {
      destroyOverlay();
      return;
    }

    if (currentContainer !== target.container) {
      destroyOverlay();
    }
    mountOverlayElements(editor, target.container);
    positionOverlayElements(target);
  }

  /** 在下一帧刷新覆盖层，合并高频的选区/事务事件 */
  function scheduleOverlayUpdate() {
    requestAnimationFrame(updateOverlay);
  }

  return {
    name: 'tableSelectionOverlay',

    onCreate() {
      editorRef = this.editor;
      this.editor.on('selectionUpdate', scheduleOverlayUpdate);
      this.editor.on('transaction', scheduleOverlayUpdate);
    },

    onDestroy() {
      if (editorRef) {
        editorRef.off('selectionUpdate', scheduleOverlayUpdate);
        editorRef.off('transaction', scheduleOverlayUpdate);
      }
      destroyOverlay();
      editorRef = null;
    },
  };
});
