import React from 'react';
import { Palette, Type, Sparkles, Clock } from 'lucide-react';
import type { StyleConfig, StylePreset } from '../../src-server/types/schema';
import { useLocalFonts } from '../hooks/useLocalFonts';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface AnimeFontCustomizerProps {
  style: StyleConfig;
  presets: StylePreset[];
  uiLang: UILang;
  onChangeStyle: (style: Partial<StyleConfig>) => void;
  onApplyPreset: (id: string) => void;
}

export const AnimeFontCustomizer: React.FC<AnimeFontCustomizerProps> = ({
  style,
  presets,
  uiLang,
  onChangeStyle,
  onApplyPreset,
}) => {
  const t = UI_TRANSLATIONS[uiLang];
  const { fonts, activeCategory, setActiveCategory, loadFontToDocument } = useLocalFonts();

  const handleFontChange = (fontFamily: string) => {
    loadFontToDocument(fontFamily);
    onChangeStyle({ fontFamily });
  };

  return (
    <div className="glass-panel p-4 space-y-4">
      {/* 1. Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[var(--btn-secondary-bg)] text-[var(--text-main)]">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm md:text-base text-[var(--text-main)]">
              {t.step2Title}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              {t.step2Desc}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Theme Presets Strip */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[var(--text-main)]" />
          <span>{t.presetsLabel}</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {presets.map((p) => {
            const isActive = style.presetName === p.name;
            return (
              <button
                key={p.id}
                onClick={() => onApplyPreset(p.id)}
                className={`px-2.5 py-1.5 rounded-lg border text-left text-xs font-bold transition-all truncate ${
                  isActive
                    ? 'border-[var(--text-main)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-black shadow-md'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-muted)] hover:border-[var(--border-active)] hover:text-[var(--text-main)]'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Font Family Selector (Local + Online) */}
      <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[var(--text-main)]" />
            <span>{t.fontPickerLabel}</span>
          </label>

          {/* Font Category Filter Tabs */}
          <div className="flex items-center gap-1 bg-[var(--bg-input)] p-0.5 rounded-lg border border-[var(--border-subtle)] text-[10px]">
            {[
              { id: 'all', label: t.fontCatAll },
              { id: 'japanese', label: t.fontCatJp },
              { id: 'thai', label: t.fontCatTh },
              { id: 'english', label: t.fontCatEn },
              { id: 'system', label: t.fontCatLocal },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2 py-0.5 rounded font-bold transition-colors ${
                  activeCategory === cat.id ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Select Dropdown */}
        <select
          value={style.fontFamily}
          onChange={(e) => handleFontChange(e.target.value)}
          className="w-full rounded-lg px-3 py-1.5 text-xs focus:outline-none font-bold"
        >
          {fonts.map((f) => (
            <option key={f.family} value={f.family}>
              {f.isLocal ? '💻 [Windows Local] ' : '🌐 [Google Font] '}
              {f.family} ({f.category})
            </option>
          ))}
        </select>
      </div>

      {/* 4. Font Sizes & Outlines */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {/* Main Size */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[var(--text-muted)]">{t.mainFontSize}</span>
            <span className="font-mono text-[var(--text-main)] font-bold">{style.fontSize}px</span>
          </div>
          <input
            type="range"
            min="20"
            max="60"
            value={style.fontSize}
            onChange={(e) => onChangeStyle({ fontSize: parseInt(e.target.value, 10) })}
            className="w-full h-1 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Trans Size */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[var(--text-muted)]">{t.transFontSize}</span>
            <span className="font-mono text-[var(--text-main)] font-bold">{style.translationFontSize}px</span>
          </div>
          <input
            type="range"
            min="16"
            max="50"
            value={style.translationFontSize}
            onChange={(e) => onChangeStyle({ translationFontSize: parseInt(e.target.value, 10) })}
            className="w-full h-1 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Stroke Outline */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[var(--text-muted)]">{t.strokeWidth}</span>
            <span className="font-mono text-[var(--text-main)] font-bold">{style.outlineWidth}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="8"
            value={style.outlineWidth}
            onChange={(e) => onChangeStyle({ outlineWidth: parseInt(e.target.value, 10) })}
            className="w-full h-1 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Neon Glow */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[var(--text-muted)]">{t.glowBlur}</span>
            <span className="font-mono text-[var(--text-main)] font-bold">{style.glowBlur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            value={style.glowBlur}
            onChange={(e) => onChangeStyle({ glowBlur: parseInt(e.target.value, 10) })}
            className="w-full h-1 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* 5. Color Swatches */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {/* Main Text Color */}
        <div className="p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-1">
          <label className="text-[10px] text-[var(--text-muted)] block font-semibold">{t.colorMain}</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={style.textColor}
              onChange={(e) => onChangeStyle({ textColor: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-[10px] font-mono text-[var(--text-main)]">{style.textColor}</span>
          </div>
        </div>

        {/* Thai Accent */}
        <div className="p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-1">
          <label className="text-[10px] text-[var(--text-muted)] block font-semibold">{t.colorTh}</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={style.secondaryTextColor}
              onChange={(e) => onChangeStyle({ secondaryTextColor: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-[10px] font-mono text-[var(--text-main)]">{style.secondaryTextColor}</span>
          </div>
        </div>

        {/* English Accent */}
        <div className="p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-1">
          <label className="text-[10px] text-[var(--text-muted)] block font-semibold">{t.colorEn}</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={style.thirdTextColor}
              onChange={(e) => onChangeStyle({ thirdTextColor: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-[10px] font-mono text-[var(--text-main)]">{style.thirdTextColor}</span>
          </div>
        </div>

        {/* Glow Color */}
        <div className="p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-1">
          <label className="text-[10px] text-[var(--text-muted)] block font-semibold">{t.colorGlow}</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={style.glowColor}
              onChange={(e) => onChangeStyle({ glowColor: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-[10px] font-mono text-[var(--text-main)]">{style.glowColor}</span>
          </div>
        </div>
      </div>

      {/* 6. Layout & Auto-Fade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[var(--border-subtle)]">
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[var(--text-muted)] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[var(--text-main)]" />
              {t.autoFade}
            </span>
            <span className="font-mono text-[var(--text-main)] font-bold">
              {style.autoFadeSeconds === 0 ? 'Persistent' : `${style.autoFadeSeconds}s`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="1"
            value={style.autoFadeSeconds}
            onChange={(e) => onChangeStyle({ autoFadeSeconds: parseInt(e.target.value, 10) })}
            className="w-full h-1 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-4 pt-3">
          <label className="flex items-center gap-2 text-xs text-[var(--text-main)] cursor-pointer">
            <input
              type="checkbox"
              checked={style.showSourceText}
              onChange={(e) => onChangeStyle({ showSourceText: e.target.checked })}
              className="rounded border-[var(--border-subtle)]"
            />
            <span>{t.showSource}</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-[var(--text-main)] cursor-pointer">
            <input
              type="checkbox"
              checked={style.showRomaji}
              onChange={(e) => onChangeStyle({ showRomaji: e.target.checked })}
              className="rounded border-[var(--border-subtle)]"
            />
            <span>{t.showRomaji}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
