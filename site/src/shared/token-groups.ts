export interface TokenDef {
  name: string;
  label: string;
  type: 'color' | 'rem' | 'text';
  defaultValue: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface TokenGroup {
  label: string;
  tokens: TokenDef[];
}

export const tokenGroups: TokenGroup[] = [
  {
    label: '品牌色',
    tokens: [
      {
        name: '--fsdx-editor-brand-50',
        label: '50',
        type: 'color',
        defaultValue: '#efeefd',
      },
      {
        name: '--fsdx-editor-brand-100',
        label: '100',
        type: 'color',
        defaultValue: '#dedbfd',
      },
      {
        name: '--fsdx-editor-brand-200',
        label: '200',
        type: 'color',
        defaultValue: '#c3bdfd',
      },
      {
        name: '--fsdx-editor-brand-300',
        label: '300',
        type: 'color',
        defaultValue: '#9d8afd',
      },
      {
        name: '--fsdx-editor-brand-400',
        label: '400',
        type: 'color',
        defaultValue: '#7a52fd',
      },
      {
        name: '--fsdx-editor-brand-500',
        label: '500 主色',
        type: 'color',
        defaultValue: '#6229fd',
      },
      {
        name: '--fsdx-editor-brand-600',
        label: '600',
        type: 'color',
        defaultValue: '#5400e5',
      },
    ],
  },
  {
    label: '灰色板',
    tokens: [
      {
        name: '--fsdx-editor-gray-50',
        label: '50',
        type: 'color',
        defaultValue: '#fafafa',
      },
      {
        name: '--fsdx-editor-gray-100',
        label: '100',
        type: 'color',
        defaultValue: '#f4f4f5',
      },
      {
        name: '--fsdx-editor-gray-200',
        label: '200',
        type: 'color',
        defaultValue: '#eaeaeb',
      },
      {
        name: '--fsdx-editor-gray-300',
        label: '300',
        type: 'color',
        defaultValue: '#d5d6d7',
      },
      {
        name: '--fsdx-editor-gray-400',
        label: '400',
        type: 'color',
        defaultValue: '#a6a7ab',
      },
      {
        name: '--fsdx-editor-gray-500',
        label: '500',
        type: 'color',
        defaultValue: '#7d7f82',
      },
      {
        name: '--fsdx-editor-gray-600',
        label: '600',
        type: 'color',
        defaultValue: '#53565a',
      },
      {
        name: '--fsdx-editor-gray-700',
        label: '700',
        type: 'color',
        defaultValue: '#404145',
      },
      {
        name: '--fsdx-editor-gray-800',
        label: '800',
        type: 'color',
        defaultValue: '#2c2d30',
      },
      {
        name: '--fsdx-editor-gray-900',
        label: '900',
        type: 'color',
        defaultValue: '#222325',
      },
    ],
  },
  {
    label: '功能色',
    tokens: [
      {
        name: '--fsdx-editor-destructive',
        label: '危险色',
        type: 'color',
        defaultValue: '#e5484d',
      },
      {
        name: '--fsdx-editor-green',
        label: '成功色',
        type: 'color',
        defaultValue: '#0cce6b',
      },
      {
        name: '--fsdx-editor-red',
        label: '错误色',
        type: 'color',
        defaultValue: '#ef4444',
      },
      {
        name: '--fsdx-editor-yellow',
        label: '警告色',
        type: 'color',
        defaultValue: '#f5c518',
      },
    ],
  },
  {
    label: '表面',
    tokens: [
      {
        name: '--fsdx-editor-surface-hover',
        label: '悬停态',
        type: 'color',
        defaultValue: 'rgba(15, 22, 36, 0.05)',
      },
      {
        name: '--fsdx-editor-surface-active',
        label: '激活态',
        type: 'color',
        defaultValue: 'rgba(37, 39, 45, 0.1)',
      },
    ],
  },
  {
    label: '圆角',
    tokens: [
      {
        name: '--fsdx-editor-radius-xs',
        label: '特小',
        type: 'rem',
        defaultValue: '0.125rem',
        min: 0,
        max: 0.5,
        step: 0.0625,
      },
      {
        name: '--fsdx-editor-radius-sm',
        label: '小',
        type: 'rem',
        defaultValue: '0.25rem',
        min: 0,
        max: 0.75,
        step: 0.0625,
      },
      {
        name: '--fsdx-editor-radius-md',
        label: '中',
        type: 'rem',
        defaultValue: '0.375rem',
        min: 0,
        max: 1,
        step: 0.0625,
      },
    ],
  },
  {
    label: '字体大小',
    tokens: [
      {
        name: '--fsdx-editor-font-xs',
        label: '超小',
        type: 'rem',
        defaultValue: '0.625rem',
        min: 0.5,
        max: 0.75,
        step: 0.0625,
      },
      {
        name: '--fsdx-editor-font-sm',
        label: '小',
        type: 'rem',
        defaultValue: '0.75rem',
        min: 0.625,
        max: 0.875,
        step: 0.0625,
      },
      {
        name: '--fsdx-editor-font-base',
        label: '正文',
        type: 'rem',
        defaultValue: '0.8125rem',
        min: 0.75,
        max: 1,
        step: 0.0625,
      },
      {
        name: '--fsdx-editor-font-md',
        label: '中',
        type: 'rem',
        defaultValue: '0.875rem',
        min: 0.75,
        max: 1.125,
        step: 0.0625,
      },
      {
        name: '--fsdx-editor-font-lg',
        label: '大',
        type: 'rem',
        defaultValue: '1rem',
        min: 0.875,
        max: 1.25,
        step: 0.0625,
      },
    ],
  },
  {
    label: '阴影',
    tokens: [
      {
        name: '--fsdx-editor-shadow-xs',
        label: '特小',
        type: 'text',
        defaultValue: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      {
        name: '--fsdx-editor-shadow-sm',
        label: '小',
        type: 'text',
        defaultValue: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      },
      {
        name: '--fsdx-editor-shadow-md',
        label: '中',
        type: 'text',
        defaultValue: '0 4px 12px 0 rgb(0 0 0 / 0.1)',
      },
    ],
  },
];

export interface Preset {
  name: string;
  label: string;
  description: string;
  tokens: Record<string, string>;
}

export const presets: Preset[] = [
  {
    name: 'default',
    label: '默认紫色',
    description: '品牌紫 + 冷灰配色',
    tokens: {},
  },
  {
    name: 'warm',
    label: '暖橙',
    description: '橙色主色 + 暖灰配色',
    tokens: {
      '--fsdx-editor-brand-50': '#fff4ed',
      '--fsdx-editor-brand-100': '#ffe6d5',
      '--fsdx-editor-brand-200': '#ffd1b0',
      '--fsdx-editor-brand-300': '#ffa366',
      '--fsdx-editor-brand-400': '#ff8533',
      '--fsdx-editor-brand-500': '#f76808',
      '--fsdx-editor-brand-600': '#d45500',
      '--fsdx-editor-gray-50': '#fdfbf8',
      '--fsdx-editor-gray-100': '#f7f3ed',
      '--fsdx-editor-gray-200': '#ebe4d9',
      '--fsdx-editor-gray-300': '#d6cdc2',
      '--fsdx-editor-gray-400': '#a89e93',
      '--fsdx-editor-gray-500': '#80776e',
      '--fsdx-editor-gray-600': '#5e544d',
      '--fsdx-editor-gray-700': '#433b35',
      '--fsdx-editor-gray-800': '#2e2722',
      '--fsdx-editor-gray-900': '#1d1815',
      '--fsdx-editor-destructive': '#dc2626',
      '--fsdx-editor-green': '#059669',
      '--fsdx-editor-red': '#dc2626',
      '--fsdx-editor-yellow': '#d97706',
    },
  },
  {
    name: 'nature',
    label: '自然绿',
    description: '绿色主色 + 中性灰配色',
    tokens: {
      '--fsdx-editor-brand-50': '#ecfdf5',
      '--fsdx-editor-brand-100': '#d1fae5',
      '--fsdx-editor-brand-200': '#a7f3d0',
      '--fsdx-editor-brand-300': '#6ee7b7',
      '--fsdx-editor-brand-400': '#34d399',
      '--fsdx-editor-brand-500': '#10b981',
      '--fsdx-editor-brand-600': '#059669',
      '--fsdx-editor-gray-50': '#fafaf9',
      '--fsdx-editor-gray-100': '#f5f5f4',
      '--fsdx-editor-gray-200': '#e7e5e4',
      '--fsdx-editor-gray-300': '#d6d3d1',
      '--fsdx-editor-gray-400': '#a8a29e',
      '--fsdx-editor-gray-500': '#78716c',
      '--fsdx-editor-gray-600': '#57534e',
      '--fsdx-editor-gray-700': '#44403c',
      '--fsdx-editor-gray-800': '#292524',
      '--fsdx-editor-gray-900': '#1c1917',
      '--fsdx-editor-destructive': '#dc2626',
      '--fsdx-editor-green': '#10b981',
      '--fsdx-editor-red': '#ef4444',
      '--fsdx-editor-yellow': '#f59e0b',
    },
  },
  {
    name: 'deep-blue',
    label: '深海蓝',
    description: '蓝色主色 + 冷蓝灰配色',
    tokens: {
      '--fsdx-editor-brand-50': '#eff6ff',
      '--fsdx-editor-brand-100': '#dbeafe',
      '--fsdx-editor-brand-200': '#bfdbfe',
      '--fsdx-editor-brand-300': '#93c5fd',
      '--fsdx-editor-brand-400': '#60a5fa',
      '--fsdx-editor-brand-500': '#3b82f6',
      '--fsdx-editor-brand-600': '#2563eb',
      '--fsdx-editor-gray-50': '#f8fafc',
      '--fsdx-editor-gray-100': '#f1f5f9',
      '--fsdx-editor-gray-200': '#e2e8f0',
      '--fsdx-editor-gray-300': '#cbd5e1',
      '--fsdx-editor-gray-400': '#94a3b8',
      '--fsdx-editor-gray-500': '#64748b',
      '--fsdx-editor-gray-600': '#475569',
      '--fsdx-editor-gray-700': '#334155',
      '--fsdx-editor-gray-800': '#1e293b',
      '--fsdx-editor-gray-900': '#0f172a',
      '--fsdx-editor-destructive': '#ef4444',
      '--fsdx-editor-green': '#22c55e',
      '--fsdx-editor-red': '#ef4444',
      '--fsdx-editor-yellow': '#eab308',
    },
  },
  {
    name: 'dark-purple',
    label: '暗紫',
    description: '深夜紫 + 亮紫品牌色',
    tokens: {
      '--fsdx-editor-brand-50': '#2e1a4a',
      '--fsdx-editor-brand-100': '#3d2066',
      '--fsdx-editor-brand-200': '#502b85',
      '--fsdx-editor-brand-300': '#7c3aed',
      '--fsdx-editor-brand-400': '#8b5cf6',
      '--fsdx-editor-brand-500': '#a78bfa',
      '--fsdx-editor-brand-600': '#c4b5fd',
      '--fsdx-editor-gray-50': '#1a1a2e',
      '--fsdx-editor-gray-100': '#16213e',
      '--fsdx-editor-gray-200': '#1f2b47',
      '--fsdx-editor-gray-300': '#2d3a56',
      '--fsdx-editor-gray-400': '#5c6b8a',
      '--fsdx-editor-gray-500': '#8492a6',
      '--fsdx-editor-gray-600': '#a8b4c5',
      '--fsdx-editor-gray-700': '#c1cddb',
      '--fsdx-editor-gray-800': '#d9e2ec',
      '--fsdx-editor-gray-900': '#f0f4f8',
      '--fsdx-editor-destructive': '#f87171',
      '--fsdx-editor-green': '#34d399',
      '--fsdx-editor-red': '#f87171',
      '--fsdx-editor-yellow': '#fbbf24',
    },
  },
];

export function getAllTokenDefaults(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const group of tokenGroups) {
    for (const token of group.tokens) {
      result[token.name] = token.defaultValue;
    }
  }
  return result;
}

export function buildStyleText(tokens: Record<string, string>): string {
  const lines = Object.entries(tokens)
    .filter(([, v]) => v)
    .map(([k, v]) => `  ${k}: ${v};`);
  if (lines.length === 0) return '';
  return `/* FSDX Editor 自定义主题 */\n:root {\n${lines.join('\n')}\n}\n`;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return [r, g, b];
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    Math.round(Math.max(0, Math.min(255, v)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lerpColor(hex: string, targetHex: string, ratio: number): string {
  const c1 = hexToRgb(hex);
  const c2 = hexToRgb(targetHex);
  if (!c1 || !c2) return hex;
  const r = c1[0] + (c2[0] - c1[0]) * ratio;
  const g = c1[1] + (c2[1] - c1[1]) * ratio;
  const b = c1[2] + (c2[2] - c1[2]) * ratio;
  return rgbToHex(r, g, b);
}

const BRAND_SHADE_RATIOS: Record<number, [string, number]> = {
  50: ['#ffffff', 0.1],
  100: ['#ffffff', 0.15],
  200: ['#ffffff', 0.3],
  300: ['#ffffff', 0.55],
  400: ['#ffffff', 0.85],
  500: ['', 0], // base color, no blend
  600: ['#000000', 0.15],
};

export function generateBrandShades(baseHex: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [level, [target, ratio]] of Object.entries(BRAND_SHADE_RATIOS)) {
    const name = `--fsdx-editor-brand-${level}`;
    if (level === '500') {
      result[name] = baseHex;
    } else {
      result[name] = lerpColor(baseHex, target, ratio);
    }
  }
  return result;
}
