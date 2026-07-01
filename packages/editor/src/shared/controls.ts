import type { Editor } from '@tiptap/core';

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

/** 创建下拉选择框，用于字体大小 / 行高等场景 */
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
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = `${selectClassName}-wrapper`;

  const iconEl = document.createElement('span');
  iconEl.className = `${selectClassName}-icon`;
  iconEl.innerHTML = icon;

  const select = document.createElement('select');
  select.className = selectClassName;
  select.title = title;

  const updateValue = () => {
    const current = getCurrent(editor) ?? '';
    if (select.value !== current) {
      select.value = current;
    }
  };

  select.addEventListener('mousedown', (e) => e.stopPropagation());
  select.addEventListener('change', () => {
    const value = select.value;
    if (value === '') {
      onClear(editor);
    } else {
      onSelect(editor, value);
    }
    updateBtnStates(container, selectClassName, editor);
  });

  const renderOptions = () => {
    select.innerHTML = '<option value="">默认</option>';
    for (const opt of options) {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      select.appendChild(option);
    }
    updateValue();
  };
  renderOptions();

  (select as unknown as Record<string, unknown>)._update = updateValue;
  (select as unknown as Record<string, unknown>)._check = () => false;

  wrapper.appendChild(iconEl);
  wrapper.appendChild(select);
  container.appendChild(wrapper);

  return wrapper;
}

/** 创建颜色按钮，内嵌隐藏的 <input type="color"> */
export function createColorBtn(
  container: HTMLElement,
  btnClassName: string,
  editor: Editor,
  icon: string,
  title: string,
  isActive: (e: Editor) => boolean,
  applyColor: (e: Editor, color: string) => void,
  attributeKey: 'color' | 'backgroundColor',
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = btnClassName;
  btn.title = title;
  btn.innerHTML = icon;

  const colorIndicator = document.createElement('span');
  colorIndicator.className = `${btnClassName}-color-indicator`;
  btn.appendChild(colorIndicator);

  (btn as unknown as Record<string, unknown>)._check = isActive;
  (btn as unknown as Record<string, unknown>)._updateIndicator = () => {
    if (isActive(editor)) {
      const attrs = editor.getAttributes('textStyle');
      const color = attrs[attributeKey] as string | undefined;
      colorIndicator.style.backgroundColor = color || '';
    } else {
      colorIndicator.style.backgroundColor = '';
    }
  };

  const input = document.createElement('input');
  input.type = 'color';
  input.className = `${btnClassName}-input`;
  input.setAttribute('aria-label', title);
  input.addEventListener('input', (e) => {
    const color = (e.target as HTMLInputElement).value;
    applyColor(editor, color);
    updateBtnStates(container, btnClassName, editor);
    const indicator = (btn as unknown as Record<string, unknown>)
      ._updateIndicator as (() => void) | undefined;
    indicator?.();
  });

  btn.addEventListener('mousedown', (e) => e.preventDefault());
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    input.click();
  });

  btn.appendChild(input);
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
