export type UILang = 'th' | 'ja' | 'en';

export interface TranslationDictionary {
  appTitle: string;
  badge: string;
  streamSimultaneous: string;
  step1Title: string;
  step1Desc: string;
  talkingBadge: string;
  testMicBtn: string;
  stopMicBtn: string;
  selectMic: string;
  rescan: string;
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
  slangDictBtn: string;
  aiModelLabel: string;
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
  mainFontSize: string;
  transFontSize: string;
  strokeWidth: string;
  glowBlur: string;
  colorMain: string;
  colorTh: string;
  colorEn: string;
  colorGlow: string;
  autoFade: string;
  showSource: string;
  showRomaji: string;
  maxLinesNote: string;
  
  step3Title: string;
  step3Desc: string;
  clearBtn: string;
  inputPlaceholder: string;
  broadcastBtn: string;
  
  soundboardTitle: string;
  soundboardSub: string;
  
  historyTitle: string;
  linesInMemory: string;
  noHistory: string;
  
  step4Btn: string;
  deployTitle: string;
  deployDesc: string;
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
  addTermBtn: string;
  sourcePatternPlaceholder: string;
  replacementPlaceholder: string;
  
  ramUsage: string;
  latency: string;
  sidecarActive: string;
}

export const UI_TRANSLATIONS: Record<UILang, TranslationDictionary> = {
  th: {
    appTitle: 'VTuber AI Subtitle & Live Translator',
    badge: 'ULTRA LOW-LATENCY',
    streamSimultaneous: 'สตรีมแปลพร้อมกัน:',
    step1Title: '[1. ไมค์ & เทสต์เสียง] ทดสอบไมโครโฟน & เสียงพูดสด',
    step1Desc: 'เลือกไมค์และทดลองพูดเพื่อตรวจผลลัพธ์ว่าระบบรับเสียงติดไหม และแปลสดถูกต้องไหม',
    talkingBadge: 'กำลังพูด...',
    testMicBtn: 'ทดสอบไมค์ & พูด',
    stopMicBtn: 'หยุดทดสอบเสียง',
    selectMic: 'เลือกอุปกรณ์ไมโครโฟน',
    rescan: 'สแกนใหม่',
    vuLevel: 'ระดับเสียงสด & Noise Gate',
    gateOpen: '⚡ ไมค์เปิดรับเสียง',
    gateClosed: '💤 ไมค์ตัดเสียงรบกวน',
    testResultTitle: 'ผลการทดสอบเสียง & การแปลภาษาสด:',
    engineActive: 'Engine ตอบสนอง:',
    spokenLabel: 'เสียงที่พูด:',
    listeningPrompt: '🎙️ ไมค์กำลังฟังเสียงอยู่... ลองพูดประโยคเพื่อทดสอบว่าระบบรับเสียงและแปลงคำแปลขึ้นไหม',
    idlePrompt: 'กดปุ่ม "ทดสอบไมค์ & พูด" ด้านบน แล้วลองพูดเพื่อทดสอบผลลัพธ์',
    
    sttEngineModeTitle: 'โหมดการฟังเสียง & ถอดรหัสคำพูด (Speech Recognition Engine Mode):',
    studioMicHiFi: '🎙️ Studio Mic 48kHz Hi-Fi (Uncompressed)',
    qualityModeTitle: '🎯 [Hi-Res Studio Quality] คุณภาพสูงสุด (แนะนำ)',
    qualityModeDesc: 'แม่นยำสูง ฟังคำชัด ไม่เพี้ยน • Audio DSP 48kHz Mastered • เหมาะสำหรับพูดประโยคยาว & ญี่ปุ่น',
    speedModeTitle: '⚡ [Ultra-Fast Speed] ตอบสนองไวพิเศษ (< 30ms)',
    speedModeDesc: 'เน้นความเร็ว ตอบสนองคำต่อคำทันที • Micro-Debounce 20ms Stream',

    matrixTitle: 'ระบบเลือกภาษา & Real-Time AI Translator',
    matrixDesc: 'แปลสดทุกคำพูดอัตโนมัติด้วยระบบ Neural AI ความเร็วสูง และเปิดใช้งานคำแปลหลายภาษาพร้อมกัน',
    slangDictBtn: 'พจนานุกรมคำสแลง & ศัพท์เฉพาะ',
    aiModelLabel: 'โมเดล AI แปลภาษา:',
    sourceLangLabel: 'ภาษาที่คุณพูด (Source):',
    targetLangLabel: 'แปลและแสดงผลพร้อมกัน (Simultaneous Targets):',
    
    step2Title: '[2. เลือกฟอนต์ & ปรับแต่ง] สตูดิโอฟอนต์ & ดีไซน์ซับ',
    step2Desc: 'ดึงฟอนต์จาก Windows ในเครื่อง และ Google Fonts ออนไลน์ ปรับขนาด ขอบตัวหนังสือ แสง และสี',
    presetsLabel: 'พรีเซ็ตสำเร็จรูป (Style Presets):',
    fontPickerLabel: 'เลือกฟอนต์ (Font Picker):',
    fontCatAll: 'ทั้งหมด',
    fontCatJp: 'ญี่ปุ่น 🇯🇵',
    fontCatTh: 'ไทย 🇹🇭',
    fontCatEn: 'อังกฤษ 🇺🇸',
    fontCatLocal: 'ฟอนต์ในเครื่อง 💻',
    mainFontSize: 'ขนาดตัวหนังสือหลัก',
    transFontSize: 'ขนาดตัวหนังสือคำแปล',
    strokeWidth: 'ความหนาขอบตัวหนังสือ (Stroke)',
    glowBlur: 'แสงนีออนสะท้อน (Glow Blur)',
    colorMain: 'สีข้อความหลัก',
    colorTh: 'สีภาษาไทย (TH)',
    colorEn: 'สีภาษาอังกฤษ (EN)',
    colorGlow: 'สีแสงนีออน',
    autoFade: 'เวลาเลือนหายอัตโนมัติ (วินาที)',
    showSource: 'แสดงคำพูดต้นฉบับ (Source)',
    showRomaji: 'แสดงตัวอ่านโรมันจิ (Romaji)',
    maxLinesNote: 'ตัดขึ้นบรรทัดใหม่อัตโนมัติเมื่อยาวเกิน 2 บรรทัด',
    
    step3Title: '[3. ดูผลลัพธ์สด] จอจำลองผลลัพธ์ OBS Overlay',
    step3Desc: 'จำลองผลลัพธ์ซับไตเติลบนหน้าจอ OBS แบบ 1:1 Real-Time',
    clearBtn: 'ล้างซับไตเติล',
    inputPlaceholder: 'พิมพ์ข้อความทดสอบเพื่อดูผลแปลและการแสดงผล...',
    broadcastBtn: 'ส่งข้อความ',
    
    soundboardTitle: 'ปุ่มกดพูดลัด (Stream Soundboard)',
    soundboardSub: 'กดปุ่มเพื่อยิงคำแปลขึ้น OBS ทันที',
    
    historyTitle: 'ประวัติคำพูด & ส่งออกไฟล์ซับ VOD (.SRT / .VTT)',
    linesInMemory: 'บรรทัดในหน่วยความจำ',
    noHistory: 'ยังไม่มีประวัติคำพูด ลองพูดผ่านไมค์เพื่อบันทึก',
    
    step4Btn: '🚀 DEPLOY TO OBS',
    deployTitle: '[4. 🚀 DEPLOY TO OBS] ติดตั้งใน OBS Studio',
    deployDesc: 'คัดลอก URL ด้านล่างไปวางใน OBS Browser Source แล้วใช้งานได้ทันที',
    copyUrlBtn: 'คัดลอก URL',
    copiedUrlBtn: 'คัดลอกแล้ว!',
    resolutionSetting: 'การตั้งค่าขนาดความละเอียดใน OBS',
    threeSteps: '3 ขั้นตอนใส่ใน OBS Studio',
    step1Guide: '1. เพิ่ม Source',
    step1GuideSub: 'กด Sources (+) ➔ เลือก Browser',
    step2Guide: '2. วาง URL',
    step2GuideSub: 'วาง URL ด้านบน',
    step3Guide: '3. กำหนดขนาด',
    step3GuideSub: 'ใส่ความกว้าง x สูง แล้วกด OK',
    copyCss: 'คัดลอก Custom CSS',
    copiedCss: 'คัดลอก CSS แล้ว!',
    doneBtn: 'เสร็จสิ้น',
    
    freeEditionBanner: 'กำลังใช้งานเวอร์ชันฟรี (Neural AI ฟรี, ถอดรหัสคำพูดความเร็วสูง)',
    viewProGumroad: 'ดูฟีเจอร์ PRO & ลิงก์ Gumroad',
    proModalTitle: 'VTuber Subtitle Studio PRO',
    proModalSubtitle: 'ปลดล็อกทุกฟีเจอร์ระดับมืออาชีพสำหรับสตรีมเมอร์ & VTuber',
    proFeature1Title: 'Simultaneous Dual Translation:',
    proFeature1Desc: 'พูด 1 ประโยค แปลและแสดงผลออกทั้ง ญี่ปุ่น [JP] + อังกฤษ [EN] พร้อมกันบน OBS',
    proFeature2Title: '48kHz Studio Vocal DSP Mastering:',
    proFeature2Desc: 'ตัดเสียงลมกระแทก (80Hz) + บูสต์ความถี่พยัญชนะ (3.8kHz EQ) + Leveler ไมค์ดูดเสียงชัดเจน',
    proFeature3Title: 'VOD Subtitle Export (.SRT / .VTT):',
    proFeature3Desc: 'บันทึกไทม์ไลน์คำพูดตลอดทั้งสตรีม กดส่งออกไฟล์ซับไปตัดต่อคลิปไฮไลต์ลง YouTube ได้ทันที',
    proFeature4Title: 'VTuber Slang Dictionary & Soundboard:',
    proFeature4Desc: 'กำหนดคำศัพท์เฉพาะช่อง และปุ่มลัดยิงคำแปลขึ้นจอสดๆ ได้ในคลิกเดียว',
    switchModeSimulation: '✨ สลับเป็นโหมด PRO จำลอง',
    switchModeFree: '🔄 สลับไปโหมด Free',
    buyOnGumroad: 'ซื้อเวอร์ชัน PRO บน Gumroad',
    oneLangInFree: '1 ภาษาในโหมด Free',
    glossaryModalTitle: 'พจนานุกรมคำสแลง & ศัพท์เฉพาะช่อง',
    glossaryModalDesc: 'กำหนดคำศัพท์เฉพาะ สแลง แฟนด้อม หรือชื่อเล่นเพื่อแปลให้ตรงเป๊ะบน OBS',
    addTermBtn: 'เพิ่มคำศัพท์',
    sourcePatternPlaceholder: 'คำค้นหา (เช่น 草, てぇてぇ, GG)',
    replacementPlaceholder: 'คำแปลแทนที่ (เช่น 55555+)',
    
    ramUsage: 'RAM',
    latency: 'Latency',
    sidecarActive: 'Bun Sidecar ทำงานปกติ',
  },
  
  ja: {
    appTitle: 'VTuber AI 字幕 & リアルタイム翻訳 Studio',
    badge: '超低遅延 ENGINE',
    streamSimultaneous: '同時配信翻訳:',
    step1Title: '[1. マイク & 音声テスト] マイク調整 & リアルタイム音声テスト',
    step1Desc: 'マイクを選択して発声テストを行い、認識と翻訳が即座に動作することを確認します',
    talkingBadge: '発声中...',
    testMicBtn: 'マイクテスト開始',
    stopMicBtn: 'テスト停止',
    selectMic: '入力マイクを選択',
    rescan: '再スキャン',
    vuLevel: 'リアルタイム音量 & ノイズゲート',
    gateOpen: '⚡ 音声認識中',
    gateClosed: '💤 待機中',
    testResultTitle: 'リアルタイム音声認識 & 翻訳結果:',
    engineActive: 'Engine 応答速度:',
    spokenLabel: '発話内容:',
    listeningPrompt: '🎙️ 音声を聴き取っています... 話しかけてリアルタイム翻訳をテストしてください',
    idlePrompt: '上の「マイクテスト開始」を押して話しかけてください',
    
    sttEngineModeTitle: '音声認識 & 発声デコードモード (Speech Recognition Engine Mode):',
    studioMicHiFi: '🎙️ Studio Mic 48kHz Hi-Fi (非圧縮スタジオ音質)',
    qualityModeTitle: '🎯 [Hi-Res Studio Quality] 最高音質・高精度 (推奨)',
    qualityModeDesc: '高精度認識・誤認識防止 • Audio DSP 48kHz Mastered • 長文発話や日本語に最適',
    speedModeTitle: '⚡ [Ultra-Fast Speed] 超高速リアルタイム応答 (< 30ms)',
    speedModeDesc: '速度最優先・即座に単語ごと出力 • Micro-Debounce 20ms Stream',

    matrixTitle: '言語選択 & リアルタイム AI 翻訳エンジン',
    matrixDesc: 'ニューラル AI による完全自動リアルタイム翻訳。複数言語への同時出力に対応',
    slangDictBtn: 'VTuber スラング & 用語辞書',
    aiModelLabel: 'AI 翻訳モデル:',
    sourceLangLabel: 'あなたが話す言語 (Source):',
    targetLangLabel: '同時翻訳・表示言語 (Simultaneous Targets):',
    
    step2Title: '[2. フォント & スタイル設定] 字幕フォント & デザイン Studio',
    step2Desc: 'Windows のローカルフォントや Google Fonts を読み込み、縁取りや発光をカスタマイズ',
    presetsLabel: 'プリセット (Style Presets):',
    fontPickerLabel: 'フォント選択 (Font Picker):',
    fontCatAll: 'すべて',
    fontCatJp: '日本語 🇯🇵',
    fontCatTh: 'タイ語 🇹🇭',
    fontCatEn: '英語 🇺🇸',
    fontCatLocal: 'ローカルフォント 💻',
    mainFontSize: 'メインフォントサイズ',
    transFontSize: '翻訳フォントサイズ',
    strokeWidth: '文字の縁取り幅 (Stroke)',
    glowBlur: 'ネオン発光 (Glow Blur)',
    colorMain: 'メインテキスト色',
    colorTh: 'タイ語テキスト色',
    colorEn: '英語テキスト色',
    colorGlow: 'ネオン発光色',
    autoFade: '自動フェードアウト時間 (秒)',
    showSource: '発話原文を表示 (Source)',
    showRomaji: 'ローマ字読みを表示 (Romaji)',
    maxLinesNote: '2行を超えると自動で改行・スクロールします',
    
    step3Title: '[3. プレビュー] OBS オーバーレイ リアルタイム確認',
    step3Desc: 'OBS 配信画面に表示される字幕を 1:1 でリアルタイム確認',
    clearBtn: '字幕クリア',
    inputPlaceholder: 'テストメッセージを入力して即座に翻訳・送信...',
    broadcastBtn: '送信',
    
    soundboardTitle: '定型句サウンドボード (Stream Soundboard)',
    soundboardSub: 'ワンクリックで OBS に即座に字幕を送信',
    
    historyTitle: '発言タイムライン & VOD 字幕エクスポート (.SRT / .VTT)',
    linesInMemory: '行のログを保持中',
    noHistory: '履歴がありません。マイクで発声してログを記録してください',
    
    step4Btn: '🚀 OBS にデプロイ',
    deployTitle: '[4. 🚀 DEPLOY TO OBS] OBS Studio への接続設定',
    deployDesc: '下の URL をコピーして OBS の「ブラウザ」ソースに貼り付けるだけです',
    copyUrlBtn: 'URL をコピー',
    copiedUrlBtn: 'コピー完了!',
    resolutionSetting: 'OBS 解像度設定',
    threeSteps: 'OBS Studio 設定の 3 ステップ',
    step1Guide: '1. ソース追加',
    step1GuideSub: 'ソース (+) ➔ 「ブラウザ」を選択',
    step2Guide: '2. URL 貼り付け',
    step2GuideSub: '上記の URL を入力',
    step3Guide: '3. サイズ設定',
    step3GuideSub: '幅と高さを指定して OK をクリック',
    copyCss: 'カスタム CSS をコピー',
    copiedCss: 'CSS コピー完了!',
    doneBtn: '完了',
    
    freeEditionBanner: '無料コミュニティ版を使用中 (高速 Neural AI・リアルタイム認識)',
    viewProGumroad: 'PRO 版の機能 & Gumroad リンクを見る',
    proModalTitle: 'VTuber Subtitle Studio PRO',
    proModalSubtitle: 'VTuber・ストリーマー向けプロ仕様の全機能をアンロック',
    proFeature1Title: '同時2言語リアルタイム翻訳 (Simultaneous Output):',
    proFeature1Desc: '1回の発声で [日本語] と [英語] (またはタイ語) を OBS 上に同時表示',
    proFeature2Title: '48kHz スタジオ品質 音声 DSP マスタリング:',
    proFeature2Desc: '80Hz 低域ノイズカット + 3.8kHz 子音明瞭化 EQ + コンプレッサーでクリアな音声認識',
    proFeature3Title: 'VOD 字幕エクスポート (.SRT / .VTT):',
    proFeature3Desc: '配信中の全発言タイムラインをワンクリックで SRT 出力。YouTube 切り抜き動画制作に直結',
    proFeature4Title: 'VTuber 専用用語辞書 & 定型句サウンドボード:',
    proFeature4Desc: 'チャンネル固有の用語登録や、ワンクリックで定型句字幕を即時送出',
    switchModeSimulation: '✨ PRO モードに切り替え',
    switchModeFree: '🔄 FREE モードに切り替え',
    buyOnGumroad: 'Gumroad で PRO 版を購入する',
    oneLangInFree: 'Free 版は 1 言語',
    glossaryModalTitle: 'VTuber スラング & 固有用語辞書',
    glossaryModalDesc: 'VTuber 固有の挨拶、スラング、固有名詞を正しい翻訳テキストに自動置換',
    addTermBtn: '用語を追加',
    sourcePatternPlaceholder: '検索単語 (例: 草, てぇてぇ, GG)',
    replacementPlaceholder: '置換後のテキスト (例: ｗｗｗ, てえてえ)',
    
    ramUsage: 'RAM',
    latency: 'Latency',
    sidecarActive: 'Bun Sidecar 稼働中',
  },
  
  en: {
    appTitle: 'VTuber AI Subtitle & Live Translator Studio',
    badge: 'ULTRA LOW-LATENCY',
    streamSimultaneous: 'Simultaneous Stream:',
    step1Title: '[1. Mic & Voice Test] Microphone Calibration & Live Speech Test',
    step1Desc: 'Select your mic and test your voice to verify instant transcription & accurate translation',
    talkingBadge: 'TALKING...',
    testMicBtn: 'Test Mic & Speech',
    stopMicBtn: 'Stop Voice Test',
    selectMic: 'Select Input Microphone',
    rescan: 'Rescan',
    vuLevel: 'Live VU Level & Noise Gate',
    gateOpen: '⚡ Voice Gate Open',
    gateClosed: '💤 Gate Closed',
    testResultTitle: 'Live Speech Recognition & Translation Test Result:',
    engineActive: 'Engine Response:',
    spokenLabel: 'You Spoke:',
    listeningPrompt: '🎙️ Listening to microphone... Speak any sentence to test live recognition and translation',
    idlePrompt: 'Click "Test Mic & Speech" above and start talking to verify live output',
    
    sttEngineModeTitle: 'Speech Recognition Engine Mode:',
    studioMicHiFi: '🎙️ Studio Mic 48kHz Hi-Fi (Uncompressed)',
    qualityModeTitle: '🎯 [Hi-Res Studio Quality] Maximum Accuracy (Recommended)',
    qualityModeDesc: 'High precision, crystal-clear voice decoding • Audio DSP 48kHz Mastered • Best for long sentences & Japanese',
    speedModeTitle: '⚡ [Ultra-Fast Speed] Ultra-Low Latency (< 30ms)',
    speedModeDesc: 'Prioritizes speed, instant word-by-word streaming • Micro-Debounce 20ms Stream',

    matrixTitle: 'Language Matrix & Real-Time AI Translation Engine',
    matrixDesc: 'Ultra-fast neural translation with simultaneous multi-target broadcasting',
    slangDictBtn: 'Stream Slang & Term Dictionary',
    aiModelLabel: 'AI Translation Model:',
    sourceLangLabel: 'Source Spoken Language:',
    targetLangLabel: 'Simultaneous Output Targets:',
    
    step2Title: '[2. Font & Style Studio] Subtitle Fonts & Styling Studio',
    step2Desc: 'Load local Windows fonts or Google Fonts with customizable outlines, glow, and colors',
    presetsLabel: 'Style Presets:',
    fontPickerLabel: 'Font Picker:',
    fontCatAll: 'All',
    fontCatJp: 'Japanese 🇯🇵',
    fontCatTh: 'Thai 🇹🇭',
    fontCatEn: 'English 🇺🇸',
    fontCatLocal: 'Windows Local 💻',
    mainFontSize: 'Main Font Size',
    transFontSize: 'Translation Font Size',
    strokeWidth: 'Text Outline Width (Stroke)',
    glowBlur: 'Neon Glow Blur',
    colorMain: 'Main Text Color',
    colorTh: 'Thai (TH) Color',
    colorEn: 'English (EN) Color',
    colorGlow: 'Neon Glow Color',
    autoFade: 'Auto-Fade Timeout (sec)',
    showSource: 'Show Source Spoken Text',
    showRomaji: 'Show Romaji Reading',
    maxLinesNote: 'Auto-rolls and wraps after 2 lines for clean stream framing',
    
    step3Title: '[3. Live Result] OBS Overlay Live Simulator',
    step3Desc: '1:1 Real-time simulation of the exact subtitle rendering in OBS Studio',
    clearBtn: 'Clear Subtitles',
    inputPlaceholder: 'Type any test message to broadcast live...',
    broadcastBtn: 'Broadcast',
    
    soundboardTitle: 'Stream Phrase Soundboard',
    soundboardSub: '1-Click instant broadcast of common stream phrases',
    
    historyTitle: 'Transcript Timeline & VOD Subtitle Export (.SRT / .VTT)',
    linesInMemory: 'lines in memory',
    noHistory: 'No subtitle history yet. Speak into your microphone to record lines',
    
    step4Btn: '🚀 DEPLOY TO OBS',
    deployTitle: '[4. 🚀 DEPLOY TO OBS] Deploy to OBS Studio',
    deployDesc: 'Copy the URL below into an OBS Browser Source for instant zero-latency subtitles',
    copyUrlBtn: 'Copy URL',
    copiedUrlBtn: 'Copied!',
    resolutionSetting: 'OBS Resolution Preset',
    threeSteps: '3 Steps to add in OBS Studio',
    step1Guide: '1. Add Source',
    step1GuideSub: 'Click Sources (+) ➔ Select Browser',
    step2Guide: '2. Paste URL',
    step2GuideSub: 'Paste the URL above',
    step3Guide: '3. Set Dimensions',
    step3GuideSub: 'Set Width x Height and click OK',
    copyCss: 'Copy Custom CSS',
    copiedCss: 'Copied CSS!',
    doneBtn: 'Done',
    
    freeEditionBanner: 'Using Free Community Edition (Neural AI, High-Speed Speech)',
    viewProGumroad: 'View PRO Features & Gumroad Link',
    proModalTitle: 'VTuber Subtitle Studio PRO',
    proModalSubtitle: 'Unlock all professional features for VTubers and Streamers',
    proFeature1Title: 'Simultaneous Dual Translation:',
    proFeature1Desc: 'Speak 1 sentence, output both Japanese [JP] and English [EN] simultaneously on OBS',
    proFeature2Title: '48kHz Studio Vocal DSP Mastering:',
    proFeature2Desc: '80Hz low rumble cut + 3.8kHz consonant presence boost + dynamic voice leveler',
    proFeature3Title: 'VOD Subtitle Export (.SRT / .VTT):',
    proFeature3Desc: 'Record stream timeline and export SRT in 1 click for YouTube highlight editing',
    proFeature4Title: 'VTuber Slang Dictionary & Soundboard:',
    proFeature4Desc: 'Custom channel terminology and 1-click broadcast hotkeys',
    switchModeSimulation: '✨ Switch to PRO Mode',
    switchModeFree: '🔄 Switch to Free Mode',
    buyOnGumroad: 'Get PRO on Gumroad',
    oneLangInFree: '1 target in Free',
    glossaryModalTitle: 'Stream Slang & Custom Term Dictionary',
    glossaryModalDesc: 'Auto-replace streamer terms, slang, and character names with exact translations on OBS',
    addTermBtn: 'Add Term',
    sourcePatternPlaceholder: 'Search Term (e.g., 草, てぇてぇ, GG)',
    replacementPlaceholder: 'Replacement Text (e.g., LOL, kawaii)',
    
    ramUsage: 'RAM',
    latency: 'Latency',
    sidecarActive: 'Bun Sidecar Active',
  }
};
