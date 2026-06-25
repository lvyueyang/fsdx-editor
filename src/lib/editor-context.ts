import { createContext, useContext } from 'react';
import type { EditorOptions } from '../types';

export const EditorOptionsContext = createContext<EditorOptions | undefined>(
  undefined,
);

export function useEditorOptions(): EditorOptions | undefined {
  return useContext(EditorOptionsContext);
}
