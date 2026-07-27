/**
 * TablePlus：表格增强套件的主扩展。
 * 组合单元格样式、选区覆盖层、节点背景色三个子扩展，
 * 注册内容清除与主题切换命令，并注入表格控制插件。
 * 运行时状态（翻译/主题/locale/contextMenu）存放在 editor.storage.tablePlus。
 *
 * 需要配合 @tiptap/extension-table 的 Table 或 TableKit 使用：
 *
 * @example
 * ```ts
 * extensions: [
 *   TableKit.configure(),
 *   TablePlus.configure({ locale: 'zh-CN' }),
 * ]
 * ```
 */
import type { Editor } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import '@tiptap/extension-table';
import {
  clearRowColumnContent,
  clearSelectedCells,
} from './commands/clear-cells';
import { NodeBackground } from './extensions/node-background';
import { TableCellStyle } from './extensions/table-cell-style';
import { getBuiltinTranslations } from './i18n';
import type { TablePlusTranslations } from './i18n/types';
import { zhCN } from './i18n/zh-CN';
import type { MenuList } from './menu/items';
import { TableSelectionOverlay } from './selection/overlay';
import { createTableControlsPlugin } from './selection/table-controls';
import {
  getTablePlusStorage,
  resolveTheme,
  resolveTranslations,
  type TablePlusLocale,
  type TablePlusStorage,
  type TablePlusTheme,
} from './storage';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tablePlus: {
      clearSelectedCells: () => ReturnType;
      clearRowColumnContent: (orientation: 'row' | 'column') => ReturnType;
      setTablePlusTheme: (theme: TablePlusTheme) => ReturnType;
    };
  }
}

/** 表格增强套件的配置选项 */
export interface TablePlusOptions {
  /** 主题模式，影响选区覆盖层和上下文菜单的配色 */
  theme: TablePlusTheme;
  /** 语言区域，内置 zh-CN / en-US */
  locale: TablePlusLocale;
  /** 局部翻译覆盖，与内置语言包浅合并 */
  translations?: Partial<TablePlusTranslations>;
  /** 自定义上下文菜单回调，接收默认菜单项列表，返回修改后的列表 */
  contextMenu?: (items: MenuList) => MenuList;
}

/** 获取指定编辑器实例的当前翻译对象 */
export function getTablePlusTranslations(
  editor: Editor | null,
): TablePlusTranslations {
  if (!editor) return zhCN;
  return resolveTranslations(editor);
}

/** 获取指定编辑器实例的当前主题 */
export function getTablePlusTheme(editor: Editor | null): TablePlusTheme {
  if (!editor) return 'light';
  return resolveTheme(editor);
}

/** 获取指定编辑器实例的当前 locale */
export function getTablePlusLocale(editor: Editor | null): TablePlusLocale {
  if (!editor) return 'zh-CN';
  return getTablePlusStorage(editor)?.locale ?? 'zh-CN';
}

export const TablePlus = Extension.create<TablePlusOptions, TablePlusStorage>({
  name: 'tablePlus',

  addOptions(): TablePlusOptions {
    return {
      theme: 'light',
      locale: 'zh-CN',
      translations: undefined,
      contextMenu: undefined,
    };
  },

  addStorage(): TablePlusStorage {
    const base = getBuiltinTranslations(this.options.locale);
    return {
      translations: this.options.translations
        ? { ...base, ...this.options.translations }
        : base,
      theme: this.options.theme,
      locale: this.options.locale,
      contextMenu: this.options.contextMenu,
    };
  },

  onCreate() {
    const dom = this.editor.view.dom;
    dom.classList.add('tiptap-table-plus');
    if (this.storage.theme === 'dark') {
      dom.classList.add('tiptap-table-plus-dark');
    }
  },

  addExtensions() {
    return [TableCellStyle, TableSelectionOverlay, NodeBackground];
  },

  addCommands() {
    return {
      clearSelectedCells: () => clearSelectedCells,
      clearRowColumnContent: (orientation) =>
        clearRowColumnContent(orientation),
      setTablePlusTheme:
        (theme) =>
        ({ editor }) => {
          this.storage.theme = theme;
          editor.view.dom.classList.toggle(
            'tiptap-table-plus-dark',
            theme === 'dark',
          );
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [createTableControlsPlugin(() => resolveTranslations(this.editor))];
  },
});
