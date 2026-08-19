import Image from '@tiptap/extension-image';
import { createImageNodeView } from './image-node-view';

export type ImageAlign = 'left' | 'center' | 'right';

/** 图片缩放配置 */
export interface ImageResizeOptions {
  enabled: boolean;
  minWidth?: number;
  minHeight?: number;
}

export interface ImageUploadOptions {
  upload: (
    file: File,
    onProgress?: (progress: number) => void,
  ) => Promise<{ url: string }>;
  /** 是否开启拖拽缩放（自定义 NodeView，支持像素与百分比宽度） */
  resize?: ImageResizeOptions | false;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      setImageAlign: (align: ImageAlign) => ReturnType;
    };
  }
}

/** 将 DOM 上的宽度值规整为数字（px）或百分比字符串 */
function parseSize(value: string | null): number | string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.endsWith('%')) return trimmed;
  const numeric = Number.parseFloat(trimmed);
  return Number.isNaN(numeric) ? null : numeric;
}

const ImageUpload = Image.extend<ImageUploadOptions>({
  name: 'imageUpload',

  addOptions() {
    return {
      ...this.parent?.(),
      upload: undefined as unknown as ImageUploadOptions['upload'],
      resize: {
        enabled: true,
        minWidth: 60,
        minHeight: 40,
      },
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        // 默认不写入 data-align，保持既有 HTML 内容在保存时不变；未设置时按居中渲染
        default: null,
        parseHTML: (element) => element.getAttribute('data-align'),
        renderHTML: (attributes) =>
          attributes.align ? { 'data-align': attributes.align } : {},
      },
      width: {
        default: null,
        parseHTML: (element) =>
          parseSize(element.style.width) ??
          parseSize(element.getAttribute('width')),
        renderHTML: (attributes) => {
          const width = attributes.width as number | string | null;
          if (width == null) return {};
          // 百分比宽度通过 CSS 渲染，固定像素使用 width 属性
          return typeof width === 'string'
            ? { style: `width: ${width}` }
            : { width };
        },
      },
      height: {
        default: null,
        parseHTML: (element) =>
          parseSize(element.style.height) ??
          parseSize(element.getAttribute('height')),
        renderHTML: (attributes) => {
          const height = attributes.height as number | string | null;
          if (height == null) return {};
          return typeof height === 'string'
            ? { style: `height: ${height}` }
            : { height };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageAlign:
        (align) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { align });
        },
    };
  },

  addNodeView() {
    if (
      !this.options.resize ||
      !this.options.resize.enabled ||
      typeof document === 'undefined'
    ) {
      return null;
    }
    const { minWidth = 60, minHeight = 40 } = this.options.resize;
    return (props) =>
      createImageNodeView(
        {
          node: props.node,
          editor: props.editor,
          getPos: props.getPos,
          HTMLAttributes: props.HTMLAttributes,
        },
        { minWidth, minHeight },
      );
  },
});

export default ImageUpload;
