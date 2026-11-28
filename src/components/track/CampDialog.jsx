import { useEffect, useRef, useState } from 'react';
import {
  GiBookCover,
  GiCompass,
  GiScrollUnfurled,
  GiSwapBag,
  GiWoodenCrate,
} from 'react-icons/gi';
import { useLanguage } from '@/context/LanguageContext';
import { useGame } from '@/context/GameContext';
import { useTracker } from '@/context/TrackerContext';
import { useExpansions } from '@/context/ExpansionContext';
import { useHeroExtras } from '@/context/HeroExtrasContext';
import {
  FOLLOWERS,
  getFollower,
  getFollowerName,
  getFollowerState,
  getFollowerStateName,
} from '@/data/followers';
import { CAMPAIGN_EXPANSIONS, getMainBox } from '@/data/boxes';
import { ESTADOS_HEROE, getHeroEffectDescription, getHeroEffectName } from '@/data/heroes/index';
import SharedConsequencesPanel from '@/components/track/SharedConsequencesPanel';
import { readCampFollowers, removeCampFollower } from '@/utils/campFollowers';
import {
  CAMP_ACTS,
  DAREN_TRAITS,
  LEGACY_TRAILS,
  MAX_LINES,
  normalizeCampRecord,
  withDarenTrait,
  withLegacyLevel,
  withUnfoldingLine,
  withoutUnfoldingLine,
} from '@/utils/campRecord';
import { getHeroExtraId } from '@/utils/heroExtras';
import { createId } from '@/utils/id';
import useFocusTrap from '@/hooks/useFocusTrap';
import act1Icon from '@/assets/apocalypse/act-1.webp';
import act2Icon from '@/assets/apocalypse/act-2.webp';
import act3Icon from '@/assets/apocalypse/act-3.webp';
import act4Icon from '@/assets/apocalypse/act-4.webp';

const RUNE_COLORS = [
  { id: 'naranja', color: '#ff8c00' },
  { id: 'verde', color: '#00aa00' },
  { id: 'azul', color: '#0077cc' },
  { id: 'rojo', color: '#cc0000' },
  { id: 'gris', color: '#999999' },
];

const HERO_EFFECT_SECTIONS = [
  { key: 'estados', label: { es: 'Estados', en: 'Conditions' }, catalogue: ESTADOS_HEROE },
];

const ACT_ICONS = {
  first: act1Icon,
  second: act2Icon,
  third: act3Icon,
  fourth: act4Icon,
};

function CampaignStoryCard({ mainBox, label }) {
  const box = getMainBox(mainBox);
  return (
    <section
      data-testid="camp-story-card"
      aria-label={label}
      className="flex h-full flex-col rounded-xl border border-slate-700 bg-slate-950/60 p-3"
    >
      <div className="flex flex-1 items-center justify-center py-2">
        <img
          src={box.logo}
          alt={box.label}
          className="max-h-20 w-auto max-w-full object-contain drop-shadow-[0_0_14px_rgba(16,185,129,0.22)]"
        />
      </div>
    </section>
  );
}

