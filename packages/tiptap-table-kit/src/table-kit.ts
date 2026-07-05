import type { Editor } from '@tiptap/core';
import type { TableOptions } from '@tiptap/extension-table';
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
import { enUS } from './i18n/en-US';
import type { TableKitTranslations } from './i18n/types';
import { zhCN } from './i18n/zh-CN';
import { TableSelectionOverlay } from './overlay/table-selection-overlay';
import { editorStateMap, getOrInitState } from './utils/state-store';

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
      setTableKitTheme: (theme: 'light' | 'dark') => ReturnType;
    };
  }
}

/** 获取指定编辑器实例的当前翻译对象 */
export function getTableKitTranslations(
  editor: Editor | null,
): TableKitTranslations {
  if (!editor) return zhCN;
  return getOrInitState(editor).translations;
}

/** 获取指定编辑器实例的当前主题 */
export function getTableKitTheme(editor: Editor | null): 'light' | 'dark' {
  if (!editor) return 'light';
  return getOrInitState(editor).theme;
}

/** 获取指定编辑器实例的当前 locale */
export function getTableKitLocale(editor: Editor | null): 'zh-CN' | 'en-US' {
  if (!editor) return 'zh-CN';
  return getOrInitState(editor).locale;
}

/** 表格增强套件的配置选项 */
interface TableKitOptions extends TableOptions {
  theme: 'light' | 'dark';
  locale: 'zh-CN' | 'en-US';
  translations?: Partial<TableKitTranslations>;
}

/**
 * 表格增强套件，继承 stock Table 扩展，集成自定义视图、单元格样式、选区覆盖层、
 * 节点背景色等子扩展，并注册所有表格操作命令。
 *
 * @example
 * ```ts
 * extensions: [
 *   TableKit.configure({
 *     resizable: true,
 *     theme: 'dark',
 *     locale: 'en-US',
 *   }),
 *   TableRow, TableCell, TableHeader
 * ]
 * ```
 */
export const TableKit = Table.extend<TableKitOptions>({
  name: 'tableKit',

  addOptions(): TableKitOptions {
    const parentOptions = this.parent!() as TableOptions;
    return {
      ...parentOptions,
      View: CustomTableView,
      theme: 'light',
      locale: 'zh-CN',
      translations: undefined,
    };
  },

  onCreate() {
    const options = this.options as TableKitOptions;

    const locale = options.locale ?? 'zh-CN';
    const base = locale === 'en-US' ? enUS : zhCN;
    const translations = options.translations
      ? { ...base, ...options.translations }
      : base;

    const theme = options.theme ?? 'light';

    editorStateMap.set(this.editor, { translations, theme, locale });

    this.editor.view.dom.classList.add('tiptap-table-kit');
    if (theme === 'dark') {
      this.editor.view.dom.classList.add('tiptap-table-kit-dark');
    }
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
        ({ editor }: { editor: Editor }) =>
          editor.chain().focus().setNodeBackgroundColor(color).run(),
      unsetCellBackgroundColor:
        () =>
        ({ editor }: { editor: Editor }) =>
          editor.chain().focus().unsetNodeBackgroundColor().run(),
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
      setTableKitTheme:
        (theme: 'light' | 'dark') =>
        ({ editor }: { editor: Editor }) => {
          const state = getOrInitState(editor);
          state.theme = theme;
          const dom = editor.view.dom;
          if (theme === 'dark') {
            dom.classList.add('tiptap-table-kit-dark');
          } else {
            dom.classList.remove('tiptap-table-kit-dark');
          }
          return true;
        },
    };
  },
});
