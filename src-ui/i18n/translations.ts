export type UILang = 'th' | 'ja' | 'en';

export interface TranslationDictionary {
  appTitle: string;
  appTagline: string;
  badge: string;
  streamSimultaneous: string;
  step1Title: string;
  step1Desc: string;
  talkingBadge: string;
  testMicBtn: string;
  stopMicBtn: string;
  selectMic: string;
  defaultMic: string;
  rescan: string;
  rescanTitle: string;
  vuLevel: string;
  gateOpen: string;
  gateClosed: string;
  testResultTitle: string;
  engineActive: string;
  spokenLabel: string;
  listeningPrompt: string;
  idlePrompt: string;

  sttEngineModeTitle: string;
  studioMicHiFi: string;
  qualityModeTitle: string;
  qualityModeDesc: string;
  speedModeTitle: string;
  speedModeDesc: string;

  matrixTitle: string;
  matrixDesc: string;
  fastEngineChip: string;
  slangDictBtn: string;
  aiModelLabel: string;
  apiKeyShow: string;
  apiKeyHide: string;
  geminiKeyLabel: string;
  openaiKeyLabel: string;
  engineBuiltInName: string;
  engineBuiltInDesc: string;
  engineGeminiName: string;
  engineGeminiDesc: string;
  engineOpenaiName: string;
  engineOpenaiDesc: string;
  sourceLangLabel: string;
  targetLangLabel: string;

  step2Title: string;
  step2Desc: string;
  presetsLabel: string;
  fontPickerLabel: string;
  fontCatAll: string;
  fontCatJp: string;
  fontCatTh: string;
  fontCatEn: string;
  fontCatLocal: string;
  fontSourceLocal: string;
  fontSourceOnline: string;
  sizeGroupLabel: string;
  colorGroupLabel: string;
  displayGroupLabel: string;
  mainFontSize: string;
  transFontSize: string;
  strokeWidth: string;
  glowBlur: string;
  colorMain: string;
  colorTh: string;
  colorEn: string;
  colorGlow: string;
  autoFade: string;
  persistent: string;
  showSource: string;
  showRomaji: string;
  maxLinesNote: string;

  step3Title: string;
  step3Desc: string;
  previewBgLabel: string;
  bgDark: string;
  bgGreen: string;
  bgGrid: string;
  bgStreamer: string;
  obsCanvasLabel: string;
  clearBtn: string;
  inputPlaceholder: string;
  broadcastBtn: string;
  quickSamplesLabel: string;

  soundboardTitle: string;
  soundboardSub: string;

  historyTitle: string;
  linesInMemory: string;
  noHistory: string;
  exportSrtTitle: string;
  exportVttTitle: string;
  copyLine: string;

  step4Btn: string;
  deployTitle: string;
  deployDesc: string;
  overlayUrlLabel: string;
  openOverlay: string;
  copyUrlBtn: string;
  copiedUrlBtn: string;
  resolutionSetting: string;
  threeSteps: string;
  step1Guide: string;
  step1GuideSub: string;
  step2Guide: string;
  step2GuideSub: string;
  step3Guide: string;
  step3GuideSub: string;
  copyCss: string;
  copiedCss: string;
  doneBtn: string;
  closeBtn: string;

  proEditionLabel: string;
  freeEditionLabel: string;
  upgradeBtn: string;
  freeEditionBanner: string;
  viewProGumroad: string;
  proModalTitle: string;
  proModalSubtitle: string;
  proFeature1Title: string;
  proFeature1Desc: string;
  proFeature2Title: string;
  proFeature2Desc: string;
  proFeature3Title: string;
  proFeature3Desc: string;
  proFeature4Title: string;
  proFeature4Desc: string;
  switchModeSimulation: string;
  switchModeFree: string;
  buyOnGumroad: string;
  oneLangInFree: string;
  glossaryModalTitle: string;
  glossaryModalDesc: string;
  glossaryEmpty: string;
  glossaryLangLabel: string;
  removeTerm: string;
  addTermBtn: string;
  sourcePatternPlaceholder: string;
  replacementPlaceholder: string;

