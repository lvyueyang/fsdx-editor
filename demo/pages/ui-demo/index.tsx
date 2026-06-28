import { Link } from 'wouter';

interface ComponentCard {
  name: string;
  href: string;
  desc: string;
}

const components: ComponentCard[] = [
  {
    name: 'Button 按钮',
    href: '/ui-demo/button',
    desc: '支持 primary / ghost 变体和 small / default / large 尺寸',
  },
  {
    name: 'ButtonGroup 按钮组',
    href: '/ui-demo/button-group',
    desc: '按钮组容器，支持水平/垂直排列，含标签和分隔线',
  },
  {
    name: 'Badge 徽标',
    href: '/ui-demo/badge',
    desc: '6 种变体 + 3 种外观 + 2 种尺寸',
  },
  {
    name: 'Card 卡片',
    href: '/ui-demo/card',
    desc: 'Header / Body / Footer / ItemGroup / GroupLabel 子组件',
  },
  { name: 'Input 输入框', href: '/ui-demo/input', desc: '透传原生 input 属性' },
  {
    name: 'Separator 分隔线',
    href: '/ui-demo/separator',
    desc: '水平 / 垂直两种方向',
  },
  {
    name: 'Toolbar 工具栏',
    href: '/ui-demo/toolbar',
    desc: 'fixed / floating 变体，内置键盘导航',
  },
  {
    name: 'Tooltip 提示框',
    href: '/ui-demo/tooltip',
    desc: '四方向 + 延迟 + 禁用',
  },
  {
    name: 'Popover 弹出框',
    href: '/ui-demo/popover',
    desc: '点击触发弹出内容',
  },
  {
    name: 'DropdownMenu 下拉菜单',
    href: '/ui-demo/dropdown-menu',
    desc: '分组、快捷键、分割线',
  },
];

export function UiDemoIndex() {
  return (
    <div className="demo-content">
      <h1 className="demo-cover-title" style={{ marginBottom: 8 }}>
        基础组件
      </h1>
      <p className="ui-demo-desc" style={{ marginBottom: 32 }}>
        所有 UI 基础组件的独立演示与调试面板
      </p>

      <div className="ui-demo-card-grid">
        {components.map((c) => (
          <Link key={c.href} href={c.href} className="ui-demo-card-link">
            <div className="ui-demo-card">
              <h3 className="ui-demo-card-title">{c.name}</h3>
              <p className="ui-demo-card-desc">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
