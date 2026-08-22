import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, X } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 max-w-xl w-full space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-lg bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-black">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-[var(--text-main)]">
                {t.glossaryModalTitle}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {t.glossaryModalDesc}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Form */}
        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-[var(--bg-input)] p-3 rounded-xl border border-[var(--border-subtle)]">
          <input
            type="text"
            placeholder={t.sourcePatternPlaceholder}
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            className="sm:col-span-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--border-active)] font-medium"
          />
          <select
            value={newLang}
            onChange={(e) => setNewLang(e.target.value)}
            className="sm:col-span-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--border-active)] font-bold"
          >
            <option value="th">ไทย (TH)</option>
            <option value="en">English (EN)</option>
            <option value="ja">日本語 (JP)</option>
          </select>
          <input
            type="text"
            placeholder={t.replacementPlaceholder}
            value={newReplacement}
            onChange={(e) => setNewReplacement(e.target.value)}
            className="sm:col-span-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--border-active)] font-medium"
          />
          <button
            type="submit"
            className="sm:col-span-2 btn-white py-1.5 text-xs flex items-center justify-center gap-1 font-black"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addTermBtn}</span>
          </button>
        </form>

        {/* Item List */}
        <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-[var(--text-main)] px-2 py-0.5 rounded bg-[var(--bg-surface)]">
                  {item.sourcePattern}
                </span>
                <span className="text-[var(--text-muted)]">➔</span>
                <span className="font-bold text-[var(--text-main)] uppercase text-[10px] px-1.5 py-0.5 rounded bg-[var(--btn-secondary-bg)]">
                  {item.targetLang}
                </span>
                <span className="text-[var(--text-main)] font-medium">{item.replacement}</span>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-1 text-[var(--text-muted)] hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="btn-white px-6 py-2 text-xs font-black">
            {t.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