  uiLanguageLabel: string;
  themeToLight: string;
  themeToDark: string;
  latencyTitle: string;
  cpuTitle: string;
  ramTitle: string;
  editionLabel: string;
  connecting: string;
  ramUsage: string;
  latency: string;
  sidecarActive: string;
}

export const UI_TRANSLATIONS: Record<UILang, TranslationDictionary> = {
  th: {
    appTitle: 'VTuber Subtitle Studio',
    appTagline: 'ซับไตเติลและแปลภาษาสดบน OBS',
    badge: 'หน่วงต่ำมาก',
    streamSimultaneous: 'แปลพร้อมกัน',
    step1Title: 'ไมค์และการฟังเสียง',
    step1Desc: 'เลือกไมค์ แล้วลองพูดเพื่อตรวจว่าระบบได้ยินและแปลถูกต้อง',
    talkingBadge: 'กำลังพูด',
    testMicBtn: 'เริ่มฟังไมค์',
    stopMicBtn: 'หยุดไมค์',
    selectMic: 'ไมโครโฟน',
    defaultMic: 'ไมค์เริ่มต้นของระบบ',
    rescan: 'สแกนใหม่',
    rescanTitle: 'ค้นหาอุปกรณ์เสียงที่เสียบอยู่อีกครั้ง',
    vuLevel: 'ระดับเสียง',
    gateOpen: 'รับเสียงอยู่',
    gateClosed: 'ตัดเสียงรบกวน',
    testResultTitle: 'ผลการฟังล่าสุด',
    engineActive: 'เวลาตอบสนอง',
    spokenLabel: 'ที่พูด',
    listeningPrompt: 'กำลังฟังอยู่ ลองพูดสักประโยคเพื่อดูคำแปล',
    idlePrompt: 'กด "เริ่มฟังไมค์" แล้วลองพูดเพื่อทดสอบ',

    sttEngineModeTitle: 'โหมดถอดเสียงพูด',
    studioMicHiFi: 'Studio Mic 48kHz (ไม่บีบอัด)',
    qualityModeTitle: 'คุณภาพสูงสุด (แนะนำ)',
    qualityModeDesc: 'ฟังชัด แม่นยำ ปรับเสียง 48kHz เหมาะกับประโยคยาวและภาษาญี่ปุ่น',
    speedModeTitle: 'เร็วพิเศษ (< 30 ms)',
    speedModeDesc: 'ขึ้นจอทีละคำทันที เน้นความไว',

    matrixTitle: 'ภาษาและการแปล',
    matrixDesc: 'เลือกภาษาที่คุณพูด และภาษาที่จะแสดงบน OBS พร้อมกัน',
    fastEngineChip: '< 40 ms',
    slangDictBtn: 'พจนานุกรมคำเฉพาะ',
    aiModelLabel: 'โมเดล AI สำหรับแปล',
    apiKeyShow: 'ใส่ API Key ของตัวเอง',
    apiKeyHide: 'ซ่อน API Key',
    geminiKeyLabel: 'Google Gemini API Key (ไม่บังคับ)',
    openaiKeyLabel: 'OpenAI API Key (ไม่บังคับ)',
    engineBuiltInName: 'Neural AI (ฟรี)',
    engineBuiltInDesc: 'เร็วที่สุด ไม่ต้องใช้คีย์',
    engineGeminiName: 'Google Gemini 2.5 Flash',
    engineGeminiDesc: 'แปลเป็นธรรมชาติ เข้าใจภาษาสตรีม',
    engineOpenaiName: 'OpenAI GPT-4o-mini',
    engineOpenaiDesc: 'แม่นยำสูงสำหรับประโยคยาว',
    sourceLangLabel: 'ภาษาที่คุณพูด',
    targetLangLabel: 'แสดงคำแปลเป็น',

    step2Title: 'หน้าตาซับไตเติล',
    step2Desc: 'พรีเซ็ต ฟอนต์ ขนาด ขอบตัวอักษร แสง และสี',
    presetsLabel: 'พรีเซ็ต',
    fontPickerLabel: 'ฟอนต์',
    fontCatAll: 'ทั้งหมด',
    fontCatJp: 'ญี่ปุ่น',
    fontCatTh: 'ไทย',
    fontCatEn: 'อังกฤษ',
    fontCatLocal: 'ในเครื่อง',
    fontSourceLocal: 'ในเครื่อง',
    fontSourceOnline: 'ออนไลน์',
    sizeGroupLabel: 'ขนาดและขอบ',
    colorGroupLabel: 'สี',
    displayGroupLabel: 'การแสดงผล',
    mainFontSize: 'ขนาดข้อความหลัก',
    transFontSize: 'ขนาดคำแปล',
    strokeWidth: 'ความหนาขอบ',
    glowBlur: 'แสงเรือง',
    colorMain: 'ข้อความหลัก',
    colorTh: 'ภาษาไทย (TH)',
    colorEn: 'ภาษาอื่น (EN/JP)',
    colorGlow: 'สีแสงเรือง',
    autoFade: 'ซ่อนอัตโนมัติหลัง',
    persistent: 'ค้างไว้',
    showSource: 'แสดงประโยคต้นฉบับ',
    showRomaji: 'แสดงโรมันจิ',
    maxLinesNote: 'ตัดขึ้นบรรทัดใหม่อัตโนมัติเมื่อยาวเกิน 2 บรรทัด',

    step3Title: 'ตัวอย่างบนจอ OBS',
    step3Desc: 'ซับแบบเดียวกับที่ผู้ชมเห็นในสตรีม',
    previewBgLabel: 'พื้นหลังตัวอย่าง',
    bgDark: 'มืด',
    bgGreen: 'กรีนสกรีน',
    bgGrid: 'ตาราง',
    bgStreamer: 'จอเกม',
    obsCanvasLabel: 'OBS 1920 x 1080',
    clearBtn: 'ล้างซับไตเติล',
    inputPlaceholder: 'พิมพ์ข้อความเพื่อส่งขึ้นจอและดูคำแปล',
    broadcastBtn: 'ส่งขึ้นจอ',
    quickSamplesLabel: 'ข้อความตัวอย่าง',

    soundboardTitle: 'ปุ่มประโยคลัด',
    soundboardSub: 'กดครั้งเดียว ส่งคำแปลขึ้น OBS ทันที',

    historyTitle: 'ประวัติคำพูด',
    linesInMemory: 'บรรทัด',
    noHistory: 'ยังไม่มีประวัติ ลองพูดผ่านไมค์เพื่อเริ่มบันทึก',
    exportSrtTitle: 'ดาวน์โหลด .SRT สำหรับ Premiere Pro / DaVinci Resolve',
    exportVttTitle: 'ดาวน์โหลด .VTT (WebVTT)',
    copyLine: 'คัดลอกบรรทัดนี้',

    step4Btn: 'เชื่อมต่อ OBS',
    deployTitle: 'เชื่อมต่อกับ OBS Studio',
    deployDesc: 'คัดลอก URL ไปวางใน Browser Source ของ OBS แล้วใช้งานได้ทันที',
    overlayUrlLabel: 'URL สำหรับ Browser Source',
    openOverlay: 'เปิดโอเวอร์เลย์ในเบราว์เซอร์',
    copyUrlBtn: 'คัดลอก URL',
    copiedUrlBtn: 'คัดลอกแล้ว',
    resolutionSetting: 'ความละเอียดของซีนใน OBS',
    threeSteps: '3 ขั้นตอนใน OBS Studio',
    step1Guide: '1. เพิ่ม Source',
    step1GuideSub: 'กด Sources (+) แล้วเลือก Browser',
    step2Guide: '2. วาง URL',
    step2GuideSub: 'วาง URL ที่คัดลอกไว้',
    step3Guide: '3. ตั้งขนาด',
    step3GuideSub: 'ใส่ความกว้าง x สูง แล้วกด OK',
    copyCss: 'คัดลอก Custom CSS',
    copiedCss: 'คัดลอก CSS แล้ว',
    doneBtn: 'เสร็จแล้ว',
    closeBtn: 'ปิด',

    proEditionLabel: 'PRO',
    freeEditionLabel: 'FREE',
    upgradeBtn: 'อัปเกรด',
    freeEditionBanner: 'คุณกำลังใช้รุ่นฟรี: แปล 1 ภาษา ด้วย Neural AI และโหมดเร็วพิเศษ',
    viewProGumroad: 'ดูฟีเจอร์ PRO',
    proModalTitle: 'VTuber Subtitle Studio PRO',
    proModalSubtitle: 'ปลดล็อกทุกฟีเจอร์สำหรับสตรีมเมอร์และ VTuber',
    proFeature1Title: 'แปลสองภาษาพร้อมกัน',
    proFeature1Desc: 'พูดประโยคเดียว ขึ้นจอทั้งญี่ปุ่น [JP] และอังกฤษ [EN] พร้อมกันบน OBS',
    proFeature2Title: 'ปรับเสียงไมค์ระดับสตูดิโอ 48kHz',
    proFeature2Desc: 'ตัดเสียงลม 80Hz เพิ่มความชัดพยัญชนะ 3.8kHz และปรับระดับเสียงให้สม่ำเสมอ',
    proFeature3Title: 'ส่งออกซับ VOD (.SRT / .VTT)',
    proFeature3Desc: 'เก็บไทม์ไลน์คำพูดทั้งสตรีม ส่งออกไปตัดคลิปไฮไลต์ลง YouTube ได้ทันที',
    proFeature4Title: 'พจนานุกรมคำเฉพาะและปุ่มประโยคลัด',
    proFeature4Desc: 'กำหนดคำเฉพาะของช่อง และยิงประโยคขึ้นจอได้ในคลิกเดียว',
    switchModeSimulation: 'สลับเป็นโหมด PRO',
    switchModeFree: 'สลับเป็นโหมด Free',
    buyOnGumroad: 'ซื้อรุ่น PRO บน Gumroad',
    oneLangInFree: 'รุ่นฟรีเลือกได้ 1 ภาษา',
    glossaryModalTitle: 'พจนานุกรมคำเฉพาะของช่อง',
    glossaryModalDesc: 'กำหนดคำสแลง ชื่อแฟนด้อม หรือชื่อเล่น ให้แปลตรงตามที่ต้องการบน OBS',
    glossaryEmpty: 'ยังไม่มีคำศัพท์ เพิ่มคำแรกด้านบนได้เลย',
    glossaryLangLabel: 'ภาษาปลายทาง',
    removeTerm: 'ลบคำนี้',
    addTermBtn: 'เพิ่มคำ',
    sourcePatternPlaceholder: 'คำที่พูด เช่น 草, てぇてぇ, GG',
    replacementPlaceholder: 'แปลเป็น เช่น 55555+',

    uiLanguageLabel: 'ภาษาของหน้าจอ',
    themeToLight: 'สลับเป็นธีมสว่าง',
    themeToDark: 'สลับเป็นธีมมืด',
    latencyTitle: 'เวลาหน่วงตั้งแต่พูดจนขึ้นจอ',
    cpuTitle: 'การใช้ CPU',
    ramTitle: 'หน่วยความจำของเซิร์ฟเวอร์',
    editionLabel: 'รุ่น',
    connecting: 'กำลังเชื่อมต่อ...',
    ramUsage: 'RAM',
    latency: 'หน่วง',
    sidecarActive: 'เซิร์ฟเวอร์ทำงานปกติ',
  },

  ja: {
    appTitle: 'VTuber Subtitle Studio',
    appTagline: 'OBS 向けリアルタイム字幕・翻訳',
    badge: '超低遅延',
    streamSimultaneous: '同時翻訳',
    step1Title: 'マイクと音声認識',
    step1Desc: 'マイクを選んで話しかけ、認識と翻訳が正しく動くか確認します',
    talkingBadge: '発話中',
    testMicBtn: 'マイクを開始',
    stopMicBtn: 'マイクを停止',
    selectMic: 'マイク',
    defaultMic: 'システムの既定のマイク',
    rescan: '再スキャン',
    rescanTitle: '接続中のオーディオデバイスを再検索',
    vuLevel: '入力レベル',
    gateOpen: '認識中',
    gateClosed: '待機中',
    testResultTitle: '最新の認識結果',
    engineActive: '応答時間',
    spokenLabel: '発話',
    listeningPrompt: '聞き取り中です。何か話すと翻訳が表示されます',
    idlePrompt: '「マイクを開始」を押して話しかけてください',

    sttEngineModeTitle: '音声認識モード',
    studioMicHiFi: 'Studio Mic 48kHz (非圧縮)',
    qualityModeTitle: '高品質 (おすすめ)',
    qualityModeDesc: '高精度で聞き取りが正確。48kHz 音声処理。長文や日本語に最適',
    speedModeTitle: '超高速 (< 30 ms)',
    speedModeDesc: '単語ごとに即表示。速度を優先',

    matrixTitle: '言語と翻訳',
    matrixDesc: '話す言語と、OBS に同時表示する言語を選びます',
    fastEngineChip: '< 40 ms',
    slangDictBtn: '用語辞書',
    aiModelLabel: '翻訳 AI モデル',
    apiKeyShow: '自分の API キーを使う',
    apiKeyHide: 'API キーを隠す',
    geminiKeyLabel: 'Google Gemini API キー (任意)',
    openaiKeyLabel: 'OpenAI API キー (任意)',
    engineBuiltInName: 'Neural AI (無料)',
    engineBuiltInDesc: '最速。キー不要',
    engineGeminiName: 'Google Gemini 2.5 Flash',
    engineGeminiDesc: '自然で配信向けの翻訳',
    engineOpenaiName: 'OpenAI GPT-4o-mini',
    engineOpenaiDesc: '長文でも高精度',
    sourceLangLabel: '話す言語',
    targetLangLabel: '翻訳の表示言語',

    step2Title: '字幕デザイン',
    step2Desc: 'プリセット、フォント、サイズ、縁取り、発光、色',
    presetsLabel: 'プリセット',
    fontPickerLabel: 'フォント',
    fontCatAll: 'すべて',
    fontCatJp: '日本語',
    fontCatTh: 'タイ語',
    fontCatEn: '英語',
    fontCatLocal: 'ローカル',
    fontSourceLocal: 'ローカル',
    fontSourceOnline: 'オンライン',
    sizeGroupLabel: 'サイズと縁取り',
    colorGroupLabel: '色',
    displayGroupLabel: '表示',
    mainFontSize: 'メイン文字サイズ',
    transFontSize: '翻訳文字サイズ',
    strokeWidth: '縁取りの太さ',
    glowBlur: '発光',
    colorMain: 'メインテキスト',
    colorTh: 'タイ語 (TH)',
    colorEn: 'その他の言語 (EN/JP)',
    colorGlow: '発光色',
    autoFade: '自動で消えるまで',
    persistent: '表示し続ける',
    showSource: '原文を表示',
    showRomaji: 'ローマ字を表示',
    maxLinesNote: '2 行を超えると自動で改行します',

    step3Title: 'OBS プレビュー',
    step3Desc: '視聴者が見るのと同じ字幕を確認できます',
    previewBgLabel: 'プレビュー背景',
    bgDark: 'ダーク',
    bgGreen: 'グリーンバック',
    bgGrid: 'グリッド',
    bgStreamer: 'ゲーム画面',
    obsCanvasLabel: 'OBS 1920 x 1080',
    clearBtn: '字幕をクリア',
    inputPlaceholder: 'テキストを入力して画面に送信',
    broadcastBtn: '送信',
    quickSamplesLabel: 'サンプル文',

    soundboardTitle: '定型句ボタン',
    soundboardSub: 'ワンクリックで OBS に字幕を送信',

    historyTitle: '発言履歴',
    linesInMemory: '行',
    noHistory: '履歴はまだありません。マイクで話すと記録されます',
    exportSrtTitle: 'Premiere Pro / DaVinci Resolve 用 .SRT をダウンロード',
    exportVttTitle: '.VTT (WebVTT) をダウンロード',
    copyLine: 'この行をコピー',

    step4Btn: 'OBS に接続',
    deployTitle: 'OBS Studio に接続',
    deployDesc: 'URL をコピーして OBS のブラウザソースに貼り付けるだけです',
    overlayUrlLabel: 'ブラウザソース用 URL',
    openOverlay: 'ブラウザでオーバーレイを開く',
    copyUrlBtn: 'URL をコピー',
    copiedUrlBtn: 'コピーしました',
    resolutionSetting: 'OBS のシーン解像度',
    threeSteps: 'OBS Studio での 3 ステップ',
    step1Guide: '1. ソース追加',
    step1GuideSub: 'ソース (+) から「ブラウザ」を選択',
    step2Guide: '2. URL を貼り付け',
    step2GuideSub: 'コピーした URL を入力',
    step3Guide: '3. サイズ設定',
    step3GuideSub: '幅と高さを入れて OK',
    copyCss: 'カスタム CSS をコピー',
    copiedCss: 'CSS をコピーしました',
    doneBtn: '完了',
    closeBtn: '閉じる',

    proEditionLabel: 'PRO',
    freeEditionLabel: 'FREE',
    upgradeBtn: 'アップグレード',
    freeEditionBanner: '無料版を使用中: Neural AI で 1 言語翻訳、超高速モード',
    viewProGumroad: 'PRO の機能を見る',
    proModalTitle: 'VTuber Subtitle Studio PRO',
    proModalSubtitle: 'VTuber・配信者向けの全機能をアンロック',
    proFeature1Title: '2 言語同時翻訳',
    proFeature1Desc: '1 回話すだけで [日本語] と [英語] (またはタイ語) を OBS に同時表示',
    proFeature2Title: '48kHz スタジオ品質の音声処理',
    proFeature2Desc: '80Hz 低域カット、3.8kHz 子音強調 EQ、音量の自動調整で認識がクリアに',
    proFeature3Title: 'VOD 字幕エクスポート (.SRT / .VTT)',
    proFeature3Desc: '配信中の発言をすべて記録し、ワンクリックで切り抜き編集用に書き出し',
    proFeature4Title: '用語辞書と定型句ボタン',
    proFeature4Desc: 'チャンネル固有の用語を登録し、定型句をワンクリックで表示',
    switchModeSimulation: 'PRO モードに切り替え',
    switchModeFree: 'FREE モードに切り替え',
    buyOnGumroad: 'Gumroad で PRO 版を購入',
    oneLangInFree: '無料版は 1 言語まで',
    glossaryModalTitle: 'チャンネル用語辞書',
    glossaryModalDesc: 'スラングやファンネーム、愛称を思い通りの訳語に自動で置き換えます',
    glossaryEmpty: '用語はまだありません。上から最初の用語を追加してください',
    glossaryLangLabel: '翻訳先の言語',
    removeTerm: 'この用語を削除',
    addTermBtn: '追加',
    sourcePatternPlaceholder: '元の語 (例: 草, てぇてぇ, GG)',
    replacementPlaceholder: '置き換え後 (例: ｗｗｗ)',

    uiLanguageLabel: '表示言語',
    themeToLight: 'ライトテーマに切り替え',
    themeToDark: 'ダークテーマに切り替え',
    latencyTitle: '発話から表示までの遅延',
    cpuTitle: 'CPU 使用率',
    ramTitle: 'サーバーのメモリ使用量',
    editionLabel: 'エディション',
    connecting: '接続中...',
    ramUsage: 'RAM',
    latency: '遅延',
    sidecarActive: 'サーバー稼働中',
  },

  en: {
    appTitle: 'VTuber Subtitle Studio',
    appTagline: 'Live subtitles and translation for OBS',
    badge: 'Ultra low latency',
    streamSimultaneous: 'Live translation',
    step1Title: 'Mic and listening',
    step1Desc: 'Pick your mic and say something to check recognition and translation',
    talkingBadge: 'Talking',
    testMicBtn: 'Start mic',
    stopMicBtn: 'Stop mic',
    selectMic: 'Microphone',
    defaultMic: 'Default system microphone',
    rescan: 'Rescan',
    rescanTitle: 'Look for connected audio devices again',
    vuLevel: 'Input level',
    gateOpen: 'Listening',
    gateClosed: 'Gate closed',
    testResultTitle: 'Latest result',
    engineActive: 'Response time',
    spokenLabel: 'You said',
    listeningPrompt: 'Listening. Say a sentence to see the translation',
    idlePrompt: 'Press "Start mic" and say something to test',

    sttEngineModeTitle: 'Speech recognition mode',
    studioMicHiFi: 'Studio Mic 48kHz (uncompressed)',
    qualityModeTitle: 'Best quality (recommended)',
    qualityModeDesc: 'Most accurate, 48kHz voice processing. Best for long sentences and Japanese',
    speedModeTitle: 'Fastest (< 30 ms)',
    speedModeDesc: 'Word-by-word output, speed first',

    matrixTitle: 'Languages and translation',
    matrixDesc: 'Choose the language you speak and the languages shown on OBS',
    fastEngineChip: '< 40 ms',
    slangDictBtn: 'Term dictionary',
    aiModelLabel: 'Translation model',
    apiKeyShow: 'Use my own API key',
    apiKeyHide: 'Hide API keys',
    geminiKeyLabel: 'Google Gemini API key (optional)',
    openaiKeyLabel: 'OpenAI API key (optional)',
    engineBuiltInName: 'Neural AI (free)',
    engineBuiltInDesc: 'Fastest, no key needed',
    engineGeminiName: 'Google Gemini 2.5 Flash',
    engineGeminiDesc: 'Natural, stream-aware translation',
    engineOpenaiName: 'OpenAI GPT-4o-mini',
    engineOpenaiDesc: 'High accuracy on long sentences',
    sourceLangLabel: 'You speak',
    targetLangLabel: 'Show translations in',

    step2Title: 'Subtitle look',
    step2Desc: 'Presets, font, size, outline, glow and colours',
    presetsLabel: 'Presets',
    fontPickerLabel: 'Font',
    fontCatAll: 'All',
    fontCatJp: 'Japanese',
    fontCatTh: 'Thai',
    fontCatEn: 'English',
    fontCatLocal: 'Installed',
    fontSourceLocal: 'Installed',
    fontSourceOnline: 'Online',
    sizeGroupLabel: 'Size and outline',
    colorGroupLabel: 'Colours',
    displayGroupLabel: 'Display',
    mainFontSize: 'Main text size',
    transFontSize: 'Translation size',
    strokeWidth: 'Outline width',
    glowBlur: 'Glow',
    colorMain: 'Main text',
    colorTh: 'Thai (TH)',
    colorEn: 'Other languages (EN/JP)',
    colorGlow: 'Glow colour',
    autoFade: 'Hide after',
    persistent: 'Keep shown',
    showSource: 'Show original sentence',
    showRomaji: 'Show romaji',
    maxLinesNote: 'Wraps automatically after 2 lines',

    step3Title: 'OBS preview',
    step3Desc: 'The same subtitle your viewers see on stream',
    previewBgLabel: 'Preview background',
    bgDark: 'Dark',
    bgGreen: 'Green screen',
    bgGrid: 'Grid',
    bgStreamer: 'Game',
    obsCanvasLabel: 'OBS 1920 x 1080',
    clearBtn: 'Clear subtitles',
    inputPlaceholder: 'Type a message to send it on screen',
    broadcastBtn: 'Send',
    quickSamplesLabel: 'Sample lines',

    soundboardTitle: 'Quick phrases',
    soundboardSub: 'One click sends the line to OBS',

    historyTitle: 'Transcript history',
    linesInMemory: 'saved',
    noHistory: 'No history yet. Speak into your mic to start recording lines',
    exportSrtTitle: 'Download .SRT for Premiere Pro / DaVinci Resolve',
    exportVttTitle: 'Download .VTT (WebVTT)',
    copyLine: 'Copy this line',

    step4Btn: 'Connect to OBS',
    deployTitle: 'Connect to OBS Studio',
    deployDesc: 'Copy the URL into an OBS Browser Source and you are live',
    overlayUrlLabel: 'Browser Source URL',
    openOverlay: 'Open the overlay in your browser',
    copyUrlBtn: 'Copy URL',
    copiedUrlBtn: 'Copied',
    resolutionSetting: 'OBS scene resolution',
    threeSteps: '3 steps in OBS Studio',
    step1Guide: '1. Add a source',
    step1GuideSub: 'Click Sources (+) and choose Browser',
    step2Guide: '2. Paste the URL',
    step2GuideSub: 'Paste the URL you copied',
    step3Guide: '3. Set the size',
    step3GuideSub: 'Enter width x height and click OK',
    copyCss: 'Copy custom CSS',
    copiedCss: 'CSS copied',
    doneBtn: 'Done',
    closeBtn: 'Close',

    proEditionLabel: 'PRO',
    freeEditionLabel: 'FREE',
    upgradeBtn: 'Upgrade',
    freeEditionBanner: 'You are on the free edition: 1 target language with Neural AI and fast mode',
    viewProGumroad: 'See PRO features',
    proModalTitle: 'VTuber Subtitle Studio PRO',
    proModalSubtitle: 'Unlock every feature for VTubers and streamers',
    proFeature1Title: 'Two languages at once',
    proFeature1Desc: 'Say one sentence and show both Japanese [JP] and English [EN] on OBS',
    proFeature2Title: '48kHz studio voice processing',
    proFeature2Desc: '80Hz rumble cut, 3.8kHz consonant boost and a voice leveller for clearer recognition',
    proFeature3Title: 'VOD subtitle export (.SRT / .VTT)',
    proFeature3Desc: 'Record the whole stream timeline and export it for highlight edits in one click',
    proFeature4Title: 'Term dictionary and quick phrases',
    proFeature4Desc: 'Add your channel terms and send ready-made lines in one click',
    switchModeSimulation: 'Switch to PRO mode',
    switchModeFree: 'Switch to Free mode',
    buyOnGumroad: 'Get PRO on Gumroad',
    oneLangInFree: 'Free edition: 1 language',
    glossaryModalTitle: 'Channel term dictionary',
    glossaryModalDesc: 'Replace slang, fandom names and nicknames with the exact translation you want on OBS',
    glossaryEmpty: 'No terms yet. Add your first one above',
    glossaryLangLabel: 'Target language',
    removeTerm: 'Remove this term',
    addTermBtn: 'Add',
    sourcePatternPlaceholder: 'Spoken term, e.g. 草, てぇてぇ, GG',
    replacementPlaceholder: 'Show as, e.g. LOL',

    uiLanguageLabel: 'Interface language',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    latencyTitle: 'Delay from speech to screen',
    cpuTitle: 'CPU usage',
    ramTitle: 'Server memory',
    editionLabel: 'Edition',
    connecting: 'Connecting...',
    ramUsage: 'RAM',
    latency: 'Latency',
    sidecarActive: 'Server running',
  },
};
