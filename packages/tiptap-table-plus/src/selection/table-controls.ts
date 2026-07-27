/**
 * 表格控制插件：ProseMirror Plugin，为编辑器中的每个表格包装器
 * 注入"追加行/列"按钮和选区覆盖层容器，并随表格增删自动同步。
 */
import { Plugin } from '@tiptap/pm/state';
import { addColumn, addRow, TableMap, type TableRect } from '@tiptap/pm/tables';
import type { EditorView } from '@tiptap/pm/view';
import type { TablePlusTranslations } from '../i18n/types';
import { ICON_PLUS } from '../icons';

const CONTROL_GUTTER = 20;
const BTN_GAP = 4;

/** 单个表格包装器上挂载的控制元素 */
interface TableControls {
  controlsDiv: HTMLDivElement;
  overlayDiv: HTMLDivElement;
  /** 表格节点的当前文档位置，每次同步时刷新（按钮点击时惰性读取） */
  posRef: { current: number };
  destroy: () => void;
}

/** 创建追加行/列按钮，点击时在表格末尾追加一行或一列 */
function createAppendButton(
  view: EditorView,
  posRef: { current: number },
  orientation: 'row' | 'column',
  title: string,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = `tiptap-table-plus-table-controls-btn tiptap-table-plus-table-controls-btn--${orientation === 'column' ? 'col' : 'row'}`;
  btn.innerHTML = ICON_PLUS;
  btn.title = title;
  btn.type = 'button';
  btn.addEventListener('mousedown', (e) => e.preventDefault());
  btn.addEventListener('click', () => {
    const tablePos = posRef.current;
    const table = view.state.doc.nodeAt(tablePos);
    if (!table || table.type.name !== 'table') return;

    const map = TableMap.get(table);
    // addColumn/addRow 仅解构 map/tableStart/table 三个字段；
    // tableStart 是表格内容起点，即表格节点位置 + 1
    const rect = { map, tableStart: tablePos + 1, table } as TableRect;
    const tr =
      orientation === 'column'
        ? addColumn(view.state.tr, rect, map.width)
        : addRow(view.state.tr, rect, map.height);
    view.dispatch(tr);
    view.focus();
  });
  return btn;
}

/** 按表格当前位置摆放两个追加按钮 */
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
  const tableRight = tableLeft + tableRect.width;
  const tableBottom = tableTop + tableRect.height;
  const btnSize = CONTROL_GUTTER - 4;

  Object.assign(addColBtn.style, {
    left: `${tableRight + BTN_GAP}px`,
    top: `${tableTop}px`,
    width: `${btnSize}px`,
    height: `${tableRect.height}px`,
  });

  Object.assign(addRowBtn.style, {
    left: `${tableLeft}px`,
    top: `${tableBottom + BTN_GAP}px`,
    width: `${tableRect.width}px`,
    height: `${btnSize}px`,
  });
}

/** 为表格包装器挂载控制层与覆盖层容器，返回清理句柄 */
function attachControls(
  wrapper: HTMLElement,
  view: EditorView,
  translations: TablePlusTranslations,
  tablePos: number,
): TableControls {
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'tiptap-table-plus-table-controls';

  const overlayDiv = document.createElement('div');
  overlayDiv.className = 'tiptap-table-plus-selection-overlay-container';

  const posRef = { current: tablePos };
  const addColBtn = createAppendButton(
    view,
    posRef,
    'column',
    translations.addColumn,
  );
  const addRowBtn = createAppendButton(
    view,
    posRef,
    'row',
    translations.addRow,
  );
  controlsDiv.append(addColBtn, addRowBtn);
  wrapper.append(controlsDiv, overlayDiv);

  const tableEl = wrapper.querySelector('table');
  let resizeObserver: ResizeObserver | null = null;
  let reposition: (() => void) | null = null;

  if (tableEl instanceof HTMLTableElement) {
    reposition = () =>
      positionControls(controlsDiv, addColBtn, addRowBtn, tableEl);
    resizeObserver = new ResizeObserver(reposition);
    resizeObserver.observe(tableEl);
    wrapper.addEventListener('scroll', reposition, { passive: true });
    reposition();
  }

  return {
    controlsDiv,
    overlayDiv,
    posRef,
    destroy() {
      resizeObserver?.disconnect();
      if (reposition) wrapper.removeEventListener('scroll', reposition);
      controlsDiv.remove();
      overlayDiv.remove();
    },
  };
}

/**
 * ProseMirror Plugin：为编辑器中所有表格注入浮动加行/加列按钮和选区覆盖层容器。
 * 替代 NodeView 方式，避免与用户显式注册的 Table 扩展产生 keyed plugin 冲突。
 */
export function createTableControlsPlugin(
  getTranslations: () => TablePlusTranslations,
): Plugin {
  return new Plugin({
    view(editorView) {
      const managed = new Map<HTMLElement, TableControls>();

      /** 扫描文档：为新增表格挂载控制层，刷新位置，移除已失效表格的控制层 */
      function syncTableControls() {
        const activeWrappers = new Set<HTMLElement>();

        editorView.state.doc.descendants((node, pos) => {
          if (node.type.name !== 'table') return;
          const wrapper = editorView.nodeDOM(pos);
          if (!(wrapper instanceof HTMLElement)) return;
          activeWrappers.add(wrapper);

          const controls = managed.get(wrapper);
          if (controls) {
            // 表格位置可能随文档编辑变化，每次同步时刷新
            controls.posRef.current = pos;
          } else {
            managed.set(
              wrapper,
              attachControls(wrapper, editorView, getTranslations(), pos),
            );
          }
        });

        for (const [wrapper, controls] of managed) {
          if (
            !activeWrappers.has(wrapper) ||
            !editorView.dom.contains(wrapper)
          ) {
            controls.destroy();
            managed.delete(wrapper);
          }
        }
      }

      syncTableControls();

      return {
        update: syncTableControls,
        destroy() {
          for (const controls of managed.values()) {
            controls.destroy();
          }
          managed.clear();
        },
      };
    },
  });
}
