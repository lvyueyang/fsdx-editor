import { TablePlus } from '@fsdx/tiptap-table-plus';
import { TableKit } from '@tiptap/extension-table';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useState } from 'react';

function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
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

const initialHtml = `
<p>点击下方工具栏按钮插入表格，或使用右键上下文菜单进行操作。</p>
`;

export default function TablePlusDemo() {
  const isDark = useIsDark();
  const [tableTheme, setTableTheme] = useState<'light' | 'dark'>('light');
  const [locale, setLocale] = useState<'zh-CN' | 'en-US'>('zh-CN');

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        TableKit.configure({
          table: {
            resizable: true,
          },
        }),
        TablePlus.configure({
          locale,
        }),
      ],
      content: initialHtml,
    },
    [locale]
  );

  useEffect(() => {
    if (!editor) return;
    editor.commands?.setTablePlusTheme(tableTheme);
  }, [editor, tableTheme]);

  const btn = useCallback(
    (label: string, action: () => void) => (
      <button
        type="button"
        key={label}
        onClick={action}
        disabled={!editor}
        className="demo-btn"
      >
        {label}
      </button>
    ),
    [editor]
  );

  const themeBtnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'var(--demo-accent)' : 'transparent',
    color: active ? '#fff' : 'var(--demo-text)',
    fontWeight: active ? 600 : 400,
  });

  return (
    <div className="demo-editor-container">
      <div className="demo-control-bar">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--demo-text-dim)' }}>主题：</span>
          <button
            type="button"
            style={themeBtnStyle(tableTheme === 'light')}
            onClick={() => setTableTheme('light')}
          >
            浅色
          </button>
          <button
            type="button"
            style={themeBtnStyle(tableTheme === 'dark')}
            onClick={() => setTableTheme('dark')}
          >
            深色
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--demo-text-dim)' }}>语言：</span>
          <button
            type="button"
            style={themeBtnStyle(locale === 'zh-CN')}
            onClick={() => setLocale('zh-CN')}
          >
            简体中文
          </button>
          <button
            type="button"
            style={themeBtnStyle(locale === 'en-US')}
            onClick={() => setLocale('en-US')}
          >
            English
          </button>
        </div>
        <span className="demo-control-bar-hint">TablePlus 演示</span>
      </div>
      <div className="demo-toolbar">
        {btn('3×4 (含表头)', () =>
          editor?.chain().focus().insertTable({ rows: 3, cols: 4, withHeaderRow: true }).run()
        )}
        {btn('2×3 (含表头)', () =>
          editor?.chain().focus().insertTable({ rows: 2, cols: 3, withHeaderRow: true }).run()
        )}
        {btn('3×2 (无表头)', () =>
          editor?.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: false }).run()
        )}
      </div>

      <div className="demo-editor-body">
        <div className={`demo-editor-content${isDark ? ' demo-editor-content--dark' : ''}`}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
