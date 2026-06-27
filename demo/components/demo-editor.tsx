import type { EditorTheme } from '../../src/core/editor';
import { Editor } from '../../src/core/editor';
import { demoOptions } from '../shared/demo-options';

interface DemoEditorProps {
  html: string;
  onChange: (html: string) => void;
  theme?: EditorTheme;
}

export function DemoEditor({ html, onChange, theme }: DemoEditorProps) {
  return (
    <Editor
      value={html}
      onChange={onChange}
      options={demoOptions}
      theme={theme}
    />
  );
}
