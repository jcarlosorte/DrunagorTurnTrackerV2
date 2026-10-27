const TIPO_META = {
  hero: { icon: '🛡', label: 'Héroe', tone: 'border-sky-500/60 bg-sky-950/50' },
  enemy: { icon: '👹', label: 'Enemigo', tone: 'border-red-500/60 bg-red-950/50' },
  rune: { icon: '🔮', label: 'Runa', tone: 'border-indigo-500/60 bg-indigo-950/50' },
};

function EntityCard({ entity, role, labels }) {
  if (!entity) {
    return (
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700/70 px-2 py-2 text-center">
        <span className="text-[0.6rem] uppercase tracking-wide text-slate-500">{labels?.none || '—'}</span>
      </div>
    );
  }

  const meta = TIPO_META[entity.type] || TIPO_META.hero;
  const isCurrent = role === 'current';

  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl border px-2 py-1.5 ${meta.tone} ${
        isCurrent ? 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-950/30' : 'opacity-80'
      }`}
      data-role={role}
    >
      <span aria-hidden="true" className="text-base leading-none">{meta.icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.55rem] uppercase tracking-wide text-slate-400">
          {role === 'prev' ? (labels?.prev || 'Anterior') : role === 'next' ? (labels?.next || 'Siguiente') : (labels?.current || 'Turno actual')}
        </span>
        <span className="block truncate text-xs font-bold text-slate-100">{entity.name || '—'}</span>
      </span>
      {isCurrent && (
        <span className="shrink-0 rounded-full bg-emerald-500 px-1.5 text-[0.55rem] font-black text-slate-950">
          {entity.turnNumber ?? ''}
        </span>
      )}
    </div>
  );
}

/**
 * Carrusel de turnos: anterior, actual y siguiente.
 * Solo informativo; no cambia el turno.
 */
export default function TurnCarousel({ prev, current, next, labels = {} }) {
  return (
    <section
      className="mb-2 grid shrink-0 grid-cols-3 gap-1.5 rounded-2xl border border-slate-700 bg-slate-900/70 p-1.5"
      aria-label={labels.title || 'Turnos'}
    >
      <EntityCard entity={prev} role="prev" labels={labels} />
      <EntityCard entity={current} role="current" labels={labels} />
      <EntityCard entity={next} role="next" labels={labels} />
    </section>
  );
}

