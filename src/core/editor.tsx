import type { Content } from '@tiptap/core';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TableKit } from '@tiptap/extension-table';
import { TextAlign } from '@tiptap/extension-text-align';
import { FontSize, LineHeight, TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-text-style/color';
import { Typography } from '@tiptap/extension-typography';
import { Selection } from '@tiptap/extensions';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/button';
import { UIProvider } from '../components/ui/provider';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '../components/ui/toolbar';
import { HorizontalRule } from '../plugins/horizontal-rule/horizontal-rule-node-extension';
import { ImageUploadNode } from '../plugins/image/image-upload-node-extension';
import { Indent } from '../plugins/indent/indent-extension';
import { CustomTableView } from '../plugins/table/custom-table-view';
import { TableCellStyle } from '../plugins/table/table-cell-style-extension';
import { NodeBackground } from './node-background-extension';
import '../styles/overrides/blockquote-node.scss';
import '../styles/overrides/code-block-node.scss';
import '../plugins/horizontal-rule/horizontal-rule-node.scss';
import '../styles/overrides/list-node.scss';
import '../plugins/image/image-node.scss';
import '../styles/overrides/heading-node.scss';
import '../styles/overrides/paragraph-node.scss';
import '../plugins/table/table-node.scss';
import { MarkButton } from '../components/mark-button';

import { useCursorVisibility } from '../hooks/use-cursor-visibility';
import { useIsBreakpoint } from '../hooks/use-is-breakpoint';
import { useWindowSize } from '../hooks/use-window-size';
import { ArrowLeftIcon } from '../icons/arrow-left-icon';
import { LinkIcon } from '../icons/link-icon';
import { SmileIcon } from '../icons/smile-icon';
import { AttachmentNode, AttachmentUploadButton } from '../plugins/attachment';
import { AudioNode, AudioUploadButton } from '../plugins/audio';
import { BlockquoteButton } from '../plugins/blockquote';
import {
  AttachmentBubbleMenu,
  AudioBubbleMenu,
  BubbleMenu,
  ImageBubbleMenu,
  VideoBubbleMenu,
} from '../plugins/bubble-menu';
import { CodeBlockButton } from '../plugins/code-block';
import { ColorHighlightDropdownMenu } from '../plugins/color/color-highlight-dropdown-menu';
import { ColorTextDropdownMenu } from '../plugins/color/color-text-dropdown-menu';
import { EmojiButton, EmojiPopoverButton } from '../plugins/emoji';
import { EmojiPopoverContent } from '../plugins/emoji/emoji-popover-content';
import { FontSizeButton } from '../plugins/font-size';
import { HorizontalRuleButton } from '../plugins/horizontal-rule';
import { CustomImage } from '../plugins/image/image-extension';
import { ImageUploadPopoverButton } from '../plugins/image/image-upload-popover-button';
import { IndentToggle } from '../plugins/indent';
import { LineHeightButton } from '../plugins/line-height';
import { LinkButton, LinkContent, LinkPopover } from '../plugins/link';
import { ListDropdownMenu } from '../plugins/list';
import {
  TableButton,
  TableExtendButtons,
  TableSelectionOverlay,
} from '../plugins/table';
import { TextAlignButton } from '../plugins/text-align';
import {
  ClearFormattingButton,
  TextStyleDropdownMenu,
} from '../plugins/text-style';
import { UndoRedoButton } from '../plugins/undo-redo';
import { VideoNode, VideoUploadButton } from '../plugins/video';
import type { EditorOptions } from '../types';
import { EditorOptionsContext, PortalContainerContext } from './editor-context';
import { handleImageUpload, MAX_FILE_SIZE } from './editor-utils';
import './editor.scss';

export type EditorTheme = 'light' | 'dark' | 'auto';

export interface EditorProps {
  value?: Content;
  onChange?: (html: string) => void;
  options?: EditorOptions;
  theme?: EditorTheme;
}

const MainToolbarContent = ({
  onLinkClick,
  onEmojiClick,
  isMobile,
}: {
  onLinkClick: () => void;
  onEmojiClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
        <ClearFormattingButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextStyleDropdownMenu modal={false} />
        <FontSizeButton />
        <LineHeightButton />
        <ListDropdownMenu
          modal={false}
          types={['bulletList', 'orderedList', 'taskList']}
        />
        <IndentToggle />
        <BlockquoteButton />
        <CodeBlockButton />
        <HorizontalRuleButton />
        <TableButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        <ColorTextDropdownMenu modal={false} />
        <ColorHighlightDropdownMenu modal={false} />
        {!isMobile ? (
          <LinkPopover autoOpenOnLinkActive={false} />
        ) : (
          <LinkButton onClick={onLinkClick} />
        )}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        {!isMobile ? (
          <EmojiButton />
        ) : (
          <EmojiPopoverButton onClick={onEmojiClick} aria-label="插入表情" />
        )}
        <ImageUploadPopoverButton />
        <VideoUploadButton />
        <AudioUploadButton />
        <AttachmentUploadButton />
      </ToolbarGroup>
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: 'link' | 'emoji';
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="fsdx-editor-button-icon" />
        {type === 'link' ? (
          <LinkIcon className="fsdx-editor-button-icon" />
        ) : (
          <SmileIcon className="fsdx-editor-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'link' ? <LinkContent /> : <EmojiPopoverContent />}
  </>
);

export function Editor({
  value,
  onChange,
  options,
  theme = 'auto',
}: EditorProps) {
  const isMobile = useIsBreakpoint();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = useState<'main' | 'link' | 'emoji'>(
    'main',
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const portalContainerRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': '主编辑区域，开始输入文字。',
        class: 'editor',
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        enableClickSelection: true,
      }).extend({
        parseHTML() {
          return [{ tag: 'a[href]:not([data-type="attachment"])' }];
        },
      }),
      HorizontalRule,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'tableCell', 'tableHeader'],
      }),
      TableKit.configure({
        table: {
          resizable: true,
          View: CustomTableView,
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      CustomImage,
      Typography,
      Superscript,
      Subscript,
      TextStyle,
      Color,
      FontSize,
      LineHeight,
      Selection,
      NodeBackground,
      TableCellStyle,
      Indent,
      VideoNode,
      AudioNode,
      AttachmentNode,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => {
      isInternalChange.current = true;
      onChange?.(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const currentHTML = editor.getHTML();
    if (value !== undefined && value !== currentHTML) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
    scrollContainerRef: contentRef,
  });

  useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      setMobileView('main');
    }
  }, [isMobile, mobileView]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (theme !== 'auto') {
      const isDark = theme === 'dark';
      wrapper.classList.toggle('fsdx-editor-dark', isDark);
      document.documentElement.classList.toggle('fsdx-editor-dark', isDark);
      return () => {
        wrapper.classList.remove('fsdx-editor-dark');
        document.documentElement.classList.remove('fsdx-editor-dark');
      };
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      wrapper.classList.toggle('fsdx-editor-dark', mediaQuery.matches);
      document.documentElement.classList.toggle(
        'fsdx-editor-dark',
        mediaQuery.matches,
      );
    };
    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [theme]);

  return (
    <UIProvider>
      <div ref={wrapperRef} className="fsdx-editor-wrapper">
        <EditorContext.Provider value={{ editor }}>
          <EditorOptionsContext.Provider value={options}>
            <PortalContainerContext.Provider value={portalContainerRef}>
              <Toolbar
                ref={toolbarRef}
                style={{
                  ...(isMobile
                    ? {
                        bottom: `calc(100% - ${height - rect.y}px)`,
                      }
                    : {}),
                }}
              >
                {mobileView === 'main' ? (
                  <MainToolbarContent
                    onLinkClick={() => setMobileView('link')}
                    onEmojiClick={() => setMobileView('emoji')}
                    isMobile={isMobile}
                  />
                ) : (
                  <MobileToolbarContent
                    type={mobileView}
                    onBack={() => setMobileView('main')}
                  />
                )}
              </Toolbar>

              <div ref={contentRef} className="fsdx-editor-content">
                {editor && <ImageBubbleMenu editor={editor} />}
                {editor && <VideoBubbleMenu editor={editor} />}
                {editor && <AudioBubbleMenu editor={editor} />}
                {editor && <AttachmentBubbleMenu editor={editor} />}
                <BubbleMenu />
                <EditorContent editor={editor} role="presentation" />
              </div>

              <TableSelectionOverlay />
              <TableExtendButtons />
              <div ref={portalContainerRef} />
            </PortalContainerContext.Provider>
          </EditorOptionsContext.Provider>
        </EditorContext.Provider>
      </div>
    </UIProvider>
  );
}
