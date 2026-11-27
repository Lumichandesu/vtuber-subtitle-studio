import { t, type Static } from 'elysia';

/**
 * TypeBox Schemas & TypeScript Type Definitions
 */

export type SupportedLang = 'ja' | 'th' | 'en' | 'auto';
export const SupportedLangs = ['ja', 'th', 'en', 'auto'] as const;

export const SubtitlePayloadSchema = t.Object({
  id: t.String(),
  timestamp: t.Number(),
  sourceLang: t.String(),
  targetLangs: t.Array(t.String()),
  rawText: t.String(),
  translations: t.Record(t.String(), t.String()),
  romaji: t.Optional(t.String()),
  isFinal: t.Boolean(),
  confidence: t.Optional(t.Number()),
  latencyMs: t.Optional(t.Number()),
});

export type SubtitlePayload = Static<typeof SubtitlePayloadSchema>;

export const StyleConfigSchema = t.Object({
  presetName: t.Optional(t.String({ default: 'Minimal Monochrome' })),
  fontFamily: t.String({ default: 'Prompt' }),
  customFontUrl: t.Optional(t.String()),
  fontSize: t.Number({ default: 34 }),
  translationFontSize: t.Number({ default: 28 }),
  fontWeight: t.Number({ default: 800 }),
  textColor: t.String({ default: '#ffffff' }),
  sourceTextColor: t.String({ default: '#ffffff' }),
  secondaryTextColor: t.String({ default: '#ffffff' }),
  thirdTextColor: t.String({ default: '#cccccc' }),
  outlineColor: t.String({ default: '#000000' }),
  outlineWidth: t.Number({ default: 4 }),
  glowColor: t.String({ default: '#ffffff' }),
  glowBlur: t.Number({ default: 8 }),
  backgroundColor: t.String({ default: 'rgba(0, 0, 0, 0.85)' }),
  borderRadius: t.Number({ default: 14 }),
  padding: t.Number({ default: 16 }),
  layoutPreset: t.Union([
    t.Literal('stacked'),
    t.Literal('side-by-side'),
    t.Literal('single-line'),
    t.Literal('manga-bubble'),
    t.Literal('minimal-bottom'),
  ], { default: 'stacked' }),
  alignment: t.Union([
    t.Literal('left'),
    t.Literal('center'),
    t.Literal('right'),
  ], { default: 'center' }),
  prefixStyle: t.Union([
    t.Literal('none'),
    t.Literal('code'),
    t.Literal('flag'),
  ], { default: 'code' }),
  autoFadeSeconds: t.Number({ default: 6 }),
  showSourceText: t.Boolean({ default: true }),
  showRomaji: t.Boolean({ default: false }),
  animationType: t.Union([
    t.Literal('fade'),
    t.Literal('pop'),
    t.Literal('slide-up'),
    t.Literal('typewriter'),
  ], { default: 'slide-up' }),
  customCss: t.Optional(t.String({ default: '' })),
});

export type StyleConfig = Static<typeof StyleConfigSchema>;

export interface GlossaryItem {
  id: string;
  sourcePattern: string;
  targetLang: string;
  replacement: string;
  category: 'slang' | 'gaming' | 'vtuber-name' | 'custom';
}

export const TranslationConfigSchema = t.Object({
  sourceLang: t.Union([
    t.Literal('ja'),
    t.Literal('th'),
    t.Literal('en'),
    t.Literal('auto'),
  ], { default: 'ja' }),
  targetLangs: t.Array(t.String(), { default: ['th', 'en'] }),
  aiEngine: t.Union([
    t.Literal('built-in'),
    t.Literal('gemini'),
    t.Literal('openai'),
    t.Literal('web-speech'),
  ], { default: 'built-in' }),
  sttMode: t.Union([
    t.Literal('quality'), // Studio Hi-Res Quality Mode (High Accuracy, Pristine Audio)
    t.Literal('speed'),   // Ultra-Fast Speed Mode (< 30ms Real-Time)
  ], { default: 'quality' }),
  geminiApiKey: t.Optional(t.String()),
  openaiApiKey: t.Optional(t.String()),
  modelName: t.Optional(t.String({ default: 'gemini-2.5-flash' })),
  systemPrompt: t.Optional(t.String()),
  streamLiveTranslation: t.Boolean({ default: true }),
});

export type TranslationConfig = Static<typeof TranslationConfigSchema>;

export const AudioConfigSchema = t.Object({
  deviceId: t.String({ default: 'default' }),
  sampleRate: t.Number({ default: 48000 }),
  vadThreshold: t.Number({ default: 0.015 }),
  silenceTimeoutMs: t.Number({ default: 600 }),
  audioQuality: t.Union([
    t.Literal('hires-48k'),
    t.Literal('hires-96k'),
    t.Literal('standard-16k'),
  ], { default: 'hires-48k' }),
  studioMicMode: t.Boolean({ default: true }),
  noiseSuppression: t.Boolean({ default: false }),
  echoCancellation: t.Boolean({ default: false }),
  autoGainControl: t.Boolean({ default: false }),
  micGain: t.Number({ default: 1.0 }),
});

export type AudioConfig = Static<typeof AudioConfigSchema>;

export type { StylePreset } from './presets';
export { BUILT_IN_PRESETS } from './presets';

export interface TelemetryStats {
  memoryMB: number;
  cpuPercent: number;
  gpuPercent: number;
  vramUsedMB: number;
  vramTotalMB: number;
  gpuActive: boolean;
  uptimeSeconds: number;
  connectedClients: number;
  latencyMs?: number;
}

export type WsClientAction = 
  | { type: 'ping'; clientTime?: number }
  | { type: 'audio_chunk'; data: string; sampleRate?: number }
  | { type: 'transcript_chunk'; text: string; isFinal?: boolean; id?: string; clientTime?: number }
  | { type: 'update_style'; payload: Partial<StyleConfig> }
  | { type: 'update_language'; payload: Partial<TranslationConfig> }
  | { type: 'manual_subtitle'; payload: Partial<SubtitlePayload>; text?: string; isFinal?: boolean; id?: string }
  | { type: 'clear_subtitles' }
  | { type: 'apply_preset'; presetId: string }
  | { type: 'update_glossary'; payload: GlossaryItem[] };

export type WsServerEvent =
  | { type: 'pong'; timestamp: number; clientTime?: number }
  | { type: 'init_state'; style: StyleConfig; language: TranslationConfig; activePort: number; glossary: GlossaryItem[] }
  | { type: 'subtitle_live'; payload: SubtitlePayload }
  | { type: 'subtitle_final'; payload: SubtitlePayload }
  | { type: 'style_updated'; payload: StyleConfig }
  | { type: 'language_updated'; payload: TranslationConfig }
  | { type: 'glossary_updated'; payload: GlossaryItem[] }
  | { type: 'subtitles_cleared' }
  | { type: 'telemetry'; stats: TelemetryStats }
  | { type: 'error'; message: string };
