import type { Editor } from '@tiptap/react';
import { useCallback, useMemo } from 'react';
import {
  useClearSelectedCells,
  useTableAddRowColumn,
  useTableCellBackgroundColor,
  useTableCellTextAlign,
  useTableCellTextColor,
  useTableCellVerticalAlign,
  useTableDeleteRowColumn,
  useTableHeaderRowColumn,
  useTableMergeSplitCell,
} from './use-table-ops';

export interface MenuItemDef {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
}

export interface SubMenuDef {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: MenuItemDef[];
}

export interface ColorSubMenuDef {
  type: 'color';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  currentColor: string | null;
  onSelectColor: (color: string) => void;
  onReset: () => void;
}

export type MenuGroupItem = MenuItemDef | SubMenuDef | ColorSubMenuDef;

export function isSubMenu(item: MenuGroupItem): item is SubMenuDef {
  return 'items' in item && !('type' in item);
}

export function isColorSubMenu(item: MenuGroupItem): item is ColorSubMenuDef {
  return 'type' in item && item.type === 'color';
}

export function useTableMenuItems(editor: Editor | null): MenuGroupItem[][] {
  const addRowBefore = useTableAddRowColumn({
    editor,
    orientation: 'row',
    direction: 'before',
  });
  const addRowAfter = useTableAddRowColumn({
    editor,
    orientation: 'row',
    direction: 'after',
  });
  const addColBefore = useTableAddRowColumn({
    editor,
    orientation: 'column',
    direction: 'before',
  });
  const addColAfter = useTableAddRowColumn({
    editor,
    orientation: 'column',
    direction: 'after',
  });
  const merge = useTableMergeSplitCell({ editor, action: 'merge' });
  const split = useTableMergeSplitCell({ editor, action: 'split' });
  const clearCells = useClearSelectedCells({ editor });
  const headerRow = useTableHeaderRowColumn({ editor, orientation: 'row' });
  const headerCol = useTableHeaderRowColumn({ editor, orientation: 'column' });
  const deleteRow = useTableDeleteRowColumn({ editor, orientation: 'row' });
  const deleteCol = useTableDeleteRowColumn({ editor, orientation: 'column' });

  const textColor = useTableCellTextColor({ editor });
  const bgColor = useTableCellBackgroundColor({ editor });
  const alignLeft = useTableCellTextAlign({ editor, align: 'left' });
  const alignCenter = useTableCellTextAlign({ editor, align: 'center' });
  const alignRight = useTableCellTextAlign({ editor, align: 'right' });
  const alignJustify = useTableCellTextAlign({ editor, align: 'justify' });
  const vaTop = useTableCellVerticalAlign({ editor, align: 'top' });
  const vaMiddle = useTableCellVerticalAlign({ editor, align: 'middle' });
  const vaBottom = useTableCellVerticalAlign({ editor, align: 'bottom' });

  const canSplit = editor?.can().splitCell() ?? false;

  const handleSelectTextColor = useCallback(
    (color: string) => {
      textColor.setColor(color);
    },
    [textColor],
  );

  const handleResetTextColor = useCallback(() => {
    textColor.unsetColor();
  }, [textColor]);

  const handleSelectBgColor = useCallback(
    (color: string) => {
      bgColor.setColor(color);
    },
    [bgColor],
  );

  const handleResetBgColor = useCallback(() => {
    bgColor.unsetColor();
  }, [bgColor]);

  return useMemo<MenuGroupItem[][]>(
    () => [
      [
        {
          label: addRowBefore.label,
          icon: addRowBefore.Icon,
          onClick: addRowBefore.handleAction,
        },
        {
          label: addRowAfter.label,
          icon: addRowAfter.Icon,
          onClick: addRowAfter.handleAction,
        },
        {
          label: addColBefore.label,
          icon: addColBefore.Icon,
          onClick: addColBefore.handleAction,
        },
        {
          label: addColAfter.label,
          icon: addColAfter.Icon,
          onClick: addColAfter.handleAction,
        },
      ],
      [
        {
          label: merge.label,
          icon: merge.Icon,
          onClick: merge.handleAction,
        },
        {
          label: split.label,
          icon: split.Icon,
          onClick: split.handleAction,
          disabled: !canSplit,
        },
      ],
      [
        {
          type: 'color',
          label: textColor.label,
          icon: textColor.Icon,
          currentColor: null,
          onSelectColor: handleSelectTextColor,
          onReset: handleResetTextColor,
        },
        {
          type: 'color',
          label: bgColor.label,
          icon: bgColor.Icon,
          currentColor: null,
          onSelectColor: handleSelectBgColor,
          onReset: handleResetBgColor,
        },
        {
          label: '水平对齐',
          icon: alignLeft.Icon,
          items: [
            {
              label: alignLeft.label,
              icon: alignLeft.Icon,
              onClick: alignLeft.handleAction,
            },
            {
              label: alignCenter.label,
              icon: alignCenter.Icon,
              onClick: alignCenter.handleAction,
            },
            {
              label: alignRight.label,
              icon: alignRight.Icon,
              onClick: alignRight.handleAction,
            },
            {
              label: alignJustify.label,
              icon: alignJustify.Icon,
              onClick: alignJustify.handleAction,
            },
          ],
        },
        {
          label: '垂直对齐',
          icon: vaTop.Icon,
          items: [
            {
              label: vaTop.label,
              icon: vaTop.Icon,
              onClick: vaTop.handleAction,
            },
            {
              label: vaMiddle.label,
              icon: vaMiddle.Icon,
              onClick: vaMiddle.handleAction,
            },
            {
              label: vaBottom.label,
              icon: vaBottom.Icon,
              onClick: vaBottom.handleAction,
            },
          ],
        },
        {
          label: clearCells.label,
          icon: clearCells.Icon,
          onClick: clearCells.handleAction,
        },
        {
          label: headerRow.label,
          icon: headerRow.Icon,
          onClick: headerRow.handleAction,
        },
        {
          label: headerCol.label,
          icon: headerCol.Icon,
          onClick: headerCol.handleAction,
        },
      ],
      [
        {
          label: deleteRow.label,
          icon: deleteRow.Icon,
          onClick: deleteRow.handleAction,
          variant: 'destructive',
        },
        {
          label: deleteCol.label,
          icon: deleteCol.Icon,
          onClick: deleteCol.handleAction,
          variant: 'destructive',
        },
      ],
    ],
    [
      addRowBefore.label,
      addRowBefore.handleAction,
      addRowAfter.label,
      addRowAfter.handleAction,
      addColBefore.label,
      addColBefore.handleAction,
      addColAfter.label,
      addColAfter.handleAction,
      merge.label,
      merge.handleAction,
      split.label,
      split.handleAction,
      canSplit,
      textColor.label,
      handleSelectTextColor,
      handleResetTextColor,
      bgColor.label,
      handleSelectBgColor,
      handleResetBgColor,
      alignLeft.label,
      alignLeft.handleAction,
      alignCenter.label,
      alignCenter.handleAction,
      alignRight.label,
      alignRight.handleAction,
      alignJustify.label,
      alignJustify.handleAction,
      vaTop.label,
      vaTop.handleAction,
      vaMiddle.label,
      vaMiddle.handleAction,
      vaBottom.label,
      vaBottom.handleAction,
      clearCells.label,
      clearCells.handleAction,
      headerRow.label,
      headerRow.handleAction,
      headerCol.label,
      headerCol.handleAction,
      deleteRow.label,
      deleteRow.handleAction,
      deleteCol.label,
      deleteCol.handleAction,
    ],
  );
}
