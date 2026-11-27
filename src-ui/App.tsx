import React, { useState, useEffect, useRef } from 'react';
import { useServerSync } from './hooks/useServerSync';
import { useAudioRecorder, type SttMode } from './hooks/useAudioRecorder';
import { MinimalAnimeHeader } from './components/MinimalAnimeHeader';
import { MicTestStudio } from './components/MicTestStudio';
import { LanguageMatrix } from './components/LanguageMatrix';
import { AnimeFontCustomizer } from './components/AnimeFontCustomizer';
import { LiveResultBox } from './components/LiveResultBox';
import { SoundboardHotkeys } from './components/SoundboardHotkeys';
import { SubtitleHistoryPanel } from './components/SubtitleHistoryPanel';
import { ObsDeployModal } from './components/ObsDeployModal';
import { GlossaryModal } from './components/GlossaryModal';
import type { UILang } from './i18n/translations';
import { UI_TRANSLATIONS } from './i18n/translations';
import { Heart, Crown, Sparkles, ExternalLink, X, Languages, AudioLines, FileDown, BookOpen } from 'lucide-react';

export type AppEdition = 'pro' | 'free';

export const GUMROAD_URL = 'https://lumichandesu.gumroad.com/l/VTuber-Subtitle-Studio';

const isUILang = (v: unknown): v is UILang => v === 'th' || v === 'ja' || v === 'en';
const HTML_LANG: Record<UILang, string> = { th: 'th', ja: 'ja', en: 'en' };

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [uiLang, setUiLang] = useState<UILang>('th');
  const defaultEdition: AppEdition = (import.meta.env.VITE_APP_EDITION as AppEdition) || 'pro';
  const [edition, setEdition] = useState<AppEdition>(defaultEdition);
  const [sttMode, setSttMode] = useState<SttMode>(defaultEdition === 'free' ? 'speed' : 'quality');
  const [studioMicMode, setStudioMicMode] = useState(defaultEdition === 'pro');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    // ?theme= and ?lang= let the launcher (or a screenshot run) pick a start state.
    const params = new URLSearchParams(window.location.search);
    const qsTheme = params.get('theme');
    const savedTheme = (qsTheme === 'dark' || qsTheme === 'light' ? qsTheme : localStorage.getItem('vtuber_theme')) as 'dark' | 'light' | null;
    const nextTheme = savedTheme === 'dark' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.className = nextTheme;

    const qsLang = params.get('lang');
    const savedLang = isUILang(qsLang) ? qsLang : localStorage.getItem('vtuber_ui_lang');
    if (isUILang(savedLang)) {
      setUiLang(savedLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[uiLang];
  }, [uiLang]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('vtuber_theme', nextTheme);
    document.documentElement.className = nextTheme;
  };

  const handleChangeUILang = (lang: UILang) => {
    setUiLang(lang);
    localStorage.setItem('vtuber_ui_lang', lang);
  };

  const handleToggleEdition = (newEdition: AppEdition) => {
    setEdition(newEdition);
  };

  const {
    isConnected,
    activePort,
    style,
    language,
    presets,
    glossary,
    latestSubtitle,
    subtitleHistory,
    telemetry,
    liveLatencyMs,
    updateStyle,
    applyPreset,
    updateLanguage,
    updateGlossary,
    sendTranscriptChunk,
    sendTestSubtitle,
    clearSubtitles,
    exportSRT,
    exportVTT,
  } = useServerSync();

  const {
    isRecording,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    volumeLevel,
    isSpeaking,
    startRecording,
    stopRecording,
    refreshDevices,
  } = useAudioRecorder({
    sourceLang: language.sourceLang,
    sttMode: edition === 'free' ? 'speed' : sttMode,
    studioMicMode: edition === 'pro' ? studioMicMode : false,
    vadThreshold: 0.010,
    onTranscript: (text, isFinal, clientTime) => {
      sendTranscriptChunk(text, isFinal, undefined, clientTime);
    },
  });

  useEffect(() => {
    if (!hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      const timer = setTimeout(() => {
        startRecording();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [startRecording]);

  const handleStopMic = () => {
    stopRecording();
    clearSubtitles();
  };

  const handleLanguageChange = (newLang: any) => {
    if (edition === 'free') {
      if (newLang.aiEngine && newLang.aiEngine !== 'built-in') {
        setIsProModalOpen(true);
        return;
      }
      if (newLang.targetLangs && newLang.targetLangs.length > 1) {
        setIsProModalOpen(true);
        updateLanguage({ ...newLang, targetLangs: [newLang.targetLangs[newLang.targetLangs.length - 1]] });
        return;
      }
    }
    updateLanguage(newLang);
  };

  const showProModal = isProModalOpen && edition === 'free';
  useEffect(() => {
    if (!showProModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsProModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showProModal]);

  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.th;

  const proFeatures = [
    { icon: Languages, tone: 'bg-yblue', title: t.proFeature1Title, desc: t.proFeature1Desc },
    { icon: AudioLines, tone: 'bg-ypink', title: t.proFeature2Title, desc: t.proFeature2Desc },
    { icon: FileDown, tone: 'bg-ysand', title: t.proFeature3Title, desc: t.proFeature3Desc },
    { icon: BookOpen, tone: 'bg-ymint', title: t.proFeature4Title, desc: t.proFeature4Desc },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans">
      <MinimalAnimeHeader
        isConnected={isConnected}
        activePort={activePort}
        liveLatencyMs={liveLatencyMs}
        telemetry={telemetry}
        uiLang={uiLang}
        edition={edition}
        onToggleEdition={handleToggleEdition}
        onChangeUILang={handleChangeUILang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenDeploy={() => setIsDeployModalOpen(true)}
        onTestSubtitle={() => sendTestSubtitle()}
        onOpenProModal={() => setIsProModalOpen(true)}
      />

      {/* Free edition notice (never shown in PRO) */}
      {edition === 'free' && (
        <div className="border-b border-line bg-ysand-soft">
          <div className="max-w-[1880px] mx-auto px-4 lg:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-ink min-w-0">
              <span className="chip chip-free">{t.freeEditionLabel}</span>
              <span className="truncate">{t.freeEditionBanner}</span>
            </div>
            <button type="button" onClick={() => setIsProModalOpen(true)} className="btn btn-secondary btn-sm">
              <Crown className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.viewProGumroad}</span>
            </button>
          </div>
        </div>
      )}

      {/* Workspace: 2 columns on laptops, 3 columns on 1080p and wider */}
      <div className="flex-1 w-full max-w-[1880px] mx-auto px-4 lg:px-6 pt-5 pb-20">
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 2xl:contents space-y-5 2xl:space-y-0">
            <div className="2xl:col-span-4 space-y-5">
              <MicTestStudio
                isRecording={isRecording}
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                onSelectDevice={setSelectedDeviceId}
                volumeLevel={volumeLevel}
                isSpeaking={isSpeaking}
                vadThreshold={0.010}
                liveLatencyMs={liveLatencyMs}
                uiLang={uiLang}
                edition={edition}
                sttMode={edition === 'free' ? 'speed' : sttMode}
                studioMicMode={edition === 'pro' ? studioMicMode : false}
                onChangeSttMode={(m) => {
                  if (edition === 'free' && m === 'quality') {
                    setIsProModalOpen(true);
                    return;
                  }
                  setSttMode(m);
                }}
                onChangeStudioMicMode={(val) => {
                  if (edition === 'free' && val) {
                    setIsProModalOpen(true);
                    return;
                  }
                  setStudioMicMode(val);
                }}
                onChangeVadThreshold={() => {}}
                onStart={startRecording}
                onStop={handleStopMic}
                onRefreshDevices={refreshDevices}
                onOpenProModal={() => setIsProModalOpen(true)}
                latestSubtitle={latestSubtitle}
                sourceLang={language.sourceLang}
              />

              <LanguageMatrix
                language={language}
                uiLang={uiLang}
                edition={edition}
                onChangeLanguage={handleLanguageChange}
                onOpenGlossary={() => {
                  if (edition === 'free') {
                    setIsProModalOpen(true);
                    return;
                  }
                  setIsGlossaryOpen(true);
                }}
                onOpenProModal={() => setIsProModalOpen(true)}
              />
            </div>

            <div className="2xl:col-span-4">
              <AnimeFontCustomizer
                style={style}
                presets={presets}
                uiLang={uiLang}
                onChangeStyle={updateStyle}
                onApplyPreset={applyPreset}
              />
            </div>
          </div>

          <div className="lg:col-span-5 2xl:col-span-4 space-y-5">
            <LiveResultBox
              style={style}
              latestSubtitle={latestSubtitle}
              uiLang={uiLang}
              onSendManualText={(text) => sendTranscriptChunk(text, true)}
              onClear={clearSubtitles}
            />

            <SoundboardHotkeys
              uiLang={uiLang}
              edition={edition}
              onTriggerPhrase={(text) => {
                if (edition === 'free') {
                  setIsProModalOpen(true);
                  return;
                }
                sendTranscriptChunk(text, true, `soundboard_${Date.now()}`);
              }}
            />

            <SubtitleHistoryPanel
              history={subtitleHistory}
              uiLang={uiLang}
              edition={edition}
              onClear={clearSubtitles}
              onExportSRT={() => {
                if (edition === 'free') {
                  setIsProModalOpen(true);
                  return;
                }
                exportSRT();
              }}
              onExportVTT={() => {
                if (edition === 'free') {
                  setIsProModalOpen(true);
                  return;
                }
                exportVTT();
              }}
            />
          </div>
        </main>
      </div>

      {/* Status bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-line">
        <div className="max-w-[1880px] mx-auto px-4 lg:px-6 h-10 flex items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-4 min-w-0 tabular-nums">
            <span className="flex items-center gap-1.5 text-ink font-medium" role="status">
              <span className={`dot ${isConnected ? 'bg-[#3FA673]' : 'bg-ysand'}`} aria-hidden="true" />
              {isConnected ? t.sidecarActive : t.connecting}
            </span>
            <span className="hidden md:inline">
              {t.editionLabel}: <b className="text-ink font-semibold">{edition === 'pro' ? t.proEditionLabel : t.freeEditionLabel}</b>
            </span>
            <span className="hidden md:inline">
              {t.latency}: <b className="text-ink font-semibold">{liveLatencyMs} ms</b>
            </span>
            <span className="hidden lg:inline">
              CPU: <b className="text-ink font-semibold">{telemetry.cpuPercent || 15}%</b>
            </span>
            <span className="hidden lg:inline">
              {t.ramUsage}: <b className="text-ink font-semibold">{telemetry.memoryMB || 128} MB</b>
            </span>
          </div>

          <div className="flex items-center gap-4 min-w-0">
            <span className="hidden sm:flex items-center gap-1 text-ink">
              <Heart className="w-3 h-3 fill-[#F8B7CC] text-[#D97C9C]" aria-hidden="true" />
              <span>Made by Lumichandesu</span>
            </span>
            <button
              type="button"
              onClick={() => setIsDeployModalOpen(true)}
              className="font-mono text-ink hover:underline underline-offset-2 truncate"
              title={t.step4Btn}
            >
              127.0.0.1:{activePort}/overlay
            </button>
          </div>
        </div>
      </footer>

      <ObsDeployModal
        isOpen={isDeployModalOpen}
        activePort={activePort}
        uiLang={uiLang}
        onClose={() => setIsDeployModalOpen(false)}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        glossary={glossary}
        uiLang={uiLang}
        onClose={() => setIsGlossaryOpen(false)}
        onUpdateGlossary={updateGlossary}
      />

      {/* PRO features and Gumroad link (only reachable in the FREE edition) */}
      {showProModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--scrim)] animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsProModalOpen(false);
          }}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="pro-modal-title" className="modal-card max-w-lg w-full p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="step-badge step-sand">
                  <Crown className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="pro-modal-title" className="panel-title">{t.proModalTitle}</h2>
                  <p className="panel-desc">{t.proModalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setIsProModalOpen(false)}
                className="btn btn-ghost btn-icon"
                aria-label={t.closeBtn}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <ul className="space-y-2">
              {proFeatures.map(({ icon: Icon, tone, title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className={`mt-0.5 w-8 h-8 rounded-xl border border-[#231F20] flex items-center justify-center text-[#231F20] shrink-0 ${tone}`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="text-sm text-muted">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary w-full min-h-[44px] text-sm"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>{t.buyOnGumroad}</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
