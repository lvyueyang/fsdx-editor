import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { useTableAddRowColumn } from './use-table-ops';

function findControlsContainer(
  editor: ReturnType<typeof useFsdxEditor>['editor'],
): HTMLElement | null {
  if (!editor || !editor.view?.dom) return null;
  return editor.view.dom.querySelector('.table-controls') as HTMLElement | null;
}

export function TableExtendButtons() {
  const { editor } = useFsdxEditor();
  const [visible, setVisible] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      if (!editor.isActive('table') || !editor.isEditable) {
        setVisible(false);
        return;
      }
      const ctrl = findControlsContainer(editor);
      setContainer(ctrl);
      setVisible(true);
    };

    update();
    editor.on('selectionUpdate', update);
    return () => {
      editor.off('selectionUpdate', update);
    };
  }, [editor]);

  if (!visible || !container) return null;

  return createPortal(<ExtendButtonsInner editor={editor} />, container);
}

function ExtendButtonsInner({
  editor,
}: {
  editor: ReturnType<typeof useFsdxEditor>['editor'];
}) {
  const addRowAfter = useTableAddRowColumn({
    editor,
    orientation: 'row',
    direction: 'after',
  });
  const addColAfter = useTableAddRowColumn({
    editor,
    orientation: 'column',
    direction: 'after',
  });

  const handleAddRow = useCallback(() => {
    addRowAfter.handleAction();
  }, [addRowAfter]);

  const handleAddCol = useCallback(() => {
    addColAfter.handleAction();
  }, [addColAfter]);

  return (
    <>
      <button
        type="button"
        className="table-extend-btn table-extend-btn--bottom"
        onClick={handleAddRow}
        aria-label="添加行"
        title="添加行"
      >
        + 行
      </button>
      <button
        type="button"
        className="table-extend-btn table-extend-btn--right"
        onClick={handleAddCol}
        aria-label="添加列"
        title="添加列"
      >
        + 列
      </button>
    </>
  );
}
