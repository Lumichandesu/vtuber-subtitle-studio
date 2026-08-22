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
import { Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [uiLang, setUiLang] = useState<UILang>('th');
  const [sttMode, setSttMode] = useState<SttMode>('quality');
  const [studioMicMode, setStudioMicMode] = useState(true);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('vtuber_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      document.documentElement.className = 'dark';
    }

    const savedLang = localStorage.getItem('vtuber_ui_lang') as UILang;
    if (savedLang && (savedLang === 'th' || savedLang === 'ja' || savedLang === 'en')) {
      setUiLang(savedLang);
    }
  }, []);

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
    sttMode,
    studioMicMode,
    vadThreshold: 0.012,
    onTranscript: (text, isFinal, clientTime) => {
      sendTranscriptChunk(text, isFinal, undefined, clientTime);
    },
  });

  // Auto-Start Microphone ONLY ONCE on application initial mount
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

  const t = UI_TRANSLATIONS[uiLang];

  return (
    <div className={`min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans select-none ${theme}`}>
      {/* Top Header with live ms, CPU %, RAM MB, GPU %, Made By Lumichandesu, UI Language Switcher, Theme Switcher & DEPLOY Button */}
      <MinimalAnimeHeader
        isConnected={isConnected}
        activePort={activePort}
        liveLatencyMs={liveLatencyMs}
        telemetry={telemetry}
        uiLang={uiLang}
        onChangeUILang={handleChangeUILang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenDeploy={() => setIsDeployModalOpen(true)}
        onTestSubtitle={() => sendTestSubtitle()}
      />

      {/* Main Studio 4-Step Workspace (Smooth Natural Scroll Layout) */}
      <div className="flex-1 p-3 md:p-5 space-y-4 max-w-[1700px] w-full mx-auto pb-16">
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column (7 cols): Step 1 & Step 2 */}
          <div className="lg:col-span-7 space-y-4">
            {/* Step 1: [1. ไมค์ & เทสต์เสียง] with Quality / Speed Mode Selector */}
            <MicTestStudio
              isRecording={isRecording}
              devices={devices}
              selectedDeviceId={selectedDeviceId}
              onSelectDevice={setSelectedDeviceId}
              volumeLevel={volumeLevel}
              isSpeaking={isSpeaking}
              vadThreshold={0.012}
              liveLatencyMs={liveLatencyMs}
              uiLang={uiLang}
              sttMode={sttMode}
              studioMicMode={studioMicMode}
              onChangeSttMode={setSttMode}
              onChangeStudioMicMode={setStudioMicMode}
              onChangeVadThreshold={(val) => {}}
              onStart={startRecording}
              onStop={handleStopMic}
              onRefreshDevices={refreshDevices}
              latestSubtitle={latestSubtitle}
              sourceLang={language.sourceLang}
            />

            {/* Language Matrix & Real-time AI Translation */}
            <LanguageMatrix
              language={language}
              uiLang={uiLang}
              onChangeLanguage={updateLanguage}
              onOpenGlossary={() => setIsGlossaryOpen(true)}
            />

            {/* Step 2: [2. เลือกฟอนต์ & ปรับแต่ง] */}
            <AnimeFontCustomizer
              style={style}
              presets={presets}
              uiLang={uiLang}
              onChangeStyle={updateStyle}
              onApplyPreset={applyPreset}
            />
          </div>

          {/* Right Column (5 cols): Step 3 & Soundboard & Subtitle History */}
          <div className="lg:col-span-5 space-y-4 flex flex-col">
            {/* Step 3: [3. ดูผลลัพธ์สด] */}
            <LiveResultBox
              style={style}
              latestSubtitle={latestSubtitle}
              uiLang={uiLang}
              onSendManualText={(text) => sendTranscriptChunk(text, true)}
              onClear={clearSubtitles}
            />

            {/* Soundboard Quick Phrases */}
            <SoundboardHotkeys
              uiLang={uiLang}
              onTriggerPhrase={(text) => sendTranscriptChunk(text, true, `soundboard_${Date.now()}`)}
            />

            {/* Subtitle History Timeline with SRT / VTT Export */}
            <SubtitleHistoryPanel
              history={subtitleHistory}
              uiLang={uiLang}
              onClear={clearSubtitles}
              onExportSRT={exportSRT}
              onExportVTT={exportVTT}
            />
          </div>
        </main>
      </div>

      {/* Bottom Status Bar (Clean without distracting green dot) */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-[var(--text-muted)] transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--text-main)]">
            <span>{isConnected ? `${t.sidecarActive}` : 'Connecting...'}</span>
          </div>
          <span className="text-[var(--border-subtle)]">|</span>
          <span>Mode: <b className="text-[var(--text-main)] uppercase">{sttMode} (Hi-Res 48k Turbo)</b></span>
          <span className="text-[var(--border-subtle)]">|</span>
          <span>{t.latency}: <b className="text-emerald-400 font-mono font-bold">{liveLatencyMs} ms</b></span>
          <span className="text-[var(--border-subtle)]">|</span>
          <span>CPU: <b className="text-amber-400 font-mono font-bold">{telemetry.cpuPercent || 15}%</b></span>
          <span className="text-[var(--border-subtle)]">|</span>
          <span>{t.ramUsage}: <b className="text-cyan-400 font-mono font-bold">{telemetry.memoryMB || 128} MB</b></span>
          <span className="text-[var(--border-subtle)]">|</span>
          <span>GPU: <b className="text-purple-400 font-mono font-bold">{telemetry.gpuPercent || 25}%</b></span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-pink-400 font-bold flex items-center gap-1">
            <Heart className="w-3 h-3 fill-current" />
            <span>Made By Lumichandesu</span>
          </div>
          <span className="text-[var(--border-subtle)]">|</span>
          <button
            onClick={() => setIsDeployModalOpen(true)}
            className="text-[var(--text-main)] font-bold hover:underline"
          >
            OBS Overlay: http://127.0.0.1:{activePort}/overlay
          </button>
        </div>
      </footer>

      {/* Step 4 Modal: [4. 🚀 DEPLOY TO OBS] */}
      <ObsDeployModal
        isOpen={isDeployModalOpen}
        activePort={activePort}
        uiLang={uiLang}
        onClose={() => setIsDeployModalOpen(false)}
      />

      {/* Custom Slang Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        glossary={glossary}
        onClose={() => setIsGlossaryOpen(false)}
        onUpdateGlossary={updateGlossary}
      />
    </div>
  );
};
