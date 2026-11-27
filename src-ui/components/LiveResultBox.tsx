import React, { useState } from 'react';
import { Monitor, Eraser, Send } from 'lucide-react';
import type { StyleConfig, SubtitlePayload } from '../../src-server/types/schema';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { PanelHeader } from './ui';

interface LiveResultBoxProps {
  style: StyleConfig;
  latestSubtitle: SubtitlePayload | null;
  uiLang: UILang;
  onSendManualText: (text: string) => void;
  onClear: () => void;
}

type BgMode = 'transparent' | 'dark' | 'green' | 'webcam';

const QUICK_SAMPLES: Record<UILang, { label: string; text: string }[]> = {
  ja: [
    { label: 'こんにちは', text: '皆さんこんにちは！今日も楽しくゲーム配信していきましょう！' },
    { label: 'ありがとう', text: 'みんな配信に来て応援してくれて本当にありがとう！' },
    { label: '勝った！', text: 'やったー！見事な大勝利です！GG！' },
    { label: '草ｗｗｗ', text: '草ｗｗｗ 面白すぎてお腹痛い' },
  ],
  en: [
    { label: 'Hello everyone', text: "Hello everyone! Welcome to today's livestream, let's have fun!" },
    { label: 'Thank you', text: 'Thank you so much everyone for tuning in and supporting today!' },
    { label: 'We won!', text: 'Yay! We won! What a magnificent victory! GG!' },
    { label: 'LOL', text: "LOL so hilarious, can't stop laughing!" },
  ],
  th: [
    { label: 'สวัสดีทุกคน', text: 'สวัสดีค่าทุกคน! วันนี้มาเล่นเกมกันอย่างสนุกสนานเลยนะ' },
    { label: 'ขอบคุณมากๆ', text: 'ขอบคุณทุกคนมากๆ เลยนะที่แวะมาให้กำลังใจในวันนี้!' },
    { label: 'ชนะแล้ว!', text: 'เย้! ชนะแล้ววว ยอดเยี่ยมมากทุกคน GG!' },
    { label: '55555+', text: '55555+ ขำมากไม่ไหวแล้ว' },
  ],
};

const CANVAS_BG: Record<BgMode, string> = {
  dark: 'bg-[#121014]',
  green: 'bg-[#00b140]',
  webcam: 'bg-[linear-gradient(135deg,#2A3B55_0%,#4A3550_55%,#6B4E3D_100%)]',
  transparent:
    'bg-[#1c1c1c] bg-[linear-gradient(45deg,#2a2a2a_25%,transparent_25%,transparent_75%,#2a2a2a_75%),linear-gradient(45deg,#2a2a2a_25%,transparent_25%,transparent_75%,#2a2a2a_75%)] [background-size:20px_20px] [background-position:0_0,10px_10px]',
};

const outline = (w: number, c: string) => `-${w}px -${w}px 0 ${c}, ${w}px -${w}px 0 ${c}, -${w}px ${w}px 0 ${c}, ${w}px ${w}px 0 ${c}`;

