import type { PaletteColor } from '../palette';
import { PALETTE_COLORS, PALETTE_COLUMNS } from '../palette';

export interface ColorGridCallbacks {
  onSelect?: (color: PaletteColor) => void;
  onClose?: () => void;
}

/**
 * 创建原生 70 色颜色网格 DOM 元素
 */
export function createColorGrid(callbacks: ColorGridCallbacks): HTMLDivElement {
  const grid = document.createElement('div');
  grid.className = 'tiptap-table-kit-color-grid';
  grid.setAttribute('role', 'grid');
  grid.setAttribute('aria-label', '颜色选择');

  const cells: HTMLButtonElement[] = [];

  for (let i = 0; i < PALETTE_COLORS.length; i++) {
    const color = PALETTE_COLORS[i];
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'tiptap-table-kit-color-grid-item';
    cell.style.backgroundColor = color.color;
    cell.tabIndex = i === 0 ? 0 : -1;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', color.color);

    cell.addEventListener('click', (e) => {
      e.preventDefault();
      callbacks.onSelect?.(color);
    });

    grid.appendChild(cell);
    cells.push(cell);
  }

  grid.addEventListener('keydown', (e) => {
    const current = document.activeElement;
    const currentIndex = cells.indexOf(current as HTMLButtonElement);

    if (currentIndex === -1) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
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
        nextIndex =
          ((row + 1) % Math.ceil(PALETTE_COLORS.length / PALETTE_COLUMNS)) *
            PALETTE_COLUMNS +
          col;
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex =
          ((row - 1 + Math.ceil(PALETTE_COLORS.length / PALETTE_COLUMNS)) %
            Math.ceil(PALETTE_COLORS.length / PALETTE_COLUMNS)) *
            PALETTE_COLUMNS +
          col;
        break;
      case 'Escape':
        e.preventDefault();
        callbacks.onClose?.();
        return;
      default:
        return;
    }

    if (cells[nextIndex]) {
      cells[nextIndex].focus();
    }
  });

  return grid;
}
