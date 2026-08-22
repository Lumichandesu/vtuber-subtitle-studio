/**
 * Massive In-Memory Preloaded Lexicon & High-Frequency Stream Cache
 * Preloads 0ms instant translations for top Japanese, Thai, and English conversational phrases.
 */

export interface LexiconEntry {
  ja: string;
  th: string;
  en: string;
  romaji?: string;
}

export const PRELOADED_LEXICON: LexiconEntry[] = [
  // Greetings & Farewells
  { ja: 'こんにちは', th: 'สวัสดีค่าทุกคน!', en: 'Hello everyone!', romaji: 'Konnichiwa' },
  { ja: '皆さんこんにちは', th: 'สวัสดีแฟนคลับทุกคนค่า!', en: 'Hello everyone!', romaji: 'Minasan konnichiwa' },
  { ja: '皆さん、聞こえてますか？', th: 'ทุกคนได้ยินฉันไหมคะ?', en: 'Can you all hear me?', romaji: 'Minasan, kikoetemasu ka?' },
  { ja: '聞こえますか', th: 'ได้ยินชัดเจนไหมคะ?', en: 'Can you hear me?', romaji: 'Kikoemasu ka' },
  { ja: 'こんばんは', th: 'สวัสดีตอนเย็นค่า!', en: 'Good evening everyone!', romaji: 'Konbanwa' },
  { ja: 'おはようございます', th: 'อรุณสวัสดิ์ค่าทุกคน!', en: 'Good morning everyone!', romaji: 'Ohayou gozaimasu' },
  { ja: 'お疲れ様でした', th: 'ขอบคุณสำหรับวันนี้นะคะ เหนื่อยหน่อยนะ!', en: 'Thank you for today / Good work!', romaji: 'Otsukaresama deshita' },
  { ja: 'おつかれさま', th: 'ขอบคุณสำหรับวันนี้นะคะ!', en: 'Good work today / GG!', romaji: 'Otsukaresama' },
  { ja: 'またね', th: 'แล้วเจอกันใหม่นะ บ๊ายบาย!', en: 'See you next time! Bye bye!', romaji: 'Mata ne' },
  { ja: 'バイバイ', th: 'บ๊ายบายทุกคนค่า!', en: 'Bye bye everyone!', romaji: 'Baibai' },
  { ja: 'おやすみなさい', th: 'ฝันดีนะทุกคน ราตรีสวัสดิ์ค่า!', en: 'Good night everyone!', romaji: 'Oyasuminasai' },

  // Gratitude & Politeness
  { ja: 'ありがとうございます', th: 'ขอบคุณมากๆ เลยนะคะ!', en: 'Thank you so much!', romaji: 'Arigatou gozaimasu' },
  { ja: 'ありがとう', th: 'ขอบคุณน้า!', en: 'Thank you!', romaji: 'Arigatou' },
  { ja: 'どういたしまして', th: 'ด้วยความยินดีค่า ไม่เป็นไรเลย!', en: 'You are very welcome!', romaji: 'Douitashimashite' },
  { ja: 'すみません', th: 'ขอโทษด้วยนะคะ / รบกวนด้วยนะ', en: 'Excuse me / I am sorry', romaji: 'Sumimasen' },
  { ja: 'ごめんなさい', th: 'ขอโทษจริงๆ นะคะ!', en: 'I am so sorry!', romaji: 'Gomen nasai' },
  { ja: 'よろしくお願いします', th: 'ฝากเนื้อฝากตัวด้วยนะคะ!', en: 'Please take care of me / Nice to meet you!', romaji: 'Yoroshiku onegaishimasu' },
  { ja: 'よろしくね', th: 'ฝากด้วยน้า!', en: 'Nice to work with you!', romaji: 'Yoroshiku ne' },

  // Streamer Reactions & Emotions
  { ja: 'やったー', th: 'เย้! สำเร็จแล้ววว!', en: 'Yay! We did it!', romaji: 'Yattaa' },
  { ja: 'やったー！勝った！', th: 'เย้! ชนะแล้ววว ชนะขาดเลย!', en: 'Yay! We won! Victory!', romaji: 'Yattaa! Katta!' },
  { ja: 'すごい', th: 'สุดยอดไปเลย!', en: 'Amazing / Incredible!', romaji: 'Sugoi' },
  { ja: 'すごすぎる', th: 'สุดยอดเกินไปแล้ว!', en: 'That is way too amazing!', romaji: 'Sugosugiru' },
  { ja: 'かわいい', th: 'น่ารักมากๆ เลย!', en: 'So cute!', romaji: 'Kawaii' },
  { ja: '超かわいい', th: 'น่ารักโคตรๆ เลยอ่ะ!', en: 'Super cute!', romaji: 'Chou kawaii' },
  { ja: '草', th: '55555+ ขำมาก', en: 'LOL / LMAO so funny', romaji: 'Kusa (LOL)' },
  { ja: '草ｗｗｗ', th: '55555+ ฮาไม่ไหวแล้ว', en: 'LOLOLOL so hilarious', romaji: 'Kusa www' },
  { ja: '助けて', th: 'ช่วยด้วยยย ช่วยฉันที!', en: 'Help me please!', romaji: 'Tasukete' },
  { ja: '助けてー', th: 'ช่วยด้วยค่าาา!', en: 'Help meeee!', romaji: 'Tasuketeee' },
  { ja: '危ない', th: 'อันตรายแล้ว ระวัง!', en: 'Watch out! Dangerous!', romaji: 'Abunai' },
  { ja: '危なかった', th: 'เกือบไปแล้ว เกือบตาย!', en: 'That was so close!', romaji: 'Abunakatta' },
  { ja: 'うそでしょ', th: 'โกหกน่า จริงดิ ไม่จริงใช่ไหม?!', en: 'No way! Are you kidding me?!', romaji: 'Uso desho' },
  { ja: 'まじで', th: 'จริงป่ะเนี่ย?!', en: 'Seriously?! / For real?!', romaji: 'Maji de' },
  { ja: '本当ですか', th: 'จริงเหรอคะเนี่ย?!', en: 'Is that really true?!', romaji: 'Hontou desu ka' },
  { ja: 'なるほど', th: 'อย่างนี้นี่เอง เข้าใจแล้ว!', en: 'I see / That makes total sense!', romaji: 'Naruhodo' },
  { ja: 'いいね', th: 'ดีมากเลย เยี่ยม!', en: 'Nice / Good job!', romaji: 'Ii ne' },
  { ja: 'ナイス', th: 'สวยมาก! เล่นดีมาก!', en: 'Nice play!', romaji: 'Naisu' },
  { ja: 'ナイスプレイ', th: 'เล่นสวยมากเลย GG!', en: 'Nice play! Good game!', romaji: 'Naisu purei' },

  // Stream Interaction & Chat Calling
  { ja: '初見さんいらっしゃい', th: 'ยินดีต้อนรับผู้ชมใหม่ทุกคนค่า!', en: 'Welcome first-time viewers!', romaji: 'Shoken-san irasshai' },
  { ja: 'いらっしゃいませ', th: 'ยินดีต้อนรับทุกคนเข้าสู่สตรีมค่า!', en: 'Welcome to the stream!', romaji: 'Irasshaimase' },
  { ja: 'チャンネル登録お願いします', th: 'อย่าลืมกดติดตามและกดกระดิ่งกันด้วยนะคะ!', en: 'Please subscribe to the channel!', romaji: 'Channeru touroku onegaishimasu' },
  { ja: '高評価お願いします', th: 'อย่าลืมกดไลก์ให้กำลังใจกันด้วยน้า!', en: 'Please leave a like on the stream!', romaji: 'Kouhyouka onegaishimasu' },
  { ja: 'スパチャありがとうございます', th: 'ขอบคุณสำหรับ Super Chat มากๆ เลยนะคะ!', en: 'Thank you so much for the Super Chat!', romaji: 'Supacha arigatou gozaimasu' },
  { ja: 'ギフトありがとうございます', th: 'ขอบคุณสำหรับของขวัญมากๆ เลยค่า!', en: 'Thank you so much for the gift!', romaji: 'Gifuto arigatou gozaimasu' },
  { ja: 'コメントありがとう', th: 'ขอบคุณทุกคอมเมนต์เลยนะ!', en: 'Thank you for all your comments!', romaji: 'Komento arigatou' },
  { ja: '今日も配信見に来てくれてありがとう', th: 'ขอบคุณที่แวะเข้ามาดูสตรีมในวันนี้นะคะ!', en: 'Thank you for coming to my stream today!', romaji: 'Kyou mo haishin mini kite kurete arigatou' },
  { ja: '今日の配信はここまで', th: 'สตรีมสำหรับวันนี้จบลงเท่านี้ค่า!', en: 'That is all for today\'s livestream!', romaji: 'Kyou no haishin wa koko made' },

  // Gaming Actions
  { ja: '行くぞ', th: 'ไปกันเล้ยยย ลุยยย!', en: 'Let\'s goooo!', romaji: 'Iku zo' },
  { ja: 'よし、行こう', th: 'เอาล่ะ ลุยกันเลย!', en: 'Alright, let\'s go!', romaji: 'Yoshi, ikou' },
  { ja: '勝った', th: 'ชนะแล้ววว!', en: 'We won!', romaji: 'Katta' },
  { ja: '負けた', th: 'แพ้ซะแล้ว เสียดายจัง!', en: 'We lost! Ah so close!', romaji: 'Maketa' },
  { ja: '悔しい', th: 'เจ็บใจจังเลยอ่ะ!', en: 'So frustrating!', romaji: 'Kuyashii' },
  { ja: 'もう一回', th: 'ขออีกรอบนึงนะ!', en: 'One more round please!', romaji: 'Mou ikkai' },
  { ja: 'ラストゲーム', th: 'ตา最後แล้วน้า!', en: 'Last game for today!', romaji: 'Rasuto geemu' },
  { ja: '敵発見', th: 'เจอศัตรูแล้ว!', en: 'Enemy spotted!', romaji: 'Teki hakken' },
  { ja: '後ろ後ろ', th: 'ข้างหลังๆ ระวังข้างหลัง!', en: 'Behind you! Watch your back!', romaji: 'Ushiro ushiro' },
  { ja: '回復して', th: 'ขอฮีลหน่อย ช่วยเติมเลือดที!', en: 'Heal me please!', romaji: 'Kaifuku shite' },
  { ja: 'ナイスキル', th: 'คิลสวยมาก!', en: 'Nice kill!', romaji: 'Naisu kiru' },
];

