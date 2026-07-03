import type { TableKitTranslations } from '@fsdx/tiptap-table-kit';
import { TableKit } from '@fsdx/tiptap-table-kit';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useContext, useMemo, useState } from 'react';
import { DemoThemeContext } from '../shared/demo-theme-context';

const tableHtml = `
<table>
  <thead><tr><th>商品</th><th>价格</th><th>库存</th></tr></thead>
  <tbody>
    <tr><td>苹果</td><td>¥5</td><td>100</td></tr>
    <tr><td>香蕉</td><td>¥3</td><td>200</td></tr>
    <tr><td>橘子</td><td>¥4</td><td>150</td></tr>
  </tbody>
</table>
`;

const customTranslations: Partial<TableKitTranslations> = {
  deleteRow: '🔥 删除此行',
  deleteColumn: '🔥 删除此列',
  clearContent: '🧹 清除单元格',
  toggleHeaderRow: '📌 切换表头行',
};

export function TiptapTableI18n() {
  const { theme: demoTheme } = useContext(DemoThemeContext);
  const [locale, setLocale] = useState<'zh-CN' | 'en-US'>('zh-CN');
  const [showCustom, setShowCustom] = useState(false);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        TableKit.configure({ resizable: true, locale }),
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
    [locale, demoTheme],
  );

  const customEditor = useEditor(
    {
      extensions: [
        StarterKit,
        TableKit.configure({
          resizable: true,
          translations: customTranslations,
        }),
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

  const handleInsertTable = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const handleInsertCustom = useCallback(() => {
    customEditor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [customEditor]);

  const localeLabel = useMemo(
    () => (locale === 'zh-CN' ? '简体中文' : 'English'),
    [locale],
  );

  return (
    <div className="demo-editor-container">
      <div className="demo-control-bar">
        <span className="demo-control-bar-hint">
          TableKit.configure({'{'} locale {'}'}) 控制右键菜单语言
        </span>
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
          <button
            type="button"
            className="tiptap-table-kit-demo-btn"
            onClick={handleInsertTable}
          >
            插入表格
          </button>
        </div>
      </div>

      {/* 内置语言编辑器 */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          className="demo-control-bar"
          style={{
            borderBottom: '1px solid var(--demo-border)',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          当前语言：{localeLabel} — 右键表格单元格查看菜单
        </div>
        <div className="demo-editor-body">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* 自定义翻译编辑器 */}
      <div
        style={{
          borderTop: '1px solid var(--demo-border)',
          flexShrink: 0,
          display: showCustom ? 'flex' : 'block',
          flexDirection: 'column',
          height: showCustom ? '50%' : 'auto',
        }}
      >
        <div className="demo-control-bar">
          <button type="button" onClick={() => setShowCustom(!showCustom)}>
            {showCustom ? '收起' : '展开'}自定义翻译示例
          </button>
          {showCustom && (
            <>
              <button
                type="button"
                className="tiptap-table-kit-demo-btn"
                onClick={handleInsertCustom}
              >
                插入表格
              </button>
              <span
                className="demo-control-bar-hint"
                style={{ marginRight: 0 }}
              >
                translations: {'{'} deleteRow: '🔥 删除此行', clearContent: '🧹
                清除单元格' {'}'}
              </span>
            </>
          )}
        </div>
        {showCustom && (
          <div className="demo-editor-body">
            <EditorContent editor={customEditor} />
          </div>
        )}
      </div>
    </div>
  );
}
