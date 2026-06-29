import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useState } from 'react';
import { Toolbar } from '../../components/ui/toolbar';
import { AlignCenterIcon } from '../../icons/align-center-icon';
import { AlignLeftIcon } from '../../icons/align-left-icon';
import { AlignRightIcon } from '../../icons/align-right-icon';
import { EditIcon } from '../../icons/edit-icon';
import { TrashIcon } from '../../icons/trash-icon';
import { getImageWidthPercent, useImageBubbleState } from '../image';
import { ImageEditor } from '../image/image-editor';
import type { FilterValues } from '../image/image-filter-panel';

interface ImageBubbleMenuContentProps {
  editor: Editor;
  nodePosRef: React.MutableRefObject<number>;
  hideMenu: () => void;
}

function dataUrlFromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function filterValuesToStyle(values: FilterValues): string {
  return [
    `brightness(${values.brightness}%)`,
    `contrast(${values.contrast}%)`,
    `saturate(${values.saturation}%)`,
    `blur(${values.blur}px)`,
    `grayscale(${values.grayscale}%)`,
    `sepia(${values.sepia}%)`,
  ].join(' ');
}

/**
 * 图片悬浮菜单内容：对齐、Alt、src、链接、编辑、删除
 */
export function ImageBubbleMenuContent({
  editor,
  nodePosRef,
  hideMenu,
}: ImageBubbleMenuContentProps) {
  const [showEditor, setShowEditor] = useState(false);

  const {
    altValue,
    srcValue,
    linkValue,
    setAltValue,
    setSrcValue,
    setLinkValue,
    syncAttrs,
    commitAlt,
    commitSrc,
    commitLink,
  } = useImageBubbleState({ editor, nodePosRef });

  useEffect(() => {
    const sync = () => {
      const attrs =
        editor.getAttributes('customImage') || editor.getAttributes('image');
      syncAttrs(attrs);
    };
    sync();
    editor.on('selectionUpdate', sync);
    return () => {
      editor.off('selectionUpdate', sync);
    };
  }, [editor, syncAttrs]);

  const handleAlignment = useCallback(
    (alignment: 'left' | 'center' | 'right') => {
      const current = editor.getAttributes('customImage')?.alignment;
      const next = current === alignment ? null : alignment;
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateImageAlignment?.(next)
        .run();
    },
    [editor, nodePosRef],
  );

  const handleDelete = useCallback(() => {
    editor.chain().focus().deleteSelection().run();
    hideMenu();
  }, [editor, hideMenu]);

  const handleEditorConfirm = useCallback(
    async (blob: Blob, filterValues?: FilterValues) => {
      try {
        const dataUrl = await dataUrlFromBlob(blob);
        editor.chain().focus().updateImageSrc?.(dataUrl).run();
        if (filterValues) {
          const filterStyle = filterValuesToStyle(filterValues);
          editor.chain().focus().updateImageFilter?.(filterStyle).run();
        }
        setSrcValue(dataUrl);
      } catch {
        // 裁剪处理失败，不做任何更改
      }
      setShowEditor(false);
    },
    [editor, setSrcValue],
  );

  const currentAlignment = editor.getAttributes('customImage')?.alignment;
  const widthPercent = getImageWidthPercent(editor);
  const currentAttrs =
    editor.getAttributes('customImage') || editor.getAttributes('image');

  return (
    <>
      <Toolbar variant="floating">
        <Toolbar.Group>
          <Toolbar.Button
            label="左对齐"
            active={currentAlignment === 'left'}
            onClick={() => handleAlignment('left')}
          >
            <AlignLeftIcon className="fsdx-editor-button-icon" />
          </Toolbar.Button>
          <Toolbar.Button
            label="居中对齐"
            active={currentAlignment === 'center'}
            onClick={() => handleAlignment('center')}
          >
            <AlignCenterIcon className="fsdx-editor-button-icon" />
          </Toolbar.Button>
          <Toolbar.Button
            label="右对齐"
            active={currentAlignment === 'right'}
            onClick={() => handleAlignment('right')}
          >
            <AlignRightIcon className="fsdx-editor-button-icon" />
          </Toolbar.Button>
          {widthPercent !== null && (
            <span className="fsdx-editor-media-bubble-menu-width-label">
              {widthPercent}%
            </span>
          )}
        </Toolbar.Group>

        <Toolbar.Separator />

        <Toolbar.Group>
          <Toolbar.Input
            type="text"
            value={altValue}
            onChange={(e) => setAltValue(e.target.value)}
            onBlur={commitAlt}
            placeholder="Alt 描述"
            className="fsdx-editor-media-bubble-menu-input"
            aria-label="图片描述"
          />
        </Toolbar.Group>

        <Toolbar.Group>
          <Toolbar.Input
            type="text"
            value={srcValue}
            onChange={(e) => setSrcValue(e.target.value)}
            onBlur={commitSrc}
            placeholder="图片源地址"
            className="fsdx-editor-media-bubble-menu-input fsdx-editor-media-bubble-menu-input--src"
            aria-label="图片源地址"
          />
        </Toolbar.Group>

        <Toolbar.Group>
          <Toolbar.Input
            type="text"
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            onBlur={commitLink}
            placeholder="链接地址"
            className="fsdx-editor-media-bubble-menu-input"
            aria-label="链接地址"
          />
        </Toolbar.Group>

        <Toolbar.Separator />

        <Toolbar.Group>
          <Toolbar.Button label="编辑图片" onClick={() => setShowEditor(true)}>
            <EditIcon className="fsdx-editor-button-icon" />
          </Toolbar.Button>
        </Toolbar.Group>

        <Toolbar.Separator />

        <Toolbar.Group>
          <Toolbar.Button
            label="删除图片"
            variant="danger"
            onClick={handleDelete}
          >
            <TrashIcon className="fsdx-editor-button-icon" />
          </Toolbar.Button>
        </Toolbar.Group>
      </Toolbar>

      {showEditor && currentAttrs.src && (
        <ImageEditor
          src={currentAttrs.src}
          onConfirm={handleEditorConfirm}
          onCancel={() => setShowEditor(false)}
        />
      )}
    </>
  );
}
