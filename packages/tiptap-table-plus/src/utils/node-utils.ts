/**
 * ProseMirror 节点操作工具：选区内节点收集与批量属性更新。
 */
import type { NodeWithPos } from '@tiptap/core';
import { findParentNodeClosestToPos } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
import type { Transaction } from '@tiptap/pm/state';
import { NodeSelection, type Selection } from '@tiptap/pm/state';
import { CellSelection, cellAround } from '@tiptap/pm/tables';

/**
 * 获取当前选区中所有指定类型的节点。
 * 依次匹配：单元格选区 → 节点选区 → 光标所在单元格 → 最近的匹配祖先节点。
 */
export function getSelectedNodesOfType(
  selection: Selection,
  allowedNodeTypes: string[],
): NodeWithPos[] {
  const results: NodeWithPos[] = [];
  const allowed = new Set(allowedNodeTypes);

  if (selection instanceof CellSelection) {
    selection.forEachCell((node: PMNode, pos: number) => {
      if (allowed.has(node.type.name)) {
        results.push({ node, pos });
      }
    });
    return results;
  }

  if (selection instanceof NodeSelection) {
    const { node, from: pos } = selection;
    if (node && allowed.has(node.type.name)) {
      results.push({ node, pos });
    }
    return results;
  }

  const { $anchor } = selection;
  const cell = cellAround($anchor);

  if (cell) {
    const cellNode = $anchor.doc.nodeAt(cell.pos);
    if (cellNode && allowed.has(cellNode.type.name)) {
      results.push({ node: cellNode, pos: cell.pos });
      return results;
    }
  }

  const parentNode = findParentNodeClosestToPos($anchor, (node) =>
    allowed.has(node.type.name),
  );

  if (parentNode) {
    results.push({ node: parentNode.node, pos: parentNode.pos });
  }

  return results;
}

/**
 * 批量更新节点的单个属性；next 为函数时以上一个值计算新值。
 * 返回是否有节点被实际修改。
 */
export function updateNodesAttr<A extends string = string, V = unknown>(
  tr: Transaction,
  targets: readonly NodeWithPos[],
  attrName: A,
  next: V | ((prev: V | undefined) => V | undefined),
): boolean {
  if (!targets.length) return false;

  let changed = false;

  for (const { pos } of targets) {
    const currentNode = tr.doc.nodeAt(pos);
    if (!currentNode) continue;

    const prevValue = (currentNode.attrs as Record<string, unknown>)[
      attrName
    ] as V | undefined;
    const resolvedNext =
      typeof next === 'function'
        ? (next as (p: V | undefined) => V | undefined)(prevValue)
        : next;

    if (prevValue === resolvedNext) continue;

    const nextAttrs: Record<string, unknown> = { ...currentNode.attrs };
    if (resolvedNext === undefined) {
      delete nextAttrs[attrName];
    } else {
      nextAttrs[attrName] = resolvedNext;
    }

    tr.setNodeMarkup(pos, undefined, nextAttrs);
    changed = true;
  }

  return changed;
}
