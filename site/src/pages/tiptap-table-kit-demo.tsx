import { TableKit } from '@fsdx/tiptap-table-kit';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DemoThemeContext } from '../shared/demo-theme-context';

const initialHtml = `
<p>点击下方按钮插入表格，或使用右键上下文菜单进行操作。</p>
`;

export function TiptapTableDemo() {
  const { theme: demoTheme } = useContext(DemoThemeContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tableTheme, setTableTheme] = useState<'light' | 'dark'>('light');
  const [locale, setLocale] = useState<'zh-CN' | 'en-US'>('zh-CN');

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        TableKit.configure({
          resizable: true,
          locale,
        }),
        TableRow,
        TableCell,
        TableHeader,
      ],
      content: initialHtml,
      editorProps: {
        attributes: {
          class: `tiptap-editor-demo ${demoTheme === 'dark' ? 'tiptap-editor-demo--dark' : ''}`,
        },
      },
    },
    [locale, demoTheme],
  );

  useEffect(() => {
    if (!editor) return;
    editor.commands.tableKit.setTheme(tableTheme);
  }, [editor, tableTheme]);

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
        <span className="demo-control-bar-hint">TableKit 配置演示</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--demo-text-dim)' }}>
            主题：
          </span>
          <button
            type="button"
            style={{
              background:
                tableTheme === 'light' ? 'var(--demo-accent)' : 'transparent',
              color: tableTheme === 'light' ? '#fff' : 'var(--demo-text)',
              fontWeight: tableTheme === 'light' ? 600 : 400,
            }}
            onClick={() => setTableTheme('light')}
          >
            浅色
          </button>
          <button
            type="button"
            style={{
              background:
                tableTheme === 'dark' ? 'var(--demo-accent)' : 'transparent',
              color: tableTheme === 'dark' ? '#fff' : 'var(--demo-text)',
              fontWeight: tableTheme === 'dark' ? 600 : 400,
            }}
            onClick={() => setTableTheme('dark')}
          >
            深色
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--demo-text-dim)' }}>
            语言：
          </span>
          <button
            type="button"
            style={{
              background:
                locale === 'zh-CN' ? 'var(--demo-accent)' : 'transparent',
              color: locale === 'zh-CN' ? '#fff' : 'var(--demo-text)',
              fontWeight: locale === 'zh-CN' ? 600 : 400,
            }}
            onClick={() => setLocale('zh-CN')}
          >
            简体中文
          </button>
          <button
            type="button"
            style={{
              background:
                locale === 'en-US' ? 'var(--demo-accent)' : 'transparent',
              color: locale === 'en-US' ? '#fff' : 'var(--demo-text)',
              fontWeight: locale === 'en-US' ? 600 : 400,
            }}
            onClick={() => setLocale('en-US')}
          >
            English
          </button>
        </div>
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
        {btn('上移', () => editor?.chain().focus().moveRowUp().run())}
        {btn('下移', () => editor?.chain().focus().moveRowDown().run())}
        {spacer}

        <div className="tiptap-table-kit-demo-group-label">列</div>
        {btn('左侧插入列', () =>
          editor?.chain().focus().addColumnBefore().run(),
        )}
        {btn('右侧插入列', () =>
          editor?.chain().focus().addColumnAfter().run(),
        )}
        {btn('删除列', () => editor?.chain().focus().deleteColumn().run())}
        {btn('左移', () => editor?.chain().focus().moveColumnLeft().run())}
        {btn('右移', () => editor?.chain().focus().moveColumnRight().run())}
        {spacer}

        <div className="tiptap-table-kit-demo-group-label">单元格</div>
        {btn('合并', () => editor?.chain().focus().mergeCells().run())}
        {btn('拆分', () => editor?.chain().focus().splitCell().run())}
        {btn('清除', () => editor?.chain().focus().clearSelectedCells().run())}
        {btn('自适应列宽', () => editor?.chain().focus().fitToWidth().run())}
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
