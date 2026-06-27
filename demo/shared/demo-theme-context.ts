import { createContext } from 'react';
import type { EditorTheme } from '../../src/core/editor';

export interface DemoThemeContextValue {
  theme: EditorTheme;
  setTheme: (theme: EditorTheme) => void;
}

export const DemoThemeContext = createContext<DemoThemeContextValue>({
  theme: 'auto',
  setTheme: () => {},
});
