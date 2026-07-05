import type { Editor } from '@tiptap/core';
import type { TableKitTranslations } from '../i18n/types';
import { zhCN } from '../i18n/zh-CN';

export interface EditorTableKitState {
  translations: TableKitTranslations;
  theme: 'light' | 'dark';
  locale: 'zh-CN' | 'en-US';
}

export const editorStateMap = new WeakMap<Editor, EditorTableKitState>();

export function getOrInitState(editor: Editor): EditorTableKitState {
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
