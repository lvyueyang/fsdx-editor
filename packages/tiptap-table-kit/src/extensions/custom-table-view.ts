import { TableView } from '@tiptap/extension-table';
import { addColumn, addRow, TableMap } from '@tiptap/pm/tables';
import type { EditorView } from '@tiptap/pm/view';
import { ICON_PLUS } from '../overlay/icon-svgs';

const CONTROL_GUTTER = 20;
const BTN_SIZE = CONTROL_GUTTER - 4;
const BTN_GAP = 4;

/**
 * 扩展 Tiptap 内置 TableView，追加表格加列/加行按钮和选区覆盖层容器。
 */
export class CustomTableView extends TableView {
  controlsDiv: HTMLDivElement;
  overlayDiv: HTMLDivElement;
  private addColBtn: HTMLButtonElement | null = null;
  private addRowBtn: HTMLButtonElement | null = null;
  private editorView: EditorView;
  private resizeObserver: ResizeObserver | null = null;
  private tableEl: HTMLTableElement | null = null;
  private onScroll = () => this.positionControls();

  constructor(
    node: any,
    cellMinWidth: number,
    view: EditorView,
    HTMLAttributes?: Record<string, unknown>,
  ) {
    super(node, cellMinWidth, view, HTMLAttributes);

    this.editorView = view;

    const tableContainer = document.createElement('div');
    tableContainer.className = 'tiptap-table-kit-table-container';
    this.dom.insertBefore(tableContainer, this.table);
    tableContainer.appendChild(this.table);

    this.dom.addEventListener('scroll', this.onScroll, { passive: true });

    this.controlsDiv = document.createElement('div');
    this.controlsDiv.className = 'tiptap-table-kit-table-controls';
    this.buildControls();
    this.dom.appendChild(this.controlsDiv);

    this.overlayDiv = document.createElement('div');
    this.overlayDiv.className = 'tiptap-table-kit-selection-overlay-container';
    this.dom.appendChild(this.overlayDiv);

    this.getTableElement();
    this.positionControls();

    if (this.tableEl) {
      this.resizeObserver = new ResizeObserver(() => {
        this.positionControls();
      });
      this.resizeObserver.observe(this.tableEl);
    }
  }

  /** 通过 DOM 映射获取表格在文档中的位置 */
  private getTablePos(): number | null {
    try {
      return this.editorView.posAtDOM(this.dom, 0);
    } catch {
      return null;
    }
  }

  private getTableElement() {
    const el = this.dom.querySelector('table');
    this.tableEl = el instanceof HTMLTableElement ? el : null;
  }

  /** 动态计算并设置加列/加行按钮位置，使其漂浮在表格外侧 */
  private positionControls() {
    if (!this.tableEl || !this.addColBtn || !this.addRowBtn) return;

    const controlsRect = this.controlsDiv.getBoundingClientRect();
    const tableRect = this.tableEl.getBoundingClientRect();

    const tableLeft = tableRect.left - controlsRect.left;
    const tableTop = tableRect.top - controlsRect.top;
    const tableWidth = tableRect.width;
    const tableHeight = tableRect.height;
    const tableRight = tableLeft + tableWidth;
    const tableBottom = tableTop + tableHeight;

    this.addColBtn.style.left = `${tableRight + BTN_GAP}px`;
    this.addColBtn.style.top = `${tableTop}px`;
    this.addColBtn.style.width = `${BTN_SIZE}px`;
    this.addColBtn.style.height = `${tableHeight}px`;

    this.addRowBtn.style.left = `${tableLeft}px`;
    this.addRowBtn.style.top = `${tableBottom + BTN_GAP}px`;
    this.addRowBtn.style.width = `${tableWidth}px`;
    this.addRowBtn.style.height = `${BTN_SIZE}px`;
  }

  /** 构建右侧加列按钮和底部加行按钮 */
  private buildControls() {
    this.addColBtn = this.createControlButton(
      'tiptap-table-kit-table-controls-btn--col',
      '添加列',
    );
    this.addColBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
    this.addColBtn.addEventListener('click', () => {
      const pos = this.getTablePos();
      if (pos == null) return;
      const map = TableMap.get(this.node);
      const { state, dispatch } = this.editorView;
      const rect = { map, tableStart: pos, table: this.node } as any;
      dispatch(addColumn(state.tr, rect, map.width));
      this.editorView.focus();
    });

    this.addRowBtn = this.createControlButton(
      'tiptap-table-kit-table-controls-btn--row',
      '添加行',
    );
    this.addRowBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
    this.addRowBtn.addEventListener('click', () => {
      const pos = this.getTablePos();
      if (pos == null) return;
      const map = TableMap.get(this.node);
      const { state, dispatch } = this.editorView;
      const rect = { map, tableStart: pos, table: this.node } as any;
      dispatch(addRow(state.tr, rect, map.height));
      this.editorView.focus();
    });

    this.controlsDiv.appendChild(this.addColBtn);
    this.controlsDiv.appendChild(this.addRowBtn);
  }

  private createControlButton(className: string, title: string) {
    const btn = document.createElement('button');
    btn.className = `tiptap-table-kit-table-controls-btn ${className}`;
    btn.innerHTML = ICON_PLUS;
    btn.title = title;
    btn.type = 'button';
    return btn;
  }

  update(node: Parameters<TableView['update']>[0]) {
    const result = super.update(node);
    this.getTableElement();
    this.positionControls();
    return result;
  }

  destroy() {
    this.dom.removeEventListener('scroll', this.onScroll);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }
}
