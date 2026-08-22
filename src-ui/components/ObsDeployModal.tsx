import React, { useState } from 'react';
import { 
  Tv, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Layers, 
  Code 
} from 'lucide-react';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface ObsDeployModalProps {
  isOpen: boolean;
  activePort: number;
  uiLang: UILang;
  onClose: () => void;
}

export const ObsDeployModal: React.FC<ObsDeployModalProps> = ({
  isOpen,
  activePort,
  uiLang,
  onClose,
}) => {
  const t = UI_TRANSLATIONS[uiLang];
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<{ width: number; height: number; label: string }>({
    width: 1920,
    height: 1080,
    label: '1080p Full HD (Recommended)',
  });

  if (!isOpen) return null;

  const overlayUrl = `http://localhost:${activePort}/overlay`;
  const customCssCode = `/* OBS Browser Source Transparent Background */
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0px auto;
  overflow: hidden;
}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleCopyCss = () => {
    navigator.clipboard.writeText(customCssCode);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-active)] rounded-2xl p-5 max-w-xl w-full space-y-4 shadow-2xl relative overflow-hidden">
        {/* Header - Clean without Port box */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-lg bg-[var(--text-main)] text-[var(--bg-main)] font-black">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-[var(--text-main)]">
                {t.deployTitle}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {t.deployDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--btn-secondary-bg)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main URL Copy Card */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-main)]">OBS Browser Source URL</label>
          <div className="flex items-center gap-2 bg-[var(--bg-input)] p-2 rounded-xl border border-[var(--border-subtle)] focus-within:border-[var(--text-main)]">
            <span className="text-[10px] font-black text-[var(--bg-main)] px-2 py-0.5 rounded bg-[var(--text-main)] uppercase">
              URL
            </span>
            <input
              type="text"
              readOnly
              value={overlayUrl}
              className="flex-1 bg-transparent text-xs font-mono text-[var(--text-main)] focus:outline-none select-all font-bold"
            />
            <a
              href={overlayUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--btn-secondary-bg)] transition-colors"
              title="Open overlay in browser"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={handleCopyUrl}
              className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
                copiedUrl
                  ? 'bg-emerald-400 text-black shadow-[0_0_12px_#50fa7b]'
                  : 'btn-white'
              }`}
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{t.copiedUrlBtn}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyUrlBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Resolution Selector: 720p on the far left! */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-main)]">{t.resolutionSetting}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { width: 1280, height: 720, label: '1280 x 720 (720p HD)' },
              { width: 1920, height: 1080, label: '1920 x 1080 (1080p FHD)' },
              { width: 2560, height: 1440, label: '2560 x 1440 (2K QHD)' },
              { width: 3840, height: 2160, label: '3840 x 2160 (4K UHD)' },
            ].map((res) => {
              const isSelected = selectedResolution.width === res.width;
              return (
                <button
                  key={res.width}
                  onClick={() => setSelectedResolution(res)}
                  className={`p-2 rounded-lg border text-left text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-[var(--text-main)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-black'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:border-[var(--border-active)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <div>{res.width} x {res.height}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Step Guide */}
        <div className="p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-2 text-xs">
          <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[var(--text-main)]" />
            {t.threeSteps}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-0.5">
              <span className="font-black text-[var(--text-main)] text-[11px]">{t.step1Guide}</span>
              <p className="text-[var(--text-muted)] text-[10px]">
                {t.step1GuideSub}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-0.5">
              <span className="font-black text-[var(--text-main)] text-[11px]">{t.step2Guide}</span>
              <p className="text-[var(--text-muted)] text-[10px]">
                {t.step2GuideSub}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-0.5">
              <span className="font-black text-[var(--text-main)] text-[11px]">{t.step3Guide}</span>
              <p className="text-[var(--text-muted)] text-[10px]">
                {t.step3GuideSub} ({selectedResolution.width}x{selectedResolution.height})
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleCopyCss}
            className="text-[11px] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{copiedCss ? t.copiedCss : t.copyCss}</span>
          </button>

          <button
            onClick={onClose}
            className="btn-white px-6 py-2 rounded-lg text-xs font-black"
          >
            {t.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
