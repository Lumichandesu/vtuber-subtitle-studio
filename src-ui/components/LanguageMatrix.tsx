import React, { useState } from 'react';
import { Globe, BookOpen, Cpu, Sparkles, Key, Zap } from 'lucide-react';
import type { TranslationConfig } from '../../src-server/types/schema';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface LanguageMatrixProps {
  language: TranslationConfig;
  uiLang: UILang;
  onChangeLanguage: (lang: Partial<TranslationConfig>) => void;
  onOpenGlossary: () => void;
}

export const LanguageMatrix: React.FC<LanguageMatrixProps> = ({
  language,
  uiLang,
  onChangeLanguage,
  onOpenGlossary,
}) => {
  const t = UI_TRANSLATIONS[uiLang];
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const toggleTargetLang = (code: string) => {
    const current = language.targetLangs || [];
    if (current.includes(code)) {
      if (current.length > 1) {
        onChangeLanguage({ targetLangs: current.filter((l) => l !== code) });
      }
    } else {
      onChangeLanguage({ targetLangs: [...current, code] });
    }
  };

  return (
    <div className="glass-panel p-4 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[var(--btn-secondary-bg)] text-[var(--text-main)]">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm md:text-base text-[var(--text-main)] flex items-center gap-2">
              {t.matrixTitle}
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3" /> &lt; 40ms Engine
              </span>
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              {t.matrixDesc}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenGlossary}
          className="btn-dark px-3 py-1.5 text-xs flex items-center gap-1.5"
          title="Edit stream slang & keyword dictionary"
        >
          <BookOpen className="w-3.5 h-3.5 text-[var(--text-main)]" />
          <span>{t.slangDictBtn}</span>
        </button>
      </div>

      {/* AI Translation Engine Selector */}
      <div className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5 text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            {t.aiModelLabel}
          </span>
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-main)] font-semibold flex items-center gap-1"
          >
            <Key className="w-3 h-3" />
            {showApiKeyInput ? 'Hide API Keys' : 'Custom Cloud API Key (Optional)'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {[
            { id: 'built-in', name: '⚡ Free Neural AI (Ultra-Fast <40ms)', desc: 'Real-time multi-cloud cluster, 0ms cache' },
            { id: 'gemini', name: '✨ Google Gemini 2.5 Flash', desc: 'VTuber persona & nuanced stream translation' },
            { id: 'openai', name: '🤖 OpenAI GPT-4o-mini', desc: 'High-accuracy streaming LLM translation' },
          ].map((engine) => {
            const isSelected = language.aiEngine === engine.id;
            return (
              <button
                key={engine.id}
                onClick={() => onChangeLanguage({ aiEngine: engine.id as any })}
                className={`p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-[var(--text-main)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-black shadow-sm'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-active)]'
                }`}
              >
                <div className="text-xs font-bold">{engine.name}</div>
                <div className="text-[9px] opacity-75">{engine.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Optional Custom API Key Fields */}
        {showApiKeyInput && (
          <div className="pt-2 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fadeIn">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block font-semibold mb-0.5">
                Google Gemini API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={language.geminiApiKey || ''}
                onChange={(e) => onChangeLanguage({ geminiApiKey: e.target.value })}
                className="w-full text-xs rounded-lg px-2.5 py-1 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block font-semibold mb-0.5">
                OpenAI API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={language.openaiApiKey || ''}
                onChange={(e) => onChangeLanguage({ openaiApiKey: e.target.value })}
                className="w-full text-xs rounded-lg px-2.5 py-1 font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Language Matrix Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Source Language */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text-main)]">
            {t.sourceLangLabel}
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { code: 'ja', label: '日本語 (JP)' },
              { code: 'th', label: 'ภาษาไทย (TH)' },
              { code: 'en', label: 'English (EN)' },
            ].map((lang) => {
              const isSelected = language.sourceLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => onChangeLanguage({ sourceLang: lang.code as any })}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-[var(--text-main)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-black'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:border-[var(--border-active)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Languages */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text-main)]">
            {t.targetLangLabel}
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { code: 'th', label: 'ภาษาไทย (TH)' },
              { code: 'ja', label: '日本語 (JP)' },
              { code: 'en', label: 'English (EN)' },
            ].map((lang) => {
              const isSelected = language.targetLangs.includes(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => toggleTargetLang(lang.code)}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-[var(--text-main)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-black'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:border-[var(--border-active)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
