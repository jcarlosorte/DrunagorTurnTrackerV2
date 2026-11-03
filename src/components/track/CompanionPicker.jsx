import { useEffect, useRef, useState } from 'react';
import { GiPawPrint, GiHearts, GiSwordWound } from 'react-icons/gi';
import { useTracker } from '@/context/TrackerContext';
import { useExpansions } from '@/context/ExpansionContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  createCompanionEntry,
  getCompanion,
  getCompanionImage,
  getCompanionsForExpansions,
} from '@/data/companions';
import useFocusTrap from '@/hooks/useFocusTrap';

/**
 * Menú de compañeros y mascotas.
 *
 * Muestra las criaturas de las expansiones activas, las asigna a un héroe en
 * juego y lista las ya asignadas. Todo vive en `trackerData.companions`.
 */
export default function CompanionPicker({ open, onClose, onOpenCompanion }) {
  const { trackerData, setTrackerData } = useTracker();
  const { selectedExpansions } = useExpansions();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  const heroesT = translations.heroes || {};
  const rolesT = translations.roles || {};
  const dialogRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedHeroId, setSelectedHeroId] = useState('');

  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    setSelectedId(null);
    setSelectedHeroId('');
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const companions = trackerData.companions || [];
  const available = getCompanionsForExpansions(selectedExpansions);
  const heroes = trackerData.placedHeroes?.length
    ? trackerData.placedHeroes
    : (trackerData.heroes || []).map((id) => ({ id }));
  const heroName = (id) => heroesT[id] || id;
  const heroRole = (id) => {
    const role = trackerData.roles?.[id];
    return role ? (rolesT[role] || role) : '';
  };
  const selected = selectedId ? getCompanion(selectedId) : null;

  const add = () => {
    if (!selected || !selectedHeroId) return;
    const orderBase = companions.filter((entry) => entry.heroId === selectedHeroId);
    const order = orderBase.length ? Math.max(...orderBase.map((entry) => entry.order || 0)) + 1 : 0;
    const entry = createCompanionEntry(selected, selectedHeroId, order);
    setTrackerData((prev) => ({ ...prev, companions: [...(prev.companions || []), entry] }));
    setSelectedId(null);
  };

  const remove = (uid) => {
    setTrackerData((prev) => ({
      ...prev,
      companions: (prev.companions || []).filter((entry) => entry.uid !== uid),
    }));
  };

  return (
    <div className="layer-dialog fixed inset-0 flex items-center justify-center bg-black/70 p-3" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="companions-picker-title"
        className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-2 border-amber-900/60 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <header className="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
          <GiPawPrint className="text-xl text-amber-300" aria-hidden="true" />
          <h2 id="companions-picker-title" className="min-w-0 flex-1 truncate text-lg font-black">
            {t.companionsPickerTitle || 'Compañeros y mascotas'}
          </h2>
          <span className="shrink-0 rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums">
            {companions.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close || 'Cerrar'}
            className="min-h-9 shrink-0 rounded-lg bg-slate-700 px-3 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          <section>
            <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
              {t.companionsAvailable || 'Disponibles'} ({available.length})
            </p>
            {available.length === 0 ? (
              <p className="rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-xs text-slate-400">
                {t.noCompanionsInExpansions || 'No hay compañeros ni mascotas en las expansiones activas.'}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
                {available.map((companion) => {
                  const image = getCompanionImage(companion.id);
                  const isSelected = selectedId === companion.id;
                  return (
                    <button
                      key={companion.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedId(isSelected ? null : companion.id)}
                      className={`flex items-center gap-2 rounded-lg border p-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-950/50'
                          : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
                      }`}
                    >
                      <span className="flex h-14 w-11 shrink-0 items-center justify-center rounded bg-slate-950/60">
                        {image && (
                          <img src={image} alt="" className="h-full w-full object-contain" loading="lazy" decoding="async" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-slate-100">{companion.name}</span>
                        <span className="block truncate text-[0.6rem] text-slate-400">
                          {companion.type === 'mascota' ? (t.pet || 'Mascota') : (t.companion || 'Compañero')} · {companion.alias}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {selected && (
            <section className="rounded-xl border border-amber-700/70 bg-amber-950/30 p-2">
              <p className="mb-1.5 text-xs font-semibold text-amber-100">
                {t.companionsAddTo || 'Añadir'} {selected.name} {t.companionsToHero || 'a'}:
              </p>
              <div className="flex gap-1.5">
                <select
                  value={selectedHeroId}
                  onChange={(event) => setSelectedHeroId(event.target.value)}
                  aria-label={t.companionsHero || 'Héroe'}
                  className="min-h-9 min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-900 px-2 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <option value="">{t.companionsChooseHero || 'Elegir héroe'}…</option>
                  {heroes.map((hero) => (
                    <option key={hero.id} value={hero.id}>
                      {heroName(hero.id)}{heroRole(hero.id) ? ` · ${heroRole(hero.id)}` : ''}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={add}
                  disabled={!selectedHeroId}
                  className="min-h-9 shrink-0 rounded-lg bg-amber-700 px-3 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  + {t.companionsAdd || 'Añadir'}
                </button>
              </div>
            </section>
          )}

          <section>
            <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
              {t.companionsInPlay || 'En juego'} ({companions.length})
            </p>
            {companions.length === 0 ? (
              <p className="rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-xs text-slate-400">
                {t.companionsEmpty || 'Sin compañeros ni mascotas.'}
              </p>
            ) : (
              <ul className="space-y-1">
                {[...companions]
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((entry) => {
                    const companion = getCompanion(entry.id);
                    const image = getCompanionImage(entry.id);
                    const stateCount = (entry.estadosAlterados || []).reduce((sum, item) => sum + item.count, 0);
                    return (
                      <li
                        key={entry.uid}
                        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1"
                      >
                        {image && (
                          <img src={image} alt="" className="h-10 w-8 shrink-0 rounded object-contain" loading="lazy" />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-slate-100">
                            {companion?.name || entry.id}
                            <span className="ml-1 font-normal text-slate-400">→ {heroName(entry.heroId)}</span>
                          </span>
                          <span className="flex items-center gap-1 text-[0.6rem] text-slate-400">
                            <GiHearts size={10} aria-hidden="true" /> {entry.vida}/{entry.vidaMax}
                            <GiSwordWound size={10} aria-hidden="true" /> {stateCount} {t.alteredStatesShort || 'estados'}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenCompanion?.(entry.uid)}
                          className="min-h-7 shrink-0 rounded-lg bg-slate-700 px-2 text-[0.65rem] font-semibold text-white hover:bg-slate-600"
                        >
                          {t.open || 'Abrir'}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(entry.uid)}
                          aria-label={`${companion?.name || entry.id}: ${t.remove || 'Quitar'}`}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-xs text-white hover:bg-red-700"
                        >
                          ✕
                        </button>
                      </li>
                    );
                  })}
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
