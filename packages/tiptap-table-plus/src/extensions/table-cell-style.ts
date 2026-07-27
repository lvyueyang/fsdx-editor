/**
 * 单元格样式扩展：为 tableCell/tableHeader 提供文字颜色、水平/垂直对齐
 * 属性（以行内 style 序列化），并注册对应的批量设置命令。
 */
import type { Command } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { getSelectedNodesOfType, updateNodesAttr } from '../utils/node-utils';

/** 单元格垂直对齐值 */
export type CellVerticalAlign = 'top' | 'middle' | 'bottom';

const CELL_TYPES = ['tableCell', 'tableHeader'];

/** 生成"节点属性 ↔ 行内样式"的声明式属性定义 */
function cellStyleAttr(attr: string, cssProperty: string) {
  return {
    default: null as string | null,
    parseHTML: (element: HTMLElement) =>
      element.style.getPropertyValue(cssProperty) || null,
    renderHTML: (attributes: Record<string, unknown>) => {
      const value = attributes[attr] as string | null;
      return value ? { style: `${cssProperty}: ${value}` } : {};
    },
  };
}

/** 生成批量设置选中单元格属性的命令 */
function setCellAttr(attr: string, value: string | null): Command {
  return ({ tr }) => {
    const targets = getSelectedNodesOfType(tr.selection, CELL_TYPES);
    return updateNodesAttr(tr, targets, attr, value);
  };
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableCellStyle: {
      setCellTextColor: (color: string) => ReturnType;
      unsetCellTextColor: () => ReturnType;
      setCellTextAlign: (textAlign: string | null) => ReturnType;
      setCellVerticalAlign: (
        verticalAlign: CellVerticalAlign | null,
      ) => ReturnType;
    };
  }
}

export const TableCellStyle = Extension.create({
  name: 'tableCellStyle',

  addGlobalAttributes() {
    return [
      {
        types: CELL_TYPES,
        attributes: {
          textColor: cellStyleAttr('textColor', 'color'),
          textAlign: cellStyleAttr('textAlign', 'text-align'),
          verticalAlign: cellStyleAttr('verticalAlign', 'vertical-align'),
        },
      },
    ];
  },

  addCommands() {
    return {
      setCellTextColor: (color) => setCellAttr('textColor', color),
      unsetCellTextColor: () => setCellAttr('textColor', null),
      setCellTextAlign: (textAlign) => setCellAttr('textAlign', textAlign),
      setCellVerticalAlign: (verticalAlign) =>
        setCellAttr('verticalAlign', verticalAlign),
    };
  },
});
