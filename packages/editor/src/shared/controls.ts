import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';
import { PALETTE_COLORS, PALETTE_COLUMNS, PALETTE_ROWS } from './color-palette';

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
    const updateIndicator = (btn as unknown as Record<string, unknown>)
      ._updateIndicator as (() => void) | undefined;
    updateIndicator?.();
  });
}

export function createDivider(className: string): HTMLDivElement {
  const div = document.createElement('div');
  div.className = className;
  return div;
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

/** 基于 floating-ui 的自定义下拉选择控件 */
export function createSelect(
  container: HTMLElement,
  selectClassName: string,
  editor: Editor,
  icon: string,
  title: string,
  options: readonly { label: string; value: string }[],
  getCurrent: (e: Editor) => string | null,
  onSelect: (e: Editor, value: string) => void,
  onClear: (e: Editor) => void,
  defaultLabel = '默认',
): HTMLElement {
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = selectClassName;
  trigger.title = title;
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const iconEl = document.createElement('span');
  iconEl.className = `${selectClassName}-icon`;
  iconEl.innerHTML = icon;

  const valueEl = document.createElement('span');
  valueEl.className = `${selectClassName}-value`;

  const arrowEl = document.createElement('span');
  arrowEl.className = `${selectClassName}-arrow`;
  arrowEl.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>';

  trigger.appendChild(iconEl);
  trigger.appendChild(valueEl);
  trigger.appendChild(arrowEl);

  let cleanup: (() => void) | null = null;
  let dropdown: HTMLElement | null = null;

  const updateValue = () => {
    const current = getCurrent(editor) ?? '';
    const currentLabel =
      options.find((o) => o.value === current)?.label ?? defaultLabel;
    valueEl.textContent = currentLabel;

    if (dropdown?.isConnected) {
      const items = dropdown.querySelectorAll(`.${selectClassName}-item`);
      items.forEach((item) => {
        if ((item as HTMLElement).dataset.value === current) {
          item.classList.add('is-selected');
        } else {
          item.classList.remove('is-selected');
        }
      });
    }
  };

  let closeDropdown = () => {
    cleanup?.();
    cleanup = null;
    dropdown?.remove();
    dropdown = null;
    trigger.setAttribute('aria-expanded', 'false');
  };

  const buildDropdown = () => {
    const menu = document.createElement('div');
    menu.className = `${selectClassName}-dropdown`;
    menu.setAttribute('role', 'listbox');

    const currentValue = getCurrent(editor) ?? '';

    const defaultItem = createSelectItem(
      selectClassName,
      '',
      defaultLabel,
      !currentValue,
    );
    defaultItem.addEventListener('click', (e) => {
      e.stopPropagation();
      onClear(editor);
      updateBtnStates(container, selectClassName, editor);
      updateValue();
      closeDropdown();
    });
    menu.appendChild(defaultItem);

    for (const opt of options) {
      const item = createSelectItem(
        selectClassName,
        opt.value,
        opt.label,
        currentValue === opt.value,
      );
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelect(editor, opt.value);
        updateBtnStates(container, selectClassName, editor);
        updateValue();
        closeDropdown();
      });
      menu.appendChild(item);
    }

    container.appendChild(menu);
    return menu;
  };

  const openDropdown = () => {
    if (dropdown) return;

    dropdown = buildDropdown();
    trigger.setAttribute('aria-expanded', 'true');

    cleanup = autoUpdate(trigger, dropdown, () => {
      if (!dropdown?.isConnected || !trigger.isConnected) {
        cleanup?.();
        closeDropdown();
        return;
      }
      computePosition(trigger, dropdown, {
        placement: 'bottom-start',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        if (!dropdown) return;
        Object.assign(dropdown.style, {
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdown?.isConnected &&
        !dropdown.contains(e.target as Node) &&
        !trigger.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };
    setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick, true);
    }, 0);

    const getItems = () =>
      dropdown?.querySelectorAll(`.${selectClassName}-item`) ?? [];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDropdown();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = Array.from(getItems());
        const activeIdx = items.indexOf(document.activeElement as Element);
        const nextIdx =
          e.key === 'ArrowDown'
            ? (activeIdx + 1) % items.length
            : (activeIdx - 1 + items.length) % items.length;
        (items[nextIdx] as HTMLElement).focus();
        return;
      }
      if (e.key === 'Enter') {
        const focused = document.activeElement as HTMLElement | null;
        if (focused?.classList.contains(`${selectClassName}-item`)) {
          focused.click();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.removedNodes) {
          if (node === dropdown) {
            cleanup?.();
            document.removeEventListener('mousedown', handleOutsideClick, true);
            document.removeEventListener('keydown', handleKeyDown);
            observer.disconnect();
            return;
          }
        }
      }
    });
    observer.observe(container, { childList: true });

    const origCloseDropdown = closeDropdown;
    closeDropdown = () => {
      observer.disconnect();
      document.removeEventListener('mousedown', handleOutsideClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      origCloseDropdown();
    };
  };

  trigger.addEventListener('mousedown', (e) => e.preventDefault());
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdown) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  (trigger as unknown as Record<string, unknown>)._update = updateValue;
  (trigger as unknown as Record<string, unknown>)._check = () => false;
  (trigger as unknown as Record<string, unknown>)._destroy = () => {
    closeDropdown();
  };

  container.appendChild(trigger);
  updateValue();
  return trigger;
}

