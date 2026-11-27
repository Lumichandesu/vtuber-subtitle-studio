import React from 'react';
import { Megaphone } from 'lucide-react';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';
import type { AppEdition } from '../App';
import { ProChip } from './ui';

interface SoundboardHotkeysProps {
  uiLang: UILang;
  edition?: AppEdition;
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
  edition = 'pro',
  onTriggerPhrase,
}) => {
  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.th;

  return (
    <section className="panel space-y-3" aria-labelledby="phrases-title">
      <div className="panel-head">
        <div className="flex items-center gap-2.5 min-w-0">
          <Megaphone className="w-4 h-4 shrink-0" aria-hidden="true" />
          <h2 id="phrases-title" className="text-[0.9375rem] font-semibold text-ink">{t.soundboardTitle}</h2>
          {edition === 'free' && <ProChip />}
        </div>
        <span className="hint text-right">{t.soundboardSub}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {QUICK_PHRASES.map((phrase, idx) => {
          const displayTitle = uiLang === 'ja' ? phrase.labelJa : uiLang === 'en' ? phrase.labelEn : phrase.labelTh;
          const displaySub = uiLang === 'ja' ? phrase.jp : uiLang === 'en' ? phrase.en : phrase.th;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onTriggerPhrase(phrase.jp)}
              className="tile !px-2.5 !py-2 min-w-0"
            >
              <span className="tile-title block truncate">{displayTitle}</span>
              <span className="tile-desc block truncate">{displaySub}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
