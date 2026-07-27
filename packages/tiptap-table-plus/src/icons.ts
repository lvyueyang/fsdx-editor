/**
 * 套件内部共享的 SVG 图标常量。
 * 16px 图标统一使用 stroke 风格，通过 currentColor 继承文字颜色。
 */
function createSvg(
  viewBox: string,
  children: string,
  opts?: { fill?: boolean },
) {
  const fillAttr = opts?.fill ? ` fill="currentColor"` : ' fill="none"';
  return `<svg width="16" height="16" viewBox="${viewBox}"${fillAttr} stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${children}</svg>`;
}

export const ICON_PLUS = createSvg('0 0 16 16', '<path d="M8 3v10M3 8h10"/>');
export const ICON_TRASH = createSvg(
  '0 0 16 16',
  '<path d="M3 5h10M6 5V3h4v2M5 5v7a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V5"/>',
);
export const ICON_MERGE_CELLS = createSvg(
  '0 0 16 16',
  '<path d="M3 4h10v8H3zM7 4v8M9 4v8"/>',
);
export const ICON_SPLIT_CELLS = createSvg(
  '0 0 16 16',
  '<path d="M3 4h5v8H3zM8 4h5v8H8z"/>',
);
export const ICON_ERASER = createSvg(
  '0 0 16 16',
  '<path d="M3 13h10M5.5 3 3 5.5l6 6L11.5 9zM9 5.5 7 3.5 4.5 6"/>',
);
export const ICON_TABLE_HEADER = createSvg(
  '0 0 16 16',
  '<path d="M3 5h10M3 9h10M3 5v6h10V5"/>',
);
export const ICON_TEXT_COLOR = createSvg(
  '0 0 16 16',
  '<path d="M4 14h8M8 2 5 10h6L8 2z"/><path d="M6 8h4"/>',
);
export const ICON_BACKGROUND_COLOR = createSvg(
  '0 0 16 16',
  '<path d="M2 2h12v12H2z"/><path d="M6 8 4 6 7 3l2 2z"/>',
);
export const ICON_ALIGN_LEFT = createSvg(
  '0 0 16 16',
  '<path d="M3 4h6M3 8h10M3 12h8"/>',
);
export const ICON_ALIGN_CENTER = createSvg(
  '0 0 16 16',
  '<path d="M4 4h8M3 8h10M4 12h8"/>',
);
export const ICON_ALIGN_RIGHT = createSvg(
  '0 0 16 16',
  '<path d="M7 4h6M3 8h10M5 12h8"/>',
);
export const ICON_ALIGN_JUSTIFY = createSvg(
  '0 0 16 16',
  '<path d="M3 4h10M3 8h10M3 12h10"/>',
);
export const ICON_VERTICAL_ALIGN_TOP = createSvg(
  '0 0 16 16',
  '<path d="M3 3h10M5 7 8 4l3 3M8 4v9"/>',
);
export const ICON_VERTICAL_ALIGN_MIDDLE = createSvg(
  '0 0 16 16',
  '<path d="M3 8h10M6 4l2-2 2 2M8 2v12M6 12l2 2 2-2"/>',
);
export const ICON_VERTICAL_ALIGN_BOTTOM = createSvg(
  '0 0 16 16',
  '<path d="M3 13h10M5 9l3 3 3-3M8 12V3"/>',
);
export const ICON_CHEVRON_RIGHT = createSvg(
  '0 0 16 16',
  '<path d="M6 4l4 4-4 4"/>',
);

/** 选区操作手柄上的竖排三点图标（24px，fill 风格，独占于手柄使用） */
export const ICON_DOTS_VERTICAL =
  '<svg class="tiptap-table-plus-selection-handle-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 14C9.10457 14 10 14.8954 10 16C10 17.1046 9.10457 18 8 18C6.89543 18 6 17.1046 6 16C6 14.8954 6.89543 14 8 14ZM16 14C17.1046 14 18 14.8954 18 16C18 17.1046 17.1046 18 16 18C14.8954 18 14 17.1046 14 16C14 14.8954 14.8954 14 16 14ZM8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6ZM16 6C17.1046 6 18 6.89543 18 8C18 9.10457 17.1046 10 16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6Z"/></svg>';
