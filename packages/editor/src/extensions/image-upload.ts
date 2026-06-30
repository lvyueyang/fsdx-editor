import Image from '@tiptap/extension-image';

export interface ImageUploadOptions {
  upload: (
    file: File,
    onProgress?: (progress: number) => void,
  ) => Promise<{ url: string }>;
}

const ImageUpload = Image.extend<ImageUploadOptions>({
  name: 'imageUpload',

  addOptions() {
    return {
      ...this.parent?.(),
      upload: undefined as unknown as ImageUploadOptions['upload'],
    };
  },
});

export default ImageUpload;
