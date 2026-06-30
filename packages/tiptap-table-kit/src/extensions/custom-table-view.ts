import { TableView } from '@tiptap/extension-table';

/**
 * 扩展 Tiptap 内置 TableView，追加表格控件容器和选区覆盖层容器。
 * 两个容器均为 tableWrapper 的直接子节点，用于渲染扩展按钮和选区覆盖层。
 */
export class CustomTableView extends TableView {
  controlsDiv: HTMLDivElement;
  overlayDiv: HTMLDivElement;

  constructor(
    node: any,
    cellMinWidth: number,
    view: any,
    HTMLAttributes?: Record<string, unknown>,
  ) {
    super(node, cellMinWidth, view, HTMLAttributes);

    this.controlsDiv = document.createElement('div');
    this.controlsDiv.className = 'table-controls';
    this.dom.appendChild(this.controlsDiv);

    this.overlayDiv = document.createElement('div');
    this.overlayDiv.className = 'table-selection-overlay-container';
    this.dom.appendChild(this.overlayDiv);
  }

  update(node: Parameters<TableView['update']>[0]) {
    return super.update(node);
  }
}
