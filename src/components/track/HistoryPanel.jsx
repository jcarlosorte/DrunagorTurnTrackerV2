import { useCallback, useEffect, useMemo, useState } from 'react';
import { GAME_LOG_EVENT, readGameLog } from '@/utils/gameLog';

const KIND_STYLES = {
  turn: 'bg-sky-900/60 text-sky-100 border-sky-700',
  event: 'bg-slate-800 text-slate-200 border-slate-700',
  damage: 'bg-red-950/60 text-red-100 border-red-800',
  rune: 'bg-emerald-950/60 text-emerald-100 border-emerald-800',
  summon: 'bg-purple-950/60 text-purple-100 border-purple-800',
};

const KIND_ICONS = {
  turn: '🎯',
  event: '✦',
  damage: '🗡',
  rune: '🔮',
  summon: '👹',
};

const FILTERS = [
  { id: 'all', label: 'Todo', icon: '≡' },
  { id: 'turn', label: 'Turnos', icon: '🎯' },
  { id: 'event', label: 'Eventos', icon: '✦' },
  { id: 'rune', label: 'Runas', icon: '🔮' },
  { id: 'summon', label: 'Invoc.', icon: '👹' },
];

/** Agrupa el historial bajo el turno al que pertenece cada entrada. */
function groupByTurn(entries) {
  const groups = [];
  let current = { key: 'start', title: 'Inicio de la partida', round: null, items: [] };

  entries.forEach((entry) => {
    if (entry.kind === 'turn') {
      if (current.items.length > 0) groups.push(current);
      current = {
        key: `${entry.at}-${entry.message}-${groups.length}`,
        title: String(entry.message || '').replace(/^Turno de\s*/i, ''),
        round: entry.round ?? null,
        items: [entry],
      };
      return;
    }
    current.items.push(entry);
  });

  if (current.items.length > 0) groups.push(current);
  return groups;
}

export default function HistoryPanel({ limit = 60, labels = {}, refreshKey = 0 }) {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState([]);

  const reload = useCallback(() => {
    setEntries(readGameLog().slice(-limit));
  }, [limit]);

  useEffect(() => {
    reload();
  }, [reload, refreshKey]);

  useEffect(() => {
    const handleChange = () => reload();
    window.addEventListener(GAME_LOG_EVENT, handleChange);
    window.addEventListener('storage', handleChange);
    const interval = window.setInterval(handleChange, 2000);
    return () => {
      window.removeEventListener(GAME_LOG_EVENT, handleChange);
      window.removeEventListener('storage', handleChange);
      window.clearInterval(interval);
    };
  }, [reload]);

  const counters = useMemo(() => {
    const base = { all: entries.length };
    entries.forEach((entry) => {
      base[entry.kind] = (base[entry.kind] || 0) + 1;
    });
    return base;
  }, [entries]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (filter !== 'all' && entry.kind !== filter) return false;
      if (!text) return true;
      return String(entry.message || '').toLowerCase().includes(text);
    });
  }, [entries, filter, query]);

  const groups = useMemo(() => groupByTurn(filtered).reverse(), [filtered]);

  const toggleGroup = (key) => {
    setCollapsed((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  };

  return (
    <section className="track-surface flex min-h-0 flex-col p-2 shadow-md" aria-label={labels.title || 'Historial'}>
      <h2 className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-200">
        <span>{labels.title || 'Historial'}</span>
        <span className="rounded-full bg-slate-800 px-1.5 text-[0.6rem] font-semibold tabular-nums text-slate-300">
          {filtered.length}
        </span>
      </h2>

      {/* Filtros por tipo */}
      <div className="mb-1.5 flex flex-wrap gap-1" role="group" aria-label={labels.filters || 'Filtrar historial'}>
        {FILTERS.map((item) => {
          const active = filter === item.id;
          const count = counters[item.id] || 0;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(item.id)}
              className={`flex min-h-6 items-center gap-1 rounded-full border px-1.5 text-[0.6rem] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                active
                  ? 'border-emerald-400/80 bg-emerald-700 text-white'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
              {count > 0 && <span className="tabular-nums opacity-70">{count}</span>}
            </button>
          );
        })}
      </div>

      <label className="sr-only" htmlFor="history-search">{labels.search || 'Buscar en el historial'}</label>
      <input
        id="history-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={labels.search || 'Buscar…'}
        className="mb-2 h-8 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 text-[0.7rem] text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
      />

      {groups.length === 0 ? (
        <p className="px-1 py-2 text-[0.7rem] text-slate-400">
          {entries.length === 0 ? (labels.empty || 'Sin eventos todavía.') : (labels.noMatches || 'Sin resultados.')}
        </p>
      ) : (
        <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
          {groups.map((group) => {
            const isCollapsed = collapsed.includes(group.key);
            return (
              <div key={group.key} className="rounded-lg border border-slate-700/70 bg-slate-950/40">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.key)}
                  aria-expanded={!isCollapsed}
                  className="flex w-full items-center gap-1.5 rounded-lg px-1.5 py-1 text-left hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <span aria-hidden="true" className="text-[0.6rem] text-slate-400">{isCollapsed ? '▸' : '▾'}</span>
                  <span className="min-w-0 flex-1 truncate text-[0.7rem] font-bold text-sky-200">
                    {group.title}
                  </span>
                  {group.round !== null && (
                    <span className="rounded bg-slate-800 px-1 text-[0.55rem] font-semibold text-slate-300">
                      R{group.round}
                    </span>
                  )}
                  <span className="rounded-full bg-slate-800 px-1.5 text-[0.55rem] tabular-nums text-slate-400">
                    {group.items.length}
                  </span>
                </button>

                {!isCollapsed && (
                  <ol className="space-y-1 px-1 pb-1">
                    {group.items.map((entry) => (
                      <li
                        key={`${entry.at}-${entry.message}`}
                        className={`flex items-start gap-1 rounded-md border px-1.5 py-1 text-[0.65rem] leading-snug ${KIND_STYLES[entry.kind] || KIND_STYLES.event}`}
                      >
                        <span aria-hidden="true" className="mt-px shrink-0">{KIND_ICONS[entry.kind] || '✦'}</span>
                        <span className="min-w-0 flex-1 break-words">{entry.message}</span>
                        <span className="shrink-0 font-mono text-[0.55rem] opacity-60">
                          {String(entry.at).slice(11, 16)}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
