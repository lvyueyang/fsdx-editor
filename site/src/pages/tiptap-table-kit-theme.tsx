import { TableKit } from '@fsdx/tiptap-table-kit';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useContext, useEffect, useState } from 'react';
import { DemoThemeContext } from '../shared/demo-theme-context';

const tableHtml = `
<table>
  <thead><tr><th>名称</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>theme</td><td>'light' | 'dark'</td><td>'light'</td></tr>
    <tr><td>locale</td><td>'zh-CN' | 'en-US'</td><td>'zh-CN'</td></tr>
    <tr><td>translations</td><td>Partial&lt;TableKitTranslations&gt;</td><td>—</td></tr>
  </tbody>
</table>
`;

function DemoEditor({ initialTheme }: { initialTheme: 'light' | 'dark' }) {
  const { theme: demoTheme } = useContext(DemoThemeContext);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        TableKit.configure({ resizable: true, theme: initialTheme }),
        TableRow,
        TableCell,
        TableHeader,
      ],
      content: tableHtml,
      editorProps: {
        attributes: {
          class: `tiptap-editor-demo ${demoTheme === 'dark' ? 'tiptap-editor-demo--dark' : ''}`,
        },
      },
    },
    [initialTheme, demoTheme],
  );

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="demo-control-bar" style={{ justifyContent: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 12 }}>
          {initialTheme === 'light' ? '☀ 浅色模式' : '☾ 深色模式'}
        </span>
      </div>
      <div className="demo-editor-body">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export function TiptapTableTheme() {
  const { theme: demoTheme } = useContext(DemoThemeContext);
  const [dynamicTheme, setDynamicTheme] = useState<'light' | 'dark'>('light');

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        TableKit.configure({ resizable: true, theme: dynamicTheme }),
        TableRow,
        TableCell,
        TableHeader,
      ],
      content: tableHtml,
      editorProps: {
        attributes: {
          class: `tiptap-editor-demo ${demoTheme === 'dark' ? 'tiptap-editor-demo--dark' : ''}`,
        },
      },
    },
    [demoTheme],
  );

  useEffect(() => {
    if (!editor) return;
    editor.commands.tableKit.setTheme(dynamicTheme);
  }, [editor, dynamicTheme]);

  const handleInsertTable = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  return (
    <div className="demo-editor-container">
      <div className="demo-control-bar">
        <span className="demo-control-bar-hint">
          通过 TableKit.configure({'{'} theme {'}'}) 或
          editor.commands.tableKit.setTheme() 切换主题
        </span>
      </div>

      {/* 并排比较 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <DemoEditor initialTheme="light" />
          <DemoEditor initialTheme="dark" />
        </div>

        {/* 动态切换演示 */}
        <div
          style={{
            borderTop: '1px solid var(--demo-border)',
            flexShrink: 0,
          }}
        >
          <div className="demo-control-bar" style={{ gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--demo-text-dim)' }}>
              运行时切换：
            </span>
            <button
              type="button"
              style={{
                background:
                  dynamicTheme === 'light'
                    ? 'var(--demo-accent)'
                    : 'transparent',
                color: dynamicTheme === 'light' ? '#fff' : 'var(--demo-text)',
                fontWeight: dynamicTheme === 'light' ? 600 : 400,
              }}
              onClick={() => setDynamicTheme('light')}
            >
              setTheme('light')
            </button>
            <button
              type="button"
              style={{
                background:
                  dynamicTheme === 'dark'
                    ? 'var(--demo-accent)'
                    : 'transparent',
                color: dynamicTheme === 'dark' ? '#fff' : 'var(--demo-text)',
                fontWeight: dynamicTheme === 'dark' ? 600 : 400,
              }}
              onClick={() => setDynamicTheme('dark')}
            >
              setTheme('dark')
            </button>
            <button
              type="button"
              className="tiptap-table-kit-demo-btn"
              onClick={handleInsertTable}
            >
              插入 3×3 表格
            </button>
          </div>
          <div className="demo-editor-body">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
