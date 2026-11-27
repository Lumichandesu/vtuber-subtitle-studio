import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Trash2, X, ArrowRight } from 'lucide-react';
import type { GlossaryItem } from '../../src-server/types/schema';
import type { UILang } from '../i18n/translations';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface GlossaryModalProps {
  isOpen: boolean;
  glossary: GlossaryItem[];
  uiLang: UILang;
  onClose: () => void;
  onUpdateGlossary: (items: GlossaryItem[]) => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  glossary,
  uiLang,
  onClose,
  onUpdateGlossary,
}) => {
  const [items, setItems] = useState<GlossaryItem[]>(glossary);
  const [newPattern, setNewPattern] = useState('');
  const [newReplacement, setNewReplacement] = useState('');
  const [newLang, setNewLang] = useState('th');

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[uiLang];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPattern.trim() || !newReplacement.trim()) return;

    const newItem: GlossaryItem = {
      id: `gloss_${Date.now()}`,
      sourcePattern: newPattern.trim(),
      targetLang: newLang,
      replacement: newReplacement.trim(),
      category: 'slang',
    };

    const updated = [...items, newItem];
    setItems(updated);
    onUpdateGlossary(updated);
    setNewPattern('');
    setNewReplacement('');
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    onUpdateGlossary(updated);
  };

  return (
    <div
      className="fixed inset-0 bg-[var(--scrim)] flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="glossary-title" className="modal-card p-6 max-w-2xl w-full space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="step-badge step-pink" aria-hidden="true">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h2 id="glossary-title" className="panel-title">{t.glossaryModalTitle}</h2>
              <p className="panel-desc">{t.glossaryModalDesc}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-icon" aria-label={t.closeBtn}>
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleAddItem} className="box grid grid-cols-1 sm:grid-cols-12 gap-2">
          <input
            type="text"
            aria-label={t.sourcePatternPlaceholder}
            placeholder={t.sourcePatternPlaceholder}
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            className="field sm:col-span-4"
          />
          <select
            aria-label={t.glossaryLangLabel}
            value={newLang}
            onChange={(e) => setNewLang(e.target.value)}
            className="field sm:col-span-2"
          >
            <option value="th">TH</option>
            <option value="en">EN</option>
            <option value="ja">JP</option>
          </select>
          <input
            type="text"
            aria-label={t.replacementPlaceholder}
            placeholder={t.replacementPlaceholder}
            value={newReplacement}
            onChange={(e) => setNewReplacement(e.target.value)}
            className="field sm:col-span-4"
          />
          <button type="submit" className="btn btn-primary sm:col-span-2">
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>{t.addTermBtn}</span>
          </button>
        </form>

        <ul className="max-h-[260px] overflow-y-auto space-y-1.5 pr-1">
          {items.length === 0 && (
            <li className="py-5 text-center text-sm text-muted rounded-xl border border-dashed border-line-strong">{t.glossaryEmpty}</li>
          )}
          {items.map((item) => (
            <li key={item.id} className="px-3 py-2 rounded-xl bg-sunken border border-line flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-ink truncate">{item.sourcePattern}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted shrink-0" aria-hidden="true" />
                <span className="chip chip-blue uppercase">{item.targetLang === 'ja' ? 'JP' : item.targetLang}</span>
                <span className="text-ink truncate">{item.replacement}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="btn btn-ghost btn-sm btn-icon !min-w-[30px] text-danger"
                aria-label={`${t.removeTerm}: ${item.sourcePattern}`}
                title={t.removeTerm}
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="btn btn-secondary px-6">
            {t.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
