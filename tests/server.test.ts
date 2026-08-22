import { describe, it, expect } from 'bun:test';
import { isPortAvailable, getAvailablePort } from '../src-server/config/env';
import { aiTranslator } from '../src-server/services/ai-translator';
import { stateStore, BUILT_IN_PRESETS } from '../src-server/services/state-store';

describe('VTuber Subtitle & Real-Time AI Translator Engine Tests', () => {
  it('should detect available ports and handle default 18890', async () => {
    const freePort = await getAvailablePort(18890);
    expect(freePort).toBeGreaterThanOrEqual(18890);
  });

  it('should translate real conversational Japanese speech into Thai and English', async () => {
    const result = await aiTranslator.translateSimultaneous(
      '皆、聞こえてますか？',
      'ja',
      ['th', 'en'],
      stateStore.getLanguage()
    );

    expect(result.translations.th).toBeDefined();
    expect(result.translations.en).toBeDefined();
    expect(result.translations.th.length).toBeGreaterThan(0);
    expect(result.translations.en.length).toBeGreaterThan(0);
    expect(result.romaji).toBeDefined();
    console.log('Test Translation Output:', result);
  });

  it('should handle StateStore style updates and state retrieval', () => {
    const original = stateStore.getStyle();
    const updated = stateStore.updateStyle({ fontSize: 42, textColor: '#00ffff' });

    expect(updated.fontSize).toBe(42);
    expect(updated.textColor).toBe('#00ffff');

    // Restore
    stateStore.updateStyle({ fontSize: original.fontSize, textColor: original.textColor });
  });

  it('should support 1-click theme presets', () => {
    const monoPreset = stateStore.applyPreset('minimal-monochrome');
    expect(monoPreset).not.toBeNull();
    expect(monoPreset?.presetName).toContain('Minimal Monochrome');
  });

  it('should handle custom glossary slang replacement', () => {
    stateStore.updateGlossary([
      { id: 'test_1', sourcePattern: '草', targetLang: 'th', replacement: '55555 ขำมาก', category: 'slang' }
    ]);
    const glossary = stateStore.getGlossary();
    expect(glossary.length).toBeGreaterThan(0);
  });

  it('should generate standard SRT subtitle format from session history', async () => {
    await aiTranslator.handleTranscriptChunk('こんにちは！', true, 'srt_test_1');
    const srt = stateStore.generateSRT();
    expect(srt).toContain('00:00:');
    expect(srt).toContain('こんにちは！');
    expect(srt).toContain('[TH]');
    expect(srt).toContain('[EN]');
  });
});
