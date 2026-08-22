import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  StyleConfig, 
  TranslationConfig, 
  AudioConfig, 
  SubtitlePayload,
  WsServerEvent,
  StylePreset,
  GlossaryItem,
  TelemetryStats
} from '../../src-server/types/schema';
import { BUILT_IN_PRESETS } from '../../src-server/types/schema';

const DEFAULT_STYLE: StyleConfig = {
  ...BUILT_IN_PRESETS[0].config,
} as StyleConfig;

const DEFAULT_LANGUAGE: TranslationConfig = {
  sourceLang: 'ja',
  targetLangs: ['th', 'en'],
  aiEngine: 'built-in',
  geminiApiKey: '',
  openaiApiKey: '',
  modelName: 'gemini-2.5-flash',
  systemPrompt: '',
  streamLiveTranslation: true,
};

const DEFAULT_AUDIO: AudioConfig = {
  deviceId: 'default',
  sampleRate: 48000,
  vadThreshold: 0.015,
  silenceTimeoutMs: 600,
  noiseSuppression: true,
  echoCancellation: true,
  autoGainControl: true,
  micGain: 1.0,
};

export function useServerSync() {
  const [isConnected, setIsConnected] = useState(false);
  const [activePort, setActivePort] = useState<number>(18890);
  const [style, setStyle] = useState<StyleConfig>(DEFAULT_STYLE);
  const [language, setLanguage] = useState<TranslationConfig>(DEFAULT_LANGUAGE);
  const [audio, setAudio] = useState<AudioConfig>(DEFAULT_AUDIO);
  const [presets, setPresets] = useState<StylePreset[]>(BUILT_IN_PRESETS);
  const [glossary, setGlossary] = useState<GlossaryItem[]>([]);
  const [latestSubtitle, setLatestSubtitle] = useState<SubtitlePayload | null>(null);
  const [subtitleHistory, setSubtitleHistory] = useState<SubtitlePayload[]>([]);
  const [liveLatencyMs, setLiveLatencyMs] = useState<number>(18);
  const [telemetry, setTelemetry] = useState<TelemetryStats>({
    memoryMB: 96,
    cpuPercent: 3,
    gpuPercent: 12,
    vramUsedMB: 480,
    vramTotalMB: 8192,
    gpuActive: true,
    uptimeSeconds: 0,
    connectedClients: 1,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const pingIntervalRef = useRef<any>(null);
  const lastPingTimeRef = useRef<number>(0);

  const connectWs = useCallback(() => {
    const isViteDev = window.location.port === '5173';
    const targetPort = isViteDev ? 18890 : (window.location.port || 18890);
    const wsUrl = `ws://${window.location.hostname || 'localhost'}:${targetPort}/ws`;

    try {
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        console.log('[ServerSync] Connected to backend on port:', targetPort);

        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            lastPingTimeRef.current = performance.now();
            socket.send(JSON.stringify({ type: 'ping', clientTime: Date.now() }));
          }
        }, 2000);
      };

      socket.onmessage = (event) => {
        try {
          const msg: WsServerEvent = JSON.parse(event.data);
          switch (msg.type) {
            case 'pong':
              if (lastPingTimeRef.current > 0) {
                const roundtrip = Math.round(performance.now() - lastPingTimeRef.current);
                setLiveLatencyMs((prev) => Math.max(1, Math.round((prev * 0.3) + (roundtrip * 0.7))));
              }
              break;

            case 'init_state':
              if (msg.style) setStyle(msg.style);
              if (msg.language) setLanguage(msg.language);
              if (msg.activePort) setActivePort(msg.activePort);
              if (msg.glossary) setGlossary(msg.glossary);
              break;

            case 'style_updated':
              setStyle(msg.payload);
              break;

            case 'language_updated':
              setLanguage(msg.payload);
              break;

            case 'glossary_updated':
              setGlossary(msg.payload);
              break;

            case 'telemetry':
              if (msg.stats) {
                setTelemetry(msg.stats);
              }
              break;

            case 'subtitle_live':
            case 'subtitle_final':
              setLatestSubtitle(msg.payload);
              if (msg.payload.latencyMs) {
                setLiveLatencyMs(msg.payload.latencyMs);
              }
              setSubtitleHistory((prev) => {
                const idx = prev.findIndex((s) => s.id === msg.payload.id);
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = msg.payload;
                  return updated;
                }
                return [...prev.slice(-100), msg.payload];
              });
              break;

            case 'subtitles_cleared':
              setLatestSubtitle(null);
              setSubtitleHistory([]);
              break;
          }
        } catch (err) {
          console.error('[ServerSync] Message parsing error:', err);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        reconnectTimeoutRef.current = setTimeout(connectWs, 2000);
      };

      socket.onerror = () => {
        socket.close();
      };
    } catch (err) {
      console.warn('[ServerSync] Connection error:', err);
      reconnectTimeoutRef.current = setTimeout(connectWs, 2000);
    }
  }, []);

  useEffect(() => {
    connectWs();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectWs]);

  const updateStyle = useCallback((newStyle: Partial<StyleConfig>) => {
    setStyle((prev) => {
      const merged = { ...prev, ...newStyle };
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'update_style',
          payload: merged,
        }));
      }
      return merged;
    });
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'apply_preset',
        presetId,
      }));
    }
  }, []);

  const updateLanguage = useCallback((newLang: Partial<TranslationConfig>) => {
    setLanguage((prev) => {
      const merged = { ...prev, ...newLang };
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'update_language',
          payload: merged,
        }));
      }
      return merged;
    });
  }, []);

  const updateGlossary = useCallback((newGlossary: GlossaryItem[]) => {
    setGlossary(newGlossary);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'update_glossary',
        payload: newGlossary,
      }));
    }
  }, []);

  const sendTranscriptChunk = useCallback((text: string, isFinal: boolean, id?: string, clientTime?: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'transcript_chunk',
        text,
        isFinal,
        id,
        clientTime: clientTime || Date.now(),
      }));
    }
  }, []);

  const sendTestSubtitle = useCallback((text?: string) => {
    const defaultSample = language.sourceLang === 'th'
      ? 'สวัสดีทุกคนค่า! วันนี้มาเล่นเกมกันอย่างสนุกสนานเลยนะ'
      : language.sourceLang === 'en'
      ? 'Hello everyone! Welcome to my VTuber livestream, let\'s have fun!'
      : '皆さん、聞こえてますか？今日も配信見に来てくれてありがとう！';

    const testText = text || defaultSample;
    sendTranscriptChunk(testText, true, `test_${Date.now()}`, Date.now());
  }, [language.sourceLang, sendTranscriptChunk]);

  const clearSubtitles = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'clear_subtitles',
      }));
    }
    setLatestSubtitle(null);
    setSubtitleHistory([]);
  }, []);

  const exportSRT = useCallback(() => {
    window.open(`http://localhost:${activePort}/api/export/srt`, '_blank');
  }, [activePort]);

  const exportVTT = useCallback(() => {
    window.open(`http://localhost:${activePort}/api/export/vtt`, '_blank');
  }, [activePort]);

  return {
    isConnected,
    activePort,
    style,
    language,
    audio,
    presets,
    glossary,
    latestSubtitle,
    subtitleHistory,
    telemetry,
    liveLatencyMs,
    updateStyle,
    applyPreset,
    updateLanguage,
    updateGlossary,
    sendTranscriptChunk,
    sendTestSubtitle,
    clearSubtitles,
    exportSRT,
    exportVTT,
  };
}
