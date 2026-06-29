import type { Editor } from '@tiptap/react';
import {
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import type { ButtonProps } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Input } from '../../components/ui/input';
import { Toolbar } from '../../components/ui/toolbar';
import { cn } from '../../core/editor-utils';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import {
  LINE_HEIGHT_PRESETS,
  normalizeLineHeight,
  useLineHeight,
} from './use-line-height';

import './line-height-button.scss';

export interface LineHeightButtonProps extends Omit<ButtonProps, 'type'> {
  editor?: Editor | null;
}

function LineHeightButtonImpl(
  { editor: providedEditor, className, ...props }: LineHeightButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { editor } = useFsdxEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    currentLineHeight,
    setLineHeight,
    unsetLineHeight,
    canSetLineHeight,
    hasLineHeight,
  } = useLineHeight({ editor });

  const displayText = hasLineHeight ? `${currentLineHeight}` : '行高';

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      setInputValue('');
    }
  }, []);

  const applyLineHeight = useCallback(
    (lineHeight: string) => {
      setLineHeight(lineHeight);
      setIsOpen(false);
    },
    [setLineHeight],
  );

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const normalized = normalizeLineHeight(inputValue);
        if (normalized) {
          applyLineHeight(normalized);
        }
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
      }
    },
    [inputValue, applyLineHeight],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, '');
      setInputValue(raw);
    },
    [],
  );

  const handlePresetClick = useCallback(
    (lineHeight: string) => {
      applyLineHeight(lineHeight);
    },
    [applyLineHeight],
  );

  const handleReset = useCallback(() => {
    unsetLineHeight();
    setIsOpen(false);
  }, [unsetLineHeight]);

  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Toolbar.Select
          label="行高"
          displayText={displayText}
          active={hasLineHeight}
          disabled={!canSetLineHeight}
          data-disabled={!canSetLineHeight}
          aria-label={`行高：${displayText}`}
          className={cn(className)}
          {...props}
          ref={ref}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="line-height-dropdown-content"
      >
        <div
          className="line-height-input-wrapper"
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            placeholder="输入行高"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="line-height-input"
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>备选行高</DropdownMenuLabel>
          {LINE_HEIGHT_PRESETS.map((lh) => (
            <button
              key={lh}
              type="button"
              className={cn('line-height-preset-item', {
                'line-height-preset-item--active': currentLineHeight === lh,
              })}
              onClick={() => handlePresetClick(lh)}
              tabIndex={-1}
            >
              {lh}
            </button>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <button
            type="button"
            className={cn('line-height-preset-item', {
              'line-height-preset-item--active': !hasLineHeight,
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

export const LineHeightButton = forwardRef(LineHeightButtonImpl);
LineHeightButton.displayName = 'LineHeightButton';
export default LineHeightButton;
