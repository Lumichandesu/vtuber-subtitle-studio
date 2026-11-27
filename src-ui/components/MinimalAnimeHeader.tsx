import React from 'react';
import { Tv, Sun, Moon, Gauge, Crown, MemoryStick } from 'lucide-react';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';
import type { TelemetryStats } from '../../src-server/types/schema';
import type { AppEdition } from '../App';

interface MinimalAnimeHeaderProps {
  isConnected: boolean;
  activePort: number;
  liveLatencyMs: number;
  telemetry: TelemetryStats;
  uiLang: UILang;
  edition: AppEdition;
  onToggleEdition: (edition: AppEdition) => void;
  onChangeUILang: (lang: UILang) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenDeploy: () => void;
  onTestSubtitle: () => void;
  onOpenProModal: () => void;
}

const UI_LANGS: { code: UILang; label: string; name: string }[] = [
  { code: 'th', label: 'TH', name: 'ภาษาไทย' },
  { code: 'ja', label: 'JP', name: '日本語' },
  { code: 'en', label: 'EN', name: 'English' },
];

export const MinimalAnimeHeader: React.FC<MinimalAnimeHeaderProps> = ({
  isConnected,
  liveLatencyMs,
  telemetry,
  uiLang,
  edition,
  onChangeUILang,
  theme,
  onToggleTheme,
  onOpenDeploy,
  onOpenProModal,
}) => {
  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.th;
  const latencyDot = liveLatencyMs <= 150 ? 'bg-[#3FA673]' : liveLatencyMs <= 300 ? 'bg-[#D9A441]' : 'bg-[#D9577A]';

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
      <div className="max-w-[1880px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/app-icon.png"
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-xl object-cover border-[1.5px] border-[#231F20] bg-surface shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold leading-tight text-ink truncate">{t.appTitle}</h1>
              {edition === 'pro' ? (
                <span className="chip chip-pro">
                  <Crown className="w-3 h-3" aria-hidden="true" />
                  {t.proEditionLabel}
                </span>
              ) : (
                <>
                  <span className="chip chip-free">{t.freeEditionLabel}</span>
                  <button type="button" onClick={onOpenProModal} className="chip chip-pro hover:bg-[#F3E3C2]">
                    <Crown className="w-3 h-3" aria-hidden="true" />
                    {t.upgradeBtn}
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-muted truncate">
              {t.appTagline}
              <span className="hidden xl:inline">
                <span aria-hidden="true"> · </span>
                {t.streamSimultaneous} TH · JP · EN
                <span aria-hidden="true"> · </span>
                Made by Lumichandesu
              </span>
            </p>
          </div>
        </div>

        {/* Status and controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5" aria-label={t.latencyTitle}>
            <span className="stat" title={t.latencyTitle}>
              <span className={`dot ${isConnected ? latencyDot : 'bg-line-strong'}`} aria-hidden="true" />
              <b className="inline-block min-w-[3.5ch] text-right">{liveLatencyMs}</b> ms
            </span>
            <span className="stat hidden xl:inline-flex" title={t.cpuTitle}>
              <Gauge className="w-3.5 h-3.5" aria-hidden="true" />
              CPU <b className="inline-block min-w-[3ch] text-right">{telemetry.cpuPercent || 15}%</b>
            </span>
            <span className="stat hidden xl:inline-flex" title={t.ramTitle}>
              <MemoryStick className="w-3.5 h-3.5" aria-hidden="true" />
              RAM <b className="inline-block min-w-[3ch] text-right">{telemetry.memoryMB || 128}</b> MB
            </span>
          </div>

          <div className="seg" role="group" aria-label={t.uiLanguageLabel}>
            {UI_LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                lang={l.code}
                onClick={() => onChangeUILang(l.code)}
                aria-pressed={uiLang === l.code}
                title={l.name}
                className="seg-btn"
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="btn btn-secondary btn-icon"
            title={theme === 'dark' ? t.themeToLight : t.themeToDark}
            aria-label={theme === 'dark' ? t.themeToLight : t.themeToDark}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
          </button>

          <button type="button" onClick={onOpenDeploy} className="btn btn-primary">
            <Tv className="w-4 h-4" aria-hidden="true" />
            <span>{t.step4Btn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

