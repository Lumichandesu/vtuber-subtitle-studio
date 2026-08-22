import React from 'react';
import { Volume2 } from 'lucide-react';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface SoundboardHotkeysProps {
  uiLang: UILang;
  onTriggerPhrase: (text: string) => void;
}

interface QuickPhrase {
  label: string;
  jp: string;
  th: string;
  en: string;
}

const QUICK_PHRASES: QuickPhrase[] = [
  { label: 'Konnichiwa', jp: 'こんにちは！', th: 'สวัสดีค่า!', en: 'Hello everyone!' },
  { label: 'Arigatou', jp: 'ありがとうございます！', th: 'ขอบคุณมากๆ เลยนะคะ!', en: 'Thank you so much!' },
  { label: 'Otsukare', jp: 'お疲れ様でした！', th: 'ขอบคุณสำหรับวันนี้นะคะ', en: 'Good work today / GG!' },
  { label: 'Yatta!', jp: 'やったー！勝った！', th: 'เย้! ชนะแล้ววว!', en: 'Yay! We won!' },
  { label: '555+ (草)', jp: '草ｗｗｗ', th: '55555+ ขำมาก', en: 'LOL so funny!' },
  { label: 'Kawaii', jp: 'かわいい！', th: 'น่ารักมากๆ เลย!', en: 'So cute!' },
  { label: 'Tasukete', jp: '助けてー！', th: 'ช่วยด้วยยย!', en: 'Help me please!' },
  { label: 'GG / Nice', jp: 'ナイスプレイ！GG！', th: 'เล่นดีมาก GG จ้า!', en: 'Nice play! Good game!' },
];

export const SoundboardHotkeys: React.FC<SoundboardHotkeysProps> = ({
  uiLang,
  onTriggerPhrase,
}) => {
  const t = UI_TRANSLATIONS[uiLang];

  return (
    <div className="glass-panel p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[var(--btn-secondary-bg)] text-[var(--text-main)]">
            <Volume2 className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-extrabold text-xs text-[var(--text-main)]">
            {t.soundboardTitle}
          </h3>
        </div>
        <span className="text-[10px] text-[var(--text-muted)]">{t.soundboardSub}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {QUICK_PHRASES.map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => onTriggerPhrase(phrase.jp)}
            className="p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)] text-left transition-all group"
          >
            <div className="text-[11px] font-black text-[var(--text-main)] group-hover:text-[var(--btn-primary-text)] truncate">{phrase.label}</div>
            <div className="text-[9px] text-[var(--text-muted)] group-hover:text-[var(--btn-primary-text)]/80 truncate">
              {uiLang === 'th' ? phrase.th : uiLang === 'ja' ? phrase.jp : phrase.en}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
