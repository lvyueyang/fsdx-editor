import { createEditorInstance } from './core/create-editor';
import type { EventHandler } from './utils/event-emitter';
import type { FsdxEditorOptions, ThemeType } from './types';

export type { EventHandler } from './utils/event-emitter';

export type {
  ContentType,
  FsdxEditorOptions,
  MediaItem,
  MediaListParams,
  MediaListResult,
  MediaUploadConfig,
  ThemeType,
  UploadProgressCallback,
} from './types';

export function createEditor(
  container: HTMLElement,
  options: FsdxEditorOptions,
) {
  if (!container) throw new Error('创建编辑器失败：container 参数不能为空');
  const { editor, emitter } = createEditorInstance(container, options);

  return {
    isEmpty(): boolean {
      return editor.isEmpty;
    },

    clear(): void {
      editor.commands.clearContent();
    },

    setHTML(html: string): void {
      editor.commands.setContent(html);
    },

    getHTML(): string {
      return editor.getHTML();
    },

    getText(): string {
      return editor.getText();
    },

    setJSON(json: Record<string, unknown>): void {
      editor.commands.setContent(json);
    },

    getJSON(): Record<string, unknown> {
      return editor.getJSON() as Record<string, unknown>;
    },

    setTheme(theme: ThemeType): void {
      if (theme === 'dark') {
        container.classList.add('fsdx-editor-dark');
      } else {
        container.classList.remove('fsdx-editor-dark');
      }
    },

    focus(): void {
      editor.commands.focus();
    },

    blur(): void {
      editor.commands.blur();
    },

    isFocused(): boolean {
      return editor.isFocused;
    },

    disable(): void {
      container.classList.add('fsdx-editor-disabled');
      editor.setEditable(false);
    },

    enable(): void {
      container.classList.remove('fsdx-editor-disabled');
      editor.setEditable(true);
    },

    isDisabled(): boolean {
      return !editor.isEditable;
    },

    getContainer(): HTMLElement {
      return container;
    },

    destroy(): void {
      editor.destroy();
      emitter.removeAllListeners();
      container.innerHTML = '';
      container.classList.remove(
        'fsdx-editor',
        'fsdx-editor-dark',
        'fsdx-editor-disabled',
      );
    },

    on(event: string, handler: EventHandler): void {
      emitter.on(event, handler);
    },

    off(event: string, handler: EventHandler): void {
      emitter.off(event, handler);
    },

    once(event: string, handler: EventHandler): void {
      emitter.once(event, handler);
    },

    emit(event: string, ...args: unknown[]): void {
      emitter.emit(event, ...args);
    },
  };
}
