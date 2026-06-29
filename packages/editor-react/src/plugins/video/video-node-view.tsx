import { NodeViewWrapper } from '@tiptap/react';
import { cn } from '../../core/editor-utils';
import type { VideoNodeAttributes } from './video-node-extension';
import './video-node.scss';

export function VideoNodeView({
  node,
}: {
  node: { attrs: VideoNodeAttributes };
}) {
  const { src, poster, width, alignment, autoplay, controls, loop } =
    node.attrs;

  if (!src) {
    return (
      <NodeViewWrapper className="fsdx-editor-video-node">
        <div className="fsdx-editor-video-placeholder">未设置视频地址</div>
      </NodeViewWrapper>
    );
  }

  const alignClass = alignment
    ? `fsdx-editor-video-node--align-${alignment}`
    : undefined;

  return (
    <NodeViewWrapper className={cn('fsdx-editor-video-node', alignClass)}>
      {/* biome-ignore lint/a11y/useMediaCaption: preview only */}
      <video
        src={src}
        poster={poster}
        width={width || undefined}
        autoPlay={!!autoplay}
        controls={controls !== false}
        loop={!!loop}
        controlsList="nodownload"
        className="fsdx-editor-video-element"
      />
    </NodeViewWrapper>
  );
}
