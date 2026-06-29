import { Input } from '@fsdx/editor-react';
import { useCallback } from 'react';

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPickerField({
  label,
  value,
  onChange,
}: ColorPickerFieldProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const colorPickerValue = value.startsWith('#') ? value : '#000000';

  return (
    <div className="theme-color-field">
      <span className="theme-color-field-label">{label}</span>
      <div className="theme-color-field-inputs">
        <input
          type="color"
          className="theme-color-picker"
          value={colorPickerValue}
          onChange={handleChange}
        />
        <Input
          type="text"
          className="theme-color-text"
          value={value}
          onChange={handleChange}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
