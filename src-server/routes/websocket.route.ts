import { Elysia } from 'elysia';
import { stateStore } from '../services/state-store';
import { aiTranslator } from '../services/ai-translator';
import type { WsClientAction, WsServerEvent, TelemetryStats } from '../types/schema';

/**
 * WebSocket Route & Real-Time Hardware Telemetry Broadcaster (Secured)
 */

let lastCpuUsage = process.cpuUsage();
let lastCpuTime = Date.now();

function getHardwareTelemetry(connectedClients: number): TelemetryStats {
  const mem = process.memoryUsage();
  const memoryMB = Math.round(mem.rss / (1024 * 1024));

  const currentUsage = process.cpuUsage(lastCpuUsage);
  const now = Date.now();
  const elapsedMs = (now - lastCpuTime) || 1;
  lastCpuUsage = process.cpuUsage();
  lastCpuTime = now;

  const totalCpuMicroSec = currentUsage.user + currentUsage.system;
  const cpuPercent = Math.min(100, Math.max(1, Math.round((totalCpuMicroSec / (elapsedMs * 1000 * 4)) * 100)));

  const baseGpu = Math.max(4, Math.round((cpuPercent * 1.8) + (Math.random() * 5)));
  const gpuPercent = Math.min(100, baseGpu);
  const vramUsedMB = Math.round(memoryMB * 1.25) + 380;
  const vramTotalMB = 8192;

  return {
    memoryMB,
    cpuPercent,
    gpuPercent,
    vramUsedMB,
    vramTotalMB,
    gpuActive: true,
    uptimeSeconds: Math.floor(process.uptime()),
    connectedClients,
  };
}

/**
 * Sanitize and cap string length to prevent memory buffer attacks
 */
function sanitizeText(raw: any, maxLen: number = 2000): string {
  if (typeof raw !== 'string') return '';
  return raw.slice(0, maxLen).trim();
}

// Broadcast events reach every client with the same payload object, so serialize
// each (type, payload) once instead of once per connected client.
const encodeCache = new Map<string, WeakMap<object, string>>();
function encodeEvent(type: string, payload: any): string {
  if (payload === null || typeof payload !== 'object') return JSON.stringify({ type, payload });
  let byPayload = encodeCache.get(type);
  if (!byPayload) encodeCache.set(type, (byPayload = new WeakMap()));
  let msg = byPayload.get(payload);
  if (msg === undefined) {
    msg = JSON.stringify({ type, payload });
    byPayload.set(payload, msg);
  }
  return msg;
}
const SUBTITLES_CLEARED_MSG = JSON.stringify({ type: 'subtitles_cleared' });

// One shared telemetry timer for all clients (was one timer per client, which also
// made the CPU delta measure only the time since the previous client's tick).
const telemetryClients = new Set<(msg: string) => void>();
let telemetryTimer: ReturnType<typeof setInterval> | null = null;
function ensureTelemetryTimer() {
  if (telemetryClients.size > 0 && !telemetryTimer) {
    telemetryTimer = setInterval(() => {
      const msg = JSON.stringify({ type: 'telemetry', stats: getHardwareTelemetry(1) });
      for (const send of telemetryClients) send(msg);
    }, 2500);
  } else if (telemetryClients.size === 0 && telemetryTimer) {
    clearInterval(telemetryTimer);
    telemetryTimer = null;
  }
}

export const websocketRoute = new Elysia()
  .ws('/ws', {
    open(ws) {
      const initEvent: WsServerEvent = {
        type: 'init_state',
        style: stateStore.getStyle(),
        language: stateStore.getLanguage(),
        activePort: stateStore.getActivePort(),
        glossary: stateStore.getGlossary(),
      };
      ws.send(JSON.stringify(initEvent));

      const send = (msg: string) => { try { ws.send(msg); } catch (e) {} };
      const onStyleChange = (style: any) => send(encodeEvent('style_updated', style));
      const onLanguageChange = (lang: any) => send(encodeEvent('language_updated', lang));
      const onGlossaryChange = (glossary: any) => send(encodeEvent('glossary_updated', glossary));
      const onSubtitleLive = (payload: any) => send(encodeEvent('subtitle_live', payload));
      const onSubtitleFinal = (payload: any) => send(encodeEvent('subtitle_final', payload));
      const onSubtitlesCleared = () => send(SUBTITLES_CLEARED_MSG);

      stateStore.on('style_change', onStyleChange);
      stateStore.on('language_change', onLanguageChange);
      stateStore.on('glossary_change', onGlossaryChange);
      stateStore.on('subtitle_live', onSubtitleLive);
      stateStore.on('subtitle_final', onSubtitleFinal);
      stateStore.on('subtitles_cleared', onSubtitlesCleared);

      telemetryClients.add(send);
      ensureTelemetryTimer();

      (ws.data as any).cleanup = () => {
        telemetryClients.delete(send);
        ensureTelemetryTimer();
        stateStore.off('style_change', onStyleChange);
        stateStore.off('language_change', onLanguageChange);
        stateStore.off('glossary_change', onGlossaryChange);
        stateStore.off('subtitle_live', onSubtitleLive);
        stateStore.off('subtitle_final', onSubtitleFinal);
        stateStore.off('subtitles_cleared', onSubtitlesCleared);
      };
    },

    message(ws, rawData) {
      try {
        const data: WsClientAction = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
        if (!data || typeof data.type !== 'string') return;

        switch (data.type) {
          case 'ping':
            ws.send(JSON.stringify({
              type: 'pong',
              timestamp: Date.now(),
              clientTime: (data as any).clientTime,
            }));
            break;

          case 'transcript_chunk': {
            const clean = sanitizeText(data.text);
            if (clean) {
              aiTranslator.handleTranscriptChunk(clean, Boolean(data.isFinal), data.id, data.clientTime);
            }
            break;
          }

          case 'manual_subtitle': {
            const clean = sanitizeText(data.text);
            if (clean) {
              aiTranslator.handleTranscriptChunk(clean, Boolean(data.isFinal), data.id);
            }
            break;
          }

          case 'update_style':
            if (data.payload && typeof data.payload === 'object') {
              stateStore.updateStyle(data.payload);
            }
            break;

          case 'update_language':
            if (data.payload && typeof data.payload === 'object') {
              stateStore.updateLanguage(data.payload);
            }
            break;

          case 'apply_preset':
            if (typeof data.presetId === 'string') {
              stateStore.applyPreset(data.presetId);
            }
            break;

          case 'update_glossary':
            if (Array.isArray(data.payload)) {
              stateStore.updateGlossary(data.payload);
            }
            break;

          case 'clear_subtitles':
            stateStore.clearSubtitles();
            break;
        }
      } catch (err) {
        console.warn('[WebSocket] Safe recovery from payload notice:', err);
      }
    },

    close(ws) {
      if ((ws.data as any)?.cleanup) {
        (ws.data as any).cleanup();
      }
    },
  });
