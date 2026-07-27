/**
 * TablePlus 运行时状态定义与读取。
 * 状态由 TablePlus 扩展通过 addStorage 初始化，挂载在
 * editor.storage.tablePlus 上；本模块是套件内部各 UI 模块
 * 读取状态的唯一入口，避免与 table-plus.ts 形成循环依赖。
 */
import type { Editor } from '@tiptap/core';
import type { TablePlusTranslations } from './i18n/types';
import { zhCN } from './i18n/zh-CN';
import type { MenuList } from './menu/items';

/** 支持的主题 */
export type TablePlusTheme = 'light' | 'dark';

/** 支持的语言区域 */
export type TablePlusLocale = 'zh-CN' | 'en-US';

/** 单个编辑器实例的 TablePlus 运行时状态 */
export interface TablePlusStorage {
  translations: TablePlusTranslations;
  theme: TablePlusTheme;
  locale: TablePlusLocale;
  contextMenu?: (items: MenuList) => MenuList;
}

declare module '@tiptap/core' {
  interface Storage {
    tablePlus?: TablePlusStorage;
  }
}

/** 读取编辑器上的 TablePlus 状态（未注册 TablePlus 时返回 undefined） */
export function getTablePlusStorage(
  editor: Editor,
): TablePlusStorage | undefined {
  return editor.storage.tablePlus;
}

/** 读取当前翻译对象，未初始化时回退到默认中文 */
export function resolveTranslations(editor: Editor): TablePlusTranslations {
  return getTablePlusStorage(editor)?.translations ?? zhCN;
}

/** 读取当前主题，未初始化时回退到亮色 */
export function resolveTheme(editor: Editor): TablePlusTheme {
  return getTablePlusStorage(editor)?.theme ?? 'light';
}