function FollowersCard({ t, language, rolesT, followers, onRemove }) {
  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-700 bg-slate-950/60 p-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        <h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
          {t.campRecruitedFollowers || 'Seguidores Reclutados'}
        </h3>
        <span className="rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums">
          {followers.length}
        </span>
      </div>
      <p className="mb-2 text-[0.65rem] text-slate-400">
        {t.campFollowersHint || 'Se colocarán al iniciar cada partida.'}
      </p>
      {followers.length === 0 ? (
        <p className="flex flex-1 items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-center text-xs text-slate-400">
          {t.campFollowersEmpty || 'Sin seguidores guardados.'}
        </p>
      ) : (
        <ul className="max-h-40 space-y-1 overflow-y-auto">
          {followers.map((entry) => {
            const follower = getFollower(entry.id);
            const state = getFollowerState(entry.id, entry.stateId);
            return (
              <li key={entry.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1 text-sm">
                <span className="min-w-0 flex-1 truncate">
                  {follower ? getFollowerName(follower, language) : entry.id}
                  <span className="ml-1 text-xs text-slate-400">
                    · {rolesT[entry.role] || entry.role}{state ? ` · ${getFollowerStateName(state, language)}` : ''}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  aria-label={`${follower ? getFollowerName(follower, language) : entry.id}: ${t.remove || 'Quitar'}`}
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

function LegacyTrail({ t, language, record, onUpdate }) {
  return (
    <section
      data-testid="camp-legacy"
      className="rounded-xl border border-slate-700 bg-slate-950/60 p-2"
    >
      <div className="mb-2 flex items-center gap-2">
        <GiCompass className="text-base text-amber-300" aria-hidden="true" />
        <div>
          <h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
            {t.campLegacyTrail || 'Ruta del Legado'}
          </h3>
          <p className="text-[0.6rem] text-slate-500">
            {t.campLegacyTrailHint || 'Marca hasta 3 niveles en cada camino.'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {LEGACY_TRAILS.map((trait) => {
          const value = record.legacyTrail[trait.id] || 0;
          const name = trait.label[language] || trait.label.es;
          return (
            <div
              key={trait.id}
              data-testid={`camp-legacy-trait-${trait.id}`}
              className="rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1.5"
            >
              <div className="flex min-w-0 items-center justify-between gap-1">
                <span className="min-w-0 truncate text-xs font-semibold text-slate-200">{name}</span>
                <span className="shrink-0 text-[0.65rem] tabular-nums text-slate-400">{value}/3</span>
              </div>
              <div className="mt-1 flex justify-center gap-1">
                {[1, 2, 3].map((level) => {
                  const selected = value >= level;
                  return (
                    <button
                      key={level}
                      type="button"
                      data-testid={`camp-legacy-${trait.id}-${level}`}
                      aria-label={`${name}: ${level}`}
                      aria-pressed={selected}
                      title={`${name}: ${level}`}
                      onClick={() => onUpdate(withLegacyLevel(record, trait.id, value === level ? 0 : level))}
                      className={`h-5 w-5 rounded-full border-2 transition-colors ${
                        selected
                          ? 'border-amber-200 bg-amber-400 hover:bg-amber-300'
                          : 'border-slate-600 bg-slate-950 hover:border-amber-400'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DarenTraits({ t, language, record, onUpdate }) {
  return (
    <section
      data-testid="camp-daren"
      className="rounded-xl border border-slate-700 bg-slate-950/60 p-2"
    >
      <div className="mb-2 flex items-center gap-2">
        <GiBookCover className="text-base text-amber-300" aria-hidden="true" />
        <div>
          <h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
            {t.campDarenTraits || 'Orígenes y Rasgos del Héroe de Darem'}
          </h3>
          <p className="text-[0.6rem] text-slate-500">
            {t.campDarenTraitsHint || 'Marca los rasgos que tenga el héroe.'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {DAREN_TRAITS.map((trait) => {
          const checked = record.darenTraits[trait.id] === true;
          const name = trait.label[language] || trait.label.es;
          return (
            <button
              key={trait.id}
              type="button"
              data-testid={`camp-daren-${trait.id}`}
              aria-pressed={checked}
              onClick={() => onUpdate(withDarenTrait(record, trait.id, !checked))}
              className={`flex min-h-9 items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-xs font-semibold transition-colors ${
                checked
                  ? 'border-emerald-500 bg-emerald-950/70 text-emerald-100'
                  : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500'
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[0.65rem] ${
                  checked
                    ? 'border-emerald-300 bg-emerald-500 text-slate-950'
                    : 'border-slate-500 bg-slate-950'
                }`}
              >
                {checked ? '✓' : ''}
              </span>
              <span className="min-w-0 truncate">{name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Repercussions({ t, language, record, onUpdate }) {
  const [drafts, setDrafts] = useState({});
  const actLabels = {
    first: t.campFirstAct || 'Primer Acto',
    second: t.campSecondAct || 'Segundo Acto',
    third: t.campThirdAct || 'Tercer Acto',
    fourth: t.campFourthAct || 'Cuarto Acto',
  };

  const addLine = (actId) => {
    const line = (drafts[actId] || '').trim();
    if (!line) return;
    onUpdate(withUnfoldingLine(record, actId, line));
    setDrafts((previous) => ({ ...previous, [actId]: '' }));
  };

  return (
    <section
      data-testid="camp-repercussions"
      className="rounded-xl border border-slate-700 bg-slate-950/60 p-2"
    >
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <GiScrollUnfurled className="text-base text-amber-300" aria-hidden="true" />
        <h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
          {t.campRepercussions || 'Repercusiones'}
        </h3>
        <span className="text-[0.6rem] uppercase tracking-wider text-slate-500">
          {t.campRepercussionsSubtitle || 'Unfoldings / Epilogue'}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {CAMP_ACTS.map((act) => {
          const lines = record.unfoldings[act.id] || [];
          const draft = drafts[act.id] || '';
          return (
            <div
              key={act.id}
              data-testid={`camp-unfolding-${act.id}`}
              className="flex min-h-40 flex-col rounded-lg border border-slate-700 bg-slate-900/50 p-2"
            >
              <h4 className="text-center text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
                {actLabels[act.id]}
              </h4>
              <img
                src={ACT_ICONS[act.id]}
                alt=""
                aria-hidden="true"
                className="mx-auto my-1.5 h-10 w-auto max-w-[80%] object-contain opacity-85"
              />
              {lines.length === 0 ? (
                <p className="flex flex-1 items-center justify-center px-1 text-center text-[0.65rem] text-slate-500">
                  {t.campNoLines || 'Sin líneas.'}
                </p>
              ) : (
                <ul className="mb-1 flex-1 space-y-1">
                  {lines.map((line, index) => (
                    <li
                      key={`${line}-${index}`}
                      className="flex items-start justify-between gap-1 rounded border border-slate-700 bg-slate-950/80 px-1.5 py-1 text-[0.68rem] text-slate-200"
                    >
                      <span className="min-w-0 flex-1 break-words">{line}</span>
                      <button
                        type="button"
                        onClick={() => onUpdate(withoutUnfoldingLine(record, act.id, index))}
                        aria-label={`${line}: ${t.remove || 'Quitar'}`}
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-slate-700 text-[0.6rem] text-white hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto flex gap-1">
                <input
                  type="text"
                  value={draft}
                  onChange={(event) => setDrafts((previous) => ({
                    ...previous,
                    [act.id]: event.target.value.slice(0, 100),
                  }))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addLine(act.id);
                    }
                  }}
                  maxLength={100}
                  disabled={lines.length >= MAX_LINES}
                  placeholder={t.campLinePlaceholder || 'Escribe una línea…'}
                  aria-label={`${actLabels[act.id]}: ${t.campLinePlaceholder || 'Escribe una línea…'}`}
                  className="min-h-7 min-w-0 flex-1 rounded border border-slate-600 bg-slate-950 px-1.5 text-[0.68rem] text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:opacity-40"
                />
                <button
                  type="button"
                  onClick={() => addLine(act.id)}
                  disabled={!draft.trim() || lines.length >= MAX_LINES}
                  aria-label={`${actLabels[act.id]}: ${t.campAddLine || 'Añadir línea'}`}
                  className="min-h-7 rounded bg-slate-700 px-1.5 text-xs font-bold text-white hover:bg-slate-600 disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <p className="mt-0.5 text-right text-[0.55rem] text-slate-500">
                {lines.length}/{MAX_LINES}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

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
  const hasCatalogue = catalogue.length > 0;
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
          disabled={!hasCatalogue}
          aria-label={`${label[language] || label.es}: ${labels.add}`}
          aria-expanded={pickerOpen}
          className="min-h-7 rounded-lg bg-rose-800 px-2 text-[0.7rem] font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
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
 * Seguimiento de Historia: objetos compartidos, medidor de runas, efectos de los
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
  const nameRef = useRef(null);
  const inputRef = useRef(null);
  const [text, setText] = useState('');
  const [campFollowerList, setCampFollowerList] = useState([]);
  const [activeHeroId, setActiveHeroId] = useState('');

  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return undefined;
    setText('');
    setCampFollowerList(readCampFollowers());
    nameRef.current?.focus({ preventScroll: true });
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
  const extras = selectedHeroId ? getExtras(selectedHeroId) : null;
  const campaign = mainBox || 'core';
  const campaignExpansionIds = CAMPAIGN_EXPANSIONS[campaign] || [];
  const showFollowers = campaign === 'apocalypse'
    || FOLLOWERS.some((follower) => campaignExpansionIds.includes(follower.expansionId));
  const showApocalypse = campaign === 'apocalypse';
  const campRecord = normalizeCampRecord(trackerData.campRecord);

  const add = () => {
    if (!text.trim()) return;
    addCampItem(text);
    setText('');
    inputRef.current?.focus();
  };

  const updateGroup = (heroId, group, next) => {
    updateExtras(heroId, { [group]: next });
  };

  const updateCampRecord = (nextRecord) => {
    setTrackerData((previous) => ({
      ...previous,
      campRecord: normalizeCampRecord(nextRecord),
    }));
  };

  const removeFollower = (id) => {
    removeCampFollower(id);
    setCampFollowerList(readCampFollowers());
  };

  return (
    <div className="layer-dialog fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="camp-title"
        className="flex max-h-[90dvh] w-full max-w-6xl flex-col rounded-2xl border border-slate-600 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <header className="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
          <GiBookCover className="text-lg text-amber-300" aria-hidden="true" />
          <h2 id="camp-title" className="min-w-0 flex-1 truncate text-base font-bold">
            {t.campTitle || 'Seguimiento de Historia'}
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

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2 sm:p-3">
          <section className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2">
            <label htmlFor="camp-party-name" className="block text-center text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
              {t.groupName || 'Nombre del grupo'}
            </label>
            <input
              ref={nameRef}
              id="camp-party-name"
              type="text"
              value={trackerData.groupName || ''}
              onChange={(event) => setTrackerData((prev) => ({
                ...prev,
                groupName: event.target.value.slice(0, 40),
              }))}
              maxLength={40}
              placeholder={t.groupNamePlaceholder || 'Ej.: Los Buscadores'}
              className="mx-auto mt-1 block min-h-9 w-full max-w-2xl rounded-lg border border-slate-600 bg-slate-950 px-3 text-center text-lg font-black text-white placeholder:font-normal placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            />
          </section>

          <div className={`grid gap-2 ${showFollowers ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
            <CampaignStoryCard
              mainBox={campaign}
              label={t.campStoryRecord || 'Seguimiento de Historia'}
            />

            <section
              data-testid="camp-rune-card"
              className="flex h-full flex-col rounded-xl border border-slate-700 bg-slate-950/60 p-2"
            >
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
              <p className="mt-auto pt-1.5 text-[0.6rem] text-slate-500">
                {t.runeMeterHint || 'Runas en el medidor y fichas extraídas / totales.'}
              </p>
            </section>

            {showFollowers && (
              <FollowersCard
                t={t}
                language={language}
                rolesT={rolesT}
                followers={campFollowerList}
                onRemove={removeFollower}
              />
            )}
          </div>

          <section
            data-testid="camp-hero-effects"
            className="rounded-xl border border-slate-700 bg-slate-950/60 p-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GiBookCover className="text-base text-amber-300" aria-hidden="true" />
                <h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
                  {t.campOutcomesConditions || 'Consecuencias y estados'}
                </h3>
              </div>
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
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <SharedConsequencesPanel
                record={campRecord}
                onUpdate={updateCampRecord}
                language={language}
                t={t}
                testId="camp-consequences"
              />
              {extras ? (
                HERO_EFFECT_SECTIONS.map((group) => (
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
                ))
              ) : (
                <p className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-center text-xs text-slate-400">
                  {t.campNoHeroes || 'Sin héroes en la partida.'}
                </p>
              )}
            </div>
          </section>

          {showApocalypse && (
            <>
              <div className="grid gap-2 lg:grid-cols-2">
                <LegacyTrail
                  t={t}
                  language={language}
                  record={campRecord}
                  onUpdate={updateCampRecord}
                />
                <DarenTraits
                  t={t}
                  language={language}
                  record={campRecord}
                  onUpdate={updateCampRecord}
                />
              </div>
              <Repercussions
                t={t}
                language={language}
                record={campRecord}
                onUpdate={updateCampRecord}
              />
            </>
          )}

          <section
            data-testid="camp-objects"
            className="rounded-xl border border-slate-700 bg-slate-950/60 p-2"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GiWoodenCrate className="text-base text-amber-300" aria-hidden="true" />
                <h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
                  {t.campObjects || 'Objetos de campamento'}
                </h3>
              </div>
              <span className="rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums">
                {campamento.length}
              </span>
            </div>
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
