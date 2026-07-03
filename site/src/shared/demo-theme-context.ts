import { createContext } from 'react';

export type EditorTheme = 'light' | 'dark' | 'auto';

export interface DemoThemeContextValue {
  theme: EditorTheme;
  setTheme: (theme: EditorTheme) => void;
}

export const DemoThemeContext = createContext<DemoThemeContextValue>({
  theme: 'auto',
  setTheme: () => {},
});