/** 创建下拉选择项 */
function createSelectItem(
  selectClassName: string,
  value: string,
  label: string,
  selected: boolean,
): HTMLElement {
  const item = document.createElement('div');
  item.className = `${selectClassName}-item`;
  if (selected) item.classList.add('is-selected');
  item.dataset.value = value;
  item.setAttribute('role', 'option');
  item.setAttribute('aria-selected', String(selected));
  item.setAttribute('tabindex', '-1');
  item.textContent = label;
  return item;
}

/** 颜色值标准化，用于比较匹配 */
function normalizeColor(color: string): string {
  return color.toLowerCase().replace(/\s/g, '');
}

/** 颜色下拉模式 */
export type ColorDropdownMode = 'textColor' | 'highlight';

/** 创建带颜色网格下拉的按钮 */
export function createColorDropdown(
  container: HTMLElement,
  btnClassName: string,
  editor: Editor,
  icon: string,
  title: string,
  mode: ColorDropdownMode,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = btnClassName;
  btn.title = title;
  btn.innerHTML = icon;

  const colorIndicator = document.createElement('span');
  colorIndicator.className = `${btnClassName}-color-indicator`;
  btn.appendChild(colorIndicator);

  const attributeKey = mode === 'textColor' ? 'color' : 'backgroundColor';

  const isActive = () => !!editor.getAttributes('textStyle')[attributeKey];

  const getCurrentColor = (): string | null => {
    const attrs = editor.getAttributes('textStyle');
    return (attrs[attributeKey] as string) || null;
  };

  (btn as unknown as Record<string, unknown>)._check = () => isActive();
  (btn as unknown as Record<string, unknown>)._updateIndicator = () => {
    colorIndicator.style.backgroundColor = getCurrentColor() || '';
  };

  const applyColor =
    mode === 'textColor'
      ? (e: Editor, color: string) => e.chain().focus().setColor(color).run()
      : (e: Editor, color: string) =>
          e.chain().focus().setBackgroundColor(color).run();

  const clearColor =
    mode === 'textColor'
      ? (e: Editor) => e.chain().focus().unsetColor().run()
      : (e: Editor) => e.chain().focus().setBackgroundColor('').run();

  const actionLabel = mode === 'textColor' ? '默认颜色' : '清除背景色';

  let cleanup: (() => void) | null = null;
  let dropdown: HTMLElement | null = null;

  let closeDropdown = () => {
    cleanup?.();
    cleanup = null;
    dropdown?.remove();
    dropdown = null;
  };

  const buildDropdown = (): HTMLElement => {
    const menu = document.createElement('div');
    menu.className = 'fsdx-editor-color-dropdown';

    const actionBtn = document.createElement('button');
    actionBtn.type = 'button';
    actionBtn.className = 'fsdx-editor-color-grid-action-btn';
    actionBtn.textContent = actionLabel;
    actionBtn.addEventListener('mousedown', (e) => e.preventDefault());
    actionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearColor(editor);
      updateBtnStates(container, btnClassName, editor);
      const updateIndicator = (btn as unknown as Record<string, unknown>)
        ._updateIndicator as (() => void) | undefined;
      updateIndicator?.();
      closeDropdown();
    });
    menu.appendChild(actionBtn);

    const separator = document.createElement('div');
    separator.className = 'fsdx-editor-color-dropdown-divider';
    menu.appendChild(separator);

    const customRow = document.createElement('div');
    customRow.className = 'fsdx-editor-color-custom-row';
    customRow.setAttribute('role', 'button');
    customRow.setAttribute('tabindex', '0');

    const customLabel = document.createElement('span');
    customLabel.textContent = '自定义颜色';
    customRow.appendChild(customLabel);

    const customSwatch = document.createElement('span');
    customSwatch.className = 'fsdx-editor-color-custom-swatch';
    customSwatch.style.backgroundColor = getCurrentColor() || 'transparent';
    customRow.appendChild(customSwatch);

    const customInput = document.createElement('input');
    customInput.type = 'color';
    customInput.className = 'fsdx-editor-color-custom-input';
    customInput.addEventListener('input', (e) => {
      const color = (e.target as HTMLInputElement).value;
      applyColor(editor, color);
      updateBtnStates(container, btnClassName, editor);
      const updateIndicator = (btn as unknown as Record<string, unknown>)
        ._updateIndicator as (() => void) | undefined;
      updateIndicator?.();
      closeDropdown();
    });
    customRow.appendChild(customInput);

    customRow.addEventListener('mousedown', (e) => e.preventDefault());
    customRow.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof customInput.showPicker === 'function') {
        customInput.showPicker();
      } else {
        customInput.click();
      }
    });
    customRow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (typeof customInput.showPicker === 'function') {
          customInput.showPicker();
        } else {
          customInput.click();
        }
      }
    });

    menu.appendChild(customRow);

    const separator2 = document.createElement('div');
    separator2.className = 'fsdx-editor-color-dropdown-divider';
    menu.appendChild(separator2);

    const grid = document.createElement('div');
    grid.className = 'fsdx-editor-color-grid';
    grid.setAttribute('role', 'grid');
    grid.setAttribute('aria-label', '颜色选择');

    const currentColor = getCurrentColor();
    const cells: HTMLButtonElement[] = [];

    for (const paletteColor of PALETTE_COLORS) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'fsdx-editor-color-grid-item';
      cell.style.backgroundColor = paletteColor.color;
      cell.setAttribute('tabindex', '-1');
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', paletteColor.color);

      if (
        currentColor &&
        normalizeColor(currentColor) === normalizeColor(paletteColor.color)
      ) {
        cell.setAttribute('data-active', 'true');
      }

      cell.addEventListener('mousedown', (e) => e.preventDefault());
      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        applyColor(editor, paletteColor.color);
        updateBtnStates(container, btnClassName, editor);
        const updateIndicator = (btn as unknown as Record<string, unknown>)
          ._updateIndicator as (() => void) | undefined;
        updateIndicator?.();
        closeDropdown();
      });

      grid.appendChild(cell);
      cells.push(cell);
    }

    grid.addEventListener('keydown', (e) => {
      const currentIndex = cells.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      if (currentIndex === -1) {
        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowRight' ||
          e.key === 'Enter'
        ) {
          e.preventDefault();
          cells[0]?.focus();
        }
        return;
      }

      const col = currentIndex % PALETTE_COLUMNS;
      const row = Math.floor(currentIndex / PALETTE_COLUMNS);
      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = row * PALETTE_COLUMNS + ((col + 1) % PALETTE_COLUMNS);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex =
            row * PALETTE_COLUMNS +
            ((col - 1 + PALETTE_COLUMNS) % PALETTE_COLUMNS);
          break;
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = ((row + 1) % PALETTE_ROWS) * PALETTE_COLUMNS + col;
          break;
        case 'ArrowUp':
          e.preventDefault();
          nextIndex =
            ((row - 1 + PALETTE_ROWS) % PALETTE_ROWS) * PALETTE_COLUMNS + col;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = cells.length - 1;
          break;
        default:
          return;
      }

      if (cells[nextIndex]) {
        cells[nextIndex].focus();
      }
    });

    menu.appendChild(grid);
    container.appendChild(menu);
    return menu;
  };

  const openDropdown = () => {
    if (dropdown) return;

    dropdown = buildDropdown();

    cleanup = autoUpdate(btn, dropdown, () => {
      if (!dropdown?.isConnected || !btn.isConnected) {
        cleanup?.();
        closeDropdown();
        return;
      }
      computePosition(btn, dropdown, {
        placement: 'bottom-start',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        if (!dropdown) return;
        Object.assign(dropdown.style, {
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdown?.isConnected &&
        !dropdown.contains(e.target as Node) &&
        !btn.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };
    setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick, true);
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.removedNodes) {
          if (node === dropdown) {
            cleanup?.();
            document.removeEventListener('mousedown', handleOutsideClick, true);
            document.removeEventListener('keydown', handleKeyDown);
            observer.disconnect();
            return;
          }
        }
      }
    });
    observer.observe(container, { childList: true });

    const origCloseDropdown = closeDropdown;
    closeDropdown = () => {
      observer.disconnect();
      document.removeEventListener('mousedown', handleOutsideClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      origCloseDropdown();
    };
  };

  btn.addEventListener('mousedown', (e) => e.preventDefault());
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdown) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  (btn as unknown as Record<string, unknown>)._destroy = () => {
    closeDropdown();
  };

  container.appendChild(btn);
  return btn;
}

