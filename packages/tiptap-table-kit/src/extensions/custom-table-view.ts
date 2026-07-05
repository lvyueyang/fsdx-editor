import { TableView } from '@tiptap/extension-table';
import { addColumn, addRow, TableMap } from '@tiptap/pm/tables';
import type { EditorView } from '@tiptap/pm/view';
import { ICON_PLUS } from '../overlay/icon-svgs';

/**
 * 扩展 Tiptap 内置 TableView，追加表格加列/加行按钮和选区覆盖层容器。
 */
export class CustomTableView extends TableView {
  controlsDiv: HTMLDivElement;
  overlayDiv: HTMLDivElement;
  private editorView: EditorView;

  constructor(
    node: any,
    cellMinWidth: number,
    view: EditorView,
    HTMLAttributes?: Record<string, unknown>,
  ) {
    super(node, cellMinWidth, view, HTMLAttributes);

    this.editorView = view;

    this.controlsDiv = document.createElement('div');
    this.controlsDiv.className = 'tiptap-table-kit-table-controls';
    this.buildControls();
    this.dom.appendChild(this.controlsDiv);

    this.overlayDiv = document.createElement('div');
    this.overlayDiv.className = 'tiptap-table-kit-selection-overlay-container';
    this.dom.appendChild(this.overlayDiv);
  }

  /** 通过 DOM 映射获取表格在文档中的位置 */
  private getTablePos(): number | null {
    try {
      return this.editorView.posAtDOM(this.dom, 0);
    } catch {
      return null;
    }
  }

  /** 构建右侧加列按钮和底部加行按钮 */
  private buildControls() {
    const addColBtn = this.createControlButton(
      'tiptap-table-kit-table-controls-btn--col',
      '添加列',
    );
    addColBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
    addColBtn.addEventListener('click', () => {
      const pos = this.getTablePos();
      if (pos == null) return;
      const map = TableMap.get(this.node);
      const { state, dispatch } = this.editorView;
      const rect = { map, tableStart: pos, table: this.node } as any;
      dispatch(addColumn(state.tr, rect, map.width));
      this.editorView.focus();
    });

    const addRowBtn = this.createControlButton(
      'tiptap-table-kit-table-controls-btn--row',
      '添加行',
    );
    addRowBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
    addRowBtn.addEventListener('click', () => {
      const pos = this.getTablePos();
      if (pos == null) return;
      const map = TableMap.get(this.node);
      const { state, dispatch } = this.editorView;
      const rect = { map, tableStart: pos, table: this.node } as any;
      dispatch(addRow(state.tr, rect, map.height));
      this.editorView.focus();
    });

    this.controlsDiv.appendChild(addColBtn);
    this.controlsDiv.appendChild(addRowBtn);
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
    return super.update(node);
  }
}
