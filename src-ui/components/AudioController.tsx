import React from 'react';
import { Mic, MicOff, Volume2, Activity, Sparkles, RefreshCw, Sliders } from 'lucide-react';
import type { AudioDevice } from '../hooks/useAudioRecorder';
import { AudioSpectrumVisualizer } from './AudioSpectrumVisualizer';

interface AudioControllerProps {
  isRecording: boolean;
  devices: AudioDevice[];
  selectedDeviceId: string;
  onSelectDevice: (id: string) => void;
  volumeLevel: number;
  isSpeaking: boolean;
  vadThreshold: number;
  analyserNode?: AnalyserNode | null;
  onChangeVadThreshold: (val: number) => void;
  onStart: () => void;
  onStop: () => void;
  onRefreshDevices: () => void;
  onTestSubtitle: () => void;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  isRecording,
  devices,
  selectedDeviceId,
  onSelectDevice,
  volumeLevel,
  isSpeaking,
  vadThreshold,
  analyserNode,
  onChangeVadThreshold,
  onStart,
  onStop,
  onRefreshDevices,
  onTestSubtitle,
}) => {
  const meterPercent = Math.min(100, Math.max(0, volumeLevel * 350));
  const thresholdPercent = Math.min(100, vadThreshold * 350);

  return (
    <div className="glass-panel p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${isRecording ? 'bg-pink-500/20 text-pink-400 shadow-[0_0_12px_rgba(255,121,198,0.4)]' : 'bg-slate-800 text-slate-400'}`}>
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
              Audio Engine & Spectrum
              {isSpeaking && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/40 animate-pulse">
                  VOICE ACTIVE
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-400">16kHz Zero-Jitter AudioWorklet Stream</p>
          </div>
        </div>

        {/* Master Mic Toggle Button */}
        <button
          onClick={isRecording ? onStop : onStart}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isRecording
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
              : 'btn-anime'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Stop Voice Stream</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 animate-bounce" />
              <span>Start Voice Stream</span>
            </>
          )}
        </button>
      </div>

      {/* 60fps Real-Time FFT Frequency Visualizer */}
      <AudioSpectrumVisualizer
        isRecording={isRecording}
        volumeLevel={volumeLevel}
        analyserNode={analyserNode}
      />

      {/* Device Selector */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <label className="font-semibold text-slate-300">Microphone Input</label>
          <button
            onClick={onRefreshDevices}
            className="text-pink-400 hover:text-pink-300 flex items-center gap-1 text-[11px]"
            title="Refresh Devices"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Rescan</span>
          </button>
        </div>
        <select
          value={selectedDeviceId}
          onChange={(e) => onSelectDevice(e.target.value)}
          disabled={isRecording}
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500 disabled:opacity-50"
        >
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label}
            </option>
          ))}
          {devices.length === 0 && <option value="default">Default System Microphone</option>}
        </select>
      </div>

      {/* VU Level Meter with VAD Threshold Needle */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
            <Activity className="w-3 h-3 text-pink-400" />
            Live VU Level
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            {Math.round(meterPercent)}% {meterPercent > thresholdPercent ? '⚡ Above Gate' : '💤 Gate Closed'}
          </span>
        </div>

        <div className="relative h-3 bg-slate-950/90 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-75 ${
              meterPercent > 70
                ? 'bg-gradient-to-r from-green-400 via-yellow-400 to-rose-500'
                : meterPercent > thresholdPercent
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                : 'bg-slate-700'
            }`}
            style={{ width: `${meterPercent}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-pink-400 shadow-[0_0_8px_#ff79c6]"
            style={{ left: `${thresholdPercent}%` }}
            title="VAD Gate Threshold"
          />
        </div>
      </div>

      {/* VAD Sensitivity Slider & Test Action */}
      <div className="flex items-center gap-3 pt-1">
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-cyan-400" />
              Noise Gate Threshold
            </span>
            <span className="font-mono text-pink-400">{(vadThreshold * 100).toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0.005"
            max="0.08"
            step="0.002"
            value={vadThreshold}
            onChange={(e) => onChangeVadThreshold(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <button
          onClick={onTestSubtitle}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-pink-300 text-[11px] font-bold rounded-lg border border-pink-500/30 flex items-center gap-1 transition-all"
        >
          <Sparkles className="w-3 h-3 text-pink-400" />
          <span>Test Subtitle</span>
        </button>
      </div>
    </div>
  );
};
