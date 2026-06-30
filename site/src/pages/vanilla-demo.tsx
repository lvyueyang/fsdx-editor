import '@fsdx/editor/editor.css';

import type { EventHandler } from '@fsdx/editor';
import { createEditor } from '@fsdx/editor';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { initialContent } from '../initial-content';
import { DemoThemeContext } from '../shared/demo-theme-context';

function simulateUpload(
  file: File,
): Promise<{ url: string; name: string; size: number }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        name: file.name,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  });
}

export function VanillaDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ReturnType<typeof createEditor> | null>(null);
  const { theme } = useContext(DemoThemeContext);

  const [html, setHtml] = useState('');
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  const refreshState = useCallback(() => {
    const ed = editorRef.current;
    if (!ed) return;
    setHtml(ed.getHTML());
    setText(ed.getText());
    setIsFocused(ed.isFocused());
    setIsEmpty(ed.isEmpty());
    setIsDisabled(ed.isDisabled());
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = createEditor(containerRef.current, {
      defaultContent: initialContent,
      defaultTheme: theme,
      placeholder: '请输入内容…',
      image: { upload: simulateUpload },
      video: { upload: simulateUpload },
      audio: { upload: simulateUpload },
      attachment: { upload: simulateUpload },
    });

    editorRef.current = editor;

    const changeHandler: EventHandler = () => refreshState();
    const focusHandler: EventHandler = () => refreshState();
    const blurHandler: EventHandler = () => refreshState();
    const readyHandler: EventHandler = () => refreshState();

    editor.on('change', changeHandler);
    editor.on('focus', focusHandler);
    editor.on('blur', blurHandler);
    editor.on('ready', readyHandler);

    refreshState();

    return () => {
      editor.off('change', changeHandler);
      editor.off('focus', focusHandler);
      editor.off('blur', blurHandler);
      editor.off('ready', readyHandler);
      editor.destroy();
      editorRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    editorRef.current?.setTheme(theme);
  }, [theme]);

  const handleReset = useCallback(() => {
    editorRef.current?.setHTML(initialContent);
    refreshState();
  }, [refreshState]);

  const handleClear = useCallback(() => {
    editorRef.current?.clear();
    refreshState();
  }, [refreshState]);

  const handleToggleDisabled = useCallback(() => {
    const ed = editorRef.current;
    if (!ed) return;
    if (ed.isDisabled()) {
      ed.enable();
    } else {
      ed.disable();
    }
    refreshState();
  }, [refreshState]);

  const handleFocus = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  return (
    <div className="demo-editor-container">
      <div className="demo-control-bar">
        <button type="button" onClick={handleReset}>
          重置内容
        </button>
        <button type="button" onClick={handleClear}>
          清空
        </button>
        <button type="button" onClick={handleToggleDisabled}>
          {isDisabled ? '启用' : '禁用'}
        </button>
        <button type="button" onClick={handleFocus}>
          聚焦
        </button>
        <span className="demo-control-bar-hint">
          原生 JavaScript API — createEditor(container, options)
        </span>
      </div>

      <div className="demo-editor-body">
        <div className="vanilla-editor-wrapper" ref={containerRef} />
      </div>

      <div className="vanilla-demo-state">
        <div className="vanilla-demo-state-title">编辑器状态</div>
        <div className="vanilla-demo-state-items">
          <span className="vanilla-demo-state-item">
            <strong>聚焦:</strong> {isFocused ? '是' : '否'}
          </span>
          <span className="vanilla-demo-state-item">
            <strong>为空:</strong> {isEmpty ? '是' : '否'}
          </span>
          <span className="vanilla-demo-state-item">
            <strong>禁用:</strong> {isDisabled ? '是' : '否'}
          </span>
          <span className="vanilla-demo-state-item">
            <strong>主题:</strong> {theme}
          </span>
        </div>
      </div>

      <details className="vanilla-demo-output">
        <summary className="vanilla-demo-output-summary">
          查看 HTML 输出
        </summary>
        <pre className="demo-code-block">{html || '<空>'}</pre>
      </details>

      <details className="vanilla-demo-output">
        <summary className="vanilla-demo-output-summary">
          查看纯文本输出
        </summary>
        <pre className="demo-code-block">{text || '<空>'}</pre>
      </details>
    </div>
  );
}
