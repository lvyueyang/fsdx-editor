import type { ReactNode } from 'react';
import { useState } from 'react';

const navItems: { label: string; href: string; activePaths: string[] }[] = [
  {
    label: '基础演示',
    href: '/',
    activePaths: ['/', '/index', '/index.html'],
  },
  {
    label: '控制面板',
    href: '/control-panel',
    activePaths: ['/control-panel', '/control-panel.html'],
  },
];

const ARROW_SIZE = 12;
const PILL_HEIGHT = 22;
const PILL_WIDTH = 80;
const BAR_HEIGHT = 44;
const LINK_ROW_HEIGHT = BAR_HEIGHT - PILL_HEIGHT;

export function DemoNav({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  const currentPath = window.location.pathname.replace(/\.html$/, '');

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          overflow: 'hidden',
          height: visible ? BAR_HEIGHT : PILL_HEIGHT,
          transition: 'height 0.2s ease',
        }}
      >
        <div
          style={{
            height: BAR_HEIGHT,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            background: visible ? '#1a1a2e' : 'transparent',
            transition: 'background 0.2s ease',
          }}
        >
          <div
            style={{
              height: LINK_ROW_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            {navItems.map((item) => {
              const isActive = item.activePaths.includes(currentPath);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: 12,
                    color: isActive ? '#60a5fa' : 'rgba(255, 255, 255, 0.7)',
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: 'none',
                    padding: '0 8px',
                    borderRadius: 3,
                    transition: 'color 0.15s',
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div
            style={{
              height: PILL_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: PILL_WIDTH,
                height: PILL_HEIGHT,
                borderRadius: '0 0 6px 6px',
                background: visible ? 'transparent' : 'rgba(26, 26, 46, 0.55)',
                transition: 'background 0.2s ease',
              }}
            >
              <svg
                width={ARROW_SIZE}
                height={Math.ceil(ARROW_SIZE * 0.6)}
                viewBox="0 0 12 7"
                fill="none"
                style={{
                  transform: visible ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
