import type { Editor } from '@tiptap/core';
import { useCallback, useState } from 'react';

interface UseAttachmentStateConfig {
  editor: Editor | null;
  nodePosRef: React.MutableRefObject<number>;
}

/**
 * 附件悬浮菜单状态管理：文件名的读写和提交
 */
export function useAttachmentState({
  editor,
  nodePosRef,
}: UseAttachmentStateConfig) {
  const [nameValue, setNameValue] = useState('');

  const syncAttrs = useCallback((attrs: Record<string, unknown>) => {
    setNameValue((attrs.fileName as string) || '');
  }, []);

  const commitName = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .setNodeSelection(nodePosRef.current)
      .updateAttributes('attachment', { fileName: nameValue || null })
      .run();
  }, [editor, nameValue, nodePosRef]);

  return { nameValue, setNameValue, syncAttrs, commitName };
}
