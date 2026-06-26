import { FloatingPortal } from '@floating-ui/react';
import type { Editor } from '@tiptap/core';
import { useCallback, useState } from 'react';
import { ImageResizeHandles } from '../../components/media-attribute-editor/image-resize-handles';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '../../components/ui/toolbar';
import { ImageEditor } from '../image/image-editor';
import type { FilterValues } from '../image/image-filter-panel';
import { useMediaBubbleMenu } from './use-media-bubble-menu';
import './media-bubble-menu.scss';

interface ImageBubbleMenuProps {
  editor: Editor | null;
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

function getWidthPercent(editor: Editor): number | null {
  const attrs = editor.getAttributes('customImage');
  const widthAttr: string | null = attrs?.width || null;
  if (!widthAttr) return null;

  const editorWidth = editor.view.dom.clientWidth;
  if (editorWidth <= 0) return null;

  if (widthAttr.endsWith('%')) {
    return Math.round(Number.parseFloat(widthAttr));
  }

  const pxValue = Number.parseFloat(widthAttr);
  if (Number.isNaN(pxValue)) return null;
  return Math.round((pxValue / editorWidth) * 100);
}

/**
 * 图片悬浮菜单栏：图片选中时显示横向气泡菜单，替代原来的纵向属性编辑面板
 * 包含对齐、Alt/源地址/链接输入、编辑图片、删除等操作
 */
export function ImageBubbleMenu({ editor }: ImageBubbleMenuProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [altValue, setAltValue] = useState('');
  const [srcValue, setSrcValue] = useState('');
  const [linkValue, setLinkValue] = useState('');

  const { visible, nodePosRef, hideMenu, refs, floatingStyles } =
    useMediaBubbleMenu({
      editor,
      nodeTypes: ['customImage', 'image'],
      onActive: useCallback((attrs: Record<string, unknown>) => {
        setAltValue((attrs.alt as string) || '');
        setSrcValue((attrs.src as string) || '');
        setLinkValue((attrs.link as string) || '');
      }, []),
    });

  const handleAlignment = useCallback(
    (alignment: 'left' | 'center' | 'right') => {
      if (!editor) return;
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

  const handleSrcBlur = useCallback(() => {
    if (!editor) return;
    if (srcValue && srcValue.trim()) {
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateImageSrc?.(srcValue.trim())
        .run();
    }
  }, [editor, srcValue, nodePosRef]);

  const handleAltBlur = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('customImage', {
        alt: altValue || null,
      })
      .run() ||
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateAttributes('image', {
          alt: altValue || null,
        })
        .run();
  }, [editor, altValue, nodePosRef]);

  const handleLinkBlur = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateImageLink?.(linkValue || null)
      .run();
  }, [editor, linkValue, nodePosRef]);

  const handleOpenEditor = useCallback(() => {
    setShowEditor(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().deleteSelection().run();
  }, [editor]);

  const handleEditorCancel = useCallback(() => {
    setShowEditor(false);
  }, []);

  const handleEditorConfirm = useCallback(
    async (blob: Blob, filterValues?: FilterValues) => {
      if (!editor) return;
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
    [editor],
  );

  if (!editor) return null;

  const currentAlignment = editor.getAttributes('customImage')?.alignment;
  const widthPercent = getWidthPercent(editor);
  const currentAttrs =
    editor.getAttributes('customImage') || editor.getAttributes('image');

  return (
    <>
      {visible && <ImageResizeHandles editor={editor} />}
      <FloatingPortal>
        <div
          ref={refs.setFloating}
          className="fsdx-editor-media-bubble-menu"
          data-visible={visible ? '' : undefined}
          style={{
            ...floatingStyles,
            visibility: visible ? 'visible' : 'hidden',
          }}
          onMouseDown={(e) => {
            const target = e.target as HTMLElement;
            if (
              target.tagName === 'INPUT' ||
              target.tagName === 'TEXTAREA' ||
              target.tagName === 'SELECT'
            )
              return;
            e.preventDefault();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              hideMenu();
            }
          }}
        >
          <Toolbar variant="floating">
            <ToolbarGroup>
              <button
                type="button"
                className={`fsdx-editor-button ${currentAlignment === 'left' ? 'fsdx-editor-media-bubble-menu-btn--active' : ''}`}
                data-active-state={currentAlignment === 'left' ? 'on' : 'off'}
                onClick={() => handleAlignment('left')}
                aria-label="左对齐"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="17" y1="10" x2="3" y2="10" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="17" y1="18" x2="3" y2="18" />
                </svg>
              </button>
              <button
                type="button"
                className={`fsdx-editor-button ${currentAlignment === 'center' ? 'fsdx-editor-media-bubble-menu-btn--active' : ''}`}
                data-active-state={currentAlignment === 'center' ? 'on' : 'off'}
                onClick={() => handleAlignment('center')}
                aria-label="居中对齐"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="18" y1="10" x2="6" y2="10" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="18" y1="18" x2="6" y2="18" />
                </svg>
              </button>
              <button
                type="button"
                className={`fsdx-editor-button ${currentAlignment === 'right' ? 'fsdx-editor-media-bubble-menu-btn--active' : ''}`}
                data-active-state={currentAlignment === 'right' ? 'on' : 'off'}
                onClick={() => handleAlignment('right')}
                aria-label="右对齐"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="19" y1="10" x2="7" y2="10" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="19" y1="18" x2="7" y2="18" />
                </svg>
              </button>
              {widthPercent !== null && (
                <span className="fsdx-editor-media-bubble-menu-width-label">
                  {widthPercent}%
                </span>
              )}
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <input
                type="text"
                value={altValue}
                onChange={(e) => setAltValue(e.target.value)}
                onBlur={handleAltBlur}
                placeholder="Alt 描述"
                className="fsdx-editor-media-bubble-menu-input"
                aria-label="图片描述"
              />
            </ToolbarGroup>

            <ToolbarGroup>
              <input
                type="text"
                value={srcValue}
                onChange={(e) => setSrcValue(e.target.value)}
                onBlur={handleSrcBlur}
                placeholder="图片源地址"
                className="fsdx-editor-media-bubble-menu-input fsdx-editor-media-bubble-menu-input--src"
                aria-label="图片源地址"
              />
            </ToolbarGroup>

            <ToolbarGroup>
              <input
                type="text"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                onBlur={handleLinkBlur}
                placeholder="链接地址"
                className="fsdx-editor-media-bubble-menu-input"
                aria-label="链接地址"
              />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <button
                type="button"
                className="fsdx-editor-button"
                onClick={handleOpenEditor}
                aria-label="编辑图片"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <button
                type="button"
                className="fsdx-editor-button fsdx-editor-media-bubble-menu-btn--danger"
                onClick={handleDelete}
                aria-label="删除图片"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </ToolbarGroup>
          </Toolbar>
        </div>
      </FloatingPortal>

      {showEditor && currentAttrs.src && (
        <ImageEditor
          src={currentAttrs.src}
          onConfirm={handleEditorConfirm}
          onCancel={handleEditorCancel}
        />
      )}
    </>
  );
}
