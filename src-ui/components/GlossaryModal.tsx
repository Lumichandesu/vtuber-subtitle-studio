import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, X, Save, ShieldCheck } from 'lucide-react';
import type { GlossaryItem } from '../../src-server/types/schema';

interface GlossaryModalProps {
  isOpen: boolean;
  glossary: GlossaryItem[];
  onClose: () => void;
  onUpdateGlossary: (items: GlossaryItem[]) => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  glossary,
  onClose,
  onUpdateGlossary,
}) => {
  const [items, setItems] = useState<GlossaryItem[]>(glossary);
  const [newPattern, setNewPattern] = useState('');
  const [newReplacement, setNewReplacement] = useState('');
  const [newLang, setNewLang] = useState('th');

  if (!isOpen) return null;

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
      <div className="bg-[#0e0e0e] border border-white/20 rounded-2xl p-5 max-w-xl w-full space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-lg bg-white text-black font-black">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">Stream Slang Dictionary</h3>
              <p className="text-xs text-[#8e8e93]">
                กำหนดคำศัพท์เฉพาะ สแลง แฟนด้อม หรือชื่อเล่นเพื่อแปลให้ตรงเป๊ะ
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#8e8e93] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Form */}
        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-[#000000] p-3 rounded-xl border border-white/10">
          <input
            type="text"
            placeholder="คำค้นหา (เช่น 草, てぇてぇ, GG)"
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            className="sm:col-span-4 bg-[#141414] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white font-medium"
          />
          <select
            value={newLang}
            onChange={(e) => setNewLang(e.target.value)}
            className="sm:col-span-3 bg-[#141414] border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white font-bold"
          >
            <option value="th">ไทย (TH)</option>
            <option value="en">English (EN)</option>
            <option value="ja">日本語 (JP)</option>
          </select>
          <input
            type="text"
            placeholder="คำแปลแทนที่ (เช่น 55555+)"
            value={newReplacement}
            onChange={(e) => setNewReplacement(e.target.value)}
            className="sm:col-span-3 bg-[#141414] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white font-medium"
          />
          <button
            type="submit"
            className="sm:col-span-2 btn-white py-1.5 text-xs flex items-center justify-center gap-1 font-black"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Item List */}
        <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-2 rounded-lg bg-[#000000] border border-white/5 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-white px-2 py-0.5 rounded bg-[#181818]">
                  {item.sourcePattern}
                </span>
                <span className="text-[#8e8e93]">➔</span>
                <span className="font-bold text-white uppercase text-[10px] px-1.5 py-0.5 rounded bg-white/10">
                  {item.targetLang}
                </span>
                <span className="text-white font-medium">{item.replacement}</span>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-1 text-[#8e8e93] hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="btn-white px-6 py-2 text-xs font-black">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
