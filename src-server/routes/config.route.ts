import { Elysia, t } from 'elysia';
import { stateStore } from '../services/state-store';
import { aiTranslator } from '../services/ai-translator';
import { StyleConfigSchema, TranslationConfigSchema, AudioConfigSchema } from '../types/schema';

/**
 * REST API Routes for Configuration, Presets, Glossary & Subtitle Exports
 */
export const configRoute = new Elysia({ prefix: '/api' })
  // Healthcheck & metadata
  .get('/health', () => ({
    status: 'ok',
    port: stateStore.getActivePort(),
    timestamp: Date.now(),
    uptime: process.uptime(),
    memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    subtitlesCount: stateStore.getSubtitles().length,
  }))

  // Get all active configs
  .get('/config', () => ({
    port: stateStore.getActivePort(),
    style: stateStore.getStyle(),
    language: stateStore.getLanguage(),
    audio: stateStore.getAudio(),
    presets: stateStore.getPresets(),
    glossary: stateStore.getGlossary(),
  }))

  // Style presets
  .get('/presets', () => stateStore.getPresets())

  .post('/presets/apply', ({ body }) => {
    const updated = stateStore.applyPreset(body.presetId);
    if (!updated) {
      return { success: false, error: 'Preset not found' };
    }
    return { success: true, style: updated };
  }, {
    body: t.Object({ presetId: t.String() })
  })

  .post('/presets/save', ({ body }) => {
    const preset = stateStore.saveCustomPreset(body.name, body.description || '');
    return { success: true, preset };
  }, {
    body: t.Object({ name: t.String(), description: t.Optional(t.String()) })
  })

  // Update style settings
  .post('/config/style', ({ body }) => {
    const updated = stateStore.updateStyle(body);
    return { success: true, style: updated };
  }, {
    body: t.Partial(StyleConfigSchema)
  })

  // Update language settings
  .post('/config/language', ({ body }) => {
    const updated = stateStore.updateLanguage(body);
    return { success: true, language: updated };
  }, {
    body: t.Partial(TranslationConfigSchema)
  })

  // Update audio settings
  .post('/config/audio', ({ body }) => {
    const updated = stateStore.updateAudio(body);
    return { success: true, audio: updated };
  }, {
    body: t.Partial(AudioConfigSchema)
  })

  // Custom glossary
  .get('/glossary', () => stateStore.getGlossary())

  .post('/glossary', ({ body }) => {
    const updated = stateStore.updateGlossary(body.items);
    return { success: true, glossary: updated };
  }, {
    body: t.Object({
      items: t.Array(t.Object({
        id: t.String(),
        sourcePattern: t.String(),
        targetLang: t.String(),
        replacement: t.String(),
        category: t.String(),
      }))
    })
  })

  // Subtitle history & exports
  .get('/subtitles', () => stateStore.getSubtitles())

  .get('/export/srt', () => {
    const srt = stateStore.generateSRT();
    return new Response(srt || '1\n00:00:00,000 --> 00:00:03,000\nNo subtitles in session.\n', {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="vtuber_stream_subtitles.srt"',
      }
    });
  })

  .get('/export/vtt', () => {
    const vtt = stateStore.generateVTT();
    return new Response(vtt || 'WEBVTT\n\n1\n00:00:00.000 --> 00:00:03.000\nNo subtitles in session.\n', {
      headers: {
        'Content-Type': 'text/vtt; charset=utf-8',
        'Content-Disposition': 'attachment; filename="vtuber_stream_subtitles.vtt"',
      }
    });
  })

  // Trigger test subtitle
  .post('/subtitles/test', async ({ body }) => {
    const text = body.text || 'こんにちは！今日も配信見に来てくれてありがとう！';
    const isFinal = body.isFinal ?? true;
    const result = await aiTranslator.handleTranscriptChunk(text, isFinal);
    return { success: true, subtitle: result };
  }, {
    body: t.Object({
      text: t.Optional(t.String()),
      isFinal: t.Optional(t.Boolean())
    })
  })

  // Clear subtitles
  .post('/subtitles/clear', () => {
    stateStore.clearSubtitles();
    return { success: true };
  });
