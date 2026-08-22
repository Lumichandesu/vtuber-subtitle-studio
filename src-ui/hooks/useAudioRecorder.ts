import { useState, useEffect, useRef, useCallback } from 'react';

export interface AudioDevice {
  deviceId: string;
  label: string;
}

export type SttMode = 'quality' | 'speed';

interface UseAudioRecorderProps {
  sourceLang: string;
  sttMode?: SttMode;
  studioMicMode?: boolean;
  vadThreshold?: number;
  onTranscript?: (text: string, isFinal: boolean, clientTime?: number) => void;
}

export function useAudioRecorder({
  sourceLang = 'ja',
  sttMode = 'quality',
  studioMicMode = true,
  vadThreshold = 0.010,
  onTranscript,
}: UseAudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('default');
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  
  // Dual-Worker Ping-Pong Architecture
  const recARef = useRef<any>(null);
  const recBRef = useRef<any>(null);
  const activeWorkerRef = useRef<'A' | 'B'>('A');
  
  const isRecordingRef = useRef(false);
  const currentInterimRef = useRef<string>('');
  const lastFinalTranscriptRef = useRef<string>('');
  const lastSpeechTimeRef = useRef<number>(Date.now());
  const restartCycleTimeoutRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  const refreshDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices
        .filter((d) => d.kind === 'audioinput')
        .map((d, idx) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${idx + 1}`,
        }));
      setDevices(audioInputs);
      if (audioInputs.length > 0 && selectedDeviceId === 'default') {
        setSelectedDeviceId(audioInputs[0].deviceId);
      }
    } catch (err) {
      console.warn('[Audio] Device enumeration error:', err);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  const getLanguageBcp47 = (lang: string) => {
    switch (lang) {
      case 'ja': return 'ja-JP';
      case 'th': return 'th-TH';
      case 'en': return 'en-US';
      default: return 'ja-JP';
    }
  };

  /**
   * Ping-Pong Alternating Speech Worker Factory
   * Completely bypasses Chromium single-phrase buffer stall by rotating workers A & B.
   */
  const spawnWorker = useCallback((workerId: 'A' | 'B') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = getLanguageBcp47(sourceLang);

    rec.onresult = (event: any) => {
      if (!isRecordingRef.current) return;
      lastSpeechTimeRef.current = Date.now();

      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        const transcript = item[0]?.transcript || '';
        if (item.isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      // Sentence final received
      if (final.trim()) {
        const text = final.trim();
        if (text !== lastFinalTranscriptRef.current) {
          lastFinalTranscriptRef.current = text;
          currentInterimRef.current = '';
          onTranscript?.(text, true, Date.now());

          // Rotate to the other worker smoothly
          switchPingPongWorker();
        }
      } 
      // Interim words
      else if (interim.trim()) {
        const text = interim.trim();
        currentInterimRef.current = text;
        onTranscript?.(text, false, Date.now());

        // Voice Pause Auto-Commit (400ms silence)
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (isRecordingRef.current && currentInterimRef.current) {
            const commit = currentInterimRef.current;
            currentInterimRef.current = '';
            lastFinalTranscriptRef.current = commit;
            onTranscript?.(commit, true, Date.now());
            switchPingPongWorker();
          }
        }, 400);
      }
    };

    rec.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.warn(`[STT-${workerId}] Notice:`, event.error);
    };

    rec.onend = () => {
      if (isRecordingRef.current && activeWorkerRef.current === workerId) {
        setTimeout(() => {
          if (isRecordingRef.current && activeWorkerRef.current === workerId) {
            try { rec.start(); } catch (e) {}
          }
        }, 10);
      }
    };

    return rec;
  }, [sourceLang, onTranscript]);

  const switchPingPongWorker = useCallback(() => {
    if (!isRecordingRef.current) return;

    const currentWorkerId = activeWorkerRef.current;
    const nextWorkerId = currentWorkerId === 'A' ? 'B' : 'A';
    activeWorkerRef.current = nextWorkerId;

    const currentRec = currentWorkerId === 'A' ? recARef.current : recBRef.current;
    const nextRec = nextWorkerId === 'A' ? recARef.current : recBRef.current;

    // Start next worker FIRST (seamless overlap)
    if (nextRec) {
      try {
        nextRec.start();
      } catch (e) {
        const fresh = spawnWorker(nextWorkerId);
        if (nextWorkerId === 'A') recARef.current = fresh;
        else recBRef.current = fresh;
        try { fresh?.start(); } catch (err) {}
      }
    }

    // Stop previous worker cleanly
    if (currentRec) {
      try {
        currentRec.stop();
      } catch (e) {}
    }
  }, [spawnWorker]);

  const startLevelMeter = (stream: MediaStream) => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass({ sampleRate: 48000 });
    audioContextRef.current = ctx;

    const source = ctx.createMediaStreamSource(stream);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 80;

    const presenceEq = ctx.createBiquadFilter();
    presenceEq.type = 'peaking';
    presenceEq.frequency.value = 3800;
    presenceEq.gain.value = 5.0;
    presenceEq.Q.value = 1.2;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-24, ctx.currentTime);
    compressor.knee.setValueAtTime(30, ctx.currentTime);
    compressor.ratio.setValueAtTime(4, ctx.currentTime);
    compressor.attack.setValueAtTime(0.002, ctx.currentTime);
    compressor.release.setValueAtTime(0.2, ctx.currentTime);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.08;

    source.connect(highpass);
    highpass.connect(presenceEq);
    presenceEq.connect(compressor);
    compressor.connect(analyser);

    setAnalyserNode(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkAudioLevel = () => {
      if (!isRecordingRef.current) {
        setVolumeLevel(0);
        setIsSpeaking(false);
        return;
      }

      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength / 255;
      setVolumeLevel(avg);
      const speaking = avg > vadThreshold;
      setIsSpeaking(speaking);

      if (speaking) {
        lastSpeechTimeRef.current = Date.now();
      }

      animFrameRef.current = requestAnimationFrame(checkAudioLevel);
    };

    checkAudioLevel();

    // Auto Refresh Heartbeat: refreshes worker every 7 seconds of complete silence to guarantee 0 stale buffers
    if (restartCycleTimeoutRef.current) clearInterval(restartCycleTimeoutRef.current);
    restartCycleTimeoutRef.current = setInterval(() => {
      if (!isRecordingRef.current) return;
      const silenceDuration = Date.now() - lastSpeechTimeRef.current;
      if (silenceDuration > 6000) {
        switchPingPongWorker();
      }
    }, 4000);
  };

  const startRecording = useCallback(async () => {
    if (isRecordingRef.current) return;

    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      isRecordingRef.current = true;
      setIsRecording(true);

      startLevelMeter(stream);

      // Initialize Dual Ping-Pong Workers
      recARef.current = spawnWorker('A');
      recBRef.current = spawnWorker('B');
      activeWorkerRef.current = 'A';

      if (recARef.current) {
        try {
          recARef.current.start();
        } catch (e) {
          console.warn('[STT-A] Start error:', e);
        }
      }
    } catch (err) {
      console.error('[Audio] Could not start microphone:', err);
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  }, [selectedDeviceId, spawnWorker, vadThreshold]);

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false;
    setIsRecording(false);
    setIsSpeaking(false);
    setVolumeLevel(0);
    currentInterimRef.current = '';
    lastFinalTranscriptRef.current = '';

    if (restartCycleTimeoutRef.current) {
      clearInterval(restartCycleTimeoutRef.current);
      restartCycleTimeoutRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (recARef.current) {
      try { recARef.current.abort(); } catch (e) {}
      recARef.current = null;
    }
    if (recBRef.current) {
      try { recBRef.current.abort(); } catch (e) {}
      recBRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try { track.stop(); } catch (e) {}
      });
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    setAnalyserNode(null);
  }, []);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return {
    isRecording,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    volumeLevel,
    isSpeaking,
    analyserNode,
    startRecording,
    stopRecording,
    refreshDevices,
  };
}
