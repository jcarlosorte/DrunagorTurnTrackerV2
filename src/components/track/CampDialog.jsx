import { useEffect, useRef, useState } from 'react';
import { GiSwapBag, GiWoodenCrate } from 'react-icons/gi';
import { useLanguage } from '@/context/LanguageContext';
import { useGame } from '@/context/GameContext';
import { useTracker } from '@/context/TrackerContext';
import { useExpansions } from '@/context/ExpansionContext';
import { useHeroExtras } from '@/context/HeroExtrasContext';
import { getFollower, getFollowerState } from '@/data/followers';
import { CONSECUENCIAS, ESTADOS_HEROE, getHeroEffectDescription, getHeroEffectName } from '@/data/heroes/index';
import { readCampFollowers, removeCampFollower } from '@/utils/campFollowers';
import { getHeroExtraId } from '@/utils/heroExtras';
import { createId } from '@/utils/id';
import useFocusTrap from '@/hooks/useFocusTrap';

const RUNE_COLORS = [
  { id: 'naranja', color: '#ff8c00' },
  { id: 'verde', color: '#00aa00' },
  { id: 'azul', color: '#0077cc' },
  { id: 'rojo', color: '#cc0000' },
  { id: 'gris', color: '#999999' },
];

const HERO_EFFECT_SECTIONS = [
  { key: 'consecuencias', label: { es: 'Consecuencias', en: 'Consequences' }, catalogue: CONSECUENCIAS },
  { key: 'estados', label: { es: 'Estados', en: 'Conditions' }, catalogue: ESTADOS_HEROE },
];

function heroEntryName(entry, language) {
  if (typeof entry === 'object' && entry) {
    return entry.name?.[language] || entry.name?.es || entry.nombre || entry.id;
  }
  return getHeroEffectName(entry, language);
}

