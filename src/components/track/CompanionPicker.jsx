import { useEffect, useRef, useState } from 'react';
import { GiPawPrint, GiHearts, GiSwordWound } from 'react-icons/gi';
import { useTracker } from '@/context/TrackerContext';
import { useExpansions } from '@/context/ExpansionContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  createCompanionEntry,
  getCompanion,
  getCompanionBackground,
  getCompanionGroup,
  getCompanionImage,
  getCompanionsForExpansions,
} from '@/data/companions';
import ConfirmDialog from '@/components/ConfirmDialog';
import { getHeroClassId } from '@/data/heroClasses';
import { FOLLOWERS, getFollower } from '@/data/followers';
import { ROLE_POSITIONS } from '@/data/roles';
import useFocusTrap from '@/hooks/useFocusTrap';

/**
 * Menú de compañeros y mascotas.
 *
 * Muestra las criaturas de las expansiones activas separadas por tipo, las
 * asigna a un héroe en juego y lista las ya asignadas. Una criatura asignada
 * deja de ofrecerse hasta que se quita.
 */
export default function CompanionPicker({ open, onClose, onOpenCompanion }) {
  const { trackerData, setTrackerData } = useTracker();
  const { selectedExpansions, mainBox, previewOtherBoxes } = useExpansions();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  const heroesT = translations.heroes || {};
  const rolesT = translations.roles || {};
  const dialogRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedHeroId, setSelectedHeroId] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [selectedFollowerId, setSelectedFollowerId] = useState(null);
  const [selectedFollowerState, setSelectedFollowerState] = useState('');

  const showCoreContent = mainBox === 'core' || previewOtherBoxes;
  const showAwakeningsContent = mainBox === 'awakenings' || previewOtherBoxes;

  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    setSelectedId(null);
    setSelectedHeroId('');
    setSelectedFollowerId(null);
    setSelectedFollowerState('');
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
  // Los Draugr pueden tener varias copias: no se retiran de Disponibles.
  const assignedIds = new Set(
    companions
      .filter((entry) => getCompanion(entry.id)?.subtype !== 'Draugr')
      .map((entry) => entry.id)
  );
  const allCompanions = getCompanionsForExpansions(selectedExpansions);
  const available = allCompanions.filter(
    (companion) => companion.subtype === 'Draugr' || !assignedIds.has(companion.id)
  );
  const groups = [
    { id: 'mascota', label: t.pets || 'Mascotas' },
    ...(showCoreContent ? [
      { id: 'companero', label: t.companions || 'Compañeros' },
      { id: 'daren_hero', label: t.darenHeroes || 'Héroes de Daren' },
    ] : []),
  ];
  const availableGroups = groups.map((group) => ({
    ...group,
    list: available.filter((companion) => getCompanionGroup(companion) === group.id),
  }));
  const visibleAvailable = availableGroups.flatMap((group) => group.list);
  const placedFollowers = trackerData.followers || [];
  const availableFollowers = FOLLOWERS.filter(
    (follower) => !placedFollowers.some((entry) => entry.id === follower.id)
  );
  const selectedFollower = selectedFollowerId ? getFollower(selectedFollowerId) : null;
  const heroes = trackerData.placedHeroes?.length
    ? trackerData.placedHeroes
    : (trackerData.heroes || []).map((id) => ({ id }));
  const placedHeroes = trackerData.placedHeroes || [];
  const draugrHeroes = placedHeroes.filter((hero) => getHeroClassId(hero.id) === 'necromante');
  const heroName = (id) => heroesT[id] || id;
  const heroRole = (id) => {
    const role = trackerData.roles?.[id];
    return role ? (rolesT[role] || role) : '';
  };
  const selected = selectedId ? getCompanion(selectedId) : null;
  const isDraugr = selected?.subtype === 'Draugr';
  const selectableHeroes = isDraugr ? draugrHeroes : heroes;

  const add = () => {
    if (!selected || !selectedHeroId) return;
    if (selected.subtype === 'Draugr' && !draugrHeroes.some((hero) => hero.id === selectedHeroId)) return;
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

  const addFollower = () => {
    if (!selectedFollower) return;
    const state = selectedFollower.states.find((item) => item.id === selectedFollowerState)
      || selectedFollower.states[0];
    const entry = {
      uid: crypto.randomUUID(),
      id: selectedFollower.id,
      name: selectedFollower.name,
      epithet: selectedFollower.epithet,
      role: selectedFollower.role,
      position: ROLE_POSITIONS[selectedFollower.role] ?? 0,
      stateId: state.id,
      image: null,
    };
    setTrackerData((prev) => ({ ...prev, followers: [...(prev.followers || []), entry] }));
    setSelectedFollowerId(null);
    setSelectedFollowerState('');
  };

  const removeFollower = (uid) => {
    setTrackerData((prev) => ({
      ...prev,
      followers: (prev.followers || []).filter((entry) => entry.uid !== uid),
    }));
  };

  const resetAll = () => {
    setTrackerData((prev) => ({
      ...prev,
      companions: (prev.companions || []).map((entry) => ({
        ...entry,
        vida: entry.vidaMax ?? entry.vida,
        estadosAlterados: [],
      })),
    }));
    setConfirmReset(false);
  };

  const renderAvailableCard = (companion) => {
    const image = getCompanionImage(companion.id);
    const background = getCompanionBackground(companion.id);
    const isSelected = selectedId === companion.id;
    return (
      <div
        key={companion.id}
        className={`rounded-lg border transition ${
          isSelected
            ? 'border-amber-400 bg-amber-950/50'
            : 'border-slate-700 bg-slate-800/60'
        }`}
      >
        <button
          type="button"
          aria-pressed={isSelected}
          onClick={() => {
            if (isSelected) {
              setSelectedId(null);
              return;
            }
            setSelectedId(companion.id);
            if (companion.subtype === 'Draugr') setSelectedHeroId('');
          }}
          className="flex w-full items-center gap-2 p-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <span
            className="relative flex h-14 w-11 shrink-0 items-center justify-center overflow-hidden rounded bg-slate-950/60"
            style={background ? {
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : undefined}
          >
            <span className="absolute inset-0 bg-slate-950/35" aria-hidden="true" />
            {image && (
              <img src={image} alt="" className="relative h-full w-full object-contain" loading="lazy" decoding="async" />
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold text-slate-100">{companion.name}</span>
            <span className="block truncate text-[0.6rem] text-slate-400">
              {companion.type === 'mascota' ? (t.pet || 'Mascota') : (t.companion || 'Compañero')} · {companion.alias}
            </span>
          </span>
        </button>

        {isSelected && (
          <div className="border-t border-amber-700/60 p-1.5">
            <p className="mb-1 text-[0.6rem] font-semibold text-amber-100">
              {t.companionsAddTo || 'Añadir'} {companion.name} {t.companionsToHero || 'a'}:
            </p>
            <div className="flex gap-1">
              <select
                value={selectedHeroId}
                onChange={(event) => setSelectedHeroId(event.target.value)}
                aria-label={t.companionsHero || 'Héroe'}
                className="min-h-8 min-w-0 flex-1 rounded border border-slate-600 bg-slate-900 px-1 text-[0.65rem] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <option value="">{t.companionsChooseHero || 'Elegir héroe'}…</option>
                {selectableHeroes.map((hero) => (
                  <option key={hero.id} value={hero.id}>
                    {heroName(hero.id)}{heroRole(hero.id) ? ` · ${heroRole(hero.id)}` : ''}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={add}
                disabled={!selectedHeroId}
                className="min-h-8 shrink-0 whitespace-nowrap rounded bg-amber-700 px-2 text-[0.65rem] font-semibold text-white hover:bg-amber-600 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                + {t.companionsAdd || 'Añadir'}
              </button>
            </div>
            {isDraugr && selectableHeroes.length === 0 && (
              <p className="mt-1 text-[0.6rem] text-amber-200">
                {t.draugrNeedsNecromancer || 'Solo un Nigromante activo en el track puede invocar Draugr.'}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderAssignedRow = (entry) => {
    const companion = getCompanion(entry.id);
    const image = getCompanionImage(entry.id);
    const background = getCompanionBackground(entry.id);
    const stateCount = (entry.estadosAlterados || []).reduce((sum, item) => sum + item.count, 0);
    return (
      <li
        key={entry.uid}
        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1"
      >
        {image && (
          <img
            src={image}
            alt=""
            className="h-10 w-8 shrink-0 rounded object-contain"
            style={background ? {
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : undefined}
            loading="lazy"
          />
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
  };

  const inPlayGroups = groups.map((group) => ({
    ...group,
    list: companions
      .filter((entry) => getCompanionGroup(getCompanion(entry.id)) === group.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
  }));

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
              {t.companionsAvailable || 'Disponibles'} ({visibleAvailable.length})
            </p>
            {visibleAvailable.length === 0 ? (
              <p className="rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-xs text-slate-400">
                {allCompanions.length === 0
                  ? (t.noCompanionsInExpansions || 'No hay compañeros ni mascotas en las expansiones activas.')
                  : showCoreContent
                    ? (t.companionsAllAssigned || 'Todas las criaturas están asignadas.')
                    : (t.companionsNotInBox || 'No hay criaturas de esta caja.')}
              </p>
            ) : (
              <div className="space-y-2.5">
                {availableGroups.map(({ id, label, list }) => (
                  <div key={id}>
                    <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400">
                      {label} ({list.length})
                    </p>
                    {list.length === 0 ? (
                      <p className="text-[0.65rem] text-slate-500">{t.companionsTypeEmpty || 'Ninguna disponible.'}</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
                        {list.map(renderAvailableCard)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {showAwakeningsContent && (
            <section>
              <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
                {t.followers || 'Seguidores'} ({availableFollowers.length})
              </p>
              {availableFollowers.length === 0 ? (
                <p className="rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-xs text-slate-400">
                  {t.followersAllPlaced || 'Todos los seguidores están colocados.'}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {availableFollowers.map((follower) => {
                    const isSelected = selectedFollowerId === follower.id;
                    return (
                      <div key={follower.id} className={`rounded-lg border transition ${isSelected ? 'border-emerald-400 bg-emerald-950/40' : 'border-slate-700 bg-slate-800/60'}`}>
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => {
                            setSelectedFollowerId(isSelected ? null : follower.id);
                            setSelectedFollowerState(isSelected ? '' : (follower.states[0]?.id || ''));
                          }}
                          className="flex w-full items-center gap-2 p-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                        >
                          <span className="flex h-14 w-11 shrink-0 items-center justify-center rounded bg-gradient-to-br from-emerald-700/60 to-slate-900 text-lg font-black text-emerald-100">
                            {follower.name.charAt(0)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-semibold text-slate-100">{follower.name}</span>
                            <span className="block truncate text-[0.6rem] text-slate-400">
                              {follower.epithet} · {rolesT[follower.role] || follower.role}
                            </span>
                          </span>
                        </button>
                        {isSelected && (
                          <div className="border-t border-emerald-700/60 p-1.5">
                            <label htmlFor={`follower-state-${follower.id}`} className="mb-1 block text-[0.6rem] font-semibold text-emerald-100">
                              {t.followersState || 'Estado'}
                            </label>
                            <div className="flex gap-1">
                              <select
                                id={`follower-state-${follower.id}`}
                                value={selectedFollowerState}
                                onChange={(event) => setSelectedFollowerState(event.target.value)}
                                className="min-h-8 min-w-0 flex-1 rounded border border-slate-600 bg-slate-900 px-1 text-[0.65rem] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                              >
                                {follower.states.map((state) => (
                                  <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={addFollower}
                                className="min-h-8 shrink-0 whitespace-nowrap rounded bg-emerald-700 px-2 text-[0.65rem] font-semibold text-white hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                              >
                                + {t.followersAdd || 'Añadir'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {placedFollowers.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {placedFollowers.map((entry) => {
                    const follower = getFollower(entry.id);
                    const state = follower?.states.find((item) => item.id === entry.stateId) || follower?.states[0];
                    return (
                      <li key={entry.uid} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1">
                        <span className="min-w-0 flex-1 truncate text-xs text-slate-200">
                          {follower?.name || entry.id} · {rolesT[entry.role] || entry.role} · {state?.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFollower(entry.uid)}
                          aria-label={`${follower?.name || entry.id}: ${t.remove || 'Quitar'}`}
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
          )}

          <section>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
                {t.companionsInPlay || 'En juego'} ({companions.length})
              </p>
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                disabled={companions.length === 0}
                className="min-h-7 shrink-0 rounded-lg border border-amber-800 bg-amber-950/50 px-2 text-[0.65rem] font-semibold text-amber-100 hover:bg-amber-900/60 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                ↺ {t.companionsReset || 'Resetear'}
              </button>
            </div>
            {companions.length === 0 ? (
              <p className="rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-xs text-slate-400">
                {t.companionsEmpty || 'Sin compañeros ni mascotas.'}
              </p>
            ) : (
              <div className="space-y-2.5">
                {inPlayGroups.map(({ id, label, list }) => (
                  list.length > 0 && (
                    <div key={id}>
                      <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400">
                        {label} ({list.length})
                      </p>
                      <ul className="space-y-1">
                        {list.map(renderAssignedRow)}
                      </ul>
                    </div>
                  )
                ))}
              </div>
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

        <ConfirmDialog
          open={confirmReset}
          title={t.companionsResetTitle || 'Resetear compañeros'}
          description={t.companionsResetConfirm || 'Se restaurará la vida y se quitarán los estados de todas las criaturas asignadas.'}
          confirmLabel={t.companionsResetAction || 'Resetear'}
          cancelLabel={translations.trackerSelect?.cancel || 'Cancelar'}
          onCancel={() => setConfirmReset(false)}
          onConfirm={resetAll}
        />
      </div>
    </div>
  );
}
