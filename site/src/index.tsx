import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Redirect, Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { Header } from './components/header';
import { Layout } from './components/layout';
import { ApiReference } from './pages/api-reference';
import { HomePage } from './pages/home';
import { TiptapTableDemo } from './pages/tiptap-table-kit-demo';
import { TiptapTableI18n } from './pages/tiptap-table-kit-i18n';
import { TiptapTableTheme } from './pages/tiptap-table-kit-theme';
import { VanillaDemo } from './pages/vanilla-demo';
import type { EditorTheme } from './shared/demo-theme-context';
import { DemoThemeContext } from './shared/demo-theme-context';

function getStoredTheme(): EditorTheme {
  const stored = localStorage.getItem('fsdx-demo-theme');
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored;
  }
  return 'auto';
}

function resolveTheme(mode: EditorTheme): 'light' | 'dark' {
  if (mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return mode;
}

function applyTheme(mode: EditorTheme) {
  const resolved = resolveTheme(mode);
  document.documentElement.setAttribute(
    'data-demo-theme',
    resolved === 'dark' ? 'dark' : 'light',
  );
}

function useDemoTheme() {
  const [theme, setTheme] = useState<EditorTheme>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('fsdx-demo-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'auto') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('auto');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme]);

  return [theme, setTheme] as const;
}

function App() {
  const [theme, setTheme] = useDemoTheme();

  const contextValue = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <DemoThemeContext.Provider value={contextValue}>
      <Router hook={useHashLocation}>
        <Layout>
          <Header theme={theme} onThemeChange={setTheme} />
          <Switch>
            <Route path="/">
              <HomePage />
            </Route>
            <Route path="/tiptap-table-kit">
              <TiptapTableDemo />
            </Route>
            <Route path="/tiptap-table-kit-theme">
              <TiptapTableTheme />
            </Route>
            <Route path="/tiptap-table-kit-i18n">
              <TiptapTableI18n />
            </Route>
            <Route path="/vanilla-demo">
              <VanillaDemo />
            </Route>
            <Route path="/api">
              <ApiReference />
            </Route>
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </DemoThemeContext.Provider>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}