function HeroEffectSection({
  heroId,
  groupKey,
  label,
  catalogue,
  extras,
  language,
  campaign,
  onUpdate,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [manualText, setManualText] = useState('');
  const added = extras[groupKey] || [];
  const addedIds = new Set(added.map((entry) => getHeroExtraId(entry)));
  const available = catalogue.filter((item) => (
    (item.campaign || 'core') === campaign && !addedIds.has(item.id)
  ));
  const labels = {
    add: language === 'en' ? 'Add' : 'Añadir',
    manual: language === 'en' ? 'Write manually…' : 'Escribir manualmente…',
    allAdded: language === 'en' ? 'All added' : 'Todas añadidas',
    none: language === 'en' ? 'None added.' : 'Ninguna añadida.',
    remove: language === 'en' ? 'Remove' : 'Quitar',
  };

  const update = (next) => onUpdate(heroId, groupKey, next);

  const addCatalog = (id) => {
    update([...added, id]);
    setPickerOpen(false);
  };

  const addManual = () => {
    const text = manualText.trim();
    if (!text) return;
    update([...added, {
      id: `manual_${createId()}`,
      manual: true,
      name: { es: text, en: text },
    }]);
    setManualText('');
  };

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
          {label[language] || label.es}
        </h3>
        <button
          type="button"
          onClick={() => setPickerOpen((value) => !value)}
          aria-label={`${label[language] || label.es}: ${labels.add}`}
          aria-expanded={pickerOpen}
          className="min-h-7 rounded-lg bg-rose-800 px-2 text-[0.7rem] font-semibold text-white hover:bg-rose-700"
        >
          + {labels.add}
        </button>
      </div>

      {pickerOpen && (
        <div className="mb-2 max-h-40 space-y-1 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-1">
          {available.length === 0 ? (
            <p className="px-1 py-1 text-[0.7rem] text-slate-400">{labels.allAdded}</p>
          ) : available.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => addCatalog(item.id)}
              className="block w-full rounded px-1.5 py-1 text-left text-[0.7rem] text-slate-200 hover:bg-slate-800"
            >
              <span className="block truncate font-semibold">{getHeroEffectName(item.id, language)}</span>
              <span className="block truncate text-[0.65rem] text-slate-400">
                {getHeroEffectDescription(item.id, language)}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mb-2 flex gap-1">
        <input
          type="text"
          value={manualText}
          onChange={(event) => setManualText(event.target.value.slice(0, 60))}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addManual();
            }
          }}
          maxLength={60}
          placeholder={labels.manual}
          aria-label={`${label[language] || label.es}: ${labels.manual}`}
          className="min-h-8 min-w-0 flex-1 rounded border border-slate-600 bg-slate-950 px-2 text-xs text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        />
        <button
          type="button"
          onClick={addManual}
          disabled={!manualText.trim()}
          className="min-h-8 rounded bg-slate-700 px-2 text-[0.65rem] font-bold text-white hover:bg-slate-600 disabled:opacity-40"
        >
          {labels.add}
        </button>
      </div>

      {added.length === 0 ? (
        <p className="px-1 text-[0.7rem] text-slate-400">{labels.none}</p>
      ) : (
        <ul className="space-y-1">
          {added.map((entry) => {
            const id = getHeroExtraId(entry);
            return (
              <li key={id} className="flex items-center justify-between gap-2 rounded-lg border border-rose-900/60 bg-rose-950/30 px-2 py-1 text-xs">
                <span className="min-w-0 flex-1 truncate text-slate-100">{heroEntryName(entry, language)}</span>
                <button
                  type="button"
                  onClick={() => update(added.filter((item) => getHeroExtraId(item) !== id))}
                  aria-label={`${heroEntryName(entry, language)}: ${labels.remove}`}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-700 text-xs text-white hover:bg-red-700"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/**
 * Campamento del grupo: objetos compartidos, medidor de runas, efectos de los
 * héroes y seguidores. Todo vive en la partida salvo los seguidores, que se
 * guardan en el campamento del navegador.
 */
export default function CampDialog({ open, onClose }) {
  const { language, translations } = useLanguage();
  const { campamento, addCampItem, removeCampItem, runes, usedTiles, availableTiles } = useGame();
  const { trackerData, setTrackerData } = useTracker();
  const { mainBox } = useExpansions();
  const { version, getExtras, updateExtras } = useHeroExtras();
  const t = translations.trackerInit || {};
  const rolesT = translations.roles || {};
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [text, setText] = useState('');
  const [campFollowerList, setCampFollowerList] = useState([]);
  const [activeHeroId, setActiveHeroId] = useState('');

  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return undefined;
    setText('');
    setCampFollowerList(readCampFollowers());
    inputRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const heroIds = Array.from(new Set([
    ...(trackerData.placedHeroes || []).map((hero) => hero.id),
    ...(trackerData.heroes || []),
  ])).filter(Boolean);
  const selectedHeroId = heroIds.includes(activeHeroId) ? activeHeroId : (heroIds[0] || '');
  const selectedHeroName = translations.heroes?.[selectedHeroId] || selectedHeroId;
  const extras = selectedHeroId ? getExtras(selectedHeroId) : null;
  const campaign = mainBox || 'core';
  const showFollowers = mainBox !== 'core';

  const add = () => {
    if (!text.trim()) return;
    addCampItem(text);
    setText('');
    inputRef.current?.focus();
  };

  const updateGroup = (heroId, group, next) => {
    updateExtras(heroId, { [group]: next });
  };

  return (
    <div className="layer-dialog fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="camp-title"
        className="flex max-h-[90dvh] w-full max-w-3xl flex-col rounded-2xl border border-slate-600 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <header className="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
          <GiWoodenCrate className="text-lg text-amber-300" aria-hidden="true" />
          <h2 id="camp-title" className="min-w-0 flex-1 truncate text-base font-bold">
            {t.campTitle || 'Campamento del grupo'}
          </h2>
          <span className="shrink-0 rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums">
            {campamento.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close || 'Cerrar'}
            className="min-h-9 shrink-0 rounded-lg bg-slate-700 px-3 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            ✕
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <label className="block text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
              {t.groupName || 'Nombre del grupo'}
              <input
                type="text"
                value={trackerData.groupName || ''}
                onChange={(event) => setTrackerData((prev) => ({
                  ...prev,
                  groupName: event.target.value.slice(0, 40),
                }))}
                maxLength={40}
                placeholder={t.groupNamePlaceholder || 'Ej.: Los Buscadores'}
                className="mt-1 min-h-9 w-full rounded-lg border border-slate-600 bg-slate-950 px-2 text-sm font-normal normal-case tracking-normal text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              />
            </label>
          </section>

          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <div className="mb-1.5 flex items-center gap-2">
              <GiSwapBag className="text-base text-yellow-300" aria-hidden="true" />
              <h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
                {t.runeMeter || 'Estado del medidor de runas'}
              </h3>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {RUNE_COLORS.map(({ id, color }) => (
                <div
                  key={id}
                  data-testid={`camp-rune-${id}`}
                  className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-center"
                  style={{ borderTopColor: color }}
                >
                  <span className="mx-auto block h-3 w-3 rotate-45 rounded-[2px] border border-white/70" style={{ backgroundColor: color }} />
                  <span className="mt-1 block text-[0.6rem] font-semibold text-slate-300">
                    {t.colores?.[id] || id}
                  </span>
                  <span className="block text-base font-black tabular-nums text-white">{runes?.[id] || 0}</span>
                  <span className="block text-[0.55rem] text-slate-500">
                    {usedTiles.filter((tile) => tile.runa === id).length}/{usedTiles.filter((tile) => tile.runa === id).length + availableTiles.filter((tile) => tile.runa === id).length}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-1.5 text-[0.6rem] text-slate-500">
              {t.runeMeterHint || 'Runas en el medidor y fichas extraídas / totales.'}
            </p>
          </section>

          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
                {t.campPartyEffects || 'Consecuencias y estados de los héroes'}
              </h3>
              {heroIds.length > 0 && (
                <select
                  value={selectedHeroId}
                  onChange={(event) => setActiveHeroId(event.target.value)}
                  aria-label={t.campSelectHero || 'Héroe'}
                  className="min-h-8 rounded-lg border border-slate-600 bg-slate-800 px-2 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  {heroIds.map((heroId) => (
                    <option key={heroId} value={heroId}>
                      {translations.heroes?.[heroId] || heroId}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {!extras ? (
              <p className="mt-2 text-xs text-slate-400">{t.campNoHeroes || 'Sin héroes en la partida.'}</p>
            ) : (
              <div className="mt-2 space-y-2">
                <p className="text-xs font-semibold text-slate-300">{selectedHeroName}</p>
                {HERO_EFFECT_SECTIONS.map((group) => (
                  <HeroEffectSection
                    key={`${selectedHeroId}-${group.key}-${version}`}
                    heroId={selectedHeroId}
                    groupKey={group.key}
                    label={group.label}
                    catalogue={group.catalogue}
                    extras={extras}
                    language={language}
                    campaign={campaign}
                    onUpdate={updateGroup}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    add();
                  }
                }}
                maxLength={60}
                placeholder={t.campPlaceholder || 'Objeto del campamento'}
                aria-label={t.campPlaceholder || 'Objeto del campamento'}
                className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-950 px-3 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              />
              <button
                type="button"
                onClick={add}
                className="min-h-10 shrink-0 rounded-lg bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                + {t.campAdd || 'Añadir'}
              </button>
            </div>
            {campamento.length === 0 ? (
              <p className="mt-2 rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-center text-xs text-slate-400">
                {t.campEmpty || 'Sin objetos en el campamento.'}
              </p>
            ) : (
              <ul className="mt-2 space-y-1">
                {campamento.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1.5 text-sm">
                    <span className="truncate">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeCampItem(index)}
                      aria-label={`${item}: ${t.remove || 'Quitar'}`}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-700 text-xs text-white hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {showFollowers && (
            <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
                  {t.campFollowers || 'Seguidores del campamento'}
                </h3>
                <span className="rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums">
                  {campFollowerList.length}
                </span>
              </div>
              <p className="mb-2 text-[0.65rem] text-slate-400">
                {t.campFollowersHint || 'Se colocarán al iniciar cada partida.'}
              </p>
              {campFollowerList.length === 0 ? (
                <p className="rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-center text-xs text-slate-400">
                  {t.campFollowersEmpty || 'Sin seguidores guardados.'}
                </p>
              ) : (
                <ul className="space-y-1">
                  {campFollowerList.map((entry) => {
                    const follower = getFollower(entry.id);
                    const state = getFollowerState(entry.id, entry.stateId);
                    return (
                      <li key={entry.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1 text-sm">
                        <span className="min-w-0 flex-1 truncate">
                          {follower?.name || entry.id}
                          <span className="ml-1 text-xs text-slate-400">
                            · {rolesT[entry.role] || entry.role}{state ? ` · ${state.name}` : ''}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            removeCampFollower(entry.id);
                            setCampFollowerList(readCampFollowers());
                          }}
                          aria-label={`${follower?.name || entry.id}: ${t.remove || 'Quitar'}`}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-700 text-xs text-white hover:bg-red-700"
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
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-slate-700 px-4 py-2.5">
          <span className="text-[0.7rem] text-slate-400">{t.campHint || 'Se guarda con la partida'}</span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-lg bg-slate-700 px-4 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            {t.close || 'Cerrar'}
          </button>
        </footer>
      </div>
    </div>
  );
}
