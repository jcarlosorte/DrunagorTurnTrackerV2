import { useEffect, useState } from 'react';
import { readGameLog } from '@/utils/gameLog';

const KIND_STYLES = {
  turn: 'bg-sky-900/60 text-sky-100 border-sky-700',
  event: 'bg-slate-800 text-slate-200 border-slate-700',
  damage: 'bg-red-950/60 text-red-100 border-red-800',
  rune: 'bg-emerald-950/60 text-emerald-100 border-emerald-800',
  summon: 'bg-purple-950/60 text-purple-100 border-purple-800',
};

export default function HistoryPanel({ limit = 10, labels = {}, refreshKey = 0 }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(readGameLog().slice(-limit).reverse());
  }, [limit, refreshKey]);

  return (
    <section className="track-surface p-2 shadow-md" aria-label={labels.title || 'Historial'}>
      <h2 className="mb-2 truncate text-xs font-bold uppercase tracking-wide text-slate-200">
        {labels.title || 'Historial'}
      </h2>

      {entries.length === 0 ? (
        <p className="px-1 py-2 text-[0.7rem] text-slate-400">{labels.empty || 'Sin eventos todavía.'}</p>
      ) : (
        <ol className="space-y-1">
          {entries.map((entry) => (
            <li
              key={`${entry.at}-${entry.message}`}
              className={`rounded-md border px-1.5 py-1 text-[0.65rem] leading-snug ${KIND_STYLES[entry.kind] || KIND_STYLES.event}`}
            >
              <span className="mr-1 font-mono text-[0.6rem] opacity-70">
                {String(entry.at).slice(11, 16)}
              </span>
              <span className="break-words">{entry.message}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
