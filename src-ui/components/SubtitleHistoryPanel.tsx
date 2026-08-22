import React, { useState } from 'react';
import { History, Download, Trash2, Copy, Check } from 'lucide-react';
import type { SubtitlePayload } from '../../src-server/types/schema';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface SubtitleHistoryPanelProps {
  history: SubtitlePayload[];
  uiLang: UILang;
  onClear: () => void;
  onExportSRT: () => void;
  onExportVTT: () => void;
}

export const SubtitleHistoryPanel: React.FC<SubtitleHistoryPanelProps> = ({
  history,
  uiLang,
  onClear,
  onExportSRT,
  onExportVTT,
}) => {
  const t = UI_TRANSLATIONS[uiLang];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLine = (sub: SubtitlePayload) => {
    const text = `${sub.rawText}\n` + Object.entries(sub.translations || {}).map(([l, t]) => `[${l}] ${t}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedId(sub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[var(--btn-secondary-bg)] text-[var(--text-main)]">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-[var(--text-main)]">
              {t.historyTitle}
            </h3>
            <span className="text-[10px] text-[var(--text-muted)]">
              {history.length} {t.linesInMemory}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onExportSRT}
            className="btn-dark px-2.5 py-1 text-[10px] flex items-center gap-1"
            title="Download SRT for Premiere Pro / DaVinci Resolve"
          >
            <Download className="w-3 h-3 text-[var(--text-main)]" />
            <span>.SRT</span>
          </button>
          <button
            onClick={onExportVTT}
            className="btn-dark px-2.5 py-1 text-[10px] flex items-center gap-1"
            title="Download WebVTT"
          >
            <Download className="w-3 h-3 text-[var(--text-main)]" />
            <span>.VTT</span>
          </button>
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg bg-[var(--btn-secondary-bg)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-400"
            title={t.clearBtn}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 text-xs">
        {history.length === 0 ? (
          <div className="py-4 text-center text-[var(--text-muted)] text-[11px]">
            {t.noHistory}
          </div>
        ) : (
          history.slice().reverse().map((sub) => (
            <div
              key={sub.id}
              className="p-2 rounded bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-start justify-between gap-2"
            >
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="font-bold text-[var(--text-main)] truncate text-[11px]">{sub.rawText}</div>
                {sub.translations && (
                  <div className="text-[10px] text-[var(--text-muted)] truncate">
                    {Object.entries(sub.translations).map(([l, t]) => `[${l.toUpperCase()}]: ${t}`).join(' • ')}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleCopyLine(sub)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded"
              >
                {copiedId === sub.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
