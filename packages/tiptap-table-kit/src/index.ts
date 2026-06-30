export { canInsertTable } from './commands/table';
export {
  type CellVerticalAlign,
  clearColumnContent,
  clearRowColumnContent,
  clearRowContent,
  clearSelectedCells,
  copySelectedCells,
  fitToWidth,
  type Orientation,
  setCellBackgroundColor,
  setCellTextColor,
  setCellVerticalAlign,
  unsetCellBackgroundColor,
  unsetCellTextColor,
} from './commands/table-cell';
export {
  duplicateColumn,
  duplicateRow,
  moveColumnLeft,
  moveColumnRight,
  moveRowDown,
  moveRowUp,
  sortColumnAsc,
  sortColumnDesc,
} from './commands/table-row-column';
export { CustomTableView } from './extensions/custom-table-view';
export {
  NodeBackground,
  type NodeBackgroundOptions,
} from './extensions/node-background';
export { TableCellStyle } from './extensions/table-cell-style';
export {
  type ColorGridCallbacks,
  createColorGrid,
} from './overlay/color-grid-builder';
export {
  ICON_ALIGN_CENTER,
  ICON_ALIGN_JUSTIFY,
  ICON_ALIGN_LEFT,
  ICON_ALIGN_RIGHT,
  ICON_ARROW_DOWN,
  ICON_ARROW_LEFT,
  ICON_ARROW_RIGHT,
  ICON_ARROW_UP,
  ICON_BG_COLOR,
  ICON_CHEVRON_LEFT,
  ICON_CHEVRON_RIGHT,
  ICON_COPY,
  ICON_ERASER,
  ICON_FIT_TO_WIDTH,
  ICON_MERGE_CELLS,
  ICON_MORE,
  ICON_PLUS,
  ICON_SORT_ASC,
  ICON_SORT_DESC,
  ICON_SPLIT_CELLS,
  ICON_TABLE_HEADER,
  ICON_TEXT_COLOR,
  ICON_TRASH,
  ICON_VA_BOTTOM,
  ICON_VA_MIDDLE,
  ICON_VA_TOP,
} from './overlay/icon-svgs';
export { openContextMenu } from './overlay/menu-builder';
export { TableSelectionOverlay } from './overlay/table-selection-overlay';
export {
  PALETTE_COLORS,
  PALETTE_COLUMNS,
  PALETTE_ROWS,
  type PaletteColor,
} from './palette';

export {
  getSelectedNodesOfType,
  isNodeInSchema,
  updateNodesAttr,
} from './utils/editor-utils';
export {
  canDoInTable,
  findRowDepth,
  findTableDepth,
} from './utils/table-helpers';
