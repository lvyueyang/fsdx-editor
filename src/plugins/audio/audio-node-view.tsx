import { NodeViewWrapper } from '@tiptap/react';
import type { AudioNodeAttributes } from './audio-node-extension';
import './audio-node.scss';

export function AudioNodeView({
  node,
}: {
  node: { attrs: AudioNodeAttributes };
}) {
  const { src, autoplay, controls, loop } = node.attrs;

  if (!src) {
    return (
      <NodeViewWrapper className="tiptap-audio-node">
        <div className="tiptap-audio-placeholder">未设置音频地址</div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="tiptap-audio-node">
      <div className="tiptap-audio-card">
        <div className="tiptap-audio-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <div className="tiptap-audio-info">
          <span className="tiptap-audio-name">
            {decodeURIComponent((src || '').split('/').pop() || '音频文件')}
          </span>
          {/* biome-ignore lint/a11y/useMediaCaption: preview only */}
          <audio
            src={src}
            autoPlay={!!autoplay}
            controls={controls !== false}
            loop={!!loop}
            className="tiptap-audio-element"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
