import type { Editor } from '@tiptap/core';
import type { TablePlusTranslations } from '../i18n/types';
import { zhCN } from '../i18n/zh-CN';

export interface EditorTablePlusState {
  translations: TablePlusTranslations;
  theme: 'light' | 'dark';
  locale: 'zh-CN' | 'en-US';
}

export const editorStateMap = new WeakMap<Editor, EditorTablePlusState>();

export function getOrInitState(editor: Editor): EditorTablePlusState {
  let state = editorStateMap.get(editor);
  if (!state) {
    state = { translations: zhCN, theme: 'light', locale: 'zh-CN' };
    editorStateMap.set(editor, state);
  }
  return state;
}

export function getStoredLocale(editor: Editor | null): 'zh-CN' | 'en-US' {
  if (!editor) return 'zh-CN';
  return getOrInitState(editor).locale;
}
