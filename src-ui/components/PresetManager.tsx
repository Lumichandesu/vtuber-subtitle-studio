import React, { useState } from 'react';
import { Sparkles, Plus, Check } from 'lucide-react';
import type { StylePreset, StyleConfig } from '../../src-server/types/schema';

interface PresetManagerProps {
  presets: StylePreset[];
  activePresetName?: string;
  currentStyle: StyleConfig;
  onApplyPreset: (id: string) => void;
  onSaveCustomPreset: (name: string, description: string) => void;
}

export const PresetManager: React.FC<PresetManagerProps> = ({
  presets,
  activePresetName,
  currentStyle,
  onApplyPreset,
  onSaveCustomPreset,
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;
    onSaveCustomPreset(newPresetName.trim(), newPresetDesc.trim());
    setNewPresetName('');
    setNewPresetDesc('');
    setShowSaveModal(false);
  };

  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <h3 className="font-bold text-sm text-slate-100">Style & Overlay Presets</h3>
        </div>
        <button
          onClick={() => setShowSaveModal(true)}
          className="text-[11px] font-bold text-pink-300 hover:text-pink-200 px-2 py-1 rounded bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 flex items-center gap-1 transition-all"
        >
          <Plus className="w-3 h-3" />
          <span>Save Current</span>
        </button>
      </div>

      {/* Presets Horizontal Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {presets.map((preset) => {
          const isActive = currentStyle.presetName === preset.name || activePresetName === preset.name;
          return (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.id)}
              className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_12px_rgba(255,121,198,0.25)]'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Gradient Banner Indicator */}
              <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${preset.previewGradient} mb-2`} />

              <div>
                <div className="font-bold text-xs text-slate-200 flex items-center justify-between">
                  <span>{preset.name}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-pink-400 stroke-[3]" />}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {preset.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Save Custom Preset Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#161c2d] border border-slate-700 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <h4 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Save Style as Custom Preset
            </h4>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preset Name</label>
                <input
                  type="text"
                  placeholder="e.g. My Neon Sakura 2.0"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. For Apex Legends & Horror Streams"
                  value={newPresetDesc}
                  onChange={(e) => setNewPresetDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-anime px-4 py-1.5 rounded-lg text-xs font-bold"
                >
                  Save Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
