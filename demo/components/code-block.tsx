import { useCallback, useState } from 'react';

interface CodeBlockProps {
  language?: string;
  title?: string;
  code: string;
}

export function CodeBlock({ language = 'tsx', title, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="demo-code-block">
      <div className="demo-code-block-header">
        <span>{title ?? language}</span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 12,
            color: 'inherit',
          }}
        >
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <div className="demo-code-block-body">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
