import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import type { 
  StyleConfig, 
  TranslationConfig, 
  AudioConfig, 
  SubtitlePayload,
  StylePreset,
  GlossaryItem
} from '../types/schema';
import { BUILT_IN_PRESETS } from '../types/schema';

/**
 * In-Memory Reactive State Store with JSON Persistence
 * Provides high-speed access and event-driven updates for WebSocket and REST APIs.
 */

const CONFIG_FILE_PATH = path.resolve(process.cwd(), 'vtuber_config.json');

const DEFAULT_STYLE: StyleConfig = {
  ...BUILT_IN_PRESETS[0].config,
} as StyleConfig;

const DEFAULT_LANGUAGE: TranslationConfig = {
  sourceLang: 'ja',
  targetLangs: ['th', 'en'],
  aiEngine: 'built-in',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  modelName: 'gemini-2.5-flash',
  systemPrompt: 'You are an ultra-fast VTuber simultaneous live translator. Translate VTuber speech naturally, matching emotional cues, gaming terms, anime slangs, and casual speech between Japanese, Thai, and English.',
  streamLiveTranslation: true,
};

const DEFAULT_AUDIO: AudioConfig = {
  deviceId: 'default',
  sampleRate: 16000,
  vadThreshold: 0.015,
  silenceTimeoutMs: 900,
  noiseSuppression: true,
  echoCancellation: true,
  autoGainControl: true,
  micGain: 1.0,
};

const DEFAULT_GLOSSARY: GlossaryItem[] = [
  { id: '1', sourcePattern: '草', targetLang: 'th', replacement: '55555+', category: 'slang' },
  { id: '2', sourcePattern: '草', targetLang: 'en', replacement: 'LOL www', category: 'slang' },
  { id: '3', sourcePattern: 'たすかる', targetLang: 'th', replacement: 'ช่วยชีวิตเลย ขอบคุณมาก!', category: 'slang' },
  { id: '4', sourcePattern: 'たすかる', targetLang: 'en', replacement: 'Bless you / Big help!', category: 'slang' },
  { id: '5', sourcePattern: 'てぇてぇ', targetLang: 'th', replacement: 'คู่จิ้นฟินมากกก!', category: 'slang' },
  { id: '6', sourcePattern: 'GG', targetLang: 'th', replacement: 'เล่นดีมาก GG!', category: 'gaming' },
];

class StateStore extends EventEmitter {
  private style: StyleConfig = { ...DEFAULT_STYLE };
  private language: TranslationConfig = { ...DEFAULT_LANGUAGE };
  private audio: AudioConfig = { ...DEFAULT_AUDIO };
  private glossary: GlossaryItem[] = [...DEFAULT_GLOSSARY];
  private customPresets: StylePreset[] = [];
  private recentSubtitles: SubtitlePayload[] = [];
  private readonly maxHistorySize = 200;
  private activePort = 18890;
  private isSaving = false;

  constructor() {
    super();
    this.loadFromDisk();
  }

  public setActivePort(port: number) {
    this.activePort = port;
  }

  public getActivePort(): number {
    return this.activePort;
  }

  public getStyle(): StyleConfig {
    return { ...this.style };
  }

  public updateStyle(partial: Partial<StyleConfig>): StyleConfig {
    this.style = { ...this.style, ...partial };
    this.emit('style_change', this.style);
    this.saveToDisk();
    return this.style;
  }

  public applyPreset(presetId: string): StyleConfig | null {
    const allPresets = [...BUILT_IN_PRESETS, ...this.customPresets];
    const found = allPresets.find(p => p.id === presetId);
    if (found) {
      this.style = { ...this.style, ...found.config, presetName: found.name };
      this.emit('style_change', this.style);
      this.saveToDisk();
      return this.style;
    }
    return null;
  }

  public getPresets(): StylePreset[] {
    return [...BUILT_IN_PRESETS, ...this.customPresets];
  }

  public saveCustomPreset(name: string, description: string): StylePreset {
    const newPreset: StylePreset = {
      id: `custom_${Date.now()}`,
      name,
      description,
      previewGradient: 'from-pink-400 via-purple-500 to-indigo-500',
      config: { ...this.style },
    };
    this.customPresets.push(newPreset);
    this.saveToDisk();
    return newPreset;
  }

