import React, { useState } from 'react';
import { BookOpen, Key, Zap, Sparkles, Bot } from 'lucide-react';
import type { TranslationConfig } from '../../src-server/types/schema';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';
import type { AppEdition } from '../App';
import { PanelHeader, ProChip } from './ui';

interface LanguageMatrixProps {
  language: TranslationConfig;
  uiLang: UILang;
  edition?: AppEdition;
  onChangeLanguage: (lang: Partial<TranslationConfig>) => void;
  onOpenGlossary: () => void;
  onOpenProModal?: () => void;
}

const LANG_OPTIONS = [
  { code: 'th', native: 'ภาษาไทย', tag: 'TH' },
  { code: 'ja', native: '日本語', tag: 'JP' },
  { code: 'en', native: 'English', tag: 'EN' },
];

export const LanguageMatrix: React.FC<LanguageMatrixProps> = ({
  language,
  uiLang,
  edition = 'pro',
  onChangeLanguage,
  onOpenGlossary,
  onOpenProModal,
}) => {
  const t = UI_TRANSLATIONS[uiLang];
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleSelectEngine = (engineId: string) => {
    if (edition === 'free' && engineId !== 'built-in') {
      onOpenProModal?.();
      return;
    }
    onChangeLanguage({ aiEngine: engineId as any });
  };

  const toggleTargetLang = (code: string) => {
    if (edition === 'free') {
      onChangeLanguage({ targetLangs: [code] });
      return;
    }

    const current = language.targetLangs || [];
    if (current.includes(code)) {
      if (current.length > 1) {
        onChangeLanguage({ targetLangs: current.filter((l) => l !== code) });
      }
    } else {
      onChangeLanguage({ targetLangs: [...current, code] });
    }
  };

  const engines = [
    { id: 'built-in', icon: Zap, name: t.engineBuiltInName, desc: t.engineBuiltInDesc, isPro: false },
    { id: 'gemini', icon: Sparkles, name: t.engineGeminiName, desc: t.engineGeminiDesc, isPro: true },
    { id: 'openai', icon: Bot, name: t.engineOpenaiName, desc: t.engineOpenaiDesc, isPro: true },
  ];

  return (
    <section className="panel space-y-4" aria-labelledby="lang-title">
      <PanelHeader id="lang-title" step="2" tone="pink" title={t.matrixTitle} desc={t.matrixDesc}>
        <button type="button" onClick={onOpenGlossary} className="btn btn-secondary">
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span>{t.slangDictBtn}</span>
          {edition === 'free' && <ProChip />}
        </button>
      </PanelHeader>

      {/* Source / target languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
        <div className="space-y-1.5" role="group" aria-labelledby="src-lang-label">
          <span id="src-lang-label" className="field-label block">{t.sourceLangLabel}</span>
          <div className="grid grid-cols-3 gap-1.5">
            {LANG_OPTIONS.map((lang) => (
              <button
                key={lang.code}
                type="button"
                lang={lang.code}
                onClick={() => onChangeLanguage({ sourceLang: lang.code as any })}
                aria-pressed={language.sourceLang === lang.code}
                className="tile !px-1 !py-2 text-center"
                title={lang.tag}
              >
                <span className="tile-title">{lang.native}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5" role="group" aria-labelledby="tgt-lang-label">
          <div className="flex items-center justify-between gap-2">
            <span id="tgt-lang-label" className="field-label">{t.targetLangLabel}</span>
            {edition === 'free' && <span className="text-xs text-warn">{t.oneLangInFree}</span>}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {LANG_OPTIONS.map((lang) => (
              <button
                key={lang.code}
                type="button"
                lang={lang.code}
                onClick={() => toggleTargetLang(lang.code)}
                aria-pressed={language.targetLangs.includes(lang.code)}
                className="tile !px-1 !py-2 text-center"
                title={lang.tag}
              >
                <span className="tile-title">{lang.native}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Translation engine */}
      <div className="box space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="box-title">
            {t.aiModelLabel}
            <span className="chip chip-blue">{t.fastEngineChip}</span>
          </span>
          {edition === 'pro' && (
            <button
              type="button"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              aria-expanded={showApiKeyInput}
              className="btn btn-ghost btn-sm !min-h-[26px] !px-2"
            >
              <Key className="w-3.5 h-3.5" aria-hidden="true" />
              {showApiKeyInput ? t.apiKeyHide : t.apiKeyShow}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 2xl:grid-cols-1 gap-2">
          {engines.map((engine) => {
            const Icon = engine.icon;
            const isSelected = (edition === 'free' ? 'built-in' : language.aiEngine) === engine.id;
            return (
              <button
                key={engine.id}
                type="button"
                onClick={() => handleSelectEngine(engine.id)}
                aria-pressed={isSelected}
                className="tile"
              >
                <div className="flex items-center gap-2">
                  <span className="check-dot" aria-hidden="true" />
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="tile-title truncate">{engine.name}</span>
                  {edition === 'free' && engine.isPro && <ProChip className="ml-auto" />}
                </div>
                <p className="tile-desc pl-6">{engine.desc}</p>
              </button>
            );
          })}
        </div>

        {edition === 'pro' && showApiKeyInput && (
          <div className="pt-2.5 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
            <div className="space-y-1">
              <label htmlFor="gemini-key" className="field-label block">{t.geminiKeyLabel}</label>
              <input
                id="gemini-key"
                type="password"
                autoComplete="off"
                placeholder="AIzaSy..."
                value={language.geminiApiKey || ''}
                onChange={(e) => onChangeLanguage({ geminiApiKey: e.target.value })}
                className="field font-mono"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="openai-key" className="field-label block">{t.openaiKeyLabel}</label>
              <input
                id="openai-key"
                type="password"
                autoComplete="off"
                placeholder="sk-..."
                value={language.openaiApiKey || ''}
                onChange={(e) => onChangeLanguage({ openaiApiKey: e.target.value })}
                className="field font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
