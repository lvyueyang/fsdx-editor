import '@tiptap/extension-table';
import type { Node as PMNode } from '@tiptap/pm/model';
import type { Editor } from '@tiptap/react';
import type { ComponentType } from 'react';
import { useCallback } from 'react';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from '../../icons/arrow-direction-icon';
import { ArrowLeftIcon } from '../../icons/arrow-left-icon';
import { CopyIcon } from '../../icons/copy-icon';
import { PlusIcon } from '../../icons/plus-icon';
import { SortAscIcon, SortDescIcon } from '../../icons/sort-icon';
import { TrashIcon } from '../../icons/trash-icon';
import { type Orientation, useTableActionVisibility } from './table-utils';
import { canDoInTable, findRowDepth, findTableDepth } from './use-table-ops';

// ─── 添加行/列 ───

export interface UseTableAddRowColumnConfig {
  editor?: Editor | null;
  orientation: Orientation;
  direction: 'before' | 'after';
  hideWhenUnavailable?: boolean;
  onAdded?: () => void;
}

const ADD_LABELS: Record<Orientation, Record<string, string>> = {
  row: { before: '上方插入行', after: '下方插入行' },
  column: { before: '左侧插入列', after: '右侧插入列' },
};

export function useTableAddRowColumn(config: UseTableAddRowColumnConfig) {
  const {
    editor: providedEditor,
    orientation,
    direction,
    hideWhenUnavailable = false,
    onAdded,
  } = config;
  const { editor } = useFsdxEditor(providedEditor);
  const isVisible = useTableActionVisibility(
    editor,
    canDoInTable,
    hideWhenUnavailable,
  );

  const handleAction = useCallback(() => {
    if (!editor) return false;
    const cmd =
      orientation === 'row'
        ? direction === 'before'
          ? 'addRowBefore'
          : 'addRowAfter'
        : direction === 'before'
          ? 'addColumnBefore'
          : 'addColumnAfter';
    const success = editor.chain().focus()[cmd as 'addRowBefore']().run();
    if (success) onAdded?.();
    return success;
  }, [editor, orientation, direction, onAdded]);

  return {
    isVisible,
    canDo: canDoInTable(editor),
    handleAction,
    label: ADD_LABELS[orientation][direction],
    Icon: PlusIcon,
  };
}

// ─── 删除行/列 ───

export interface UseTableDeleteRowColumnConfig {
  editor?: Editor | null;
  orientation: Orientation;
  hideWhenUnavailable?: boolean;
  onDeleted?: () => void;
}

const DELETE_LABELS: Record<Orientation, string> = {
  row: '删除行',
  column: '删除列',
};

export function useTableDeleteRowColumn(config: UseTableDeleteRowColumnConfig) {
  const {
    editor: providedEditor,
    orientation,
    hideWhenUnavailable = false,
    onDeleted,
  } = config;
  const { editor } = useFsdxEditor(providedEditor);
  const isVisible = useTableActionVisibility(
    editor,
    canDoInTable,
    hideWhenUnavailable,
  );

  const handleAction = useCallback(() => {
    if (!editor) return false;
    const cmd = orientation === 'row' ? 'deleteRow' : 'deleteColumn';
    const success = editor.chain().focus()[cmd as 'deleteRow']().run();
    if (success) onDeleted?.();
    return success;
  }, [editor, orientation, onDeleted]);

  return {
    isVisible,
    canDo: canDoInTable(editor),
    handleAction,
    label: DELETE_LABELS[orientation],
    Icon: TrashIcon,
  };
}

// ─── 移动行/列 ───

export interface UseTableMoveRowColumnConfig {
  editor?: Editor | null;
  orientation: Orientation;
  direction: 'up' | 'down' | 'left' | 'right';
  hideWhenUnavailable?: boolean;
  onMoved?: () => void;
}

const MOVE_LABELS: Record<Orientation, Record<string, string>> = {
  row: { up: '上移行', down: '下移行' },
  column: { left: '左移列', right: '右移列' },
};

const MOVE_ROW_ICONS: Record<string, typeof ArrowUpIcon> = {
  up: ArrowUpIcon,
  down: ArrowDownIcon,
};
const MOVE_COL_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  left: ArrowLeftIcon,
  right: ArrowRightIcon,
};

