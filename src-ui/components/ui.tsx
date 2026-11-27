import React from 'react';
import { Crown } from 'lucide-react';

type Tone = 'blue' | 'pink' | 'sand' | 'mint';

// Literal class names so Tailwind keeps them.
const TONE_CLASS: Record<Tone, string> = {
  blue: 'step-blue',
  pink: 'step-pink',
  sand: 'step-sand',
  mint: 'step-mint',
};

interface PanelHeaderProps {
  id: string;
  step: React.ReactNode;
  tone: Tone;
  title: React.ReactNode;
  desc?: React.ReactNode;
  children?: React.ReactNode;
}

/** Panel heading: coloured step badge, title, one-line description and an optional action slot on the right. */
export const PanelHeader: React.FC<PanelHeaderProps> = ({ id, step, tone, title, desc, children }) => (
  <div className="panel-head">
    <div className="flex items-start gap-3 min-w-0">
      <span className={`step-badge ${TONE_CLASS[tone]}`} aria-hidden="true">{step}</span>
      <div className="min-w-0">
        <h2 id={id} className="panel-title">{title}</h2>
        {desc && <p className="panel-desc">{desc}</p>}
      </div>
    </div>
    {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
  </div>
);

export const ProChip: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`chip chip-pro !px-1.5 !py-0 text-[0.625rem] ${className}`}>
    <Crown className="w-2.5 h-2.5" aria-hidden="true" />
    PRO
  </span>
);
