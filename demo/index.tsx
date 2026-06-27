import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Redirect, Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import type { EditorTheme } from '../src/core/editor';
import { Header } from './components/header';
import { Layout } from './components/layout';
import { ApiReference } from './pages/api-reference';
import { BasicDemo } from './pages/basic-demo';
import { ControlPanel } from './pages/control-panel';
import { Overview } from './pages/overview';
import { ThemeConfig } from './pages/theme-config';
import { DemoThemeContext } from './shared/demo-theme-context';

type DemoTheme = 'light' | 'dark' | 'auto';

const THEME_STORAGE_KEY = 'fsdx-demo-theme';

function getStoredTheme(): DemoTheme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored;
  }
  return 'auto';
}

function resolveTheme(mode: DemoTheme): 'light' | 'dark' {
  if (mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return mode;
}

function applyTheme(mode: DemoTheme) {
  const resolved = resolveTheme(mode);
  document.documentElement.setAttribute(
    'data-demo-theme',
    resolved === 'dark' ? 'dark' : 'light',
  );
}

function useDemoTheme() {
  const [theme, setTheme] = useState<DemoTheme>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
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

  const contextValue = useMemo(
    () => ({ theme: theme as EditorTheme, setTheme }),
    [theme, setTheme],
  );

  return (
    <DemoThemeContext.Provider value={contextValue}>
      <Router hook={useHashLocation}>
        <Layout>
          <Header theme={theme} onThemeChange={setTheme} />
          <Switch>
            <Route path="/">
              <Overview />
            </Route>
            <Route path="/demo">
              <BasicDemo />
            </Route>
            <Route path="/control-panel">
              <ControlPanel />
            </Route>
            <Route path="/api">
              <ApiReference />
            </Route>
            <Route path="/theme-config">
              <ThemeConfig />
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