export function useTableMoveRowColumn(config: UseTableMoveRowColumnConfig) {
  const {
    editor: providedEditor,
    orientation,
    direction,
    hideWhenUnavailable = false,
    onMoved,
  } = config;
  const { editor } = useFsdxEditor(providedEditor);
  const isVisible = useTableActionVisibility(
    editor,
    canDoInTable,
    hideWhenUnavailable,
  );

  const handleAction = useCallback(() => {
    if (!editor) return false;
    const { state, view } = editor;
    const { selection, doc } = state;
    const $anchor = selection.$anchor;
    const tDepth = findTableDepth($anchor);
    if (tDepth === -1) return false;
    const tablePos = $anchor.start(tDepth);
    const tableNode = $anchor.node(tDepth);

    if (orientation === 'row') {
      const rDepth = findRowDepth($anchor);
      if (rDepth === -1) return false;
      const rowIdx = $anchor.index(rDepth - 1);
      const rows: PMNode[] = [];
      tableNode.forEach((child) => rows.push(child));
      const targetIdx = direction === 'up' ? rowIdx - 1 : rowIdx + 1;
      if (targetIdx < 0 || targetIdx >= rows.length) return false;

      const rowPositions: number[] = [];
      let p = tablePos + 1;
      for (const r of rows) {
        rowPositions.push(p);
        p += r.nodeSize;
      }

      const tr = state.tr;
      const from1 = rowPositions[rowIdx];
      const to1 = from1 + rows[rowIdx].nodeSize;
      const from2 = rowPositions[targetIdx];
      const to2 = from2 + rows[targetIdx].nodeSize;
      const s1 = doc.slice(from1, to1);
      const s2 = doc.slice(from2, to2);
      if (direction === 'up') {
        tr.replace(from2, to2, s1);
        tr.replace(from1, to1, s2);
      } else {
        tr.replace(from1, to1, s2);
        tr.replace(from2, to2, s1);
      }
      view.dispatch(tr);
    } else {
      const colIdx = $anchor.index($anchor.depth - 1);
      const targetCol = direction === 'left' ? colIdx - 1 : colIdx + 1;
      if (targetCol < 0) return false;

      const tr = state.tr;
      let p = tablePos + 1;
      tableNode.forEach((row) => {
        const cells: { node: PMNode; pos: number }[] = [];
        let cp = p + 1;
        row.forEach((cell) => {
          cells.push({ node: cell, pos: cp });
          cp += cell.nodeSize;
        });
        if (targetCol >= cells.length || colIdx >= cells.length) {
          p += row.nodeSize;
          return;
        }
        const c1 = cells[colIdx];
        const c2 = cells[targetCol];
        tr.replace(
          c2.pos,
          c2.pos + c2.node.nodeSize,
          doc.slice(c1.pos, c1.pos + c1.node.nodeSize),
        );
        tr.replace(
          c1.pos,
          c1.pos + c1.node.nodeSize,
          doc.slice(c2.pos, c2.pos + c2.node.nodeSize),
        );
        p += row.nodeSize;
      });
      view.dispatch(tr);
    }
    onMoved?.();
    return true;
  }, [editor, orientation, direction, onMoved]);

  const dirKey =
    orientation === 'row' ? direction : direction === 'left' ? 'left' : 'right';
  const icons = orientation === 'row' ? MOVE_ROW_ICONS : MOVE_COL_ICONS;
  const labels = MOVE_LABELS[orientation];

  return {
    isVisible,
    canDo: canDoInTable(editor),
    handleAction,
    label: labels[dirKey],
    Icon: icons[dirKey],
  };
}

// ─── 复制行/列 ───

export interface UseTableDuplicateRowColumnConfig {
  editor?: Editor | null;
  orientation: Orientation;
  hideWhenUnavailable?: boolean;
  onDuplicated?: () => void;
}

const DUPLICATE_LABELS: Record<Orientation, string> = {
  row: '复制行',
  column: '复制列',
};

