import React, { useState } from 'react';
import { Tv, Monitor, Trash2, Send, Video } from 'lucide-react';
import type { StyleConfig, SubtitlePayload } from '../../src-server/types/schema';

interface LivePreviewProps {
  style: StyleConfig;
  latestSubtitle: SubtitlePayload | null;
  onSendManualText: (text: string) => void;
  onClear: () => void;
}

type BgMode = 'transparent' | 'dark' | 'green' | 'webcam';

export const LivePreview: React.FC<LivePreviewProps> = ({
  style,
  latestSubtitle,
  onSendManualText,
  onClear,
}) => {
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
    sourceLang: 'ja',
    targetLangs: ['th', 'en'],
    rawText: 'こんにちは！今日も配信見に来てくれてありがとう！',
    translations: {
      th: 'สวัสดีค่าทุกคน! ขอบคุณที่แวะมาดูสตรีมวันนี้นะคะ!',
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
    <div className="glass-panel p-4 space-y-3 flex flex-col h-full">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(139,233,253,0.3)]">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-100">1:1 WYSIWYG OBS Canvas</h2>
            <p className="text-[11px] text-slate-400">Hardware Accelerated Stream Simulation</p>
          </div>
        </div>

        {/* Background Mode Toggles & Clear */}
        <div className="flex items-center gap-1.5">
          <div className="bg-slate-900/90 p-1 rounded-lg border border-slate-800 flex items-center gap-0.5 text-xs">
            <button
              onClick={() => setBgMode('dark')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                bgMode === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setBgMode('green')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                bgMode === 'green' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Green
            </button>
            <button
              onClick={() => setBgMode('transparent')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                bgMode === 'transparent' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setBgMode('webcam')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                bgMode === 'webcam' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Streamer
            </button>
          </div>

          <button
            onClick={onClear}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-all"
            title="Clear Live Subtitles"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview Viewport Canvas */}
      <div
        className={`flex-1 min-h-[220px] rounded-xl border border-slate-800 relative overflow-hidden flex flex-col justify-end p-5 transition-all shadow-inner ${
          bgMode === 'dark'
            ? 'bg-gradient-to-b from-[#0b0f19] to-[#121827]'
            : bgMode === 'green'
            ? 'bg-[#00b140]'
            : bgMode === 'webcam'
            ? 'bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950'
            : 'bg-[radial-gradient(#2d3748_1px,transparent_1px)] [background-size:16px_16px] bg-[#1a202c]'
        }`}
        style={{
          alignItems: style.alignment === 'left' ? 'flex-start' : style.alignment === 'right' ? 'flex-end' : 'center',
          fontFamily: `"${style.fontFamily}", 'Prompt', 'Outfit', sans-serif`,
        }}
      >
        {/* OBS Simulation watermark */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-slate-400 backdrop-blur-md pointer-events-none border border-white/10">
          <Monitor className="w-3 h-3 text-pink-400" />
          <span>OBS BROWSER SOURCE (1920x1080)</span>
        </div>

        {/* Webcam Mock Watermark if in webcam mode */}
        {bgMode === 'webcam' && (
          <div className="absolute top-8 right-4 flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-purple-500/30 text-xs text-purple-300 pointer-events-none">
            <Video className="w-4 h-4 text-pink-400" />
            <span className="font-bold">VTuber Avatar Camera View</span>
          </div>
        )}

        {/* Subtitle Card */}
        <div
          className="relative max-w-[95%] transition-all duration-200"
          style={{
            backgroundColor: style.backgroundColor,
            borderRadius: `${style.borderRadius}px`,
            padding: `${style.padding}px ${style.padding * 1.5}px`,
            border: `1.5px solid ${style.glowColor}55`,
            boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 ${style.glowBlur}px ${style.glowColor}44`,
            textAlign: style.alignment,
          }}
        >
          {/* Romaji */}
          {style.showRomaji && subtitleToRender.romaji && (
            <div
              className="text-xs font-semibold text-cyan-300 mb-1"
              style={{ textShadow: `0 0 8px rgba(139, 233, 253, 0.6)` }}
            >
              {subtitleToRender.romaji}
            </div>
          )}

          {/* Source Line */}
          {style.showSourceText && (
            <div
              className="font-extrabold leading-tight mb-2"
              style={{
                fontSize: `${style.fontSize}px`,
                color: style.textColor,
                textShadow: mainShadow,
              }}
            >
              {subtitleToRender.rawText}
              {!subtitleToRender.isFinal && (
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 ml-2 animate-ping" />
              )}
            </div>
          )}

          {/* Translations */}
          <div className="space-y-1">
            {Object.entries(subtitleToRender.translations || {}).map(([lang, text]) => {
              const transShadow = `
                -${Math.max(2, ow - 1)}px -${Math.max(2, ow - 1)}px 0 ${oc},
                 ${Math.max(2, ow - 1)}px -${Math.max(2, ow - 1)}px 0 ${oc},
                -${Math.max(2, ow - 1)}px  ${Math.max(2, ow - 1)}px 0 ${oc},
                 ${Math.max(2, ow - 1)}px  ${Math.max(2, ow - 1)}px 0 ${oc},
                 0 0 ${style.glowBlur}px ${lang === 'th' ? style.secondaryTextColor : style.thirdTextColor}aa
              `;

              return (
                <div
                  key={lang}
                  className="flex items-center gap-2 font-bold leading-tight"
                  style={{
                    fontSize: `${style.translationFontSize}px`,
                    color: lang === 'th' ? style.secondaryTextColor : style.thirdTextColor,
                    textShadow: transShadow,
                    justifyContent: style.alignment === 'left' ? 'flex-start' : style.alignment === 'right' ? 'flex-end' : 'center',
                  }}
                >
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/20 border border-white/30 tracking-wider">
                    {lang}
                  </span>
                  <span>{text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Manual Input Bar */}
      <form onSubmit={handleManualSubmit} className="flex gap-2 pt-1">
        <input
          type="text"
          placeholder="Type any phrase to test simultaneous translation..."
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500 font-medium"
        />
        <button
          type="submit"
          className="btn-anime px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast</span>
        </button>
      </form>
    </div>
  );
};
