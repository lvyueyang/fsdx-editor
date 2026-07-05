/**
 * 表格操作菜单的全部可翻译文本。
 * 使用方可引入内置语言包，或传入自定义 Partial<TablePlusTranslations> 覆盖部分字段。
 */
export interface TablePlusTranslations {
  /** 上方插入行 */
  insertRowAbove: string;
  /** 下方插入行 */
  insertRowBelow: string;
  /** 左侧插入列 */
  insertColumnLeft: string;
  /** 右侧插入列 */
  insertColumnRight: string;
  /** 合并单元格 */
  mergeCells: string;
  /** 拆分单元格 */
  splitCell: string;
  /** 文字颜色 */
  textColor: string;
  /** 背景色 */
  backgroundColor: string;
  /** 水平对齐 */
  horizontalAlign: string;
  /** 垂直对齐 */
  verticalAlign: string;
  /** 左对齐 */
  alignLeft: string;
  /** 居中 */
  alignCenter: string;
  /** 右对齐 */
  alignRight: string;
  /** 两端对齐 */
  alignJustify: string;
  /** 顶端对齐 */
  alignTop: string;
  /** 居中对齐（垂直） */
  alignMiddle: string;
  /** 底端对齐 */
  alignBottom: string;
  /** 清除内容 */
  clearContent: string;
  /** 切换标题行 */
  toggleHeaderRow: string;
  /** 切换标题列 */
  toggleHeaderColumn: string;
  /** 删除行 */
  deleteRow: string;
  /** 删除列 */
  deleteColumn: string;
  /** 返回上级菜单 */
  back: string;
  /** 颜色面板默认颜色按钮 */
  defaultColor: string;
  /** 操作手柄 aria-label */
  tableActions: string;
  /** 添加列 */
  addColumn: string;
  /** 添加行 */
  addRow: string;
}