export function useTableDuplicateRowColumn(
  config: UseTableDuplicateRowColumnConfig,
) {
  const {
    editor: providedEditor,
    orientation,
    hideWhenUnavailable = false,
    onDuplicated,
  } = config;
  const { editor } = useFsdxEditor(providedEditor);
  const isVisible = useTableActionVisibility(
    editor,
    canDoInTable,
    hideWhenUnavailable,
  );

  const handleAction = useCallback(() => {
    if (!editor) return false;
    const { state, view } = editor;
    const { selection } = state;
    const $anchor = selection.$anchor;
    const tDepth = findTableDepth($anchor);
    if (tDepth === -1) return false;
    const tableNode = $anchor.node(tDepth);
    const tableStart = $anchor.start(tDepth);

    if (orientation === 'row') {
      const rDepth = findRowDepth($anchor);
      if (rDepth === -1) return false;
      const rowNode = $anchor.node(rDepth);
      const rowEnd = $anchor.start(rDepth) + rowNode.nodeSize;
      const tr = state.tr;
      tr.insert(rowEnd, rowNode.copy(rowNode.content));
      view.dispatch(tr);
    } else {
      const colIdx = $anchor.index($anchor.depth - 1);
      const tr = state.tr;
      let p = tableStart + 1;
      tableNode.forEach((row) => {
        const rStart = p;
        const cells: { node: PMNode; cpos: number }[] = [];
        let cp = rStart + 1;
        row.forEach((cell) => {
          cells.push({ node: cell, cpos: cp });
          cp += cell.nodeSize;
        });
        if (colIdx < cells.length) {
          tr.insert(
            cells[colIdx].cpos + cells[colIdx].node.nodeSize,
            cells[colIdx].node.copy(cells[colIdx].node.content),
          );
        }
        p += row.nodeSize;
      });
      view.dispatch(tr);
    }
    onDuplicated?.();
    return true;
  }, [editor, orientation, onDuplicated]);

  return {
    isVisible,
    canDo: canDoInTable(editor),
    handleAction,
    label: DUPLICATE_LABELS[orientation],
    Icon: CopyIcon,
  };
}

// ─── 排序行/列 ───

export interface UseTableSortRowColumnConfig {
  editor?: Editor | null;
  orientation: Orientation;
  direction: 'asc' | 'desc';
  hideWhenUnavailable?: boolean;
  onSorted?: () => void;
}

const SORT_LABELS: Record<string, string> = {
  asc: '升序排列',
  desc: '降序排列',
};

export function useTableSortRowColumn(config: UseTableSortRowColumnConfig) {
  const {
    editor: providedEditor,
    orientation,
    direction,
    hideWhenUnavailable = false,
    onSorted,
  } = config;
  const { editor } = useFsdxEditor(providedEditor);
  const isVisible = useTableActionVisibility(
    editor,
    canDoInTable,
    hideWhenUnavailable,
  );

  const handleAction = useCallback(() => {
    if (!editor) return false;
    const success = editor
      .chain()
      .focus()
      .command(({ tr }) => {
        const $a = tr.selection.$anchor;
        const tDepth = findTableDepth($a);
        if (tDepth === -1) return false;
        const tNode = $a.node(tDepth);
        const tStart = $a.start(tDepth);

        if (orientation === 'row') {
          const colIdx = $a.index($a.depth - 1);
          const tableRows: PMNode[] = [];
          let header: PMNode | null = null;
          tNode.forEach((row, _o, idx) => {
            if (idx === 0) header = row;
            else tableRows.push(row);
          });

          tableRows.sort((a, b) => {
            const aText =
              a.childCount > colIdx ? a.child(colIdx).textContent : '';
            const bText =
              b.childCount > colIdx ? b.child(colIdx).textContent : '';
            if (!aText) return 1;
            if (!bText) return -1;
            const cmp = aText.localeCompare(bText, 'zh-CN');
            return direction === 'asc' ? cmp : -cmp;
          });

          const allRows: PMNode[] = header ? [header, ...tableRows] : tableRows;
          const newTable = tNode.type.create(tNode.attrs, allRows, tNode.marks);
          tr.replaceWith(tStart, tStart + tNode.nodeSize, newTable);
        } else {
          const colIdx = $a.index($a.depth - 1);
          const tableRows: PMNode[] = [];
          let header: PMNode | null = null;
          tNode.forEach((row, _o, idx) => {
            if (idx === 0) header = row;
            else tableRows.push(row);
          });

          tableRows.sort((a, b) => {
            const aText =
              a.childCount > colIdx ? a.child(colIdx).textContent : '';
            const bText =
              b.childCount > colIdx ? b.child(colIdx).textContent : '';
            if (!aText) return 1;
            if (!bText) return -1;
            const cmp = aText.localeCompare(bText, 'zh-CN');
            return direction === 'asc' ? cmp : -cmp;
          });

          const allRows: PMNode[] = header ? [header, ...tableRows] : tableRows;
          const newTable = tNode.type.create(tNode.attrs, allRows, tNode.marks);
          tr.replaceWith(tStart, tStart + tNode.nodeSize, newTable);
        }
        return true;
      })
      .run();
    if (success) onSorted?.();
    return success;
  }, [editor, orientation, direction, onSorted]);

  return {
    isVisible,
    canDo: canDoInTable(editor),
    handleAction,
    label: SORT_LABELS[direction],
    Icon: direction === 'asc' ? SortAscIcon : SortDescIcon,
  };
}
