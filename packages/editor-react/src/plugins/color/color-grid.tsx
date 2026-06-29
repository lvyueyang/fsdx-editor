import { useCallback, useEffect, useRef } from 'react';
import { cn } from '../../core/editor-utils';
import {
  PALETTE_COLORS,
  PALETTE_COLUMNS,
  PALETTE_ROWS,
  type PaletteColor,
} from './color-palette';
import './color-palette.scss';

const GRID_TOTAL = PALETTE_COLUMNS * PALETTE_ROWS;

export interface ColorGridProps {
  /** 当前激活的颜色值 */
  activeColor?: string | null;
  /** 颜色选中回调 */
  onSelectColor?: (color: PaletteColor) => void;
  /** 关闭菜单回调 */
  onClose?: () => void;
}

/**
 * 10×7 颜色网格选择器，支持键盘 2D 导航
 */
export function ColorGrid({
  activeColor,
  onSelectColor,
  onClose,
}: ColorGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  const normalizedActive = activeColor?.toLowerCase().replace(/\s/g, '') ?? '';

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const grid = gridRef.current;
      if (!grid) return;

      const cells = grid.querySelectorAll<HTMLButtonElement>(
        '.fsdx-editor-color-grid-item',
      );
      const current = document.activeElement as HTMLButtonElement;
      const currentIndex = Array.from(cells).indexOf(current);

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
          nextIndex = GRID_TOTAL - 1;
          break;
        case 'Escape':
          e.preventDefault();
          onClose?.();
          return;
        default:
          return;
      }

      if (cells[nextIndex]) {
        cells[nextIndex].focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cells = grid.querySelectorAll<HTMLButtonElement>(
      '.fsdx-editor-color-grid-item',
    );
    const activeCell = Array.from(cells).find((cell) => {
      const color = cell.style.backgroundColor;
      return (
        color && color.toLowerCase().replace(/\s/g, '') === normalizedActive
      );
    });

    if (activeCell) {
      activeCell.setAttribute('data-active', 'true');
    }
  }, [activeColor, normalizedActive]);

  return (
    <div
      ref={gridRef}
      className="fsdx-editor-color-grid"
      role="grid"
      aria-label="颜色选择"
      onKeyDown={handleKeyDown}
    >
      {PALETTE_COLORS.map((color, index) => {
        const itemColor = color.color;
        return (
          <button
            key={`${color.name}-${color.level}`}
            type="button"
            className={cn('fsdx-editor-color-grid-item')}
            style={{ backgroundColor: itemColor }}
            tabIndex={index === 0 ? 0 : -1}
            role="gridcell"
            aria-label={itemColor}
            onClick={(e) => {
              e.preventDefault();
              onSelectColor?.(color);
            }}
          />
        );
      })}
    </div>
  );
}

ColorGrid.displayName = 'ColorGrid';
