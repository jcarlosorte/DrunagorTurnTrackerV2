import { useEffect, useRef } from 'react';
import { GiNightSleep, GiRun, GiSwordWound, GiHearts } from 'react-icons/gi';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import { getEnemyStatusCatalog } from '@/data/estadosAlterados';
import { getCompanion, getCompanionImage } from '@/data/companions';
import { parseCompanionAbilities } from '@/utils/companionAbilities';
import { FiInfo } from 'react-icons/fi';
import useFocusTrap from '@/hooks/useFocusTrap';

/**
 * Ficha de un compañero o mascota: datos de la criatura, vida y estados
 * alterados. El estado se guarda en `trackerData.companions`.
 */
export default function ModalCompanionCard({ uid, onClose }) {
  const { trackerData, setTrackerData } = useTracker();
  const { translations } = useLanguage();
  const t = translations.heroes || {};
  const dialogRef = useRef(null);

  useFocusTrap(dialogRef, true);

  const entry = (trackerData.companions || []).find((item) => item.uid === uid);
  const companion = entry ? getCompanion(entry.id) : null;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!entry || !companion) return null;

  const image = getCompanionImage(companion.id);
  const abilities = parseCompanionAbilities(companion.abilities, {
    labels: translations.condiciones_t || {},
    descriptions: translations.condiciones_d || {},
  });
  const catalogue = getEnemyStatusCatalog();
  const estados = entry.estadosAlterados || [];
  const countOf = (id) => estados.find((estado) => estado.id === id)?.count || 0;

  const update = (changes) => {
    setTrackerData((prev) => ({
      ...prev,
      companions: (prev.companions || []).map((item) => (
        item.uid === uid ? { ...item, ...changes } : item
      )),
    }));
  };

  const changeVida = (delta) => {
    const next = Math.max(0, Math.min(entry.vidaMax ?? companion.life, entry.vida + delta));
    update({ vida: next });
  };

  const changeEstado = (estado, delta) => {
    const current = countOf(estado.id);
    const next = Math.max(0, Math.min(estado.max || 1, current + delta));
    const rest = estados.filter((item) => item.id !== estado.id);
    update({ estadosAlterados: next > 0 ? [...rest, { id: estado.id, count: next }] : rest });
  };

  return (
    <div className="layer-dialog fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="companion-title"
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border-2 border-amber-900/60 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <header className="flex items-start gap-3 border-b border-slate-700 px-4 py-3">
          {image && (
            <img
              src={image}
              alt={companion.name}
              className="h-40 w-auto shrink-0 rounded-lg border border-slate-700 bg-slate-950/60 object-contain p-1"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="min-w-0 flex-1">
            <h2 id="companion-title" className="truncate text-lg font-black">{companion.name}</h2>
            <p className="truncate text-xs text-slate-400">
              {companion.alias} · {companion.type === 'mascota' ? (t.pet || 'Mascota') : (t.companion || 'Compañero')}
              {companion.subtype && companion.subtype !== '-' ? ` · ${companion.subtype}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close || 'Cerrar'}
            className="min-h-9 shrink-0 rounded-lg bg-slate-700 px-3 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="rounded-lg border border-slate-700 bg-slate-800/70 px-1 py-1.5">
              <GiSwordWound className="mx-auto text-rose-300" aria-hidden="true" />
              <p className="text-[0.6rem] uppercase tracking-wide text-slate-400">{t.attack || 'Ataque'}</p>
              <p className="text-sm font-bold">{companion.attack ?? '—'}</p>
              <p className="text-[0.55rem] text-slate-500">{companion.attackType}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800/70 px-1 py-1.5">
              <GiRun className="mx-auto text-emerald-300" aria-hidden="true" />
              <p className="text-[0.6rem] uppercase tracking-wide text-slate-400">{t.movement || 'Movimiento'}</p>
              <p className="text-sm font-bold">{companion.movement ?? '—'}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800/70 px-1 py-1.5">
              <GiHearts className="mx-auto text-red-300" aria-hidden="true" />
              <p className="text-[0.6rem] uppercase tracking-wide text-slate-400">{t.life || 'Vida'}</p>
              <p className="text-sm font-bold tabular-nums" data-testid="companion-life">{entry.vida} / {entry.vidaMax ?? companion.life}</p>
            </div>
          </div>

          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
              {t.life || 'Vida'}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {[-5, -1, 1, 5].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => changeVida(delta)}
                  className={`min-h-9 flex-1 rounded-lg border text-sm font-bold ${
                    delta < 0
                      ? 'border-red-800 bg-red-900/70 text-red-100 hover:bg-red-800'
                      : 'border-emerald-800 bg-emerald-900/70 text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <p className="mb-1.5 flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
              <GiNightSleep size={13} aria-hidden="true" /> {t.alteredStates || 'Estados alterados'}
            </p>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {catalogue.map((estado) => {
                const count = countOf(estado.id);
                return (
                  <div
                    key={estado.id}
                    className={`flex items-center gap-1 rounded-lg border px-1 py-0.5 ${
                      count > 0 ? 'border-amber-700/70 bg-amber-950/40' : 'border-slate-700 bg-slate-800/60'
                    }`}
                  >
                    {estado.imagen && (
                      <img src={estado.imagen} alt="" className="h-5 w-5 shrink-0 object-contain" loading="lazy" />
                    )}
                    <span className="min-w-0 flex-1 truncate text-[0.6rem] capitalize text-slate-200">{estado.texto}</span>
                    <button
                      type="button"
                      onClick={() => changeEstado(estado, -1)}
                      disabled={count <= 0}
                      aria-label={`${estado.texto}: −1`}
                      className="flex h-6 w-5 items-center justify-center rounded bg-slate-700 text-xs text-white hover:bg-slate-600 disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-[0.65rem] font-bold tabular-nums">{count}</span>
                    <button
                      type="button"
                      onClick={() => changeEstado(estado, 1)}
                      disabled={count >= (estado.max || 1)}
                      aria-label={`${estado.texto}: +1`}
                      className="flex h-6 w-5 items-center justify-center rounded bg-slate-700 text-xs text-white hover:bg-slate-600 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <p className="mb-1 flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
              <GiSwordWound size={13} aria-hidden="true" /> {t.abilities || 'Capacidades'}
            </p>
            {abilities.length === 0 ? (
              <p className="text-xs text-slate-400">—</p>
            ) : (
              <ul className="space-y-1">
                {abilities.map((ability, index) => (
                  <li key={`${ability.token}-${index}`} className="flex items-start gap-1.5 text-xs leading-snug text-slate-300">
                    <span className="mt-0.5 w-3 shrink-0 text-right text-[0.65rem] text-slate-500">{index + 1}.</span>
                    <span className="min-w-0 flex-1">{ability.label}</span>
                    {ability.description && (
                      <FiInfo
                        title={ability.description}
                        aria-label={ability.description}
                        className="mt-0.5 shrink-0 cursor-help text-slate-500 hover:text-amber-300"
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-slate-700 px-4 py-2.5">
          <span className="text-[0.7rem] text-slate-400">{t.savedWithGame || 'Se guarda con la partida'}</span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-lg bg-slate-700 px-4 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            {t.close || 'Cerrar'}
          </button>
        </footer>
      </div>
    </div>
  );
}
