import { useCallback, useEffect, useMemo, useState } from 'react';
import type { EditorTheme } from '../../src/core/editor';
import { ColorPickerField } from '../components/color-picker-field';
import { DemoEditor } from '../components/demo-editor';
import { initialContent } from '../initial-content';
import {
  buildStyleText,
  generateBrandShades,
  getAllTokenDefaults,
  type Preset,
  presets,
  type TokenDef,
  type TokenGroup,
  tokenGroups,
} from '../shared/token-groups';

const STORAGE_KEY = 'fsdx-theme-config-values';
const OVERRIDE_STYLE_ID = 'fsdx-theme-override';

function loadStoredValues(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, string>;
  } catch {
    // ignore parse errors
  }
  return {};
}

function saveStoredValues(values: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
}

function applyOverrideStyle(values: Record<string, string>) {
  let el = document.getElementById(
    OVERRIDE_STYLE_ID,
  ) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = OVERRIDE_STYLE_ID;
    document.head.appendChild(el);
  }
  const css = buildStyleText(values);
  el.textContent = css;
}

function removeOverrideStyle() {
  const el = document.getElementById(OVERRIDE_STYLE_ID);
  if (el) el.remove();
}

export function ThemeConfig() {
  const [html] = useState(initialContent);
  const [previewTheme, setPreviewTheme] = useState<EditorTheme>('light');
  const [values, setValues] = useState<Record<string, string>>(() => {
    const stored = loadStoredValues();
    const defaults = getAllTokenDefaults();
    return { ...defaults, ...stored };
  });
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    return new Set(tokenGroups.map((g) => g.label));
  });
  useEffect(() => {
    applyOverrideStyle(values);
    return () => removeOverrideStyle();
  }, [values]);

  const handleValueChange = useCallback((name: string, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      saveStoredValues(next);
      return next;
    });
  }, []);

  const handleBrandGenerate = useCallback((baseHex: string) => {
    const shades = generateBrandShades(baseHex);
    setValues((prev) => {
      const next = { ...prev, ...shades };
      saveStoredValues(next);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setValues(getAllTokenDefaults());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleDownload = useCallback(() => {
    const css = buildStyleText(values);
    const blob = new Blob([css], { type: 'text/css;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fsdx-editor-theme.css';
    a.click();
    URL.revokeObjectURL(url);
  }, [values]);

  const handlePreset = useCallback((preset: Preset) => {
    const defaults = getAllTokenDefaults();
    const next = { ...defaults, ...preset.tokens };
    setValues(next);
    saveStoredValues(next);
  }, []);

  const handleToggleGroup = useCallback((label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }, []);

  const hasChanges = useMemo(() => {
    const defaults = getAllTokenDefaults();
    return Object.keys(values).some((k) => values[k] !== defaults[k]);
  }, [values]);

  const renderField = useCallback(
    (token: TokenDef) => {
      switch (token.type) {
        case 'color':
          return (
            <ColorPickerField
              key={token.name}
              label={token.label}
              value={values[token.name] ?? token.defaultValue}
              onChange={(v) => handleValueChange(token.name, v)}
            />
          );
        case 'rem': {
          const rawValue = values[token.name] ?? token.defaultValue;
          const numValue = Number.parseFloat(rawValue) || 0;
          return (
            <div key={token.name} className="theme-rem-field">
              <span className="theme-rem-field-label">{token.label}</span>
              <div className="theme-rem-field-inputs">
                <input
                  type="range"
                  className="theme-slider"
                  min={token.min ?? 0}
                  max={token.max ?? 2}
                  step={token.step ?? 0.0625}
                  value={numValue}
                  onChange={(e) =>
                    handleValueChange(
                      token.name,
                      `${Number.parseFloat(e.target.value)}rem`,
                    )
                  }
                />
                <span className="theme-rem-value">{rawValue}</span>
              </div>
            </div>
          );
        }
        default:
          return (
            <div key={token.name} className="theme-text-field">
              <span className="theme-text-field-label">{token.label}</span>
              <input
                type="text"
                className="theme-text-input"
                value={values[token.name] ?? token.defaultValue}
                onChange={(e) => handleValueChange(token.name, e.target.value)}
                spellCheck={false}
              />
            </div>
          );
      }
    },
    [values, handleValueChange],
  );

  return (
    <div className="theme-config-page">
      <div className="theme-config-toolbar">
        <div className="theme-config-toolbar-left">
          <span className="theme-config-toolbar-title">主题配置</span>
          <div className="theme-config-preview-theme">
            <span className="theme-config-preview-label">预览模式：</span>
            {(['light', 'dark'] as EditorTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                className={`demo-theme-toggle-btn${previewTheme === t ? ' demo-theme-toggle-btn--active' : ''}`}
                onClick={() => setPreviewTheme(t)}
              >
                {t === 'light' ? '浅色' : '深色'}
              </button>
            ))}
          </div>
        </div>
        <div className="theme-config-toolbar-right">
          {hasChanges && (
            <button
              type="button"
              className="demo-btn demo-btn-ghost"
              onClick={handleReset}
            >
              重置默认
            </button>
          )}
          <button
            type="button"
            className="demo-btn demo-btn-primary"
            onClick={handleDownload}
          >
            下载 CSS
          </button>
        </div>
      </div>

      <div className="theme-config-body">
        <div className="theme-config-panel">
          {tokenGroups.map((group: TokenGroup) => {
            const isExpanded = expandedGroups.has(group.label);
            return (
              <div key={group.label} className="theme-group">
                <button
                  type="button"
                  className="theme-group-header"
                  onClick={() => handleToggleGroup(group.label)}
                >
                  <span
                    className={`theme-group-arrow${isExpanded ? ' theme-group-arrow--open' : ''}`}
                  >
                    ▸
                  </span>
                  <span className="theme-group-title">{group.label}</span>
                  <span className="theme-group-count">
                    {group.tokens.length}
                  </span>
                </button>
                {isExpanded && (
                  <div className="theme-group-body">
                    {group.label === '品牌色' && (
                      <div className="theme-brand-generator">
                        <ColorPickerField
                          label="主色"
                          value={values['--fsdx-editor-brand-500'] ?? '#6229fd'}
                          onChange={handleBrandGenerate}
                        />
                      </div>
                    )}
                    {group.tokens.map((token) => renderField(token))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="theme-config-preview">
          <DemoEditor html={html} onChange={() => {}} theme={previewTheme} />
        </div>
      </div>

      <div className="theme-config-presets">
        <span className="theme-config-presets-label">预设主题：</span>
        {presets.map((preset: Preset) => (
          <button
            key={preset.name}
            type="button"
            className="demo-btn demo-btn-preset"
            title={preset.description}
            onClick={() => handlePreset(preset)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
