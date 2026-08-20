import type { Editor } from '@tiptap/core';
import type { VideoAlign } from '../extensions/video-node';
import {
  addBtn,
  createBubbleInput,
  createDivider,
  updateBtnStates,
} from '../shared/controls';
import { bindTooltips } from '../shared/tooltip';
import { sanitizeUrl } from '../utils/link';
import { ICONS, updateInputs } from './toolbar-shared';

const BTN_CLASS = 'easyx-editor-bubble-btn';
const DIVIDER_CLASS = 'easyx-editor-bubble-divider';
const POSTER_INPUT_CLASS = 'easyx-editor-bubble-input';

/** 当前选中视频的封面地址 */
function getSelectedVideoPoster(editor: Editor): string {
  const attrs = editor.getAttributes('videoNode');
  return (attrs.poster as string) || '';
}

export function createVideoMenuElement(): HTMLElement {
  const menuEl = document.createElement('div');
  menuEl.className = 'easyx-editor-bubble-menu easyx-editor-video-menu';
  return menuEl;
}

/**
 * 视频选中浮层（第三个 BubbleMenu 实例）：对齐 / 封面 / 控制器 / 自动播放 / 删除。
 * 仅在选中 videoNode 节点时显示，由 create-editor 注册。
 */
export function populateVideoMenu(
  menuEl: HTMLElement,
  editor: Editor,
): () => void {
  menuEl.innerHTML = '';
  bindTooltips(menuEl);

  const add = (
    icon: string,
    title: string,
    check: (e: Editor) => boolean,
    action: (e: Editor) => void,
  ) => addBtn(menuEl, BTN_CLASS, editor, icon, title, check, action);

  const div = () => menuEl.appendChild(createDivider(DIVIDER_CLASS));

  const refreshAll = () => {
    updateBtnStates(menuEl, BTN_CLASS, editor);
    updateInputs(menuEl, POSTER_INPUT_CLASS, editor);
  };

  // ===== 对齐 =====
  const alignOptions: { icon: string; title: string; align: VideoAlign }[] = [
    { icon: ICONS.alignLeft, title: '左对齐', align: 'left' },
    { icon: ICONS.alignCenter, title: '居中', align: 'center' },
    { icon: ICONS.alignRight, title: '右对齐', align: 'right' },
  ];
  for (const { icon, title, align } of alignOptions) {
    add(
      icon,
      title,
      (e) => e.getAttributes('videoNode').align === align,
      (e) => {
        e.chain().focus().setVideoAlign(align).run();
        refreshAll();
      },
    );
  }

  div();

  // ===== 封面地址 =====
  createBubbleInput(
    menuEl,
    POSTER_INPUT_CLASS,
    editor,
    '设置封面地址',
    '封面地址',
    getSelectedVideoPoster,
    (e, value) => {
      const safeUrl = value ? sanitizeUrl(value, window.location.href) : null;
      if (value && !safeUrl) {
        // 非法地址不提交，恢复显示值
        const input = menuEl.querySelector<HTMLInputElement>(
          `.${POSTER_INPUT_CLASS}`,
        );
        if (input) input.value = getSelectedVideoPoster(e);
        return;
      }
      e.chain()
        .focus()
        .updateAttributes('videoNode', { poster: safeUrl })
        .run();
    },
  );

  div();

  // ===== 控制器 =====
  add(
    ICONS.movie,
    '显示控制器',
    (e) => e.getAttributes('videoNode').controls !== false,
    (e) => {
      const controls = e.getAttributes('videoNode').controls !== false;
      e.chain()
        .focus()
        .updateAttributes('videoNode', { controls: !controls })
        .run();
      refreshAll();
    },
  );

  // ===== 自动播放 =====
  add(
    ICONS.play,
    '自动播放',
    (e) => e.getAttributes('videoNode').autoplay === true,
    (e) => {
      const autoplay = e.getAttributes('videoNode').autoplay === true;
      e.chain()
        .focus()
        .updateAttributes('videoNode', { autoplay: !autoplay })
        .run();
      refreshAll();
    },
  );

  div();

  // ===== 删除视频 =====
  add(
    ICONS.delete,
    '删除视频',
    () => false,
    (e) => e.chain().focus().deleteSelection().run(),
  );

  refreshAll();
  return refreshAll;
}
