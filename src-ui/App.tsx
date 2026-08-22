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
import { Heart, Crown, Sparkles, ExternalLink } from 'lucide-react';

export type AppEdition = 'pro' | 'free';

export const GUMROAD_URL = 'https://lumichandesu.gumroad.com/l/VTuber-Subtitle-Studio';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [uiLang, setUiLang] = useState<UILang>('th');
  const [edition, setEdition] = useState<AppEdition>('pro');
  const [sttMode, setSttMode] = useState<SttMode>('quality');
  const [studioMicMode, setStudioMicMode] = useState(true);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
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

    const savedEdition = localStorage.getItem('vtuber_edition') as AppEdition;
    if (savedEdition === 'free' || savedEdition === 'pro') {
      setEdition(savedEdition);
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

  const handleToggleEdition = (newEdition: AppEdition) => {
    setEdition(newEdition);
    localStorage.setItem('vtuber_edition', newEdition);
    if (newEdition === 'free') {
      setSttMode('speed');
      setStudioMicMode(false);
      updateLanguage({ aiEngine: 'built-in' });
    }
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
        edition={edition}
        onToggleEdition={handleToggleEdition}
        onChangeUILang={handleChangeUILang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenDeploy={() => setIsDeployModalOpen(true)}
        onTestSubtitle={() => sendTestSubtitle()}
        onOpenProModal={() => setIsProModalOpen(true)}
      />

      {/* Free Edition Notice Banner (When in Free Mode) */}
      {edition === 'free' && (
        <div className="bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-cyan-500/15 border-b border-pink-500/30 px-4 py-2 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-[var(--text-main)]">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-black text-[10px] border border-emerald-500/30">
              FREE COMMUNITY EDITION
            </span>
            <span className="font-semibold text-[11px]">
              กำลังใช้งานเวอร์ชันฟรี (Neural AI ฟรี, ถอดรหัสคำพูดความเร็วสูง)
            </span>
          </div>
          <button
            onClick={() => setIsProModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 text-white font-black text-[11px] shadow-sm hover:opacity-90 transition-opacity"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>ดูฟีเจอร์ PRO & ลิงก์ Gumroad</span>
          </button>
        </div>
      )}

      {/* Main Studio 4-Step Workspace */}
      <div className="flex-1 p-3 md:p-5 space-y-4 max-w-[1700px] w-full mx-auto pb-16">
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column (7 cols): Step 1 & Step 2 */}
          <div className="lg:col-span-7 space-y-4">
            {/* Step 1: [1. ไมค์ & เทสต์เสียง] */}
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
              onChangeVadThreshold={(val) => {}}
              onStart={startRecording}
              onStop={handleStopMic}
              onRefreshDevices={refreshDevices}
              onOpenProModal={() => setIsProModalOpen(true)}
              latestSubtitle={latestSubtitle}
              sourceLang={language.sourceLang}
            />

            {/* Language Matrix & Real-time AI Translation */}
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
              onTriggerPhrase={(text) => {
                if (edition === 'free') {
                  setIsProModalOpen(true);
                  return;
                }
                sendTranscriptChunk(text, true, `soundboard_${Date.now()}`);
              }}
            />

            {/* Subtitle History Timeline with SRT / VTT Export */}
            <SubtitleHistoryPanel
              history={subtitleHistory}
              uiLang={uiLang}
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

      {/* Bottom Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-[var(--text-muted)] transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--text-main)]">
            <span>{isConnected ? `${t.sidecarActive}` : 'Connecting...'}</span>
          </div>
          <span className="text-[var(--border-subtle)]">|</span>
          <span>Edition: <b className={`uppercase font-bold ${edition === 'pro' ? 'text-amber-400' : 'text-emerald-400'}`}>{edition}</b></span>
          <span className="text-[var(--border-subtle)]">|</span>
          <span>{t.latency}: <b className="text-emerald-400 font-mono font-bold">{liveLatencyMs} ms</b></span>
          <span className="text-[var(--border-subtle)]">|</span>
          <span>CPU: <b className="text-amber-400 font-mono font-bold">{telemetry.cpuPercent || 15}%</b></span>
          <span className="text-[var(--border-subtle)]">|</span>
          <span>{t.ramUsage}: <b className="text-cyan-400 font-mono font-bold">{telemetry.memoryMB || 128} MB</b></span>
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

      {/* PRO Edition Features & Gumroad Showcase Modal */}
      {isProModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[var(--bg-surface)] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[var(--text-main)]">
                    VTuber Subtitle Studio PRO
                  </h3>
                  <p className="text-xs text-amber-400 font-semibold">
                    ปลดล็อกทุกฟีเจอร์ระดับมืออาชีพสำหรับสตรีมเมอร์ & VTuber
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-[var(--text-main)]">Simultaneous Dual Translation:</b>
                  <p className="text-[var(--text-muted)]">พูด 1 ประโยค แปลและแสดงผลออกทั้ง ญี่ปุ่น [JP] + อังกฤษ [EN] พร้อมกันบน OBS</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-[var(--text-main)]">48kHz Studio Vocal DSP Mastering:</b>
                  <p className="text-[var(--text-muted)]">ตัดเสียงลมกระแทก (80Hz) + บูสต์ความถี่พยัญชนะ (3.8kHz EQ) + Leveler ไมค์ดูดเสียงชัดเจน</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-[var(--text-main)]">VOD Subtitle Export (.SRT / .VTT):</b>
                  <p className="text-[var(--text-muted)]">บันทึกไทม์ไลน์คำพูดตลอดทั้งสตรีม กดส่งออกไฟล์ซับไปตัดต่อคลิปไฮไลต์ลง YouTube ได้ทันที</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-[var(--text-main)]">VTuber Slang Dictionary & Soundboard:</b>
                  <p className="text-[var(--text-muted)]">กำหนดคำศัพท์เฉพาะช่อง และปุ่มลัดยิงคำแปลขึ้นจอสดๆ ได้ในคลิกเดียว</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  handleToggleEdition(edition === 'pro' ? 'free' : 'pro');
                  setIsProModalOpen(false);
                }}
                className="px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-main)] hover:bg-[var(--btn-secondary-bg)] transition-colors"
              >
                {edition === 'pro' ? '🔄 สลับไปโหมด Free' : '✨ สลับเป็นโหมด PRO จำลอง'}
              </button>

              <a
                href={GUMROAD_URL}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/25 hover:opacity-95 transition-opacity"
              >
                <span>ซื้อเวอร์ชัน PRO บน Gumroad</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