/** 创建缩进数字输入框 */
export function createIndentInput(
  container: HTMLElement,
  inputClassName: string,
  editor: Editor,
  title: string,
  getIndent: (e: Editor) => number,
  setIndent: (e: Editor, value: number) => void,
): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'number';
  input.className = inputClassName;
  input.title = title;
  input.placeholder = 'em';
  input.min = '0';
  input.step = '0.5';

  const updateValue = () => {
    const val = getIndent(editor);
    input.value = val > 0 ? String(val) : '';
  };

  input.addEventListener('mousedown', (e) => e.stopPropagation());
  input.addEventListener('change', () => {
    const value = Number.parseFloat(input.value);
    if (!Number.isNaN(value)) {
      setIndent(editor, Math.max(0, value));
    }
  });
  input.addEventListener('focus', () => updateValue());

  (input as unknown as Record<string, unknown>)._update = updateValue;

  container.appendChild(input);
  updateValue();
  return input;
}

/** 表格 grid picker 弹出层尺寸 */
const TABLE_PICKER_ROWS = 10;
const TABLE_PICKER_COLS = 10;

/** 创建表格插入按钮，带 grid picker 弹出层 */
export function createTableBtn(
  container: HTMLElement,
  btnClassName: string,
  pickerClassName: string,
  editor: Editor,
  icon: string,
  title: string,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = btnClassName;
  btn.title = title;
  btn.innerHTML = icon;

  (btn as unknown as Record<string, unknown>)._check = () =>
    editor.isActive('table');

  const picker = document.createElement('div');
  picker.className = pickerClassName;
  picker.style.display = 'none';

  const label = document.createElement('div');
  label.className = `${pickerClassName}-label`;
  label.textContent = '1 × 1';
  picker.appendChild(label);

  const grid = document.createElement('div');
  grid.className = `${pickerClassName}-grid`;
  picker.appendChild(grid);

  const cells: HTMLDivElement[][] = [];
  let currentRows = 0;
  let currentCols = 0;

  for (let r = 0; r < TABLE_PICKER_ROWS; r++) {
    const row: HTMLDivElement[] = [];
    for (let c = 0; c < TABLE_PICKER_COLS; c++) {
      const cell = document.createElement('div');
      cell.className = `${pickerClassName}-cell`;
      cell.addEventListener('mouseenter', () => {
        currentRows = r + 1;
        currentCols = c + 1;
        label.textContent = `${currentRows} × ${currentCols}`;
        highlightCells(cells, r, c);
      });
      cell.addEventListener('click', () => {
        editor
          .chain()
          .focus()
          .insertTable({
            rows: currentRows,
            cols: currentCols,
            withHeaderRow: true,
          })
          .run();
        closePicker();
      });
      grid.appendChild(cell);
      row.push(cell);
    }
    cells.push(row);
  }

  function highlightCells(
    cellMatrix: HTMLDivElement[][],
    endRow: number,
    endCol: number,
  ) {
    for (let r = 0; r < cellMatrix.length; r++) {
      for (let c = 0; c < cellMatrix[r].length; c++) {
        if (r <= endRow && c <= endCol) {
          cellMatrix[r][c].classList.add('is-highlighted');
        } else {
          cellMatrix[r][c].classList.remove('is-highlighted');
        }
      }
    }
  }

  function closePicker() {
    picker.style.display = 'none';
    highlightCells(cells, -1, -1);
    currentRows = 0;
    currentCols = 0;
    label.textContent = '1 × 1';
  }

  const onDocMouseDown = (event: MouseEvent) => {
    if (
      picker.style.display !== 'none' &&
      !btn.contains(event.target as Node) &&
      !picker.contains(event.target as Node)
    ) {
      closePicker();
    }
  };

  btn.addEventListener('mousedown', (e) => e.preventDefault());
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (picker.style.display === 'none') {
      const btnRect = btn.getBoundingClientRect();
      picker.style.display = 'block';
      picker.style.position = 'fixed';
      picker.style.top = `${btnRect.bottom + 4}px`;
      picker.style.left = `${btnRect.left}px`;
      document.addEventListener('mousedown', onDocMouseDown);
    } else {
      closePicker();
      document.removeEventListener('mousedown', onDocMouseDown);
    }
  });

  btn.appendChild(picker);
  container.appendChild(btn);
  return btn;
}
