import type { Editor } from '@tiptap/react';
import {
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import type { ButtonProps } from '../../components/ui/button';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Input } from '../../components/ui/input';
import { cn } from '../../core/editor-utils';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { ChevronDownIcon } from '../../icons/chevron-down-icon';
import {
  FONT_SIZE_PRESETS,
  normalizeFontSize,
  useFontSize,
} from './use-font-size';

import './font-size-button.scss';

export interface FontSizeButtonProps extends Omit<ButtonProps, 'type'> {
  editor?: Editor | null;
}

/**
 * 字号工具栏按钮，支持直接输入和下拉选择备选字号
 */
function FontSizeButtonImpl(
  { editor: providedEditor, className, ...props }: FontSizeButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { editor } = useFsdxEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    currentSize,
    setFontSize,
    unsetFontSize,
    canSetFontSize,
    hasFontSize,
  } = useFontSize({ editor });

  const displayText = hasFontSize ? `${currentSize}px` : '字号';

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      setInputValue('');
    }
  }, []);

  const applyFontSize = useCallback(
    (size: string) => {
      setFontSize(size);
      setIsOpen(false);
    },
    [setFontSize],
  );

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const normalized = normalizeFontSize(inputValue);
        if (normalized) {
          applyFontSize(normalized);
        }
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
      }
    },
    [inputValue, applyFontSize],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, '');
      setInputValue(raw);
    },
    [],
  );

  const handlePresetClick = useCallback(
    (size: string) => {
      applyFontSize(size);
    },
    [applyFontSize],
  );

  const handleReset = useCallback(() => {
    unsetFontSize();
    setIsOpen(false);
  }, [unsetFontSize]);

  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          data-active-state={hasFontSize ? 'on' : 'off'}
          role="button"
          tabIndex={-1}
          disabled={!canSetFontSize}
          data-disabled={!canSetFontSize}
          aria-label={`字号：${displayText}`}
          tooltip="字号"
          className={cn(className)}
          {...props}
          ref={ref}
        >
          <span
            className={cn(
              'fsdx-editor-button-text',
              'fsdx-editor-button-text-fixed',
            )}
          >
            {displayText}
          </span>
          <ChevronDownIcon className="fsdx-editor-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="font-size-dropdown-content">
        <div
          className="font-size-input-wrapper"
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            placeholder="输入字号"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="font-size-input"
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>备选字号</DropdownMenuLabel>
          {FONT_SIZE_PRESETS.map((size) => (
            <button
              key={size}
              type="button"
              className={cn('font-size-preset-item', {
                'font-size-preset-item--active': currentSize === size,
              })}
              onClick={() => handlePresetClick(size)}
              tabIndex={-1}
            >
              {size}px
            </button>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <button
            type="button"
            className={cn('font-size-preset-item', {
              'font-size-preset-item--active': !hasFontSize,
            })}
            onClick={handleReset}
            tabIndex={-1}
          >
            默认
          </button>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const FontSizeButton = forwardRef(FontSizeButtonImpl);
FontSizeButton.displayName = 'FontSizeButton';
export default FontSizeButton;
