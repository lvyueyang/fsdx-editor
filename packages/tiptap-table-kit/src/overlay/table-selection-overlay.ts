import type { Editor } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { CellSelection, cellAround } from '@tiptap/pm/tables';
import { getTableKitTranslations } from '../table-kit';
import { openContextMenu } from './context-menu';

interface CellRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function getCellsRect(editor: Editor): CellRect | null {
  const { selection } = editor.state;
  if (!(selection instanceof CellSelection)) return null;

  const cells: DOMRect[] = [];
  selection.forEachCell((_node, pos) => {
    const dom = editor.view.nodeDOM(pos);
    if (dom instanceof HTMLElement) {
      cells.push(dom.getBoundingClientRect());
    }
  });
  if (cells.length === 0) return null;
  return {
    left: Math.min(...cells.map((r) => r.left)),
    top: Math.min(...cells.map((r) => r.top)),
    right: Math.max(...cells.map((r) => r.right)),
    bottom: Math.max(...cells.map((r) => r.bottom)),
  };
}

function getSingleCellRect(editor: Editor): {
  rect: CellRect;
  wrapper: HTMLElement;
} | null {
  const cell = cellAround(editor.state.selection.$anchor);
  if (!cell) return null;
  const dom = editor.view.nodeDOM(cell.pos);
  if (!(dom instanceof HTMLElement)) return null;
  const el = dom.closest('.tableWrapper');
  const wrapper = el instanceof HTMLElement ? el : null;
  if (!wrapper) return null;
  const cellDom = dom.getBoundingClientRect();
  return {
    rect: {
      left: cellDom.left,
      top: cellDom.top,
      right: cellDom.right,
      bottom: cellDom.bottom,
    },
    wrapper,
  };
}

function findWrapperEl(editor: Editor): HTMLElement | null {
  const { selection } = editor.state;
  if (!(selection instanceof CellSelection)) return null;
  let wrapper: HTMLElement | null = null;
  selection.forEachCell((_node, pos) => {
    if (!wrapper) {
      const dom = editor.view.nodeDOM(pos);
      if (dom instanceof HTMLElement) {
        const el = dom.closest('.tableWrapper');
        wrapper = el instanceof HTMLElement ? el : null;
      }
    }
  });
  return wrapper;
}

function findOverlayContainer(wrapper: HTMLElement | null): HTMLElement | null {
  if (!wrapper) return null;
  const el = wrapper.querySelector(
    '.tiptap-table-kit-selection-overlay-container',
  );
  return el instanceof HTMLElement ? el : null;
}

/**
 * Tiptap Extension：自动管理表格选区的边框、操作手柄和原生上下文菜单
 */
export const TableSelectionOverlay = Extension.create(() => {
  let borderEl: HTMLDivElement | null = null;
  let handleEl: HTMLButtonElement | null = null;
  let currentContainer: HTMLElement | null = null;
  let editorRef: Editor | null = null;

  function destroyOverlay() {
    borderEl?.remove();
    borderEl = null;
    handleEl?.remove();
    handleEl = null;
    currentContainer = null;

    const menu = document.querySelector('.tiptap-table-kit-context-menu');
    if (menu) menu.remove();
  }

  function ensureElements(editor: Editor, container: HTMLElement) {
    if (!borderEl) {
      borderEl = document.createElement('div');
      borderEl.className = 'tiptap-table-kit-selection-border';
    }
    if (!borderEl.parentNode || borderEl.parentNode !== container) {
      container.appendChild(borderEl);
    }

    if (!handleEl) {
      handleEl = document.createElement('button');
      handleEl.type = 'button';
      handleEl.className = 'tiptap-table-kit-selection-handle';
      handleEl.setAttribute(
        'aria-label',
        getTableKitTranslations(editor).tableActions,
      );
      handleEl.innerHTML =
        '<span class="tiptap-table-kit-selection-handle-dot"><svg class="tiptap-table-kit-selection-handle-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 14C9.10457 14 10 14.8954 10 16C10 17.1046 9.10457 18 8 18C6.89543 18 6 17.1046 6 16C6 14.8954 6.89543 14 8 14ZM16 14C17.1046 14 18 14.8954 18 16C18 17.1046 17.1046 18 16 18C14.8954 18 14 17.1046 14 16C14 14.8954 14.8954 14 16 14ZM8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6ZM16 6C17.1046 6 18 6.89543 18 8C18 9.10457 17.1046 10 16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6Z" fill="currentColor"></path></svg></span>';

      handleEl.addEventListener('click', (e) => {
        e.stopPropagation();
        openContextMenu(handleEl!, editor);
      });

      handleEl.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    }
    if (!handleEl.parentNode || handleEl.parentNode !== container) {
      container.appendChild(handleEl);
    }

    currentContainer = container;
  }

  function updateOverlay() {
    const editor = editorRef;
    if (!editor) return;

    const { selection } = editor.state;
    if (!editor.isEditable) {
      destroyOverlay();
      return;
    }

    let cellsRect: CellRect | null = null;
    let container: HTMLElement | null = null;

    if (selection instanceof CellSelection) {
      const wrapper = findWrapperEl(editor);
      const rect = getCellsRect(editor);
      container = findOverlayContainer(wrapper);
      const containerRect = container?.getBoundingClientRect() ?? null;

      if (rect && containerRect) {
        cellsRect = {
          left: rect.left - containerRect.left,
          top: rect.top - containerRect.top,
          right: rect.right - containerRect.left,
          bottom: rect.bottom - containerRect.top,
        };
      }
    } else if (editor.isActive('tableKit')) {
      const result = getSingleCellRect(editor);
      if (result) {
        container = findOverlayContainer(result.wrapper);
        const containerRect = container?.getBoundingClientRect() ?? null;
        if (containerRect) {
          cellsRect = {
            left: result.rect.left - containerRect.left,
            top: result.rect.top - containerRect.top,
            right: result.rect.right - containerRect.left,
            bottom: result.rect.bottom - containerRect.top,
          };
        }
      }
    }

    if (!cellsRect || !container) {
      destroyOverlay();
      return;
    }

    if (currentContainer !== container) {
      destroyOverlay();
    }

    ensureElements(editor, container);

    const width = cellsRect.right - cellsRect.left;
    const height = cellsRect.bottom - cellsRect.top;

    if (borderEl) {
      Object.assign(borderEl.style, {
        position: 'absolute',
        left: `${cellsRect.left}px`,
        top: `${cellsRect.top}px`,
        width: `${width}px`,
        height: `${height}px`,
      });
    }

    if (handleEl) {
      Object.assign(handleEl.style, {
        position: 'absolute',
        left: `${cellsRect.right}px`,
        top: `${cellsRect.top + height / 2}px`,
      });
    }
  }

  const handler = () => {
    requestAnimationFrame(updateOverlay);
  };

  return {
    name: 'tableSelectionOverlay',

    onCreate() {
      editorRef = this.editor;
      this.editor.on('selectionUpdate', handler);
      this.editor.on('transaction', handler);
    },

    onDestroy() {
      if (editorRef) {
        editorRef.off('selectionUpdate', handler);
        editorRef.off('transaction', handler);
      }
      destroyOverlay();
      editorRef = null;
    },
  };
});
