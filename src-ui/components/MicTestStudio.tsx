import React from 'react';
import { Mic, MicOff, Volume2, Activity, RefreshCw, CheckCircle2, Zap, Sparkles, Sliders, Crown } from 'lucide-react';
import type { AudioDevice, SttMode } from '../hooks/useAudioRecorder';
import type { SubtitlePayload } from '../../src-server/types/schema';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';
import type { AppEdition } from '../App';

interface MicTestStudioProps {
  isRecording: boolean;
  devices: AudioDevice[];
  selectedDeviceId: string;
  onSelectDevice: (id: string) => void;
  volumeLevel: number;
  isSpeaking: boolean;
  vadThreshold: number;
  liveLatencyMs: number;
  uiLang: UILang;
  edition?: AppEdition;
  sttMode: SttMode;
  studioMicMode: boolean;
  onChangeSttMode: (mode: SttMode) => void;
  onChangeStudioMicMode: (val: boolean) => void;
  onChangeVadThreshold: (val: number) => void;
  onStart: () => void;
  onStop: () => void;
  onRefreshDevices: () => void;
  onOpenProModal?: () => void;
  latestSubtitle: SubtitlePayload | null;
  sourceLang: string;
}

export const MicTestStudio: React.FC<MicTestStudioProps> = ({
  isRecording,
  devices,
  selectedDeviceId,
  onSelectDevice,
  volumeLevel,
  isSpeaking,
  vadThreshold,
  liveLatencyMs,
  uiLang,
  edition = 'pro',
  sttMode,
  studioMicMode,
  onChangeSttMode,
  onChangeStudioMicMode,
  onChangeVadThreshold,
  onStart,
  onStop,
  onRefreshDevices,
  onOpenProModal,
  latestSubtitle,
  sourceLang,
}) => {
  const t = UI_TRANSLATIONS[uiLang];
  const meterPercent = Math.min(100, Math.max(0, volumeLevel * 350));
  const thresholdPercent = Math.min(100, vadThreshold * 350);

  const handleQualityModeClick = () => {
    if (edition === 'free') {
      onOpenProModal?.();
      return;
    }
    onChangeSttMode('quality');
  };

  return (
    <div className="glass-panel p-4 space-y-3.5">
      {/* 1. Step Header & Start/Stop Test */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${isRecording ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-black' : 'bg-[var(--btn-secondary-bg)] text-[var(--text-main)]'}`}>
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm md:text-base text-[var(--text-main)] flex items-center gap-2">
              {t.step1Title}
              {isSpeaking && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-[var(--btn-secondary-bg)] text-[var(--text-main)] border border-[var(--border-subtle)]">
                  {t.talkingBadge}
                </span>
              )}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              {t.step1Desc}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={isRecording ? onStop : onStart}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
            isRecording
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
              : 'btn-white'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>{t.stopMicBtn}</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>{t.testMicBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Dynamic Audio Engine Mode Switcher (Quality vs Speed) */}
      <div className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5 text-[11px]">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            {t.sttEngineModeTitle}
          </span>
          {edition === 'pro' && (
            <label className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={studioMicMode}
                onChange={(e) => onChangeStudioMicMode(e.target.checked)}
                className="rounded border-[var(--border-subtle)]"
              />
              <span>{t.studioMicHiFi}</span>
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Quality Mode (PRO Exclusive) */}
          <button
            type="button"
            onClick={handleQualityModeClick}
            className={`p-2 rounded-lg border text-left transition-all relative ${
              sttMode === 'quality' && edition === 'pro'
                ? 'border-[var(--text-main)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-black shadow-sm'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-active)]'
            }`}
          >
            {edition === 'free' && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-black text-[9px] border border-amber-500/40 flex items-center gap-0.5">
                <Crown className="w-2.5 h-2.5" /> PRO
              </span>
            )}
            <div className="text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {t.qualityModeTitle}
            </div>
            <div className="text-[10px] opacity-80 mt-0.5">
              {t.qualityModeDesc}
            </div>
          </button>

          {/* Speed Mode (Available in Free & Pro) */}
          <button
            type="button"
            onClick={() => onChangeSttMode('speed')}
            className={`p-2 rounded-lg border text-left transition-all ${
              sttMode === 'speed' || edition === 'free'
                ? 'border-[var(--text-main)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-black shadow-sm'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-active)]'
            }`}
          >
            <div className="text-xs font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              {t.speedModeTitle}
            </div>
            <div className="text-[10px] opacity-80 mt-0.5">
              {t.speedModeDesc}
            </div>
          </button>
        </div>
      </div>

      {/* 3. Device Selection & VU Meter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Device Select */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <label className="font-bold text-[var(--text-main)]">{t.selectMic}</label>
            <button
              onClick={onRefreshDevices}
              className="text-[var(--text-main)] hover:text-[var(--text-muted)] flex items-center gap-1 text-[10px] font-bold"
              title="Rescan connected audio devices"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t.rescan}</span>
            </button>
          </div>
          <select
            value={selectedDeviceId}
            onChange={(e) => onSelectDevice(e.target.value)}
            disabled={isRecording}
            className="w-full rounded-lg px-3 py-1.5 text-xs focus:outline-none disabled:opacity-50 font-medium"
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label}
              </option>
            ))}
            {devices.length === 0 && <option value="default">Default System Microphone</option>}
          </select>
        </div>

        {/* Level Meter & VAD */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)] flex items-center gap-1 text-[11px]">
              <Activity className="w-3 h-3 text-[var(--text-main)]" />
              {t.vuLevel}
            </span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">
              {Math.round(meterPercent)}% {meterPercent > thresholdPercent ? t.gateOpen : t.gateClosed}
            </span>
          </div>

          <div className="relative h-3.5 bg-[var(--bg-input)] rounded-full overflow-hidden border border-[var(--border-subtle)] p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                meterPercent > 75
                  ? 'bg-rose-400'
                  : meterPercent > thresholdPercent
                  ? 'bg-emerald-400'
                  : 'bg-[var(--text-muted)]/30'
              }`}
              style={{ width: `${meterPercent}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-1 bg-[var(--text-main)] shadow-[0_0_6px_var(--text-main)]"
              style={{ left: `${thresholdPercent}%` }}
              title="VAD Gate Threshold Needle"
            />
          </div>
        </div>
      </div>

      {/* 4. Live Speech & Translation Result Box */}
      <div className="p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-main)]">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>{t.testResultTitle}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3 h-3" />
            {t.latency}: {liveLatencyMs} ms
          </span>
        </div>

        {latestSubtitle ? (
          <div className="space-y-1.5 animate-fadeIn">
            {/* Spoken text */}
            <div className="flex items-start gap-2 text-xs">
              <span className="px-1.5 py-0.5 rounded bg-[var(--btn-secondary-bg)] text-[var(--text-main)] font-black text-[10px] uppercase border border-[var(--border-subtle)]">
                [{latestSubtitle.sourceLang.toUpperCase()}] {t.spokenLabel}
              </span>
              <span className="font-bold text-[var(--text-main)] line-clamp-2">{latestSubtitle.rawText}</span>
            </div>

            {/* Simultaneous Translations with Clean [LANG] Badges */}
            {latestSubtitle.translations && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 border-l-2 border-[var(--border-active)]">
                {Object.entries(latestSubtitle.translations).map(([lang, text]) => (
                  <div key={lang} className="text-[11px] flex items-center gap-1.5 bg-[var(--bg-surface)] px-2 py-1 rounded border border-[var(--border-subtle)]">
                    <span className="font-mono text-[10px] font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 select-none">
                      [{lang.toUpperCase()}]
                    </span>
                    <span className="text-[var(--text-main)] truncate font-semibold">{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-2.5 text-center text-xs text-[var(--text-muted)]">
            {isRecording ? t.listeningPrompt : t.idlePrompt}
          </div>
        )}
      </div>
    </div>
  );
};
