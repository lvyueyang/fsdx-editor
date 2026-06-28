import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tooltip } from '../../components/ui/tooltip';
import { useFsdxEditor } from '../../hooks/use-fsdx-editor';
import { IndentIcon } from '../../icons/indent-icon';

import type { UseIndentConfig } from './use-indent';
import { useIndent } from './use-indent';

import './indent-toggle.scss';

export interface IndentToggleProps extends UseIndentConfig {
  /** 无缩进时输入框显示的默认值 */
  defaultInputValue?: number;
  hideWhenUnavailable?: boolean;
}

const INDENT_LABEL_TOGGLE_ON = '增加缩进';
const INDENT_LABEL_TOGGLE_OFF = '取消缩进';

export const IndentToggle = forwardRef<HTMLDivElement, IndentToggleProps>(
  (
    {
      editor: providedEditor,
      defaultStep = 2,
      defaultInputValue = 2,
      hideWhenUnavailable = false,
    },
    ref,
  ) => {
    const { editor } = useFsdxEditor(providedEditor);
    const {
      isVisible,
      isActive,
      currentIndent,
      handleToggle,
      handleSetIndent,
    } = useIndent({ editor, defaultStep, hideWhenUnavailable });

    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>(
      String(defaultInputValue),
    );
    const isEditing = useRef(false);

    // 非编辑状态时同步外部缩进值到输入框
    useEffect(() => {
      if (!isEditing.current) {
        if (currentIndent > 0) {
          setInputValue(String(currentIndent));
        } else {
          setInputValue(String(defaultInputValue));
        }
      }
    }, [currentIndent, defaultInputValue]);

    const applyInputValue = useCallback(() => {
      const parsed = Number.parseFloat(inputValue);
      if (Number.isNaN(parsed) || parsed <= 0) {
        handleSetIndent(0);
        setInputValue(String(defaultInputValue));
      } else {
        handleSetIndent(parsed);
      }
    }, [inputValue, defaultInputValue, handleSetIndent]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
      },
      [],
    );

    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          isEditing.current = false;
          applyInputValue();
          inputRef.current?.blur();
        }
        if (e.key === 'Escape') {
          isEditing.current = false;
          if (currentIndent > 0) {
            setInputValue(String(currentIndent));
          } else {
            setInputValue(String(defaultInputValue));
          }
          inputRef.current?.blur();
        }
      },
      [applyInputValue, currentIndent, defaultInputValue],
    );

    const handleInputFocus = useCallback(() => {
      isEditing.current = true;
      inputRef.current?.select();
    }, []);

    const handleInputBlur = useCallback(() => {
      isEditing.current = false;
      applyInputValue();
    }, [applyInputValue]);

    if (!isVisible) {
      return null;
    }

    return (
      <span className="fsdx-editor-indent-group" ref={ref}>
        <Tooltip
          title={isActive ? INDENT_LABEL_TOGGLE_OFF : INDENT_LABEL_TOGGLE_ON}
        >
          <Button
            type="button"
            variant="ghost"
            data-active-state={isActive ? 'on' : 'off'}
            aria-label={
              isActive ? INDENT_LABEL_TOGGLE_OFF : INDENT_LABEL_TOGGLE_ON
            }
            aria-pressed={isActive}
            onClick={handleToggle}
          >
            <IndentIcon className="fsdx-editor-button-icon" />
          </Button>
        </Tooltip>
        <Input
          ref={inputRef}
          className="fsdx-editor-indent-input"
          type="number"
          step="0.5"
          min="0"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          aria-label="缩进值"
        />
      </span>
    );
  },
);

IndentToggle.displayName = 'IndentToggle';
