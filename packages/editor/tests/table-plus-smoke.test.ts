/**
 * TablePlus 集成测试：通过 editor 包的 rstest 环境验证
 * @fsdx/tiptap-table-plus 的命令、运行时状态与表格控制插件。
 */
import {
  getTablePlusTheme,
  getTablePlusTranslations,
  TablePlus,
} from '@fsdx/tiptap-table-plus';
import { expect, test } from '@rstest/core';
import { Editor } from '@tiptap/core';
import { TableKit } from '@tiptap/extension-table';
import StarterKit from '@tiptap/starter-kit';

const TABLE_HTML = `
<table>
  <tr><td><p>a1</p></td><td><p>b1</p></td></tr>
  <tr><td><p>a2</p></td><td><p>b2</p></td></tr>
</table>
`;

function createTableEditor() {
  const element = document.createElement('div');
  document.body.appendChild(element);
  const editor = new Editor({
    element,
    extensions: [StarterKit, TableKit.configure(), TablePlus.configure()],
    content: TABLE_HTML,
  });
  return { editor, element };
}

test('TablePlus 注册后 storage 初始化正确', () => {
  const { editor } = createTableEditor();
  const storage = editor.storage.tablePlus;

  expect(storage).toBeDefined();
  expect(storage?.locale).toBe('zh-CN');
  expect(storage?.theme).toBe('light');
  expect(getTablePlusTranslations(editor).deleteRow).toBe('删除行');
  expect(getTablePlusTheme(editor)).toBe('light');

  editor.destroy();
});

test('单元格样式命令：文字颜色与垂直对齐', () => {
  const { editor } = createTableEditor();

  editor.commands.setTextSelection(3);
  expect(editor.isActive('table')).toBe(true);

  editor
    .chain()
    .focus()
    .setCellTextColor('#ff0000')
    .setCellVerticalAlign('middle')
    .setCellTextAlign('center')
    .run();

  const html = editor.getHTML();
  expect(html).toContain('color: #ff0000');
  expect(html).toContain('vertical-align: middle');
  expect(html).toContain('text-align: center');

  editor.chain().focus().unsetCellTextColor().setCellVerticalAlign(null).run();
  const html2 = editor.getHTML();
  expect(html2).not.toContain('color: #ff0000');
  expect(html2).not.toContain('vertical-align');

  editor.destroy();
});

test('clearSelectedCells 清除内容与样式', () => {
  const { editor } = createTableEditor();
  editor.commands.setTextSelection(3);
  editor.chain().focus().setCellTextColor('#ff0000').run();

  const cleared = editor.chain().focus().clearSelectedCells().run();
  expect(cleared).toBe(true);

  const html = editor.getHTML();
  expect(html).not.toContain('a1');
  expect(html).not.toContain('color: #ff0000');
  expect(html).toContain('b1');

  editor.destroy();
});

test('clearRowColumnContent 清除整行内容（位置不偏移）', () => {
  const { editor } = createTableEditor();
  editor.commands.setTextSelection(3);

  const ok = editor.chain().focus().clearRowColumnContent('row').run();
  expect(ok).toBe(true);

  const html = editor.getHTML();
  expect(html).not.toContain('a1');
  expect(html).not.toContain('b1');
  expect(html).toContain('a2');
  expect(html).toContain('b2');

  editor.destroy();
});

test('clearRowColumnContent 清除整列内容', () => {
  const { editor } = createTableEditor();
  // 光标进入第二列（b1）
  editor.commands.setTextSelection(8);

  const ok = editor.chain().focus().clearRowColumnContent('column').run();
  expect(ok).toBe(true);

  const html = editor.getHTML();
  expect(html).not.toContain('b1');
  expect(html).not.toContain('b2');
  expect(html).toContain('a1');
  expect(html).toContain('a2');

  editor.destroy();
});

test('setTablePlusTheme 切换主题并更新 storage', () => {
  const { editor } = createTableEditor();

  editor.commands.setTablePlusTheme('dark');
  expect(editor.storage.tablePlus?.theme).toBe('dark');
  expect(editor.view.dom.classList.contains('tiptap-table-plus-dark')).toBe(
    true,
  );

  editor.commands.setTablePlusTheme('light');
  expect(editor.storage.tablePlus?.theme).toBe('light');
  expect(editor.view.dom.classList.contains('tiptap-table-plus-dark')).toBe(
    false,
  );

  editor.destroy();
});

test('表格控制插件注入覆盖层容器与追加按钮', () => {
  const { editor } = createTableEditor();

  const controls = editor.view.dom.querySelector(
    '.tiptap-table-plus-table-controls',
  );
  const overlayContainer = editor.view.dom.querySelector(
    '.tiptap-table-plus-selection-overlay-container',
  );
  expect(controls).not.toBeNull();
  expect(overlayContainer).not.toBeNull();

  const buttons = editor.view.dom.querySelectorAll(
    '.tiptap-table-plus-table-controls-btn',
  );
  expect(buttons.length).toBe(2);

  // 点击追加行按钮，表格应变多一行
  const addRowBtn = editor.view.dom.querySelector(
    '.tiptap-table-plus-table-controls-btn--row',
  ) as HTMLButtonElement;
  addRowBtn.click();
  expect(editor.view.dom.querySelectorAll('tr').length).toBe(3);

  // 点击追加列按钮，每行应变为三列
  const addColBtn = editor.view.dom.querySelector(
    '.tiptap-table-plus-table-controls-btn--col',
  ) as HTMLButtonElement;
  addColBtn.click();
  expect(editor.view.dom.querySelectorAll('tr:first-child td').length).toBe(3);

  editor.destroy();
});

test('contextMenu 配置项可自定义菜单', () => {
  const element = document.createElement('div');
  document.body.appendChild(element);
  const editor = new Editor({
    element,
    extensions: [
      StarterKit,
      TableKit.configure(),
      TablePlus.configure({
        contextMenu: (items) => items.slice(0, 2),
      }),
    ],
    content: TABLE_HTML,
  });

  expect(editor.storage.tablePlus?.contextMenu).toBeDefined();
  const items = editor.storage.tablePlus?.contextMenu?.([]);
  expect(items?.length).toBe(0);

  editor.destroy();
});
