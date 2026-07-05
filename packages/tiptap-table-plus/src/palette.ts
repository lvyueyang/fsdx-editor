export interface PaletteColor {
  /** 色相名称 */
  name: string;
  /** 色相 HSL hue 值 */
  hue: number;
  /** 色相 HSL saturation 值 */
  saturation: number;
  /** 明度级别 1-7 */
  level: number;
  /** 明度 HSL lightness 值 */
  lightness: number;
  /** 颜色值 */
  color: string;
}

/** 10 种色相 */
const HUES: { name: string; h: number; s: number }[] = [
  { name: '灰色', h: 0, s: 0 },
  { name: '红色', h: 0, s: 70 },
  { name: '橙色', h: 25, s: 75 },
  { name: '黄色', h: 45, s: 70 },
  { name: '绿色', h: 140, s: 40 },
  { name: '青色', h: 170, s: 45 },
  { name: '蓝色', h: 210, s: 60 },
  { name: '靛蓝', h: 240, s: 45 },
  { name: '紫色', h: 275, s: 40 },
  { name: '粉色', h: 320, s: 55 },
];

/** 7 级明度 */
const LIGHTNESS_LEVELS = [95, 85, 75, 65, 50, 38, 26];

export const PALETTE_COLUMNS = 10;
export const PALETTE_ROWS = 7;

/**
 * 70 色色板：10 色相 × 7 明度
 * 排列按明度优先，10 列对应 10 种色相
 */
export const PALETTE_COLORS: PaletteColor[] = [];

for (const l of LIGHTNESS_LEVELS) {
  HUES.forEach((hue) => {
    PALETTE_COLORS.push({
      name: hue.name,
      hue: hue.h,
      saturation: hue.s,
      level: LIGHTNESS_LEVELS.indexOf(l) + 1,
      lightness: l,
      color: `hsl(${hue.h}, ${hue.s}%, ${l}%)`,
    });
  });
}
