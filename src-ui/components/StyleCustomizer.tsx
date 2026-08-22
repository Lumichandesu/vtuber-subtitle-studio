import React from 'react';
import { Palette, Type, Sliders, Layout, Sparkles, Clock } from 'lucide-react';
import type { StyleConfig } from '../../src-server/types/schema';
import { useLocalFonts } from '../hooks/useLocalFonts';

interface StyleCustomizerProps {
  style: StyleConfig;
  onChangeStyle: (style: Partial<StyleConfig>) => void;
}

export const StyleCustomizer: React.FC<StyleCustomizerProps> = ({
  style,
  onChangeStyle,
}) => {
  const { fonts, hasLocalAccess } = useLocalFonts();

  return (
    <div className="glass-panel p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 shadow-[0_0_12px_rgba(255,121,198,0.3)]">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-100">OBS Subtitle Styling Studio</h2>
            <p className="text-[11px] text-slate-400">Typography, Dual Stroke, Neon Glow & Layouts</p>
          </div>
        </div>
      </div>

      {/* Typography & Font Picker */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-pink-400" />
            Font Family
          </span>
          <span className="text-[10px] text-slate-400">
            {hasLocalAccess ? '✨ System Fonts Active' : '🌐 Web Fonts'}
          </span>
        </div>

        <select
          value={style.fontFamily}
          onChange={(e) => onChangeStyle({ fontFamily: e.target.value })}
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
        >
          {fonts.map((f) => (
            <option key={f.family} value={f.family}>
              {f.family} ({f.category})
            </option>
          ))}
        </select>

        {/* Font Size Sliders */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Main Font Size</span>
              <span className="font-mono text-pink-400">{style.fontSize}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              value={style.fontSize}
              onChange={(e) => onChangeStyle({ fontSize: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Translation Size</span>
              <span className="font-mono text-cyan-400">{style.translationFontSize}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="50"
              value={style.translationFontSize}
              onChange={(e) => onChangeStyle({ translationFontSize: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Color Palette Grid */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          Color & Neon Glow Palette
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Main Text Color */}
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <label className="text-[10px] text-slate-400 block">Main Text</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={style.textColor}
                onChange={(e) => onChangeStyle({ textColor: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-300">{style.textColor}</span>
            </div>
          </div>

          {/* Thai Translation Color */}
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <label className="text-[10px] text-slate-400 block">Thai Accent</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={style.secondaryTextColor}
                onChange={(e) => onChangeStyle({ secondaryTextColor: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-300">{style.secondaryTextColor}</span>
            </div>
          </div>

          {/* English Translation Color */}
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <label className="text-[10px] text-slate-400 block">English Accent</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={style.thirdTextColor}
                onChange={(e) => onChangeStyle({ thirdTextColor: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-300">{style.thirdTextColor}</span>
            </div>
          </div>

          {/* Glow Color */}
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <label className="text-[10px] text-slate-400 block">Neon Glow</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={style.glowColor}
                onChange={(e) => onChangeStyle({ glowColor: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-300">{style.glowColor}</span>
            </div>
          </div>
        </div>

        {/* Outline & Glow Sliders */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Outline Stroke</span>
              <span className="font-mono text-slate-300">{style.outlineWidth}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={style.outlineWidth}
              onChange={(e) => onChangeStyle({ outlineWidth: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Glow Radius</span>
              <span className="font-mono text-pink-400">{style.glowBlur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={style.glowBlur}
              onChange={(e) => onChangeStyle({ glowBlur: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Layout & Auto-Fade Behavior */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-purple-400" />
          Layout & Alignment
        </span>

        {/* Alignment & Presets */}
        <div className="grid grid-cols-3 gap-2">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              onClick={() => onChangeStyle({ alignment: align })}
              className={`py-1.5 rounded-lg text-xs font-bold capitalize border transition-all ${
                style.alignment === align
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              Align {align}
            </button>
          ))}
        </div>

        {/* Auto-Fade Timer Slider */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              Auto-Fade Timeout
            </span>
            <span className="font-mono text-cyan-400">
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-4 pt-1">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={style.showSourceText}
              onChange={(e) => onChangeStyle({ showSourceText: e.target.checked })}
              className="rounded border-slate-700 text-pink-500 focus:ring-pink-500 bg-slate-900"
            />
            <span>Show Source Line</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={style.showRomaji}
              onChange={(e) => onChangeStyle({ showRomaji: e.target.checked })}
              className="rounded border-slate-700 text-pink-500 focus:ring-pink-500 bg-slate-900"
            />
            <span>Show Romaji Reading</span>
          </label>
        </div>
      </div>
    </div>
  );
};
