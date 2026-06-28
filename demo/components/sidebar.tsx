import { useLocation } from 'wouter';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: '概览',
    items: [{ label: '关于 FSDX Editor', href: '/', icon: '◆' }],
  },
  {
    label: '演示',
    items: [
      { label: '基础演示', href: '/demo', icon: '◇' },
      { label: '控制面板', href: '/control-panel', icon: '◈' },
      { label: '主题配置', href: '/theme-config', icon: '🎨' },
    ],
  },
  {
    label: '基础组件',
    items: [
      { label: '组件概览', href: '/ui-demo', icon: '□' },
      { label: 'Button', href: '/ui-demo/button', icon: '◇' },
      { label: 'ButtonGroup', href: '/ui-demo/button-group', icon: '◇' },
      { label: 'Badge', href: '/ui-demo/badge', icon: '◇' },
      { label: 'Card', href: '/ui-demo/card', icon: '◇' },
      { label: 'Input', href: '/ui-demo/input', icon: '◇' },
      { label: 'Separator', href: '/ui-demo/separator', icon: '◇' },
      { label: 'Toolbar', href: '/ui-demo/toolbar', icon: '◇' },
      { label: 'Tooltip', href: '/ui-demo/tooltip', icon: '◇' },
      { label: 'Popover', href: '/ui-demo/popover', icon: '◇' },
      { label: 'DropdownMenu', href: '/ui-demo/dropdown-menu', icon: '◇' },
    ],
  },
  {
    label: '参考',
    items: [{ label: 'API 文档', href: '/api', icon: '{}' }],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside className="demo-sidebar">
      <a href="#/" className="demo-sidebar-brand">
        <span className="demo-sidebar-brand-icon">F</span>
        <span className="demo-sidebar-brand-text">FSDX Editor</span>
      </a>
      <nav className="demo-sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.label} className="demo-sidebar-group">
            <div className="demo-sidebar-group-label">{group.label}</div>
            {group.items.map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                title={item.label}
                className={`demo-sidebar-link${location === item.href ? ' demo-sidebar-link--active' : ''}`}
              >
                <span className="demo-sidebar-link-icon">{item.icon}</span>
                <span className="demo-sidebar-link-text">{item.label}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>
      <button
        type="button"
        className="demo-sidebar-toggle"
        onClick={onToggle}
        title={collapsed ? '展开侧栏' : '收起侧栏'}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <path d="M6 3L11 8L6 13" />
        </svg>
      </button>
    </aside>
  );
}
