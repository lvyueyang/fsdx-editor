export interface FilterValues {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
}

interface ImageFilterPanelProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
}

const FILTERS: {
  key: keyof FilterValues;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { key: 'brightness', label: '亮度', min: 0, max: 200, step: 1, unit: '%' },
  { key: 'contrast', label: '对比度', min: 0, max: 200, step: 1, unit: '%' },
  { key: 'saturation', label: '饱和度', min: 0, max: 200, step: 1, unit: '%' },
  { key: 'blur', label: '模糊', min: 0, max: 20, step: 0.1, unit: 'px' },
  { key: 'grayscale', label: '灰度', min: 0, max: 100, step: 1, unit: '%' },
  { key: 'sepia', label: '棕褐色', min: 0, max: 100, step: 1, unit: '%' },
];

export function ImageFilterPanel({ values, onChange }: ImageFilterPanelProps) {
  return (
    <div className="tiptap-image-filter-panel">
      {FILTERS.map(({ key, label, min, max, step, unit }) => (
        <div key={key} className="tiptap-image-filter-row">
          <label
            htmlFor={`filter-${key}`}
            className="tiptap-image-filter-label"
          >
            {label}
          </label>
          <input
            id={`filter-${key}`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={values[key]}
            onChange={(e) =>
              onChange({ ...values, [key]: Number(e.target.value) })
            }
            className="tiptap-image-filter-slider"
          />
          <span className="tiptap-image-filter-value">
            {values[key]}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
