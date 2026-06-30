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
export const ICON_ARROW_UP = createSvg(
  '0 0 16 16',
  '<path d="M8 12V4M5 7l3-3 3 3"/>',
);
export const ICON_ARROW_DOWN = createSvg(
  '0 0 16 16',
  '<path d="M8 4v8M5 9l3 3 3-3"/>',
);
export const ICON_ARROW_LEFT = createSvg(
  '0 0 16 16',
  '<path d="M12 8H4M7 5l-3 3 3 3"/>',
);
export const ICON_ARROW_RIGHT = createSvg(
  '0 0 16 16',
  '<path d="M4 8h8M9 5l3 3-3 3"/>',
);
export const ICON_COPY = createSvg(
  '0 0 16 16',
  '<path d="M5 3h6a1 1 0 0 1 1 1v8M3 5h6a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1"/>',
);
export const ICON_SORT_ASC = createSvg(
  '0 0 16 16',
  '<path d="M8 11V3M5 6l3-3 3 3M3 13h10"/>',
);
export const ICON_SORT_DESC = createSvg(
  '0 0 16 16',
  '<path d="M8 3v8M5 8l3 3 3-3M3 3h10"/>',
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
export const ICON_FIT_TO_WIDTH = createSvg(
  '0 0 16 16',
  '<path d="M3 5v6M13 5v6M6 8h4M6 6l-2 2 2 2M10 6l2 2-2 2"/>',
);
export const ICON_TEXT_COLOR = createSvg(
  '0 0 16 16',
  '<path d="M4 14h8M8 2 5 10h6L8 2z"/><path d="M6 8h4"/>',
);
export const ICON_BG_COLOR = createSvg(
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
export const ICON_VA_TOP = createSvg(
  '0 0 16 16',
  '<path d="M3 3h10M5 7 8 4l3 3M8 4v9"/>',
);
export const ICON_VA_MIDDLE = createSvg(
  '0 0 16 16',
  '<path d="M3 8h10M6 4l2-2 2 2M8 2v12M6 12l2 2 2-2"/>',
);
export const ICON_VA_BOTTOM = createSvg(
  '0 0 16 16',
  '<path d="M3 13h10M5 9l3 3 3-3M8 12V3"/>',
);

export const ICON_MORE = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="4" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="12" cy="8" r="1.5"/></svg>`;

export const ICON_CHEVRON_RIGHT = createSvg(
  '0 0 16 16',
  '<path d="M6 4l4 4-4 4"/>',
);
export const ICON_CHEVRON_LEFT = createSvg(
  '0 0 16 16',
  '<path d="M10 4l-4 4 4 4"/>',
);
