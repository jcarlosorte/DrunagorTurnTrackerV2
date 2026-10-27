import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { HEROES } from '@/data/heroes';
import {
  AURAS,
  CONSECUENCIAS,
  ESTADOS_HEROE,
  getHeroEffectName,
  getHeroEffectDescription,
} from '@/data/heroes/index';
import { getHeroExtras, stepHeroEstado, toggleHeroExtra } from '@/utils/heroExtras';

const GROUPS = [
  { key: 'auras', label: { es: 'Auras', en: 'Auras' }, catalogue: AURAS },
  { key: 'consecuencias', label: { es: 'Consecuencias', en: 'Consequences' }, catalogue: CONSECUENCIAS },
  { key: 'estados', label: { es: 'Estados', en: 'Conditions' }, catalogue: ESTADOS_HEROE },
];

const SOURCE_LABELS = {
  core: 'Adv.',
  desert: 'DH',
  undead_dragon: 'UD',
  shadow_world: 'SW',
  luccanor: 'LU',
};

export default function ModalHeroCard({ heroId, role, onClose }) {
  const { language, translations } = useLanguage();
  const closeRef = useRef(null);
  const titleId = useId();
  const [tab, setTab] = useState('auras');
  const [extras, setExtras] = useState(() => getHeroExtras(heroId));

  const hero = useMemo(() => HEROES.find((item) => item.id === heroId), [heroId]);
  const heroName = translations.heroes?.[heroId] || heroId;
  const roleName = translations.roles?.[role] || role || '';
  const profession = hero?.profession
    ? (translations.heroes?.profession?.[hero.profession] || hero.profession)
    : '';

  useEffect(() => {
    closeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const group = GROUPS.find((item) => item.key === tab) || GROUPS[0];
  const selected = extras[tab] || [];
  const selectedIds = new Set(selected.map((item) => (typeof item === 'string' ? item : item.id)));

  const toggle = (id) => {
    const next = toggleHeroExtra(heroId, tab, id);
    setExtras({ ...next, estados: next.estados || [] });
  };

  const stepEstado = (id, delta) => {
    const next = stepHeroEstado(heroId, id, delta);
    setExtras({ ...next, estados: next.estados || [] });
  };

  const estadoCount = (id) => (
    (extras.estados || []).find((item) => item.id === id)?.count || 0
  );

  return (
    <div className="layer-modal fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border-2 border-rose-900/70 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-rose-700 via-rose-500 to-rose-800" aria-hidden="true" />

        <header className="flex shrink-0 items-center gap-3 border-b border-slate-700 px-3 py-2.5">
          {hero?.image && (
            <img src={hero.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover ring-2 ring-rose-900" />
          )}
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="truncate text-lg font-bold text-white">{heroName}</h2>
            <div className="mt-1 flex flex-wrap gap-1 text-[0.65rem]">
              {profession && (
                <span className="rounded-full bg-rose-800 px-2 py-0.5 font-semibold uppercase tracking-wide text-white">
                  {profession}
                </span>
              )}
              {roleName && (
                <span className="rounded-full border border-slate-600 px-2 py-0.5 text-slate-300">{roleName}</span>
              )}
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {/* Estadísticas base del héroe */}
          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2" aria-label={translations.heroes?.stats || 'Estadísticas'}>
            <dl className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <dt className="text-slate-400">{translations.heroes?.baseLife || 'Vida base'}</dt>
                <dd className="text-lg font-bold text-white">{hero?.baseLife ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">{translations.heroes?.baseMove || 'Movimiento'}</dt>
                <dd className="text-lg font-bold text-white">{hero?.baseMove ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">{translations.heroes?.roleLabel || 'Rol'}</dt>
                <dd className="truncate text-sm font-bold text-white">{roleName || '—'}</dd>
              </div>
            </dl>
          </section>

          {/* Auras / Consecuencias / Estados */}
          <div className="mt-3 flex gap-1 rounded-xl border border-slate-700 bg-slate-950/60 p-1" role="tablist">
            {GROUPS.map((item) => {
              const count = (extras[item.key] || []).length;
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.key)}
                  className={`flex min-h-9 flex-1 items-center justify-center gap-1 rounded-lg px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
                    active ? 'bg-rose-800 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="truncate">{item.label[language] || item.label.es}</span>
                  {count > 0 && (
                    <span className="rounded-full bg-black/30 px-1.5 text-[0.6rem] tabular-nums">{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 space-y-1">
            {group.catalogue.map((item) => {
              const isSelected = selectedIds.has(item.id);
              const count = group.key === 'estados' ? estadoCount(item.id) : 0;
              return (
                <div
                  key={item.id}
                  className={`rounded-lg border px-2 py-1.5 text-xs transition ${
                    isSelected ? 'border-rose-700 bg-rose-950/40' : 'border-slate-700 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggle(item.id)}
                      className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                    >
                      <span className="flex items-center gap-1">
                        <span
                          aria-hidden="true"
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[0.6rem] ${
                            isSelected ? 'border-rose-400 bg-rose-600 text-white' : 'border-slate-500 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <span className="truncate font-semibold text-slate-100">
                          {getHeroEffectName(item.id, language) || item.name?.es}
                        </span>
                        <span className="shrink-0 rounded bg-slate-800 px-1 text-[0.55rem] text-slate-400">
                          {SOURCE_LABELS[item.source?.book] || item.source?.book} {item.source?.page}
                        </span>
                      </span>
                      <span className="mt-0.5 block leading-snug text-slate-400">
                        {getHeroEffectDescription(item.id, language) || item.effect?.es}
                      </span>
                    </button>

                    {group.key === 'estados' && (
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => stepEstado(item.id, -1)}
                          disabled={count <= 0}
                          aria-label={`${item.name?.es}: −1`}
                          className="flex h-7 w-7 items-center justify-center rounded bg-red-800 text-sm text-white hover:bg-red-700 disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-xs font-bold tabular-nums text-white">{count}</span>
                        <button
                          type="button"
                          onClick={() => stepEstado(item.id, 1)}
                          aria-label={`${item.name?.es}: +1`}
                          className="flex h-7 w-7 items-center justify-center rounded bg-emerald-800 text-sm text-white hover:bg-emerald-700"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-700 bg-slate-950/70 px-3 py-2">
          <span className="text-[0.7rem] text-slate-400">
            {translations.heroes?.managementHint || 'Gestión de héroe activada'}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl bg-slate-700 px-5 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          >
            {translations.trackerInit?.close || 'Cerrar'}
          </button>
        </footer>
      </div>
    </div>
  );
}
