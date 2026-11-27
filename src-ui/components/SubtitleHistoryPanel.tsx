import React, { useState } from 'react';
import { History, Download, Eraser, Copy, Check } from 'lucide-react';
import type { SubtitlePayload } from '../../src-server/types/schema';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';
import type { AppEdition } from '../App';
import { ProChip } from './ui';

interface SubtitleHistoryPanelProps {
  history: SubtitlePayload[];
  uiLang: UILang;
  edition?: AppEdition;
  onClear: () => void;
  onExportSRT: () => void;
  onExportVTT: () => void;
}

export const SubtitleHistoryPanel: React.FC<SubtitleHistoryPanelProps> = ({
  history,
  uiLang,
  edition = 'pro',
  onClear,
  onExportSRT,
  onExportVTT,
}) => {
  const t = UI_TRANSLATIONS[uiLang];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLine = (sub: SubtitlePayload) => {
    const text = `${sub.rawText}\n` + Object.entries(sub.translations || {}).map(([l, tr]) => `[${l}] ${tr}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedId(sub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="panel space-y-3" aria-labelledby="history-title">
      <div className="panel-head">
        <div className="flex items-center gap-2.5 min-w-0">
          <History className="w-4 h-4 shrink-0" aria-hidden="true" />
          <h2 id="history-title" className="text-[0.9375rem] font-semibold text-ink truncate">{t.historyTitle}</h2>
          <span className="chip tabular-nums">
            {history.length} {t.linesInMemory}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={onExportSRT} className="btn btn-secondary btn-sm" title={t.exportSrtTitle}>
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>.SRT</span>
          </button>
          <button type="button" onClick={onExportVTT} className="btn btn-secondary btn-sm" title={t.exportVttTitle}>
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>.VTT</span>
          </button>
          {edition === 'free' && <ProChip />}
          <button type="button" onClick={onClear} className="btn btn-ghost btn-sm btn-icon !min-w-[30px]" title={t.clearBtn} aria-label={t.clearBtn}>
            <Eraser className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="max-h-[180px] overflow-y-auto space-y-1.5 pr-1">
        {history.length === 0 ? (
          <p className="py-5 text-center text-sm text-muted rounded-xl border border-dashed border-line-strong">{t.noHistory}</p>
        ) : (
          history.slice().reverse().map((sub) => (
            <div key={sub.id} className="px-3 py-2 rounded-xl bg-sunken border border-line flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink truncate">{sub.rawText}</p>
                {sub.translations && (
                  <p className="text-xs text-muted truncate">
                    {Object.entries(sub.translations).map(([l, tr]) => `${l.toUpperCase()}: ${tr}`).join('  ·  ')}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleCopyLine(sub)}
                className="btn btn-ghost btn-sm btn-icon !min-w-[30px]"
                title={t.copyLine}
                aria-label={t.copyLine}
              >
                {copiedId === sub.id ? <Check className="w-3.5 h-3.5 text-ok" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
