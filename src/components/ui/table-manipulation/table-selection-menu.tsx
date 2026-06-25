import type { Editor } from '@tiptap/react';
import { useMemo } from 'react';
import { ArrowRightIcon } from '../../icons/arrow-direction-icon';
import {
  useClearSelectedCells,
  useCopySelectedCells,
  useTableAddRowColumn,
  useTableDeleteRowColumn,
  useTableHeaderRowColumn,
  useTableMergeSplitCell,
  useTableMoveRowColumn,
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

export type MenuGroupItem = MenuItemDef | SubMenuDef;

export function isSubMenu(item: MenuGroupItem): item is SubMenuDef {
  return 'items' in item;
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
  const moveRowUp = useTableMoveRowColumn({
    editor,
    orientation: 'row',
    direction: 'up',
  });
  const moveRowDown = useTableMoveRowColumn({
    editor,
    orientation: 'row',
    direction: 'down',
  });
  const moveColLeft = useTableMoveRowColumn({
    editor,
    orientation: 'column',
    direction: 'left',
  });
  const moveColRight = useTableMoveRowColumn({
    editor,
    orientation: 'column',
    direction: 'right',
  });
  const copyCells = useCopySelectedCells({ editor });
  const clearCells = useClearSelectedCells({ editor });
  const headerRow = useTableHeaderRowColumn({ editor, orientation: 'row' });
  const headerCol = useTableHeaderRowColumn({ editor, orientation: 'column' });
  const deleteRow = useTableDeleteRowColumn({ editor, orientation: 'row' });
  const deleteCol = useTableDeleteRowColumn({ editor, orientation: 'column' });

  const canSplit = editor?.can().splitCell() ?? false;

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
          label: '移动',
          icon: ArrowRightIcon,
          items: [
            {
              label: moveRowUp.label,
              icon: moveRowUp.Icon,
              onClick: moveRowUp.handleAction,
            },
            {
              label: moveRowDown.label,
              icon: moveRowDown.Icon,
              onClick: moveRowDown.handleAction,
            },
            {
              label: moveColLeft.label,
              icon: moveColLeft.Icon,
              onClick: moveColLeft.handleAction,
            },
            {
              label: moveColRight.label,
              icon: moveColRight.Icon,
              onClick: moveColRight.handleAction,
            },
          ],
        },
        {
          label: copyCells.label,
          icon: copyCells.Icon,
          onClick: copyCells.handleAction,
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
      moveRowUp.label,
      moveRowUp.handleAction,
      moveRowDown.label,
      moveRowDown.handleAction,
      moveColLeft.label,
      moveColLeft.handleAction,
      moveColRight.label,
      moveColRight.handleAction,
      copyCells.label,
      copyCells.handleAction,
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
