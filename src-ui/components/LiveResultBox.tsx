import React, { useState } from 'react';
import { Tv, Monitor, Trash2, Send } from 'lucide-react';
import type { StyleConfig, SubtitlePayload } from '../../src-server/types/schema';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface LiveResultBoxProps {
  style: StyleConfig;
  latestSubtitle: SubtitlePayload | null;
  uiLang: UILang;
  onSendManualText: (text: string) => void;
  onClear: () => void;
}

type BgMode = 'transparent' | 'dark' | 'green' | 'webcam';

export const LiveResultBox: React.FC<LiveResultBoxProps> = ({
  style,
  latestSubtitle,
  uiLang,
  onSendManualText,
  onClear,
}) => {
  const t = UI_TRANSLATIONS[uiLang];
  const [bgMode, setBgMode] = useState<BgMode>('dark');
  const [manualInput, setManualInput] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    onSendManualText(manualInput.trim());
    setManualInput('');
  };

  const subtitleToRender = latestSubtitle || {
    id: 'demo',
    timestamp: Date.now(),
    sourceLang: 'th',
    targetLangs: ['ja', 'en'],
    rawText: 'สวัสดีค่าทุกคน! ขอบคุณที่แวะมาดูสตรีมวันนี้นะคะ!',
    translations: {
      ja: '皆さん、こんにちは！今日も配信見に来てくれてありがとう！',
      en: 'Hello everyone! Thanks for coming to my livestream today!',
    },
    romaji: 'Konnichiwa! Kyou mo haishin mini kite kurete arigatou!',
    isFinal: true,
  };

  const ow = style.outlineWidth;
  const oc = style.outlineColor;
  const gc = style.glowColor;
  const gb = style.glowBlur;

  const mainShadow = `
    -${ow}px -${ow}px 0 ${oc},
     ${ow}px -${ow}px 0 ${oc},
    -${ow}px  ${ow}px 0 ${oc},
     ${ow}px  ${ow}px 0 ${oc},
     0 0 ${gb}px ${gc}
  `;

  return (
    <div className="glass-panel p-4 space-y-3.5 flex flex-col">
      {/* 1. Step Header & Background Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[var(--btn-secondary-bg)] text-[var(--text-main)]">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm md:text-base text-[var(--text-main)]">
              {t.step3Title}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              {t.step3Desc}
            </p>
          </div>
        </div>

        {/* Background Toggles & Clear */}
        <div className="flex items-center gap-1.5">
          <div className="bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-subtle)] flex items-center gap-0.5 text-xs">
            <button
              onClick={() => setBgMode('dark')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                bgMode === 'dark' ? 'bg-[var(--text-main)] text-[var(--bg-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setBgMode('green')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                bgMode === 'green' ? 'bg-emerald-600 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Green
            </button>
            <button
              onClick={() => setBgMode('transparent')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                bgMode === 'transparent' ? 'bg-[var(--text-main)] text-[var(--bg-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setBgMode('webcam')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                bgMode === 'webcam' ? 'bg-[var(--text-main)] text-[var(--bg-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Streamer
            </button>
          </div>

          <button
            onClick={onClear}
            className="p-1.5 rounded-lg bg-[var(--btn-secondary-bg)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-400 transition-all"
            title={t.clearBtn}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Preview Viewport Canvas (Enlarged Height: min-h-[380px]) */}
      <div
        className={`min-h-[380px] rounded-xl border border-[var(--border-subtle)] relative overflow-hidden flex flex-col justify-end p-6 md:p-8 transition-all shadow-inner ${
          bgMode === 'dark'
            ? 'bg-[#050505]'
            : bgMode === 'green'
            ? 'bg-[#00b140]'
            : bgMode === 'webcam'
            ? 'bg-gradient-to-tr from-[#111111] via-[#0a0a0a] to-[#1c1c1c]'
            : 'bg-[radial-gradient(#333333_1px,transparent_1px)] [background-size:16px_16px] bg-[#000000]'
        }`}
        style={{
          alignItems: style.alignment === 'left' ? 'flex-start' : style.alignment === 'right' ? 'flex-end' : 'center',
          fontFamily: `"${style.fontFamily}", 'Prompt', 'Outfit', sans-serif`,
        }}
      >
        {/* Watermark */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/80 text-[10px] font-mono text-[#8e8e93] backdrop-blur-md pointer-events-none border border-white/10">
          <Monitor className="w-3.5 h-3.5 text-white" />
          <span>OBS CANVAS (1920x1080)</span>
        </div>

        {/* Subtitle Card (Spacious Card Layout) */}
        <div
          className="relative max-w-[95%] transition-all duration-200"
          style={{
            backgroundColor: style.backgroundColor,
            borderRadius: `${style.borderRadius}px`,
            padding: `${style.padding * 1.25}px ${style.padding * 1.8}px`,
            border: `1px solid ${style.glowColor}44`,
            boxShadow: `0 12px 40px rgba(0,0,0,0.85), 0 0 ${style.glowBlur}px ${style.glowColor}33`,
            textAlign: style.alignment,
          }}
        >
          {/* Romaji */}
          {style.showRomaji && subtitleToRender.romaji && (
            <div className="text-xs font-semibold text-white/80 mb-1.5">
              {subtitleToRender.romaji}
            </div>
          )}

          {/* Source Line */}
          {style.showSourceText && (
            <div
              className="font-extrabold leading-snug mb-3 line-clamp-2"
              style={{
                fontSize: `${style.fontSize}px`,
                color: style.textColor,
                textShadow: mainShadow,
              }}
            >
              {subtitleToRender.rawText}
              {!subtitleToRender.isFinal && (
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 ml-2 animate-ping" />
              )}
            </div>
          )}

          {/* Simultaneous Translations with Clean [TH], [JP], [EN] Language Tags */}
          <div className="space-y-2">
            {Object.entries(subtitleToRender.translations || {}).map(([lang, text]) => {
              const transShadow = `
                -${Math.max(2, ow - 1)}px -${Math.max(2, ow - 1)}px 0 ${oc},
                 ${Math.max(2, ow - 1)}px -${Math.max(2, ow - 1)}px 0 ${oc},
                -${Math.max(2, ow - 1)}px  ${Math.max(2, ow - 1)}px 0 ${oc},
                 ${Math.max(2, ow - 1)}px  ${Math.max(2, ow - 1)}px 0 ${oc},
                 0 0 ${style.glowBlur}px ${lang === 'th' ? style.secondaryTextColor : style.thirdTextColor}88
              `;

              const langTag = lang.toUpperCase();

              return (
                <div
                  key={lang}
                  className="flex items-center gap-2 font-bold leading-snug line-clamp-2"
                  style={{
                    fontSize: `${style.translationFontSize}px`,
                    color: lang === 'th' ? style.secondaryTextColor : style.thirdTextColor,
                    textShadow: transShadow,
                    justifyContent: style.alignment === 'left' ? 'flex-start' : style.alignment === 'right' ? 'flex-end' : 'center',
                  }}
                >
                  <span className="font-mono text-xs font-black opacity-80 px-1.5 py-0.5 rounded bg-black/40 border border-white/20 select-none">
                    [{langTag}]
                  </span>
                  <span>{text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Manual Input Bar & Quick Phrase Clickers */}
      <div className="space-y-2 pt-1">
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder={t.inputPlaceholder}
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="flex-1 rounded-lg px-3 py-2 text-xs focus:outline-none font-medium"
          />
          <button
            type="submit"
            className="btn-white px-4 py-2 flex items-center gap-1.5 text-xs font-bold"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.broadcastBtn}</span>
          </button>
        </form>

        {/* Quick Sample Clickers */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: '🌸 สวัสดี/こんにちは', text: 'สวัสดีค่าทุกคน! วันนี้มาเล่นเกมกันอย่างสนุกสนานเลยนะ' },
            { label: '🙏 ขอบคุณ', text: 'ขอบคุณทุกคนมากๆ เลยนะที่แวะมาให้กำลังใจในวันนี้!' },
            { label: '🎉 We Won!', text: 'やったー！勝った！Let\'s go victory!' },
            { label: '🤣 555+ (草)', text: '草ｗｗｗ 55555+ ขำมากไม่ไหวแล้ว' },
          ].map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendManualText(sample.text)}
              className="px-2.5 py-1 rounded bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] text-[10px] text-[var(--text-main)] font-semibold transition-all"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
