import { useCallback, useState } from 'react';
import { DemoEditor } from '../components/demo-editor';
import { initialContent } from '../initial-content';

export function BasicDemo() {
  const [html, setHtml] = useState(initialContent);

  const handleReset = useCallback(() => {
    setHtml(initialContent);
  }, []);

  return (
    <div className="demo-editor-container">
      <div className="demo-control-bar">
        <button type="button" onClick={handleReset}>
          重置内容
        </button>
        <span className="demo-control-bar-hint">
          下方编辑器中已预置一份包含所有功能节点的演示文档
        </span>
      </div>
      <div className="demo-editor-body">
        <DemoEditor html={html} onChange={setHtml} />
      </div>
    </div>
  );
}
