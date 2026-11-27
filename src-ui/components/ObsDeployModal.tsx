import React, { useEffect, useState } from 'react';
import { Tv, Copy, Check, ExternalLink, X, Code } from 'lucide-react';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface ObsDeployModalProps {
  isOpen: boolean;
  activePort: number;
  uiLang: UILang;
  onClose: () => void;
}

const RESOLUTIONS = [
  { width: 1280, height: 720, label: '720p' },
  { width: 1920, height: 1080, label: '1080p' },
  { width: 2560, height: 1440, label: '1440p' },
  { width: 3840, height: 2160, label: '4K' },
];

export const ObsDeployModal: React.FC<ObsDeployModalProps> = ({
  isOpen,
  activePort,
  uiLang,
  onClose,
}) => {
  const t = UI_TRANSLATIONS[uiLang];
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<{ width: number; height: number; label: string }>(RESOLUTIONS[1]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

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

  const steps = [
    { title: t.step1Guide, sub: t.step1GuideSub },
    { title: t.step2Guide, sub: t.step2GuideSub },
    { title: t.step3Guide, sub: `${t.step3GuideSub} (${selectedResolution.width} x ${selectedResolution.height})` },
  ];

  return (
    <div
      className="fixed inset-0 bg-[var(--scrim)] flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="deploy-title" className="modal-card p-6 max-w-xl w-full space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="step-badge step-blue" aria-hidden="true">
              <Tv className="w-4 h-4" />
            </span>
            <div>
              <h2 id="deploy-title" className="panel-title">{t.deployTitle}</h2>
              <p className="panel-desc">{t.deployDesc}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-icon" aria-label={t.closeBtn}>
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="overlay-url" className="field-label block">{t.overlayUrlLabel}</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1 rounded-xl border-[1.5px] border-line-strong bg-sunken pl-3 pr-1 min-h-[44px] focus-within:border-[var(--focus)]">
              <input
                id="overlay-url"
                type="text"
                readOnly
                value={overlayUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 min-w-0 bg-transparent text-sm font-mono text-ink focus:outline-none"
              />
              <a
                href={overlayUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-icon"
                title={t.openOverlay}
                aria-label={t.openOverlay}
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
            <button type="button" onClick={handleCopyUrl} className="btn btn-primary min-h-[44px] min-w-[9rem]" aria-live="polite">
              {copiedUrl ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
              <span>{copiedUrl ? t.copiedUrlBtn : t.copyUrlBtn}</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5" role="group" aria-labelledby="res-label">
          <span id="res-label" className="field-label block">{t.resolutionSetting}</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {RESOLUTIONS.map((res) => (
              <button
                key={res.width}
                type="button"
                onClick={() => setSelectedResolution(res)}
                aria-pressed={selectedResolution.width === res.width}
                className="tile !py-2 text-center"
              >
                <span className="tile-title block">{res.label}</span>
                <span className="text-[0.6875rem] text-muted tabular-nums">{res.width} x {res.height}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="box space-y-2">
          <span className="box-title">{t.threeSteps}</span>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {steps.map((s) => (
              <li key={s.title} className="p-2.5 rounded-xl bg-surface border border-line">
                <p className="text-sm font-semibold text-ink">{s.title}</p>
                <p className="text-xs text-muted">{s.sub}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={handleCopyCss} className="btn btn-ghost btn-sm">
            {copiedCss ? <Check className="w-3.5 h-3.5 text-ok" aria-hidden="true" /> : <Code className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>{copiedCss ? t.copiedCss : t.copyCss}</span>
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary px-6">
            {t.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
