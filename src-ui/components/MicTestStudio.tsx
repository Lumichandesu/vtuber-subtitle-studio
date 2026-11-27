import React from 'react';
import { Mic, MicOff, RefreshCw, Sparkles, Zap } from 'lucide-react';
import type { AudioDevice, SttMode } from '../hooks/useAudioRecorder';
import type { SubtitlePayload } from '../../src-server/types/schema';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';
import type { AppEdition } from '../App';
import { PanelHeader, ProChip } from './ui';

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
  onStart,
  onStop,
  onRefreshDevices,
  onOpenProModal,
  latestSubtitle,
}) => {
  const t = UI_TRANSLATIONS[uiLang];
  const meterPercent = Math.min(100, Math.max(0, volumeLevel * 350));
  const thresholdPercent = Math.min(100, vadThreshold * 350);
  const gateOpen = meterPercent > thresholdPercent;

  const handleQualityModeClick = () => {
    if (edition === 'free') {
      onOpenProModal?.();
      return;
    }
    onChangeSttMode('quality');
  };

  const qualitySelected = sttMode === 'quality' && edition === 'pro';
  const speedSelected = sttMode === 'speed' || edition === 'free';

  return (
    <section className="panel space-y-4" aria-labelledby="mic-title">
      <PanelHeader id="mic-title" step="1" tone="blue" title={t.step1Title} desc={t.step1Desc}>
        <button
          type="button"
          onClick={isRecording ? onStop : onStart}
          className={`btn ${isRecording ? 'btn-stop' : 'btn-primary'} min-w-[8.5rem]`}
        >
          {isRecording ? <MicOff className="w-4 h-4" aria-hidden="true" /> : <Mic className="w-4 h-4" aria-hidden="true" />}
          <span>{isRecording ? t.stopMicBtn : t.testMicBtn}</span>
        </button>
      </PanelHeader>

      {/* Device + level */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-1 min-[1800px]:grid-cols-2 gap-x-4 gap-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="mic-device" className="field-label">{t.selectMic}</label>
            <button type="button" onClick={onRefreshDevices} className="btn btn-ghost btn-sm !min-h-[26px] !px-2" title={t.rescanTitle}>
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.rescan}</span>
            </button>
          </div>
          <select
            id="mic-device"
            value={selectedDeviceId}
            onChange={(e) => onSelectDevice(e.target.value)}
            disabled={isRecording}
            className="field"
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label}
              </option>
            ))}
            {devices.length === 0 && <option value="default">{t.defaultMic}</option>}
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between min-h-[26px]">
            <span className="field-label">{t.vuLevel}</span>
            <span className="flex items-center gap-2 text-xs text-muted tabular-nums">
              <span
                className={`chip chip-pink ${isSpeaking ? 'talk-pulse' : 'invisible'}`}
                aria-hidden={!isSpeaking}
              >
                {t.talkingBadge}
              </span>
              <span className="inline-block min-w-[4ch] text-right">{Math.round(meterPercent)}%</span>
              <span className={gateOpen ? 'text-ok font-medium' : ''}>{gateOpen ? t.gateOpen : t.gateClosed}</span>
            </span>
          </div>
          <div
            className="relative h-3.5 mt-[11px] rounded-full bg-sunken border border-line overflow-hidden"
            role="meter"
            aria-label={t.vuLevel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(meterPercent)}
          >
            <div
              className={`absolute inset-y-0 left-0 transition-[width] duration-75 ${
                meterPercent > 75 ? 'bg-ypink' : gateOpen ? 'bg-yblue' : 'bg-line-strong'
              }`}
              style={{ width: `${meterPercent}%` }}
            />
            <div
              className="absolute inset-y-0 w-[3px] bg-ink"
              style={{ left: `${thresholdPercent}%` }}
              title="Noise gate"
            />
          </div>
        </div>
      </div>

      {/* Recognition mode */}
      <div className="box space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="box-title">{t.sttEngineModeTitle}</span>
          {edition === 'pro' && (
            <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
              <input
                type="checkbox"
                className="check"
                checked={studioMicMode}
                onChange={(e) => onChangeStudioMicMode(e.target.checked)}
              />
              <span>{t.studioMicHiFi}</span>
            </label>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button type="button" onClick={handleQualityModeClick} aria-pressed={qualitySelected} className="tile">
            <div className="flex items-center gap-2">
              <span className="check-dot" aria-hidden="true" />
              <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="tile-title">{t.qualityModeTitle}</span>
              {edition === 'free' && <ProChip className="ml-auto" />}
            </div>
            <p className="tile-desc pl-6">{t.qualityModeDesc}</p>
          </button>
          <button type="button" onClick={() => onChangeSttMode('speed')} aria-pressed={speedSelected} className="tile">
            <div className="flex items-center gap-2">
              <span className="check-dot" aria-hidden="true" />
              <Zap className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="tile-title">{t.speedModeTitle}</span>
            </div>
            <p className="tile-desc pl-6">{t.speedModeDesc}</p>
          </button>
        </div>
      </div>

      {/* Latest recognition result */}
      <div className="rounded-2xl border border-dashed border-line-strong p-3 space-y-2" aria-live="polite">
        <div className="flex items-center justify-between gap-2">
          <span className="box-title">{t.testResultTitle}</span>
          <span className="text-xs text-muted tabular-nums">
            {t.engineActive}: <b className="text-ink font-semibold">{liveLatencyMs} ms</b>
          </span>
        </div>

        {latestSubtitle ? (
          <div className="space-y-1.5 animate-fadeIn">
            <div className="flex items-start gap-2 text-sm">
              <span className="chip shrink-0">{latestSubtitle.sourceLang.toUpperCase()}</span>
              <span className="font-medium text-ink line-clamp-2">{latestSubtitle.rawText}</span>
            </div>
            {latestSubtitle.translations && (
              <div className="space-y-1">
                {Object.entries(latestSubtitle.translations).map(([lang, text]) => (
                  <div key={lang} className="flex items-start gap-2 text-sm">
                    <span className="chip chip-blue shrink-0">{lang.toUpperCase()}</span>
                    <span className="text-ink line-clamp-2">{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="py-2 text-sm text-muted">{isRecording ? t.listeningPrompt : t.idlePrompt}</p>
        )}
      </div>
    </section>
  );
};
