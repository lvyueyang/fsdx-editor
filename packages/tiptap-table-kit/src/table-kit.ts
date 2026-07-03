import type { Editor } from '@tiptap/core';
import { Table } from '@tiptap/extension-table';
import {
  clearColumnContent,
  clearRowColumnContent,
  clearRowContent,
  clearSelectedCells,
  copySelectedCells,
  fitToWidth,
  setCellTextColor,
  unsetCellTextColor,
} from './commands/table-cell';
import {
  duplicateColumn,
  duplicateRow,
  moveColumnLeft,
  moveColumnRight,
  moveRowDown,
  moveRowUp,
  sortColumnAsc,
  sortColumnDesc,
} from './commands/table-row-column';
import { CustomTableView } from './extensions/custom-table-view';
import { NodeBackground } from './extensions/node-background';
import { TableCellStyle } from './extensions/table-cell-style';
import { TableSelectionOverlay } from './overlay/table-selection-overlay';
import './styles/table.css';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableKit: {
      moveRowUp: () => ReturnType;
      moveRowDown: () => ReturnType;
      moveColumnLeft: () => ReturnType;
      moveColumnRight: () => ReturnType;
      duplicateRow: () => ReturnType;
      duplicateColumn: () => ReturnType;
      sortColumnAsc: () => ReturnType;
      sortColumnDesc: () => ReturnType;
      clearSelectedCells: () => ReturnType;
      setCellTextColor: (color: string) => ReturnType;
      unsetCellTextColor: () => ReturnType;
      setCellBackgroundColor: (color: string) => ReturnType;
      unsetCellBackgroundColor: () => ReturnType;
      fitToWidth: () => ReturnType;
      copySelectedCells: () => ReturnType;
      clearRowContent: () => ReturnType;
      clearColumnContent: () => ReturnType;
      clearRowColumnContent: (orientation: 'row' | 'column') => ReturnType;
    };
  }
}

/**
 * 表格增强套件，继承 stock Table 扩展，集成自定义视图、单元格样式、选区覆盖层、
 * 节点背景色等子扩展，并注册所有表格操作命令。
 *
 * @example
 * ```ts
 * extensions: [TableKit.configure({ resizable: true }), TableRow, TableCell, TableHeader]
 * ```
 */
export const TableKit = Table.extend({
  addOptions() {
    return {
      ...this.parent!(),
      View: CustomTableView,
    };
  },

  addExtensions() {
    return [TableCellStyle, TableSelectionOverlay, NodeBackground];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      moveRowUp:
        () =>
        ({ editor }: { editor: Editor }) =>
          moveRowUp(editor),
      moveRowDown:
        () =>
        ({ editor }: { editor: Editor }) =>
          moveRowDown(editor),
      moveColumnLeft:
        () =>
        ({ editor }: { editor: Editor }) =>
          moveColumnLeft(editor),
      moveColumnRight:
        () =>
        ({ editor }: { editor: Editor }) =>
          moveColumnRight(editor),
      duplicateRow:
        () =>
        ({ editor }: { editor: Editor }) =>
          duplicateRow(editor),
      duplicateColumn:
        () =>
        ({ editor }: { editor: Editor }) =>
          duplicateColumn(editor),
      sortColumnAsc:
        () =>
        ({ editor }: { editor: Editor }) =>
          sortColumnAsc(editor),
      sortColumnDesc:
        () =>
        ({ editor }: { editor: Editor }) =>
          sortColumnDesc(editor),
      clearSelectedCells:
        () =>
        ({ editor }: { editor: Editor }) =>
          clearSelectedCells(editor),
      setCellTextColor:
        (color: string) =>
        ({ editor }: { editor: Editor }) =>
          setCellTextColor(editor, color),
      unsetCellTextColor:
        () =>
        ({ editor }: { editor: Editor }) =>
          unsetCellTextColor(editor),
      setCellBackgroundColor:
        (color: string) =>
        ({ chain }) =>
          chain().focus().setNodeBackgroundColor(color).run(),
      unsetCellBackgroundColor:
        () =>
        ({ chain }) =>
          chain().focus().unsetNodeBackgroundColor().run(),
      fitToWidth:
        () =>
        ({ editor }: { editor: Editor }) =>
          fitToWidth(editor),
      copySelectedCells:
        () =>
        ({ editor }: { editor: Editor }) =>
          copySelectedCells(editor),
      clearRowContent:
        () =>
        ({ editor }: { editor: Editor }) =>
          clearRowContent(editor),
      clearColumnContent:
        () =>
        ({ editor }: { editor: Editor }) =>
          clearColumnContent(editor),
      clearRowColumnContent:
        (orientation: 'row' | 'column') =>
        ({ editor }: { editor: Editor }) =>
          clearRowColumnContent(editor, orientation),
    };
  },
});
