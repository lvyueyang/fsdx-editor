import type { Editor } from '@tiptap/core';
import type { Editor as ReactEditor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { isExtensionAvailable } from '../../core/editor-utils';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { useIsBreakpoint } from '../../hooks/use-is-breakpoint';
import { ImagePlusIcon } from '../../icons/image-plus-icon';

// ======== useImageUpload ========

export const IMAGE_UPLOAD_SHORTCUT_KEY = 'mod+shift+i';

export interface UseImageUploadConfig {
  editor?: ReactEditor | null;
  hideWhenUnavailable?: boolean;
  onInserted?: () => void;
}

export function canInsertImage(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!isExtensionAvailable(editor, 'imageUpload')) return false;

  return editor.can().insertContent({ type: 'imageUpload' });
}

export function isImageActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive('imageUpload');
}

export function insertImage(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!canInsertImage(editor)) return false;

  try {
    return editor
      .chain()
      .focus()
      .insertContent({
        type: 'imageUpload',
      })
      .run();
  } catch {
    return false;
  }
}

export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, hideWhenUnavailable } = props;

  if (!editor || !editor.isEditable) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!isExtensionAvailable(editor, 'imageUpload')) return false;

  if (!editor.isActive('code')) {
    return canInsertImage(editor);
  }

  return true;
}

export function useImageUpload(config?: UseImageUploadConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {};

  const { editor } = useFsdxEditor(providedEditor);
  const isMobile = useIsBreakpoint();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canInsert = canInsertImage(editor);
  const isActive = isImageActive(editor);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleImage = useCallback(() => {
    if (!editor) return false;

    const success = insertImage(editor);
    if (success) {
      onInserted?.();
    }
    return success;
  }, [editor, onInserted]);

  useHotkeys(
    IMAGE_UPLOAD_SHORTCUT_KEY,
    (event) => {
      event.preventDefault();
      handleImage();
    },
    {
      enabled: isVisible && canInsert,
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true,
    },
  );

  return {
    isVisible,
    isActive,
    handleImage,
    canInsert,
    label: '添加图片',
    shortcutKeys: IMAGE_UPLOAD_SHORTCUT_KEY,
    Icon: ImagePlusIcon,
  };
}

// ======== useImageBubbleState ========

interface UseImageBubbleStateConfig {
  editor: Editor | null;
  nodePosRef: React.MutableRefObject<number>;
}

/**
 * 图片悬浮菜单状态管理：alt / src / link 的读写和提交
 */
export function useImageBubbleState({
  editor,
  nodePosRef,
}: UseImageBubbleStateConfig) {
  const [altValue, setAltValue] = useState('');
  const [srcValue, setSrcValue] = useState('');
  const [linkValue, setLinkValue] = useState('');

  const syncAttrs = useCallback((attrs: Record<string, unknown>) => {
    setAltValue((attrs.alt as string) || '');
    setSrcValue((attrs.src as string) || '');
    setLinkValue((attrs.link as string) || '');
  }, []);

  const commitAlt = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('customImage', { alt: altValue || null })
      .run() ||
      editor
        .chain()
        .setNodeSelection(nodePosRef.current)
        .updateAttributes('image', { alt: altValue || null })
        .run();
  }, [editor, altValue, nodePosRef]);

  const commitSrc = useCallback(() => {
    if (!editor || !srcValue?.trim()) return;
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateImageSrc?.(srcValue.trim())
      .run();
  }, [editor, srcValue, nodePosRef]);

  const commitLink = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateImageLink?.(linkValue || null)
      .run();
  }, [editor, linkValue, nodePosRef]);

  return {
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
  };
}
