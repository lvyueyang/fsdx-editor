import type { EditorTheme } from '@fsdx/editor-react';
import { createContext } from 'react';

export interface DemoThemeContextValue {
  theme: EditorTheme;
  setTheme: (theme: EditorTheme) => void;
}

export const DemoThemeContext = createContext<DemoThemeContextValue>({
  theme: 'auto',
  setTheme: () => {},
});