  public getLanguage(): TranslationConfig {
    return { ...this.language };
  }

  public updateLanguage(partial: Partial<TranslationConfig>): TranslationConfig {
    this.language = { ...this.language, ...partial };
    this.emit('language_change', this.language);
    this.saveToDisk();
    return this.language;
  }

  public getAudio(): AudioConfig {
    return { ...this.audio };
  }

  public updateAudio(partial: Partial<AudioConfig>): AudioConfig {
    this.audio = { ...this.audio, ...partial };
    this.emit('audio_change', this.audio);
    this.saveToDisk();
    return this.audio;
  }

  public getGlossary(): GlossaryItem[] {
    return [...this.glossary];
  }

  public updateGlossary(items: GlossaryItem[]): GlossaryItem[] {
    this.glossary = items;
    this.emit('glossary_change', this.glossary);
    this.saveToDisk();
    return this.glossary;
  }

  public pushSubtitle(subtitle: SubtitlePayload) {
    const existingIndex = this.recentSubtitles.findIndex((s) => s.id === subtitle.id);
    if (existingIndex >= 0) {
      this.recentSubtitles[existingIndex] = subtitle;
    } else {
      this.recentSubtitles.push(subtitle);
      if (this.recentSubtitles.length > this.maxHistorySize) {
        this.recentSubtitles.shift();
      }
    }

    if (subtitle.isFinal) {
      this.emit('subtitle_final', subtitle);
    } else {
      this.emit('subtitle_live', subtitle);
    }
  }

  public getSubtitles(): SubtitlePayload[] {
    return [...this.recentSubtitles];
  }

  public clearSubtitles() {
    this.recentSubtitles = [];
    this.emit('subtitles_cleared');
  }

  public generateSRT(): string {
    if (this.recentSubtitles.length === 0) return '';
    let srt = '';
    let index = 1;

    const baseTime = this.recentSubtitles[0]?.timestamp || Date.now();

    const formatTimestamp = (msOffset: number) => {
      const totalSec = Math.floor(msOffset / 1000);
      const hours = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;
      const ms = msOffset % 1000;

      const pad = (n: number, z = 2) => String(n).padStart(z, '0');
      return `${pad(hours)}:${pad(mins)}:${pad(secs)},${pad(ms, 3)}`;
    };

    for (const sub of this.recentSubtitles) {
      const startMs = Math.max(0, sub.timestamp - baseTime);
      const durationMs = 3000;
      const endMs = startMs + durationMs;

      srt += `${index}\n`;
      srt += `${formatTimestamp(startMs)} --> ${formatTimestamp(endMs)}\n`;
      srt += `${sub.rawText}\n`;
      if (sub.translations) {
        for (const [lang, trans] of Object.entries(sub.translations)) {
          srt += `[${lang.toUpperCase()}] ${trans}\n`;
        }
      }
      srt += `\n`;
      index++;
    }

    return srt;
  }

  public generateVTT(): string {
    return 'WEBVTT\n\n' + this.generateSRT().replace(/,/g, '.');
  }

  private saveToDisk() {
    if (this.isSaving) return;
    this.isSaving = true;

    setTimeout(() => {
      try {
        const data = JSON.stringify({
          style: this.style,
          language: this.language,
          audio: this.audio,
          glossary: this.glossary,
          customPresets: this.customPresets,
        }, null, 2);
        fs.writeFileSync(CONFIG_FILE_PATH, data, 'utf-8');
      } catch (err) {
        console.error('[StateStore] Failed to save config to disk:', err);
      } finally {
        this.isSaving = false;
      }
    }, 200);
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(CONFIG_FILE_PATH)) {
        const raw = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.style) this.style = { ...DEFAULT_STYLE, ...parsed.style };
        if (parsed.language) this.language = { ...DEFAULT_LANGUAGE, ...parsed.language };
        if (parsed.audio) this.audio = { ...DEFAULT_AUDIO, ...parsed.audio };
        if (parsed.glossary) this.glossary = parsed.glossary;
        if (parsed.customPresets) this.customPresets = parsed.customPresets;
        console.log('[StateStore] Loaded settings from disk.');
      }
    } catch (err) {
      console.warn('[StateStore] Could not load previous config, using defaults:', err);
    }
  }
}

export const stateStore = new StateStore();
