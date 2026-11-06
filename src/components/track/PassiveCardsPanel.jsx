import { useState } from 'react';

export default function PassiveCardsPanel({
  cards = [],
  labels = {},
  getCardName,
  getCardDescription,
}) {
  const [open, setOpen] = useState(false);
  if (!cards.length) return null;

  return (
    <div className="mb-2 rounded-xl border border-violet-700/60 bg-violet-950/40 p-2 text-violet-100">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="text-xs font-black uppercase tracking-wide">
          {labels.title || 'Pasivas activas'} ({cards.length})
        </span>
        <span aria-hidden="true">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <ul className="mt-2 space-y-2">
          {cards.map((card) => (
            <li key={card.uuid} className="rounded-lg border border-violet-800/60 bg-slate-950/40 p-2">
              <p className="text-xs font-bold">{getCardName(card)}</p>
              <p className="mt-1 text-[0.7rem] leading-relaxed text-violet-100/90">
                {getCardDescription(card)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
