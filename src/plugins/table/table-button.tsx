import { forwardRef, useCallback, useId, useState } from 'react';
import type { ButtonProps } from '../../components/ui/button';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { cn } from '../../core/tiptap-utils';
import { useTiptapEditor } from '../../hooks/use-tiptap-editor';
import { ChevronDownIcon } from '../../icons/chevron-down-icon';
import type { UseTableConfig } from './';
import { useTable } from './';

import './table-button.scss';

export interface TableButtonProps
  extends Omit<ButtonProps, 'type'>,
    UseTableConfig {
  text?: string;
}

/**
 * 表格插入按钮，点击后展示网格选择器以便可视化选择表格行列数
 */
function TableButtonImpl(
  {
    editor: providedEditor,
    maxRows,
    maxCols,
    hideWhenUnavailable,
    onInserted,
    text,
    className,
    onClick,
    children,
    ...buttonProps
  }: TableButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { editor } = useTiptapEditor(providedEditor);
  const {
    isVisible,
    canInsert,
    handleInsert,
    maxRows: gridRows,
    maxCols: gridCols,
    label,
    Icon,
  } = useTable({ editor, maxRows, maxCols, hideWhenUnavailable, onInserted });

  const [isOpen, setIsOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(0);
  const [hoveredCol, setHoveredCol] = useState(0);
  const gridId = useId();

  const resetHovered = useCallback(() => {
    setHoveredRow(0);
    setHoveredCol(0);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) resetHovered();
    },
    [resetHovered],
  );

  const handleCellHover = useCallback((row: number, col: number) => {
    setHoveredRow(row);
    setHoveredCol(col);
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      handleInsert(row, col);
      setIsOpen(false);
    },
    [handleInsert],
  );

  const handleButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
    },
    [onClick],
  );

  if (!isVisible) {
    return null;
  }

  const displayText = text ?? '表格';

  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          data-active-state="off"
          role="button"
          tabIndex={-1}
          disabled={!canInsert}
          data-disabled={!canInsert}
          aria-label={label}
          tooltip={label}
          className={cn(className)}
          onClick={handleButtonClick}
          {...buttonProps}
          ref={ref}
        >
          {children ?? (
            <>
              <Icon className="tiptap-button-icon" />
              {text && (
                <span className="tiptap-button-text">{displayText}</span>
              )}
              <ChevronDownIcon className="tiptap-button-dropdown-small" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="table-grid-dropdown"
        onMouseLeave={resetHovered}
      >
        <div className="table-grid-label" id={gridId}>
          {hoveredRow > 0 && hoveredCol > 0
            ? `${hoveredRow} × ${hoveredCol} 表格`
            : '选择表格大小'}
        </div>
        <div className="table-grid" role="grid" aria-labelledby={gridId}>
          {Array.from({ length: gridRows }, (_, ri) => (
            <div key={ri} className="table-grid-row" role="row" tabIndex={-1}>
              {Array.from({ length: gridCols }, (_, ci) => {
                const isActive = ri < hoveredRow && ci < hoveredCol;
                return (
                  <button
                    key={ci}
                    type="button"
                    className={cn('table-grid-cell', {
                      'table-grid-cell--active': isActive,
                    })}
                    role="gridcell"
                    tabIndex={-1}
                    aria-label={`${ri + 1} 行 ${ci + 1} 列表格`}
                    onMouseEnter={() => handleCellHover(ri + 1, ci + 1)}
                    onClick={() => handleCellClick(ri + 1, ci + 1)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const TableButton = forwardRef(TableButtonImpl);
TableButton.displayName = 'TableButton';
export default TableButton;
