import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Download, 
  Trash2, 
  Palette, 
  Volume2, 
  Languages, 
  Tv, 
  HelpCircle, 
  Minus, 
  Square, 
  X, 
  Pin, 
  Check, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import type { StylePreset } from '../../src-server/types/schema';

interface TopMenuBarProps {
  activePort: number;
  presets: StylePreset[];
  onApplyPreset: (id: string) => void;
  onOpenGlossary: () => void;
  onClearSubtitles: () => void;
  onExportSRT: () => void;
  onExportVTT: () => void;
  onTestSubtitle: () => void;
}

export const TopMenuBar: React.FC<TopMenuBarProps> = ({
  activePort,
  presets,
  onApplyPreset,
  onOpenGlossary,
  onClearSubtitles,
  onExportSRT,
  onExportVTT,
  onTestSubtitle,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  const toggleMenu = (name: string) => {
    setActiveMenu(activeMenu === name ? null : name);
  };

  const closeMenus = () => setActiveMenu(null);

  return (
    <div 
      className="bg-[#121622] border-b border-slate-800/80 px-3 py-1 flex items-center justify-between text-xs select-none relative z-50"
      onMouseLeave={closeMenus}
    >
      {/* Left Branding & Dropdown Menus */}
      <div className="flex items-center gap-1">
        {/* App Logo */}
        <div className="flex items-center gap-2 px-2 py-1 mr-2 rounded bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-pink-500/30">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
          <span className="font-extrabold bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent tracking-tight">
            VTUBER STUDIO PRO
          </span>
          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-pink-500/30 text-pink-300">
            EXE
          </span>
        </div>

        {/* File Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('file')}
            className={`px-2.5 py-1 rounded hover:bg-slate-800 font-medium transition-colors ${
              activeMenu === 'file' ? 'bg-slate-800 text-white' : 'text-slate-300'
            }`}
          >
            File
          </button>
          {activeMenu === 'file' && (
            <div className="absolute left-0 top-full mt-1 w-52 bg-[#181f30] border border-slate-700/80 rounded-lg shadow-2xl p-1 space-y-0.5 z-50 animate-fadeIn">
              <button
                onClick={() => { onTestSubtitle(); closeMenus(); }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-700/60 flex items-center gap-2 text-slate-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Trigger Test Subtitle</span>
              </button>
              <button
                onClick={() => { onExportSRT(); closeMenus(); }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-700/60 flex items-center gap-2 text-slate-200"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Subtitles (.SRT)</span>
              </button>
              <button
                onClick={() => { onExportVTT(); closeMenus(); }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-700/60 flex items-center gap-2 text-slate-200"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Subtitles (.VTT)</span>
              </button>
              <hr className="border-slate-700/50 my-1" />
              <button
                onClick={() => { onClearSubtitles(); closeMenus(); }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-rose-950/40 text-rose-300 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Clear Session History</span>
              </button>
            </div>
          )}
        </div>

        {/* Presets Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('presets')}
            className={`px-2.5 py-1 rounded hover:bg-slate-800 font-medium transition-colors ${
              activeMenu === 'presets' ? 'bg-slate-800 text-white' : 'text-slate-300'
            }`}
          >
            Presets
          </button>
          {activeMenu === 'presets' && (
            <div className="absolute left-0 top-full mt-1 w-60 bg-[#181f30] border border-slate-700/80 rounded-lg shadow-2xl p-1 space-y-0.5 z-50 animate-fadeIn">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Theme Presets
              </div>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => { onApplyPreset(preset.id); closeMenus(); }}
                  className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-700/60 flex items-center justify-between text-slate-200 text-xs"
                >
                  <span className="font-semibold">{preset.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI & Glossary Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('ai')}
            className={`px-2.5 py-1 rounded hover:bg-slate-800 font-medium transition-colors ${
              activeMenu === 'ai' ? 'bg-slate-800 text-white' : 'text-slate-300'
            }`}
          >
            AI & Glossary
          </button>
          {activeMenu === 'ai' && (
            <div className="absolute left-0 top-full mt-1 w-56 bg-[#181f30] border border-slate-700/80 rounded-lg shadow-2xl p-1 space-y-0.5 z-50 animate-fadeIn">
              <button
                onClick={() => { onOpenGlossary(); closeMenus(); }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-700/60 flex items-center gap-2 text-slate-200"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>Custom Slang & Glossary</span>
              </button>
            </div>
          )}
        </div>

        {/* OBS Studio Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('obs')}
            className={`px-2.5 py-1 rounded hover:bg-slate-800 font-medium transition-colors ${
              activeMenu === 'obs' ? 'bg-slate-800 text-white' : 'text-slate-300'
            }`}
          >
            OBS Studio
          </button>
          {activeMenu === 'obs' && (
            <div className="absolute left-0 top-full mt-1 w-64 bg-[#181f30] border border-slate-700/80 rounded-lg shadow-2xl p-1 space-y-0.5 z-50 animate-fadeIn">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`http://localhost:${activePort}/overlay`);
                  closeMenus();
                }}
                className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-700/60 flex items-center gap-2 text-slate-200"
              >
                <Tv className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copy Overlay URL (Port {activePort})</span>
              </button>
              <a
                href={`http://localhost:${activePort}/overlay`}
                target="_blank"
                rel="noreferrer"
                className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-700/60 flex items-center gap-2 text-slate-200"
                onClick={closeMenus}
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Overlay in Browser</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Right: Window Controls / Tray Pin */}
      <div className="flex items-center gap-1.5">
        {/* Port Status Badge */}
        <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
          PORT: <span className="text-emerald-400 font-bold">{activePort}</span>
        </div>

        {/* Always on top toggle */}
        <button
          onClick={() => setIsAlwaysOnTop(!isAlwaysOnTop)}
          className={`p-1 rounded transition-colors ${
            isAlwaysOnTop ? 'bg-pink-500/20 text-pink-400' : 'text-slate-400 hover:text-slate-200'
          }`}
          title={isAlwaysOnTop ? 'Pinned On Top' : 'Pin Always on Top'}
        >
          <Pin className={`w-3.5 h-3.5 ${isAlwaysOnTop ? 'fill-current' : ''}`} />
        </button>

        {/* Minimize / Maximize / Close Mock for Webview shell */}
        <button 
          onClick={() => {}}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
          title="Minimize Window"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => {}}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
          title="Maximize Window"
        >
          <Square className="w-3 h-3" />
        </button>
        <button 
          onClick={() => {}}
          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded"
          title="Close Window"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
