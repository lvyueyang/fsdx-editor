import '@fsdx/tiptap-table-kit/styles/table.css';
import { TableKit } from '@fsdx/tiptap-table-kit';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useState } from 'react';

function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

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

function DemoEditor({ theme }: { theme: 'light' | 'dark' }) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        TableKit.configure({ resizable: true, theme }),
        TableRow,
        TableCell,
        TableHeader,
      ],
      content: tableHtml,
    },
    [theme],
  );

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="demo-control-bar" style={{ justifyContent: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 12 }}>
          {theme === 'light' ? '☀ 浅色模式' : '☾ 深色模式'}
        </span>
      </div>
      <div className="demo-editor-body">
        <div className="tiptap-editor-demo">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

export default function TableKitThemeDemo() {
  const isDark = useIsDark();
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
    },
    [],
  );

  useEffect(() => {
    if (!editor) return;
    editor.commands?.tableKit?.setTheme(dynamicTheme);
  }, [editor, dynamicTheme]);

  const handleInsertTable = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const themeBtnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'var(--demo-accent)' : 'transparent',
    color: active ? '#fff' : 'var(--demo-text)',
    fontWeight: active ? 600 : 400,
  });

  return (
    <div className="demo-editor-container">
      <div className="demo-control-bar">
        <span className="demo-control-bar-hint">
          通过 TableKit.configure(&#123; theme &#125;) 或
          editor.commands.tableKit.setTheme() 切换主题
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <DemoEditor theme="light" />
          <DemoEditor theme="dark" />
        </div>

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
              style={themeBtnStyle(dynamicTheme === 'light')}
              onClick={() => setDynamicTheme('light')}
            >
              setTheme('light')
            </button>
            <button
              type="button"
              style={themeBtnStyle(dynamicTheme === 'dark')}
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
            <div
              className={`tiptap-editor-demo${isDark ? ' tiptap-editor-demo--dark' : ''}`}
            >
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
