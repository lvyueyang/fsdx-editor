import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import '../styles/demo.css';
import { Sidebar } from './sidebar';

const COLLAPSED_KEY = 'fsdx-demo-sidebar-collapsed';

export function Layout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(COLLAPSED_KEY) === '1';
  });

  const handleToggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSED_KEY, next ? '1' : '0');
      return next;
    });
  }, []);

  return (
    <div className={`demo-layout${collapsed ? ' demo-layout--collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      <div className="demo-main">{children}</div>
    </div>
  );
}
