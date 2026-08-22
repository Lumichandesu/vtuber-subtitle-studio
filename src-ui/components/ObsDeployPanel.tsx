import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, Video, HelpCircle, Layers, Code } from 'lucide-react';

interface ObsDeployPanelProps {
  activePort: number;
}

export const ObsDeployPanel: React.FC<ObsDeployPanelProps> = ({ activePort }) => {
  const [copied, setCopied] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showCss, setShowCss] = useState(false);

  const overlayUrl = `http://localhost:${activePort}/overlay`;
  const customCssCode = `/* Optional: Transparent OBS Background */
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0px auto;
  overflow: hidden;
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyCss = () => {
    navigator.clipboard.writeText(customCssCode);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2500);
  };

  return (
    <div className="glass-panel p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(80,250,123,0.3)]">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
              OBS Studio Browser Source Integration
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" /> Port {activePort}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Add directly as an OBS Browser Source for zero-CPU overlay</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCss(!showCss)}
            className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showCss ? 'Hide CSS' : 'Custom CSS'}</span>
          </button>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-[11px] text-slate-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showGuide ? 'Hide Guide' : 'Setup Guide'}</span>
          </button>
        </div>
      </div>

      {/* URL Copy Bar with Animated Glow */}
      <div className="relative group">
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 focus-within:border-pink-500/80 transition-all">
          <span className="text-[10px] font-extrabold text-pink-400 px-2 py-1 rounded bg-pink-500/10 select-none">
            OBS URL
          </span>
          <input
            type="text"
            readOnly
            value={overlayUrl}
            className="flex-1 bg-transparent text-xs font-mono text-cyan-300 focus:outline-none select-all"
          />

          <a
            href={overlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Open in new browser tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleCopy}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              copied
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_#50fa7b]'
                : 'btn-anime'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>

        {copied && (
          <div className="absolute -top-8 right-4 bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-lg shadow-emerald-500/40 animate-bounce">
            ✨ Copied! Ready to paste in OBS Studio!
          </div>
        )}
      </div>

      {/* Custom CSS Panel */}
      {showCss && (
        <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-300">OBS Custom CSS Snippet</span>
            <button
              onClick={handleCopyCss}
              className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 flex items-center gap-1"
            >
              {copiedCss ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCss ? 'Copied CSS!' : 'Copy CSS'}</span>
            </button>
          </div>
          <pre className="p-2 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto">
            {customCssCode}
          </pre>
        </div>
      )}

      {/* Step-by-Step OBS Guide */}
      {showGuide && (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs animate-fadeIn">
          <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            3-Step OBS Studio Quick Setup
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="font-bold text-pink-400 text-xs">Step 1: Add Source</span>
              <p className="text-slate-400 text-[10px]">
                In OBS Studio, click <b>Sources (+)</b> ➔ select <b>Browser</b>.
              </p>
            </div>

            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="font-bold text-cyan-400 text-xs">Step 2: Paste URL</span>
              <p className="text-slate-400 text-[10px]">
                Set URL to <code className="text-cyan-300">{overlayUrl}</code>.
              </p>
            </div>

            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="font-bold text-yellow-400 text-xs">Step 3: Resolution</span>
              <p className="text-slate-400 text-[10px]">
                Set <b>Width: 1920</b>, <b>Height: 1080</b>, and check <i>Shutdown when not visible</i>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