export const LiveResultBox: React.FC<LiveResultBoxProps> = ({
  style,
  latestSubtitle,
  uiLang,
  onSendManualText,
  onClear,
}) => {
  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.th;
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
  const mainShadow = `${outline(ow, oc)}, 0 0 ${style.glowBlur}px ${style.glowColor}`;
  const justify = style.alignment === 'left' ? 'flex-start' : style.alignment === 'right' ? 'flex-end' : 'center';

  const bgModes: { id: BgMode; label: string }[] = [
    { id: 'dark', label: t.bgDark },
    { id: 'green', label: t.bgGreen },
    { id: 'transparent', label: t.bgGrid },
    { id: 'webcam', label: t.bgStreamer },
  ];

  return (
    <section className="panel space-y-4" aria-labelledby="preview-title">
      <PanelHeader id="preview-title" step="4" tone="mint" title={t.step3Title} desc={t.step3Desc}>
        <button type="button" onClick={onClear} className="btn btn-secondary btn-icon" title={t.clearBtn} aria-label={t.clearBtn}>
          <Eraser className="w-4 h-4" aria-hidden="true" />
        </button>
      </PanelHeader>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="field-label" id="bg-label">{t.previewBgLabel}</span>
          <div className="seg" role="group" aria-labelledby="bg-label">
            {bgModes.map((m) => (
              <button key={m.id} type="button" onClick={() => setBgMode(m.id)} aria-pressed={bgMode === m.id} className="seg-btn">
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* OBS canvas simulation */}
        <div
          className={`min-h-[300px] 2xl:min-h-[340px] rounded-2xl border-[1.5px] border-[#231F20] relative overflow-hidden flex flex-col justify-end px-5 pb-5 pt-12 md:px-6 md:pb-6 ${CANVAS_BG[bgMode]}`}
          style={{
            alignItems: justify,
            fontFamily: `"${style.fontFamily}", 'Prompt', 'Outfit', Kanit, sans-serif`,
          }}
          aria-live="polite"
        >
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/55 text-[0.6875rem] text-white pointer-events-none font-sans">
            <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.obsCanvasLabel}</span>
          </div>

          <div
            className="relative max-w-[95%]"
            style={{
              backgroundColor: style.backgroundColor,
              borderRadius: `${style.borderRadius}px`,
              padding: `${style.padding * 1.25}px ${style.padding * 1.8}px`,
              border: `1px solid ${style.glowColor}44`,
              boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 ${style.glowBlur}px ${style.glowColor}33`,
              textAlign: style.alignment,
            }}
          >
            {style.showRomaji && subtitleToRender.romaji && (
              <div className="text-xs font-semibold text-white/80 mb-1.5">{subtitleToRender.romaji}</div>
            )}

            {style.showSourceText && (
              <div
                className="font-extrabold leading-snug mb-3 line-clamp-2"
                style={{ fontSize: `${style.fontSize}px`, color: style.textColor, textShadow: mainShadow }}
              >
                {subtitleToRender.rawText}
                {!subtitleToRender.isFinal && (
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#67A2D8] ml-2 align-middle talk-pulse" aria-hidden="true" />
                )}
              </div>
            )}

            <div className="space-y-2">
              {Object.entries(subtitleToRender.translations || {}).map(([lang, text]) => {
                const color = lang === 'th' ? style.secondaryTextColor : style.thirdTextColor;
                return (
                  <div
                    key={lang}
                    className="flex items-center gap-2 font-bold leading-snug line-clamp-2"
                    style={{
                      fontSize: `${style.translationFontSize}px`,
                      color,
                      textShadow: `${outline(Math.max(2, ow - 1), oc)}, 0 0 ${style.glowBlur}px ${color}88`,
                      justifyContent: justify,
                    }}
                  >
                    <span className="font-mono text-xs font-black opacity-80 px-1.5 py-0.5 rounded bg-black/40 border border-white/20 select-none">
                      [{lang.toUpperCase()}]
                    </span>
                    <span>{text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Manual input: the panel's one primary action */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <label htmlFor="manual-input" className="sr-only">{t.inputPlaceholder}</label>
        <input
          id="manual-input"
          type="text"
          placeholder={t.inputPlaceholder}
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          className="field flex-1 !min-h-[40px]"
        />
        <button type="submit" className="btn btn-primary !min-h-[40px] px-5">
          <Send className="w-4 h-4" aria-hidden="true" />
          <span>{t.broadcastBtn}</span>
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t.quickSamplesLabel}>
        <span className="text-xs text-muted mr-1">{t.quickSamplesLabel}</span>
        {QUICK_SAMPLES[uiLang].map((sample) => (
          <button key={sample.label} type="button" onClick={() => onSendManualText(sample.text)} className="btn btn-secondary btn-sm">
            {sample.label}
          </button>
        ))}
      </div>
    </section>
  );
};
