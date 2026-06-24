import type { Editor } from '@tiptap/react';
import { useMemo } from 'react';
import {
  useTableAddRowColumn,
  useTableClearRowColumnContent,
  useTableDeleteRowColumn,
  useTableDuplicateRowColumn,
  useTableHeaderRowColumn,
  useTableMergeSplitCell,
  useTableMoveRowColumn,
} from './use-table-ops';

export interface MenuItemDef {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

export function useTableMenuItems(editor: Editor | null): MenuItemDef[][] {
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
  const deleteRow = useTableDeleteRowColumn({ editor, orientation: 'row' });
  const deleteCol = useTableDeleteRowColumn({ editor, orientation: 'column' });
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
  const dupRow = useTableDuplicateRowColumn({ editor, orientation: 'row' });
  const dupCol = useTableDuplicateRowColumn({ editor, orientation: 'column' });
  const clearRow = useTableClearRowColumnContent({
    editor,
    orientation: 'row',
  });
  const clearCol = useTableClearRowColumnContent({
    editor,
    orientation: 'column',
  });
  const headerRow = useTableHeaderRowColumn({ editor, orientation: 'row' });
  const headerCol = useTableHeaderRowColumn({ editor, orientation: 'column' });

  return useMemo<MenuItemDef[][]>(
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
          label: deleteRow.label,
          icon: deleteRow.Icon,
          onClick: deleteRow.handleAction,
        },
        {
          label: deleteCol.label,
          icon: deleteCol.Icon,
          onClick: deleteCol.handleAction,
        },
        { label: merge.label, icon: merge.Icon, onClick: merge.handleAction },
        { label: split.label, icon: split.Icon, onClick: split.handleAction },
      ],
      [
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
        {
          label: dupRow.label,
          icon: dupRow.Icon,
          onClick: dupRow.handleAction,
        },
        {
          label: dupCol.label,
          icon: dupCol.Icon,
          onClick: dupCol.handleAction,
        },
      ],
      [
        {
          label: clearRow.label,
          icon: clearRow.Icon,
          onClick: clearRow.handleAction,
        },
        {
          label: clearCol.label,
          icon: clearCol.Icon,
          onClick: clearCol.handleAction,
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
      deleteRow.label,
      deleteRow.handleAction,
      deleteCol.label,
      deleteCol.handleAction,
      merge.label,
      merge.handleAction,
      split.label,
      split.handleAction,
      moveRowUp.label,
      moveRowUp.handleAction,
      moveRowDown.label,
      moveRowDown.handleAction,
      moveColLeft.label,
      moveColLeft.handleAction,
      moveColRight.label,
      moveColRight.handleAction,
      dupRow.label,
      dupRow.handleAction,
      dupCol.label,
      dupCol.handleAction,
      clearRow.label,
      clearRow.handleAction,
      clearCol.label,
      clearCol.handleAction,
      headerRow.label,
      headerRow.handleAction,
      headerCol.label,
      headerCol.handleAction,
    ],
  );
}