class OfflineLexiconManager {
  private jaMap = new Map<string, LexiconEntry>();
  private thMap = new Map<string, LexiconEntry>();
  private enMap = new Map<string, LexiconEntry>();

  constructor() {
    this.buildIndexes();
  }

  private buildIndexes() {
    for (const entry of PRELOADED_LEXICON) {
      // Normalize keys
      const jaKey = this.normalize(entry.ja);
      const thKey = this.normalize(entry.th);
      const enKey = this.normalize(entry.en);

      this.jaMap.set(jaKey, entry);
      this.thMap.set(thKey, entry);
      this.enMap.set(enKey, entry);
    }
  }

  private normalize(text: string): string {
    return text.toLowerCase().replace(/[\s.,!?！？。、〜~]/g, '');
  }

  public lookup(text: string, sourceLang: string, targetLangs: string[]): { translations: Record<string, string>; romaji?: string } | null {
    const key = this.normalize(text);
    if (!key) return null;

    let matched: LexiconEntry | undefined;

    if (sourceLang === 'ja') {
      matched = this.jaMap.get(key);
    } else if (sourceLang === 'th') {
      matched = this.thMap.get(key);
    } else if (sourceLang === 'en') {
      matched = this.enMap.get(key);
    } else {
      matched = this.jaMap.get(key) || this.thMap.get(key) || this.enMap.get(key);
    }

    if (!matched) return null;

    const translations: Record<string, string> = {};
    for (const target of targetLangs) {
      if (target === 'ja') translations['ja'] = matched.ja;
      if (target === 'th') translations['th'] = matched.th;
      if (target === 'en') translations['en'] = matched.en;
    }

    return { translations, romaji: matched.romaji };
  }
}

export const offlineLexicon = new OfflineLexiconManager();
