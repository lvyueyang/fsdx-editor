import type { Editor } from '@tiptap/core';

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
