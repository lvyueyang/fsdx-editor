import {
  CustomTableView,
  clearSelectedCells,
  fitToWidth,
  moveColumnLeft,
  moveColumnRight,
  moveRowDown,
  moveRowUp,
  NodeBackground,
  TableCellStyle,
  TableSelectionOverlay,
} from '@fsdx/tiptap-table-kit';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useContext, useRef } from 'react';
import '@fsdx/tiptap-table-kit/styles/table.css';
import { DemoThemeContext } from '../shared/demo-theme-context';

const initialHtml = `
<p>点击下方按钮插入表格，或使用命令函数进行操作。</p>
`;

export function TiptapTableDemo() {
  const { theme } = useContext(DemoThemeContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Table.configure({
          resizable: true,
          View: CustomTableView,
        }),
        TableRow,
        TableCell,
        TableHeader,
        TableCellStyle,
        TableSelectionOverlay,
        NodeBackground,
      ],
      content: initialHtml,
      editorProps: {
        attributes: {
          class: `tiptap-editor-demo ${theme === 'dark' ? 'tiptap-editor-demo--dark' : ''}`,
        },
      },
    },
    [theme],
  );

  const handleInsert = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 4, withHeaderRow: true })
      .run();
  }, [editor]);

  const handleInsertSmall = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 2, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const btn = (
    label: string,
    action: () => void,
    disabledFn?: () => boolean,
  ) => (
    <button
      type="button"
      onClick={action}
      disabled={disabledFn?.() ?? !editor}
      className="tiptap-table-kit-demo-btn"
    >
      {label}
    </button>
  );

  const spacer = <span className="tiptap-table-kit-demo-spacer" />;

  return (
    <div ref={containerRef} className="demo-editor-container">
      <div className="demo-control-bar">
        <span className="demo-control-bar-hint">
          使用纯函数式命令 API 操作表格，不依赖任何 UI 框架
        </span>
      </div>

      <div className="tiptap-table-kit-demo-toolbar">
        <div className="tiptap-table-kit-demo-group-label">插入</div>
        {btn('3×4 表格', handleInsert)}
        {btn('2×3 表格', handleInsertSmall)}
        {spacer}

        <div className="tiptap-table-kit-demo-group-label">行</div>
        {btn('上方插入行', () => editor?.chain().focus().addRowBefore().run())}
        {btn('下方插入行', () => editor?.chain().focus().addRowAfter().run())}
        {btn('删除行', () => editor?.chain().focus().deleteRow().run())}
        {btn('上移', () => moveRowUp(editor))}
        {btn('下移', () => moveRowDown(editor))}
        {spacer}

        <div className="tiptap-table-kit-demo-group-label">列</div>
        {btn('左侧插入列', () =>
          editor?.chain().focus().addColumnBefore().run(),
        )}
        {btn('右侧插入列', () =>
          editor?.chain().focus().addColumnAfter().run(),
        )}
        {btn('删除列', () => editor?.chain().focus().deleteColumn().run())}
        {btn('左移', () => moveColumnLeft(editor))}
        {btn('右移', () => moveColumnRight(editor))}
        {spacer}

        <div className="tiptap-table-kit-demo-group-label">单元格</div>
        {btn('合并', () => editor?.chain().focus().mergeCells().run())}
        {btn('拆分', () => editor?.chain().focus().splitCell().run())}
        {btn('清除', () => clearSelectedCells(editor))}
        {btn('自适应列宽', () => fitToWidth(editor))}
        {btn('切换标题行', () =>
          editor?.chain().focus().toggleHeaderRow().run(),
        )}
        {btn('切换标题列', () =>
          editor?.chain().focus().toggleHeaderColumn().run(),
        )}
      </div>

      <div className="demo-editor-body">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
