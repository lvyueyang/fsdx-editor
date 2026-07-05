import type { Editor } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import {
  clearColumnContent,
  clearRowColumnContent,
  clearRowContent,
  clearSelectedCells,
  copySelectedCells,
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
import { NodeBackground } from './extensions/node-background';
import { TableCellStyle } from './extensions/table-cell-style';
import { enUS } from './i18n/en-US';
import type { TablePlusTranslations } from './i18n/types';
import { zhCN } from './i18n/zh-CN';
import { TableSelectionOverlay } from './overlay/table-selection-overlay';
import { createTableControlsPlugin } from './table-controls-plugin';
import { editorStateMap, getOrInitState } from './utils/state-store';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    table: {
      insertTable: (options?: {
        rows?: number;
        cols?: number;
        withHeaderRow?: boolean;
      }) => ReturnType;
      addColumnBefore: () => ReturnType;
      addColumnAfter: () => ReturnType;
      deleteColumn: () => ReturnType;
      addRowBefore: () => ReturnType;
      addRowAfter: () => ReturnType;
      deleteRow: () => ReturnType;
      deleteTable: () => ReturnType;
      mergeCells: () => ReturnType;
      splitCell: () => ReturnType;
      toggleHeaderRow: () => ReturnType;
      toggleHeaderColumn: () => ReturnType;
      toggleHeaderCell: () => ReturnType;
      mergeOrSplit: () => ReturnType;
      goToNextCell: () => ReturnType;
      goToPreviousCell: () => ReturnType;
      fixTables: () => ReturnType;
    };
    tablePlus: {
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
      copySelectedCells: () => ReturnType;
      clearRowContent: () => ReturnType;
      clearColumnContent: () => ReturnType;
      clearRowColumnContent: (orientation: 'row' | 'column') => ReturnType;
      setTablePlusTheme: (theme: 'light' | 'dark') => ReturnType;
    };
  }
}

/** 获取指定编辑器实例的当前翻译对象 */
export function getTablePlusTranslations(
  editor: Editor | null,
): TablePlusTranslations {
  if (!editor) return zhCN;
  return getOrInitState(editor).translations;
}

/** 获取指定编辑器实例的当前主题 */
export function getTablePlusTheme(editor: Editor | null): 'light' | 'dark' {
  if (!editor) return 'light';
  return getOrInitState(editor).theme;
}

/** 获取指定编辑器实例的当前 locale */
export function getTablePlusLocale(editor: Editor | null): 'zh-CN' | 'en-US' {
  if (!editor) return 'zh-CN';
  return getOrInitState(editor).locale;
}

/** 表格增强套件的配置选项 */
interface TablePlusOptions {
  theme: 'light' | 'dark';
  locale: 'zh-CN' | 'en-US';
  translations?: Partial<TablePlusTranslations>;
}

/**
 * 表格增强套件，为基础 Table 扩展提供单元格样式、选区覆盖层、
 * 节点背景色和丰富的表格操作命令。
 * 需要配合 TableKit 使用。
 *
 * @example
 * ```ts
 * extensions: [
 *   TableKit.configure(),
 *   TablePlus.configure({ locale: 'zh-CN' }),
 * ]
 * ```
 */
export const TablePlus = Extension.create<TablePlusOptions>({
  name: 'tablePlus',

  addOptions(): TablePlusOptions {
    return {
      theme: 'light',
      locale: 'zh-CN',
      translations: undefined,
    };
  },

  onCreate() {
    const locale = this.options.locale ?? 'zh-CN';
    const base = locale === 'en-US' ? enUS : zhCN;
    const translations = this.options.translations
      ? { ...base, ...this.options.translations }
      : base;

    const theme = this.options.theme ?? 'light';

    editorStateMap.set(this.editor, { translations, theme, locale });

    this.editor.view.dom.classList.add('tiptap-table-plus');
    if (theme === 'dark') {
      this.editor.view.dom.classList.add('tiptap-table-plus-dark');
    }
  },

  addExtensions() {
    return [TableCellStyle, TableSelectionOverlay, NodeBackground];
  },

  addCommands() {
    return {
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
      setTablePlusTheme:
        (theme: 'light' | 'dark') =>
        ({ editor }: { editor: Editor }) => {
          const state = getOrInitState(editor);
          state.theme = theme;
          const dom = editor.view.dom;
          if (theme === 'dark') {
            dom.classList.add('tiptap-table-plus-dark');
          } else {
            dom.classList.remove('tiptap-table-plus-dark');
          }
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      createTableControlsPlugin(() => getTablePlusTranslations(this.editor)),
    ];
  },
});
