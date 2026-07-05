import { TablePlus } from '@fsdx/tiptap-table-plus';
import { TableKit } from '@tiptap/extension-table';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useState } from 'react';

type TabKey = 'insert' | 'row' | 'col' | 'cell' | 'sort';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'insert', label: '插入' },
  { key: 'row', label: '行操作' },
  { key: 'col', label: '列操作' },
  { key: 'cell', label: '单元格' },
  { key: 'sort', label: '排序' },
];

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

const initialHtml = `
<p>点击下方工具栏按钮插入表格，或使用右键上下文菜单进行操作。</p>
`;

export default function TablePlusDemo() {
  const isDark = useIsDark();
  const [tableTheme, setTableTheme] = useState<'light' | 'dark'>('light');
  const [locale, setLocale] = useState<'zh-CN' | 'en-US'>('zh-CN');
  const [activeTab, setActiveTab] = useState<TabKey>('insert');

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
    [locale],
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
    [editor],
  );

  const themeBtnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'var(--demo-accent)' : 'transparent',
    color: active ? '#fff' : 'var(--demo-text)',
    fontWeight: active ? 600 : 400,
  });

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '4px 12px',
    border: 'none',
    borderBottom: active
      ? '2px solid var(--demo-accent)'
      : '2px solid transparent',
    background: 'transparent',
    color: active ? 'var(--demo-accent)' : 'var(--demo-text-muted)',
    fontSize: 12,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s, border-color 0.15s',
  });

  const renderToolbar = () => {
    switch (activeTab) {
      case 'insert':
        return (
          <>
            {btn('3×4 (含表头)', () =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 4, withHeaderRow: true })
                .run(),
            )}
            {btn('2×3 (含表头)', () =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 2, cols: 3, withHeaderRow: true })
                .run(),
            )}
            {btn('3×2 (无表头)', () =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 2, withHeaderRow: false })
                .run(),
            )}
          </>
        );
      case 'row':
        return (
          <>
            {btn('上方插入', () =>
              editor?.chain().focus().addRowBefore().run(),
            )}
            {btn('下方插入', () => editor?.chain().focus().addRowAfter().run())}
            {btn('删除行', () => editor?.chain().focus().deleteRow().run())}
            {btn('上移', () => editor?.chain().focus().moveRowUp().run())}
            {btn('下移', () => editor?.chain().focus().moveRowDown().run())}
            {btn('复制', () => editor?.chain().focus().duplicateRow?.().run())}
          </>
        );
      case 'col':
        return (
          <>
            {btn('左侧插入', () =>
              editor?.chain().focus().addColumnBefore().run(),
            )}
            {btn('右侧插入', () =>
              editor?.chain().focus().addColumnAfter().run(),
            )}
            {btn('删除列', () => editor?.chain().focus().deleteColumn().run())}
            {btn('左移', () => editor?.chain().focus().moveColumnLeft().run())}
            {btn('右移', () => editor?.chain().focus().moveColumnRight().run())}
            {btn('复制', () =>
              editor?.chain().focus().duplicateColumn?.().run(),
            )}
          </>
        );
      case 'cell':
        return (
          <>
            {btn('合并', () => editor?.chain().focus().mergeCells().run())}
            {btn('拆分', () => editor?.chain().focus().splitCell().run())}
            {btn('清除', () =>
              editor?.chain().focus().clearSelectedCells().run(),
            )}
            {btn('切换标题行', () =>
              editor?.chain().focus().toggleHeaderRow().run(),
            )}
            {btn('切换标题列', () =>
              editor?.chain().focus().toggleHeaderColumn().run(),
            )}
          </>
        );
      case 'sort':
        return (
          <>
            {btn('升序排序', () =>
              editor?.chain().focus().sortColumnAsc?.().run(),
            )}
            {btn('降序排序', () =>
              editor?.chain().focus().sortColumnDesc?.().run(),
            )}
          </>
        );
    }
  };

  return (
    <div className="demo-editor-container">
      <div className="demo-control-bar">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--demo-text-dim)' }}>
            主题：
          </span>
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
          <span style={{ fontSize: 12, color: 'var(--demo-text-dim)' }}>
            语言：
          </span>
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

      <div className="demo-tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            style={tabBtnStyle(activeTab === tab.key)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="demo-toolbar">{renderToolbar()}</div>

      <div className="demo-editor-body">
        <div
          className={`demo-editor-content${isDark ? ' demo-editor-content--dark' : ''}`}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
