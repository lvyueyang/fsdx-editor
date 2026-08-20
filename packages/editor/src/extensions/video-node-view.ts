import type { Node } from '@tiptap/pm/model';
import type { NodeView } from '@tiptap/pm/view';

export interface VideoNodeViewProps {
  node: Node;
  HTMLAttributes: Record<string, unknown>;
}

/**
 * 视频 NodeView：复用同一个 <video> 元素，属性更新时只同步发生变化的值，
 * 避免重建 DOM 或重复赋值 src 触发重新加载导致编辑器闪动。
 */
export function createVideoNodeView(props: VideoNodeViewProps): NodeView {
  const { node, HTMLAttributes } = props;
  let currentNode = node;

  const container = document.createElement('div');
  container.className = 'easyx-editor-video-wrapper';

  const video = document.createElement('video');
  container.appendChild(video);

  // 记录上一次同步的值，仅在实际变化时更新 DOM
  let lastSrc = '';
  let lastPoster = '';
  let lastControls: boolean | null = null;
  let lastAutoplay: boolean | null = null;

  const sync = (n: Node) => {
    const attrs = n.attrs as Record<string, unknown>;
    const src = (attrs.src as string) ?? (HTMLAttributes.src as string) ?? '';
    const poster = (attrs.poster as string) ?? '';
    const controls = attrs.controls !== false;
    const autoplay = attrs.autoplay === true;
    const align = (attrs.align as string) ?? null;

    if (src !== lastSrc) {
      lastSrc = src;
      video.src = src;
    }
    if (poster !== lastPoster) {
      lastPoster = poster;
      video.poster = poster;
    }
    if (controls !== lastControls) {
      lastControls = controls;
      video.controls = controls;
    }
    if (autoplay !== lastAutoplay) {
      lastAutoplay = autoplay;
      video.autoplay = autoplay;
    }
    if (align != null) {
      container.dataset.align = align;
    } else {
      delete container.dataset.align;
    }
  };

  sync(node);

  return {
    dom: container,
    contentDOM: undefined,
    ignoreMutation: () => true,
    update(updatedNode) {
      if (updatedNode.type !== currentNode.type) return false;
      currentNode = updatedNode;
      sync(updatedNode);
      return true;
    },
    destroy() {},
  };
}
