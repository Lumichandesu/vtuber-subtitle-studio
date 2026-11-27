import React, { useEffect } from 'react';
import type { StyleConfig, StylePreset } from '../../src-server/types/schema';
import { useLocalFonts } from '../hooks/useLocalFonts';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { PanelHeader } from './ui';

interface AnimeFontCustomizerProps {
  style: StyleConfig;
  presets: StylePreset[];
  uiLang: UILang;
  onChangeStyle: (style: Partial<StyleConfig>) => void;
  onApplyPreset: (id: string) => void;
}

/** Preset names from the server start with an emoji; the studio shows the plain name. */
const cleanPresetName = (name: string) => name.replace(/^[^\p{L}\p{N}]+/u, '').trim() || name;

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  display: string;
  onChange: (v: number) => void;
}

const Slider: React.FC<SliderProps> = ({ id, label, value, min, max, display, onChange }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between gap-2 text-xs">
      <label htmlFor={id} className="text-ink">{label}</label>
      <span className="font-medium text-ink tabular-nums">{display}</span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={1}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
      className="range"
    />
  </div>
);

interface SwatchProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}

const Swatch: React.FC<SwatchProps> = ({ id, label, value, onChange }) => (
  <label htmlFor={id} className="flex items-center gap-2.5 p-2 rounded-xl bg-surface border border-line cursor-pointer hover:border-line-strong min-w-0">
    <input
      id={id}
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-8 h-8 shrink-0 rounded-lg cursor-pointer border border-line-strong bg-transparent p-0.5"
    />
    <span className="min-w-0">
      <span className="block text-xs text-ink truncate">{label}</span>
      <span className="block text-[0.6875rem] font-mono text-muted uppercase">{value}</span>
    </span>
  </label>
);

export const AnimeFontCustomizer: React.FC<AnimeFontCustomizerProps> = ({
  style,
  presets,
  uiLang,
  onChangeStyle,
  onApplyPreset,
}) => {
  const t = UI_TRANSLATIONS[uiLang];
  const { fonts, activeCategory, setActiveCategory, loadFontToDocument } = useLocalFonts();

  // The studio chrome uses bundled Kanit; the subtitle font is loaded on demand so the preview matches OBS.
  useEffect(() => {
    if (style.fontFamily) loadFontToDocument(style.fontFamily);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style.fontFamily]);

  const handleFontChange = (fontFamily: string) => {
    loadFontToDocument(fontFamily);
    onChangeStyle({ fontFamily });
  };

  const categories = [
    { id: 'all', label: t.fontCatAll },
    { id: 'japanese', label: t.fontCatJp },
    { id: 'thai', label: t.fontCatTh },
    { id: 'english', label: t.fontCatEn },
    { id: 'system', label: t.fontCatLocal },
  ];

  return (
    <section className="panel space-y-4" aria-labelledby="style-title">
      <PanelHeader id="style-title" step="3" tone="sand" title={t.step2Title} desc={t.step2Desc} />

      {/* Presets */}
      <div className="space-y-1.5" role="group" aria-labelledby="preset-label">
        <span id="preset-label" className="field-label block">{t.presetsLabel}</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onApplyPreset(p.id)}
              aria-pressed={style.presetName === p.name}
              className="tile !py-2 flex items-center gap-2"
              title={cleanPresetName(p.name)}
            >
              <span className="check-dot" aria-hidden="true" />
              <span className="tile-title truncate">{cleanPresetName(p.name)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="font-select" className="field-label">{t.fontPickerLabel}</label>
          <div className="seg" role="group" aria-label={t.fontPickerLabel}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
                className="seg-btn !min-h-[24px] !px-2"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <select
          id="font-select"
          value={style.fontFamily}
          onChange={(e) => handleFontChange(e.target.value)}
          className="field"
          style={{ fontFamily: `"${style.fontFamily}", Kanit, sans-serif` }}
        >
          {fonts.map((f) => (
            <option key={f.family} value={f.family}>
              {f.family} ({f.isLocal ? t.fontSourceLocal : t.fontSourceOnline}, {f.category})
            </option>
          ))}
        </select>
      </div>

      {/* Size and outline */}
      <div className="box space-y-3">
        <span className="box-title">{t.sizeGroupLabel}</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
          <Slider id="s-main" label={t.mainFontSize} value={style.fontSize} min={20} max={60} display={`${style.fontSize}px`} onChange={(v) => onChangeStyle({ fontSize: v })} />
          <Slider id="s-trans" label={t.transFontSize} value={style.translationFontSize} min={16} max={50} display={`${style.translationFontSize}px`} onChange={(v) => onChangeStyle({ translationFontSize: v })} />
          <Slider id="s-stroke" label={t.strokeWidth} value={style.outlineWidth} min={0} max={8} display={`${style.outlineWidth}px`} onChange={(v) => onChangeStyle({ outlineWidth: v })} />
          <Slider id="s-glow" label={t.glowBlur} value={style.glowBlur} min={0} max={30} display={`${style.glowBlur}px`} onChange={(v) => onChangeStyle({ glowBlur: v })} />
        </div>
      </div>

      {/* Colours */}
      <div className="box space-y-2.5">
        <span className="box-title">{t.colorGroupLabel}</span>
        <div className="grid grid-cols-2 gap-2">
          <Swatch id="c-main" label={t.colorMain} value={style.textColor} onChange={(v) => onChangeStyle({ textColor: v })} />
          <Swatch id="c-th" label={t.colorTh} value={style.secondaryTextColor} onChange={(v) => onChangeStyle({ secondaryTextColor: v })} />
          <Swatch id="c-en" label={t.colorEn} value={style.thirdTextColor} onChange={(v) => onChangeStyle({ thirdTextColor: v })} />
          <Swatch id="c-glow" label={t.colorGlow} value={style.glowColor} onChange={(v) => onChangeStyle({ glowColor: v })} />
        </div>
      </div>

      {/* Display behaviour */}
      <div className="box space-y-3">
        <span className="box-title">{t.displayGroupLabel}</span>
        <Slider
          id="s-fade"
          label={t.autoFade}
          value={style.autoFadeSeconds}
          min={0}
          max={15}
          display={style.autoFadeSeconds === 0 ? t.persistent : `${style.autoFadeSeconds}s`}
          onChange={(v) => onChangeStyle({ autoFadeSeconds: v })}
        />
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              className="check"
              checked={style.showSourceText}
              onChange={(e) => onChangeStyle({ showSourceText: e.target.checked })}
            />
            <span>{t.showSource}</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              className="check"
              checked={style.showRomaji}
              onChange={(e) => onChangeStyle({ showRomaji: e.target.checked })}
            />
            <span>{t.showRomaji}</span>
          </label>
        </div>
      </div>
    </section>
  );
};
