import { Plugin } from '@tiptap/pm/state';
import { addColumn, addRow, TableMap } from '@tiptap/pm/tables';
import type { EditorView } from '@tiptap/pm/view';
import type { TablePlusTranslations } from './i18n/types';
import { ICON_PLUS } from './overlay/icon-svgs';

const CONTROL_GUTTER = 20;
const BTN_GAP = 4;

interface TableControls {
  controlsDiv: HTMLDivElement;
  overlayDiv: HTMLDivElement;
  addColBtn: HTMLButtonElement;
  addRowBtn: HTMLButtonElement;
  resizeObserver: ResizeObserver | null;
  scrollHandler: () => void;
  tableEl: HTMLTableElement | null;
  wrapper: HTMLElement;
}

/** 获取表格在文档中的位置 */
function getTablePos(view: EditorView, wrapper: HTMLElement): number | null {
  try {
    return view.posAtDOM(wrapper, 0);
  } catch {
    return null;
  }
}

/** 创建控制按钮 */
function createControlButton(
  className: string,
  title: string,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = `tiptap-table-plus-table-controls-btn ${className}`;
  btn.innerHTML = ICON_PLUS;
  btn.title = title;
  btn.type = 'button';
  return btn;
}

/** 动态定位加行/加列按钮 */
function positionControls(
  controlsDiv: HTMLDivElement,
  addColBtn: HTMLButtonElement,
  addRowBtn: HTMLButtonElement,
  tableEl: HTMLTableElement,
) {
  const controlsRect = controlsDiv.getBoundingClientRect();
  const tableRect = tableEl.getBoundingClientRect();

  const tableLeft = tableRect.left - controlsRect.left;
  const tableTop = tableRect.top - controlsRect.top;
  const tableWidth = tableRect.width;
  const tableHeight = tableRect.height;
  const tableRight = tableLeft + tableWidth;
  const tableBottom = tableTop + tableHeight;
  const btnSize = CONTROL_GUTTER - 4;

  addColBtn.style.left = `${tableRight + BTN_GAP}px`;
  addColBtn.style.top = `${tableTop}px`;
  addColBtn.style.width = `${btnSize}px`;
  addColBtn.style.height = `${tableHeight}px`;

  addRowBtn.style.left = `${tableLeft}px`;
  addRowBtn.style.top = `${tableBottom + BTN_GAP}px`;
  addRowBtn.style.width = `${tableWidth}px`;
  addRowBtn.style.height = `${btnSize}px`;
}

/** 为表格包装器附加控制层和选区覆盖层 */
function attachControls(
  wrapper: HTMLElement,
  view: EditorView,
  translations: TablePlusTranslations,
): TableControls {
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'tiptap-table-plus-table-controls';

  const overlayDiv = document.createElement('div');
  overlayDiv.className = 'tiptap-table-plus-selection-overlay-container';

  const addColBtn = createControlButton(
    'tiptap-table-plus-table-controls-btn--col',
    translations.addColumn,
  );
  addColBtn.addEventListener('mousedown', (e) => e.preventDefault());
  addColBtn.addEventListener('click', () => {
    const pos = getTablePos(view, wrapper);
    if (pos == null) return;
    const doc = view.state.doc;
    const node = doc.nodeAt(pos);
    if (!node) return;
    const map = TableMap.get(node);
    const { state, dispatch } = view;
    const rect = { map, tableStart: pos, table: node } as any;
    dispatch(addColumn(state.tr, rect, map.width));
    view.focus();
  });

  const addRowBtn = createControlButton(
    'tiptap-table-plus-table-controls-btn--row',
    translations.addRow,
  );
  addRowBtn.addEventListener('mousedown', (e) => e.preventDefault());
  addRowBtn.addEventListener('click', () => {
    const pos = getTablePos(view, wrapper);
    if (pos == null) return;
    const doc = view.state.doc;
    const node = doc.nodeAt(pos);
    if (!node) return;
    const map = TableMap.get(node);
    const { state, dispatch } = view;
    const rect = { map, tableStart: pos, table: node } as any;
    dispatch(addRow(state.tr, rect, map.height));
    view.focus();
  });

  controlsDiv.appendChild(addColBtn);
  controlsDiv.appendChild(addRowBtn);
  wrapper.appendChild(controlsDiv);
  wrapper.appendChild(overlayDiv);

  const tableEl = wrapper.querySelector('table');
  const resizeObserver =
    tableEl instanceof HTMLTableElement
      ? new ResizeObserver(() => {
          positionControls(controlsDiv, addColBtn, addRowBtn, tableEl);
        })
      : null;
  if (resizeObserver && tableEl) {
    resizeObserver.observe(tableEl);
  }

  const scrollHandler = () =>
    positionControls(
      controlsDiv,
      addColBtn,
      addRowBtn,
      tableEl as HTMLTableElement,
    );
  wrapper.addEventListener('scroll', scrollHandler, { passive: true });

  if (tableEl instanceof HTMLTableElement) {
    positionControls(controlsDiv, addColBtn, addRowBtn, tableEl);
  }

  return {
    controlsDiv,
    overlayDiv,
    addColBtn,
    addRowBtn,
    resizeObserver,
    scrollHandler,
    tableEl: tableEl instanceof HTMLTableElement ? tableEl : null,
    wrapper,
  };
}

/** 移除附加的控制元素 */
function detachControls(ctrl: TableControls) {
  ctrl.resizeObserver?.disconnect();
  ctrl.wrapper.removeEventListener('scroll', ctrl.scrollHandler);
  ctrl.controlsDiv.remove();
  ctrl.overlayDiv.remove();
}

/**
 * ProseMirror Plugin：为编辑器中所有表格注入浮动加行/加列按钮和选区覆盖层容器。
 * 替代 CustomTableView 的 NodeView 方式，避免与用户显式注册的 Table 扩展产生 keyed plugin 冲突。
 */
export function createTableControlsPlugin(
  getTranslations: () => TablePlusTranslations,
): Plugin {
  return new Plugin({
    view(editorView) {
      const managed = new Map<HTMLElement, TableControls>();

      function sync() {
        const doc = editorView.state.doc;
        const activeWrappers = new Set<HTMLElement>();

        doc.descendants((node, pos) => {
          if (node.type.name !== 'table') return;
          const wrapper = editorView.nodeDOM(pos);
          if (!(wrapper instanceof HTMLElement)) return;
          activeWrappers.add(wrapper);

          if (!managed.has(wrapper)) {
            managed.set(
              wrapper,
              attachControls(wrapper, editorView, getTranslations()),
            );
          }
        });

        for (const [wrapper, ctrl] of managed) {
          if (
            !activeWrappers.has(wrapper) ||
            !editorView.dom.contains(wrapper)
          ) {
            detachControls(ctrl);
            managed.delete(wrapper);
          }
        }
      }

      sync();

      return {
        update() {
          sync();
        },
        destroy() {
          for (const ctrl of managed.values()) {
            detachControls(ctrl);
          }
          managed.clear();
        },
      };
    },
  });
}
