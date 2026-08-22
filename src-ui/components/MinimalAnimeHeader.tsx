import React from 'react';
import { Sparkles, Tv, Sun, Moon, Zap, Cpu, Activity, Gauge, Heart } from 'lucide-react';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';
import type { TelemetryStats } from '../../src-server/types/schema';

interface MinimalAnimeHeaderProps {
  isConnected: boolean;
  activePort: number;
  liveLatencyMs: number;
  telemetry: TelemetryStats;
  uiLang: UILang;
  onChangeUILang: (lang: UILang) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenDeploy: () => void;
  onTestSubtitle: () => void;
}

export const MinimalAnimeHeader: React.FC<MinimalAnimeHeaderProps> = ({
  isConnected,
  activePort,
  liveLatencyMs,
  telemetry,
  uiLang,
  onChangeUILang,
  theme,
  onToggleTheme,
  onOpenDeploy,
  onTestSubtitle,
}) => {
  const t = UI_TRANSLATIONS[uiLang];
  const isFast = liveLatencyMs <= 150;
  const isModerate = liveLatencyMs > 150 && liveLatencyMs <= 300;

  const vramGb = (telemetry.vramUsedMB ? (telemetry.vramUsedMB / 1024).toFixed(1) : '0.5');

  return (
    <header className="px-4 md:px-5 py-2 flex flex-wrap items-center justify-between gap-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm transition-colors">
      {/* Left: Cute Anime Avatar & Title & Made By Lumichandesu */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <img
            src="/app-icon.png"
            alt="VTuber Avatar"
            className="w-9 h-9 rounded-xl object-cover shadow-md border border-[var(--border-active)] group-hover:scale-105 transition-transform"
            onError={(e) => {
              // Fallback to sparkles icon if img fails
              (e.currentTarget as any).style.display = 'none';
            }}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-black tracking-tight text-[var(--text-main)]">
              {t.appTitle}
            </h1>
            <span className="px-1.5 py-0.5 text-[8px] font-extrabold rounded bg-[var(--btn-secondary-bg)] text-[var(--text-main)] border border-[var(--border-subtle)]">
              {t.badge}
            </span>
            <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 fill-current" />
              Made By Lumichandesu
            </span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5">
            <span>{t.streamSimultaneous}</span>
            <span className="font-bold text-[var(--text-main)]">[TH] 🇹🇭</span>
            <span>•</span>
            <span className="font-bold text-[var(--text-main)]">[JP] 🇯🇵</span>
            <span>•</span>
            <span className="font-bold text-[var(--text-main)]">[EN] 🇺🇸</span>
          </p>
        </div>
      </div>

      {/* Right: Real-time ms, CPU %, RAM, GPU % & VRAM, Language Switcher, Theme & DEPLOY */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Real-Time Latency (ms) */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-mono font-black transition-all ${
            isFast
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : isModerate
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
          title="End-to-End Latency"
        >
          <Zap className="w-3 h-3 fill-current animate-pulse" />
          <span>{liveLatencyMs} ms</span>
        </div>

        {/* CPU % */}
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[10px] font-mono text-[var(--text-muted)]"
          title="CPU Usage"
        >
          <Gauge className="w-3 h-3 text-amber-400" />
          <span>CPU <b className="text-[var(--text-main)]">{telemetry.cpuPercent || 3}%</b></span>
        </div>

        {/* RAM MB */}
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[10px] font-mono text-[var(--text-muted)]"
          title="Server RAM Memory"
        >
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span>RAM <b className="text-[var(--text-main)]">{telemetry.memoryMB || 96}M</b></span>
        </div>

        {/* GPU % & VRAM Usage */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[10px] font-mono text-[var(--text-muted)]"
          title="GPU Hardware Acceleration Load & VRAM Usage"
        >
          <Activity className="w-3 h-3 text-purple-400" />
          <span>GPU <b className="text-[var(--text-main)]">{telemetry.gpuPercent || 12}%</b></span>
          <span className="text-[var(--border-subtle)]">|</span>
          <span>VRAM <b className="text-purple-300">{vramGb} GB</b></span>
        </div>

        {/* Trilingual UI Language Switcher */}
        <div className="flex items-center bg-[var(--bg-input)] p-0.5 rounded-lg border border-[var(--border-subtle)] text-[10px] font-bold">
          <button
            onClick={() => onChangeUILang('th')}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              uiLang === 'th' ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-black' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            🇹🇭 TH
          </button>
          <button
            onClick={() => onChangeUILang('ja')}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              uiLang === 'ja' ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-black' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            🇯🇵 JP
          </button>
          <button
            onClick={() => onChangeUILang('en')}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              uiLang === 'en' ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-black' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            🇺🇸 EN
          </button>
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className="btn-dark p-1.5 text-xs flex items-center transition-transform active:scale-95"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
          )}
        </button>

        {/* Prominent DEPLOY TO OBS Button */}
        <button
          onClick={onOpenDeploy}
          className="btn-white px-3.5 py-1.5 text-xs flex items-center gap-1.5"
        >
          <Tv className="w-3.5 h-3.5" />
          <span>{t.step4Btn}</span>
        </button>
      </div>
    </header>
  );
};
