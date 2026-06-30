import type { Editor } from '@tiptap/core';

export const ICONS: Record<string, string> = {
  bold: '<svg viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>',
  italic:
    '<svg viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>',
  strike:
    '<svg viewBox="0 0 24 24"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>',
  underline:
    '<svg viewBox="0 0 24 24"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>',
  code: '<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  h1: '<span style="font-weight:700;font-size:14px;">H1</span>',
  h2: '<span style="font-weight:700;font-size:12px;">H2</span>',
  h3: '<span style="font-weight:700;font-size:11px;">H3</span>',
  blockquote:
    '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  codeBlock:
    '<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  bulletList:
    '<svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  orderedList:
    '<svg viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>',
  hr: '<svg viewBox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="8 8 4 12 8 16"/><polyline points="16 8 20 12 16 16"/></svg>',
  link: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  image:
    '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  video:
    '<svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
  audio:
    '<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  attachment:
    '<svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
};

export function createDivider(className: string): HTMLDivElement {
  const div = document.createElement('div');
  div.className = className;
  return div;
}

export function updateBtnStates(
  container: HTMLElement,
  btnClassName: string,
  editor: Editor,
): void {
  const buttons = container.querySelectorAll(`.${btnClassName}`);
  buttons.forEach((btn) => {
    const check = (btn as unknown as Record<string, unknown>)._check as
      | ((e: Editor) => boolean)
      | undefined;
    if (check?.(editor)) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });
}

export function addBtn(
  menuEl: HTMLElement,
  btnClassName: string,
  editor: Editor,
  icon: string,
  title: string,
  check: (e: Editor) => boolean,
  action: (e: Editor) => void,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = btnClassName;
  btn.title = title;
  btn.innerHTML = icon;

  (btn as unknown as Record<string, unknown>)._check = check;

  btn.addEventListener('mousedown', (e) => e.preventDefault());
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    action(editor);
    updateBtnStates(menuEl, btnClassName, editor);
  });

  menuEl.appendChild(btn);
  return btn;
}

export function triggerMediaUpload(
  accept: string,
  editor: Editor,
  nodeType: string,
  upload: (
    file: File,
    onProgress?: (progress: number) => void,
  ) => Promise<{ url: string; name?: string; size?: number }>,
): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.style.display = 'none';

  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const result = await upload(file);
      const chain = editor.chain().focus();
      if (nodeType === 'imageUpload') {
        chain.setImage({ src: result.url }).run();
      } else if (nodeType === 'videoNode') {
        chain.setVideo({ src: result.url }).run();
      } else if (nodeType === 'audioNode') {
        chain.setAudio({ src: result.url }).run();
      } else if (nodeType === 'attachmentNode') {
        chain
          .setAttachment({
            src: result.url,
            name: result.name || file.name,
            size: result.size,
          })
          .run();
      }
    } catch {
      // 上传失败静默处理
    }
    input.remove();
  });

  document.body.appendChild(input);
  input.click();
}
