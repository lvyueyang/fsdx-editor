import { Image } from '@tiptap/extension-image';

export interface CustomImageAttributes {
  src: string;
  alt: string;
  title: string;
  width: string | null;
  alignment: 'left' | 'center' | 'right' | null;
  filter: string | null;
  link: string | null;
}

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    customImage: {
      insertCustomImage: (attrs: Partial<CustomImageAttributes>) => ReturnType;
      updateImageSrc: (src: string) => ReturnType;
      updateImageWidth: (width: string | null) => ReturnType;
      updateImageAlignment: (
        alignment: CustomImageAttributes['alignment'],
      ) => ReturnType;
      updateImageFilter: (filter: string | null) => ReturnType;
      updateImageLink: (link: string | null) => ReturnType;
    };
  }
}

export const CustomImage = Image.extend({
  name: 'customImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-width'),
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { 'data-width': attributes.width };
        },
      },
      alignment: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-alignment'),
        renderHTML: (attributes) => {
          if (!attributes.alignment) return {};
          return { 'data-alignment': attributes.alignment };
        },
      },
      filter: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-filter'),
        renderHTML: (attributes) => {
          if (!attributes.filter) return {};
          return { 'data-filter': attributes.filter };
        },
      },
      link: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-link'),
        renderHTML: (attributes) => {
          if (!attributes.link) return {};
          return { 'data-link': attributes.link };
        },
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const { width, alignment, filter } = node.attrs as CustomImageAttributes;
    const styleParts: string[] = [];

    if (width) styleParts.push(`width: ${width}`);
    if (alignment === 'left') {
      styleParts.push('display: block; margin-left: 0; margin-right: auto');
    }
    if (alignment === 'center') {
      styleParts.push('display: block; margin-left: auto; margin-right: auto');
    }
    if (alignment === 'right') {
      styleParts.push('display: block; margin-left: auto; margin-right: 0');
    }
    if (filter) styleParts.push(`filter: ${filter}`);

    const attrs = { ...HTMLAttributes };
    if (styleParts.length > 0) {
      attrs.style = styleParts.join('; ');
    }

    return ['img', attrs];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      insertCustomImage:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: attrs.src || '',
              alt: attrs.alt || '',
              title: attrs.title || '',
              width: attrs.width || null,
              alignment: attrs.alignment || null,
              filter: attrs.filter || null,
              link: attrs.link || null,
            },
          });
        },
      updateImageSrc:
        (src) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { src });
        },
      updateImageWidth:
        (width) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { width });
        },
      updateImageAlignment:
        (alignment) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { alignment });
        },
      updateImageFilter:
        (filter) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { filter });
        },
      updateImageLink:
        (link) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { link });
        },
    };
  },
}).configure({
  allowBase64: true,
});
