import type { Editor } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import type { NodeView } from '@tiptap/pm/view';

/** 图片可缩放 NodeView 配置 */
export interface ImageNodeViewResizeOptions {
  minWidth: number;
  minHeight: number;
}

/** 缩放手柄方向（仅四角） */
const RESIZE_HANDLES = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
] as const;

type ResizeDirection = (typeof RESIZE_HANDLES)[number];

export interface ImageNodeViewProps {
  node: Node;
  editor: Editor;
  getPos: () => number | undefined;
  HTMLAttributes: Record<string, unknown>;
}

/** 判断宽度是否为百分比形式 */
function isPercentWidth(width: unknown): boolean {
  return typeof width === 'string' && width.endsWith('%');
}

/** 将节点宽度属性应用到 wrapper（百分比相对容器解析，px 固定） */
function applyWrapperWidth(wrapper: HTMLElement, width: unknown): void {
  if (width != null && width !== '') {
    wrapper.style.width = isPercentWidth(width) ? String(width) : `${width}px`;
  } else {
    wrapper.style.removeProperty('width');
  }
}

/** 同步节点属性到 img DOM（src/alt/title/对齐） */
function syncImageAttrs(
  img: HTMLImageElement,
  node: Node,
  HTMLAttributes: Record<string, unknown>,
): void {
  const { src, alt, title, align } = node.attrs as Record<string, unknown>;
  img.src = (src as string) ?? (HTMLAttributes.src as string) ?? '';
  if (alt != null) {
    img.alt = String(alt);
  } else {
    img.removeAttribute('alt');
  }
  if (title != null) {
    img.title = String(title);
  } else {
    img.removeAttribute('title');
  }
  if (align != null) {
    img.dataset.align = String(align);
  } else {
    delete img.dataset.align;
  }
}

/** 按方向定位缩放手柄（absolute 于 wrapper 内） */
function positionHandle(
  handle: HTMLDivElement,
  direction: ResizeDirection,
): void {
  const style = handle.style;
  if (direction.includes('top')) style.top = '-5px';
  if (direction.includes('bottom')) style.bottom = '-5px';
  if (direction.includes('left')) style.left = '-5px';
  if (direction.includes('right')) style.right = '-5px';
}

/**
 * 图片可缩放 NodeView：尺寸落在 wrapper 上（img 以 100% 填满），
 * 四角手柄相对 wrapper 定位，随图片尺寸同步移动。
 * 支持像素与百分比两种宽度，拖动时按当前单位提交并保持纵横比。
 */
export function createImageNodeView(
  props: ImageNodeViewProps,
  resize: ImageNodeViewResizeOptions,
): NodeView {
  const { node, editor, getPos, HTMLAttributes } = props;
  let currentNode = node;

  const container = document.createElement('div');
  container.dataset.resizeContainer = '';
  container.dataset.node = node.type.name;
  container.style.display = 'flex';

  const wrapper = document.createElement('div');
  wrapper.dataset.resizeWrapper = '';
  wrapper.style.position = 'relative';
  wrapper.style.flexShrink = '0';
  applyWrapperWidth(wrapper, currentNode.attrs.width);

  const img = document.createElement('img');
  img.draggable = false;
  syncImageAttrs(img, currentNode, HTMLAttributes);

  wrapper.appendChild(img);
  container.appendChild(wrapper);

  let isResizing = false;
  let activeDirection: ResizeDirection | null = null;
  let startX = 0;
  let startWidth = 0;

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing || !activeDirection) return;
    let newWidth = startWidth;
    if (activeDirection.includes('right'))
      newWidth = startWidth + e.clientX - startX;
    if (activeDirection.includes('left'))
      newWidth = startWidth - (e.clientX - startX);
    wrapper.style.width = `${Math.max(resize.minWidth, Math.round(newWidth))}px`;
  };

  const onMouseUp = () => {
    if (!isResizing) return;
    isResizing = false;
    activeDirection = null;
    delete container.dataset.resizeState;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    commitSize();
  };

  const startResize = (e: MouseEvent, direction: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing = true;
    activeDirection = direction;
    startX = e.clientX;
    startWidth = wrapper.offsetWidth;
    container.dataset.resizeState = 'true';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  /** 提交尺寸：当前宽度为百分比时换算为容器宽度的百分比 */
  const commitSize = () => {
    const pos = getPos();
    if (pos === undefined) return;
    const width = wrapper.offsetWidth;
    if (isPercentWidth(currentNode.attrs.width)) {
      const containerWidth = container.clientWidth || 1;
      const pct = Math.max(
        1,
        Math.min(100, Math.round((width / containerWidth) * 100)),
      );
      editor
        .chain()
        .focus()
        .setNodeSelection(pos)
        .updateAttributes('imageUpload', { width: `${pct}%`, height: null })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .setNodeSelection(pos)
        .updateAttributes('imageUpload', { width, height: null })
        .run();
    }
  };

  for (const direction of RESIZE_HANDLES) {
    const handle = document.createElement('div');
    handle.dataset.resizeHandle = direction;
    handle.style.position = 'absolute';
    positionHandle(handle, direction);
    handle.addEventListener('mousedown', (e) => startResize(e, direction));
    wrapper.appendChild(handle);
  }

  return {
    dom: container,
    contentDOM: undefined,
    ignoreMutation: () => true,
    update(updatedNode) {
      if (updatedNode.type !== currentNode.type) return false;
      currentNode = updatedNode;
      applyWrapperWidth(wrapper, updatedNode.attrs.width);
      syncImageAttrs(img, updatedNode, HTMLAttributes);
      return true;
    },
    destroy() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    },
  };
}
