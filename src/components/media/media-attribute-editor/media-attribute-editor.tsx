import type { Editor } from '@tiptap/core';
import { useCallback, useState } from 'react';
import type { MediaType } from '../../../types';
import { FloatingElement } from '../../primitives/floating-element';
import { AttachmentAttributeEditor } from './attachment-attribute-editor';
import { AudioAttributeEditor } from './audio-attribute-editor';
import { ImageAttributeEditor } from './image-attribute-editor';
import { VideoAttributeEditor } from './video-attribute-editor';
import './media-attribute-editor.scss';

const NODE_TYPE_MAP: Record<string, MediaType> = {
  customImage: 'image',
  image: 'image',
  video: 'video',
  audio: 'audio',
  attachment: 'attachment',
};

export interface MediaAttributeEditorProps {
  editor: Editor;
}

export function MediaAttributeEditor({ editor }: MediaAttributeEditorProps) {
  const [mediaType, setMediaType] = useState<MediaType | null>(null);

  const getBoundingClientRect = useCallback((ed: Editor) => {
    const { selection } = ed.state;
    const { $from } = selection;

    if (!$from.nodeAfter) {
      setMediaType(null);
      return null;
    }

    const nodeType = $from.nodeAfter.type.name;
    const type = NODE_TYPE_MAP[nodeType];
    if (!type || !ed.isActive(nodeType)) {
      setMediaType(null);
      return null;
    }

    setMediaType(type);

    const pos = ed.view.coordsAtPos($from.pos);

    return {
      x: pos.left,
      y: pos.top,
      width: pos.right - pos.left,
      height: pos.bottom - pos.top,
      top: pos.top,
      left: pos.left,
      right: pos.right,
      bottom: pos.bottom,
    } as DOMRect;
  }, []);

  return (
    <FloatingElement
      editor={editor}
      getBoundingClientRect={getBoundingClientRect}
      zIndex={50}
    >
      <div className="tiptap-media-attribute-editor-content">
        {mediaType === 'image' && <ImageAttributeEditor editor={editor} />}
        {mediaType === 'video' && <VideoAttributeEditor editor={editor} />}
        {mediaType === 'audio' && <AudioAttributeEditor editor={editor} />}
        {mediaType === 'attachment' && (
          <AttachmentAttributeEditor editor={editor} />
        )}
      </div>
    </FloatingElement>
  );
}
