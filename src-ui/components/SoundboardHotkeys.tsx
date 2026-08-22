import React from 'react';
import { Volume2 } from 'lucide-react';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface SoundboardHotkeysProps {
  uiLang: UILang;
  onTriggerPhrase: (text: string) => void;
}

interface QuickPhrase {
  labelTh: string;
  labelJa: string;
  labelEn: string;
  jp: string;
  th: string;
  en: string;
}

const QUICK_PHRASES: QuickPhrase[] = [
  { labelTh: 'สวัสดี', labelJa: 'こんにちは', labelEn: 'Hello', jp: 'こんにちは！', th: 'สวัสดีค่า!', en: 'Hello everyone!' },
  { labelTh: 'ขอบคุณ', labelJa: 'ありがとう', labelEn: 'Thank you', jp: 'ありがとうございます！', th: 'ขอบคุณมากๆ เลยนะคะ!', en: 'Thank you so much!' },
  { labelTh: 'ขอบคุณสำหรับวันนี้', labelJa: 'お疲れ様', labelEn: 'Good work', jp: 'お疲れ様でした！', th: 'ขอบคุณสำหรับวันนี้นะคะ', en: 'Good work today / GG!' },
  { labelTh: 'เย้ ชนะแล้ว!', labelJa: 'やったー！', labelEn: 'We won!', jp: 'やったー！勝った！', th: 'เย้! ชนะแล้ววว!', en: 'Yay! We won!' },
  { labelTh: '55555+ (ขำ)', labelJa: '草ｗｗｗ', labelEn: 'LOL so funny', jp: '草ｗｗｗ', th: '55555+ ขำมาก', en: 'LOL so funny!' },
  { labelTh: 'น่ารักจัง', labelJa: 'かわいい', labelEn: 'So cute', jp: 'かわいい！', th: 'น่ารักมากๆ เลย!', en: 'So cute!' },
  { labelTh: 'ช่วยด้วยยย', labelJa: '助けてー！', labelEn: 'Help me', jp: '助けてー！', th: 'ช่วยด้วยยย!', en: 'Help me please!' },
  { labelTh: 'เล่นดีมาก GG', labelJa: 'ナイスGG', labelEn: 'Nice GG', jp: 'ナイスプレイ！GG！', th: 'เล่นดีมาก GG จ้า!', en: 'Nice play! Good game!' },
];

export const SoundboardHotkeys: React.FC<SoundboardHotkeysProps> = ({
  uiLang,
  onTriggerPhrase,
}) => {
  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.th;

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
        {QUICK_PHRASES.map((phrase, idx) => {
          const displayTitle = uiLang === 'ja' ? phrase.labelJa : uiLang === 'en' ? phrase.labelEn : phrase.labelTh;
          const displaySub = uiLang === 'ja' ? phrase.jp : uiLang === 'en' ? phrase.en : phrase.th;

          return (
            <button
              key={idx}
              onClick={() => onTriggerPhrase(phrase.jp)}
              className="p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)] text-left transition-all group"
            >
              <div className="text-[11px] font-black text-[var(--text-main)] group-hover:text-[var(--btn-primary-text)] truncate">
                {displayTitle}
              </div>
              <div className="text-[9px] text-[var(--text-muted)] group-hover:text-[var(--btn-primary-text)]/80 truncate">
                {displaySub}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
