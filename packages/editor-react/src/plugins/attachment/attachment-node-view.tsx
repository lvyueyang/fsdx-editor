import { NodeViewWrapper } from '@tiptap/react';
import { formatFileSize } from '../../lib/format-file-size';
import type { AttachmentNodeAttributes } from './attachment-node-extension';
import './attachment-node.scss';

function getFileTypeLabel(fileType: string): string {
  if (!fileType) return '文件';
  const parts = fileType.split('/');
  return parts[parts.length - 1] || fileType;
}

export function AttachmentNodeView({
  node,
}: {
  node: { attrs: AttachmentNodeAttributes };
}) {
  const { src, fileName, fileSize, fileType } = node.attrs;

  if (!src) {
    return (
      <NodeViewWrapper className="fsdx-editor-attachment-node">
        <div className="fsdx-editor-attachment-placeholder">未设置附件地址</div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="fsdx-editor-attachment-node">
      <div className="fsdx-editor-attachment-card">
        <div className="fsdx-editor-attachment-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="fsdx-editor-attachment-info">
          <span className="fsdx-editor-attachment-name">
            {fileName || '未知文件'}
          </span>
          <span className="fsdx-editor-attachment-meta">
            {getFileTypeLabel(fileType || '')}
            {fileSize !== undefined && fileSize > 0
              ? ` · ${formatFileSize(fileSize)}`
              : ''}
          </span>
        </div>
        <a
          href={src}
          download={fileName}
          className="fsdx-editor-attachment-download"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>
      </div>
    </NodeViewWrapper>
  );
}
