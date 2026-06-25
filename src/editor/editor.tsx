import type { Content } from '@tiptap/core';
import { Highlight } from '@tiptap/extension-highlight';
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
import { NodeBackground } from '../components/extensions/node-background-extension';
import { HorizontalRule } from '../components/nodes/horizontal-rule-node/horizontal-rule-node-extension';
import { ImageUploadNode } from '../components/nodes/image-upload-node/image-upload-node-extension';
import { Indent } from '../components/nodes/indent-node/indent-extension';
import { CustomTableView } from '../components/nodes/table-node/custom-table-view';
import { Button } from '../components/primitives/button';
import { Spacer } from '../components/primitives/spacer';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '../components/primitives/toolbar';
import { TableCellStyle } from '../components/ui/table-manipulation/table-cell-style-extension';
import '../components/nodes/blockquote-node/blockquote-node.scss';
import '../components/nodes/code-block-node/code-block-node.scss';
import '../components/nodes/horizontal-rule-node/horizontal-rule-node.scss';
import '../components/nodes/list-node/list-node.scss';
import '../components/nodes/image-node/image-node.scss';
import '../components/nodes/heading-node/heading-node.scss';
import '../components/nodes/paragraph-node/paragraph-node.scss';
import '../components/nodes/table-node/table-node.scss';
import { CustomImage } from '../components/extensions/image-extension';
import { ArrowLeftIcon } from '../components/icons/arrow-left-icon';
import { LinkIcon } from '../components/icons/link-icon';
import { SmileIcon } from '../components/icons/smile-icon';
import { MediaAttributeEditor } from '../components/media/media-attribute-editor';
import { AttachmentNode } from '../components/nodes/attachment-node';
import { AudioNode } from '../components/nodes/audio-node';
import { VideoNode } from '../components/nodes/video-node';
import { AttachmentUploadButton } from '../components/ui/attachment-upload-button';
import { AudioUploadButton } from '../components/ui/audio-upload-button';
import { BlockquoteButton } from '../components/ui/blockquote-button';
import { ClearFormattingButton } from '../components/ui/clear-formatting-button';
import { CodeBlockButton } from '../components/ui/code-block-button';
import { ColorHighlightDropdownMenu } from '../components/ui/color-highlight-dropdown-menu';
import { ColorTextDropdownMenu } from '../components/ui/color-text-dropdown-menu';
import { EmojiButton, EmojiPopoverButton } from '../components/ui/emoji-button';
import { EmojiPopoverContent } from '../components/ui/emoji-button/emoji-popover-content';
import { FontSizeButton } from '../components/ui/font-size-button';
import { ImageUploadPopoverButton } from '../components/ui/image-upload-button/image-upload-popover-button';
import { IndentToggle } from '../components/ui/indent-button';
import { LineHeightButton } from '../components/ui/line-height-button';
import {
  LinkButton,
  LinkContent,
  LinkPopover,
} from '../components/ui/link-popover';
import { ListDropdownMenu } from '../components/ui/list-dropdown-menu';
import { MarkButton } from '../components/ui/mark-button';
import { TableButton } from '../components/ui/table-button';
import {
  TableExtendButtons,
  TableSelectionOverlay,
} from '../components/ui/table-manipulation';
import { TextAlignButton } from '../components/ui/text-align-button';
import { TextStyleDropdownMenu } from '../components/ui/text-style-dropdown-menu';
import { UndoRedoButton } from '../components/ui/undo-redo-button';
import { VideoUploadButton } from '../components/ui/video-upload-button';
import { useCursorVisibility } from '../hooks/use-cursor-visibility';
import { useIsBreakpoint } from '../hooks/use-is-breakpoint';
import { useWindowSize } from '../hooks/use-window-size';
import { EditorOptionsContext } from '../lib/editor-context';
import { handleImageUpload, MAX_FILE_SIZE } from '../lib/tiptap-utils';
import type { EditorOptions } from '../types';
import { ThemeToggle } from './theme-toggle';
import './editor.scss';

export interface EditorProps {
  value?: Content;
  onChange?: (html: string) => void;
  options?: EditorOptions;
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
      <Spacer />

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
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
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

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
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
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === 'link' ? (
          <LinkIcon className="tiptap-button-icon" />
        ) : (
          <SmileIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'link' ? <LinkContent /> : <EmojiPopoverContent />}
  </>
);

export function Editor({ value, onChange, options }: EditorProps) {
  const isMobile = useIsBreakpoint();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = useState<'main' | 'link' | 'emoji'>(
    'main',
  );
  const toolbarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
        link: {
          openOnClick: false,
          enableClickSelection: true,
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

  return (
    <div className="editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <EditorOptionsContext.Provider value={options}>
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

          <div ref={contentRef} className="editor-content">
            {editor && <MediaAttributeEditor editor={editor} />}
            <EditorContent editor={editor} role="presentation" />
          </div>

          <TableSelectionOverlay />
          <TableExtendButtons />
        </EditorOptionsContext.Provider>
      </EditorContext.Provider>
    </div>
  );
}
