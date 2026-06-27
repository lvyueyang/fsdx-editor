import { useCallback } from 'react';

type DemoTheme = 'light' | 'dark' | 'auto';

interface HeaderProps {
  theme: DemoTheme;
  onThemeChange: (theme: DemoTheme) => void;
}

const themeOptions: { value: DemoTheme; label: string }[] = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'auto', label: '自动' },
];

export function Header({ theme, onThemeChange }: HeaderProps) {
  const handleThemeChange = useCallback(
    (next: DemoTheme) => {
      onThemeChange(next);
    },
    [onThemeChange],
  );

  return (
    <header className="demo-header">
      <div className="demo-header-left">文档</div>
      <div className="demo-header-right">
        <div className="demo-theme-toggle">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleThemeChange(opt.value)}
              className={`demo-theme-toggle-btn${theme === opt.value ? ' demo-theme-toggle-btn--active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
