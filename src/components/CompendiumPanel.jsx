import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  GiBookCover,
  GiCancel,
  GiClockwork,
  GiCrossedSwords,
  GiDeathSkull,
  GiFootprint,
  GiGems,
  GiMagnifyingGlass,
  GiScrollUnfurled,
} from 'react-icons/gi';
import { useLanguage } from '@/context/LanguageContext';
import {
  COMPENDIUM_CATEGORIES,
  COMPENDIUM_ENTRIES,
  compendiumCategoryLabel,
  searchCompendium,
} from '@/data/compendium';

const CATEGORY_ICONS = {
  book: GiBookCover,
  swords: GiCrossedSwords,
  footprint: GiFootprint,
  skull: GiDeathSkull,
  gems: GiGems,
  clock: GiClockwork,
  scroll: GiScrollUnfurled,
};

const RELATED_TERMS = {
  combat: ['conditions', 'resources'],
  movement: ['turn', 'conditions'],
  conditions: ['combat', 'resources'],
  resources: ['combat', 'turn'],
  turn: ['resources', 'campaign'],
  campaign: ['conditions', 'resources'],
  general: ['combat', 'turn'],
};

function CategoryIcon({ categoryId, size = 20 }) {
  const category = COMPENDIUM_CATEGORIES.find((item) => item.id === categoryId);
  const Icon = CATEGORY_ICONS[category?.icon] || GiBookCover;
  return <Icon size={size} aria-hidden="true" />;
}

function TermIcon({ entry, size = 20 }) {
  if (entry.icon) {
    return (
      <img
        src={entry.icon}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-contain"
        loading="lazy"
      />
    );
  }
  return <CategoryIcon categoryId={entry.category} size={size} />;
}

export default function CompendiumPanel({ onClose }) {
  const { language, translations } = useLanguage();
  const t = translations.compendium || {};
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [onlyWithIcon, setOnlyWithIcon] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef(null);

  const entries = useMemo(
    () => searchCompendium(COMPENDIUM_ENTRIES, {
      query,
      category,
      language,
      onlyWithIcon,
    }),
    [query, category, language, onlyWithIcon],
  );

  const selected = useMemo(
    () => COMPENDIUM_ENTRIES.find((entry) => entry.id === selectedId) || null,
    [selectedId],
  );

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, category, onlyWithIcon]);

  const formatResults = (count) => (
    (t.results || '{count} términos').replace('{count}', String(count))
  );

  const selectEntry = (entry) => {
    setSelectedId(entry.id);
    setActiveIndex(entries.findIndex((item) => item.id === entry.id));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, entries.length - 1));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === 'Enter' && entries[activeIndex]) {
      event.preventDefault();
      selectEntry(entries[activeIndex]);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (query) {
        setQuery('');
      } else {
        onClose?.();
      }
    }
  };

  const categories = [
    { id: 'all', label: t.all || 'Todo', icon: 'book' },
    ...COMPENDIUM_CATEGORIES.map((item) => ({
      ...item,
      label: item.label[language] || item.label.es,
    })),
  ];

  return (
    <motion.div
      id="track-menu-compendium"
      data-testid="compendium-panel"
      role="region"
      aria-label={t.title || 'Compendio'}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="menu-panel layer-menu flex max-h-[76dvh] flex-col gap-2 overflow-hidden px-3 pb-3 pt-2 text-white sm:px-4"
    >
      <div data-testid="menu-header" className="sticky top-0 z-10 -mx-3 -mt-2 flex shrink-0 items-center gap-2 border-b border-slate-700 bg-slate-900/95 px-3 py-2 backdrop-blur sm:-mx-4 sm:px-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-900/60 text-violet-300">
          <GiBookCover className="text-lg" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold">{t.title || 'Compendio'}</h2>
          <p className="truncate text-[0.65rem] text-slate-400">{t.subtitle || 'Busca palabras clave, condiciones y términos de reglas.'}</p>
        </div>
        <span className="hidden shrink-0 rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-200 sm:inline">
          {formatResults(entries.length)}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close || 'Cerrar compendio'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-sm font-bold text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          ✕
        </button>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
        <section className="flex min-h-0 flex-col gap-2" aria-label={t.search || 'Buscar término'}>
          <div className="relative">
            <GiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400" aria-hidden="true" />
            <input
              ref={searchRef}
              data-testid="compendium-search"
              type="search"
              role="combobox"
              aria-label={t.search || 'Buscar término'}
              aria-autocomplete="list"
              aria-expanded
              aria-controls="compendium-results"
              aria-activedescendant={entries[activeIndex] ? `compendium-result-${entries[activeIndex].id}` : undefined}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.search || 'Buscar término…'}
              className="min-h-11 w-full rounded-xl border border-slate-600 bg-slate-950/80 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  searchRef.current?.focus();
                }}
                aria-label={t.clear || 'Limpiar búsqueda'}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <GiCancel />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t.category || 'Categoría'}>
            {categories.map((item) => {
              const active = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(item.id)}
                  className={`inline-flex min-h-8 items-center gap-1 rounded-full border px-2.5 text-[0.68rem] font-semibold transition ${
                    active
                      ? 'border-violet-400/80 bg-violet-800 text-violet-50'
                      : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <CategoryIcon categoryId={item.id} size={13} />
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              aria-pressed={onlyWithIcon}
              onClick={() => setOnlyWithIcon((value) => !value)}
              className={`inline-flex min-h-8 items-center gap-1 rounded-full border px-2.5 text-[0.68rem] font-semibold transition ${
                onlyWithIcon
                  ? 'border-emerald-400/80 bg-emerald-800 text-emerald-50'
                  : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              <GiGems size={13} />
              {t.withIcon || 'Con icono'}
            </button>
          </div>

          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400" aria-live="polite">
            {formatResults(entries.length)}
          </p>

          <div
            id="compendium-results"
            role="listbox"
            aria-label={t.title || 'Compendio'}
            className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1"
          >
            {entries.length === 0 ? (
              <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4 text-sm text-slate-300">
                <p className="font-bold text-white">{t.noResultsTitle || 'Sin resultados'}</p>
                <p className="mt-1 text-xs text-slate-400">{t.noResultsBody || 'Prueba con otra palabra o cambia los filtros.'}</p>
                <p className="mt-3 text-xs text-slate-500">{t.emptyHint || 'Prueba con: Arrollar, Aturdimiento, Escudo…'}</p>
              </div>
            ) : entries.map((entry, index) => {
              const isSelected = selectedId === entry.id;
              const isActive = activeIndex === index;
              return (
                <button
                  key={entry.id}
                  id={`compendium-result-${entry.id}`}
                  data-testid={`compendium-result-${entry.id}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectEntry(entry)}
                  className={`flex w-full items-start gap-2.5 rounded-xl border p-2 text-left transition ${
                    isSelected
                      ? 'border-violet-500/80 bg-violet-950/60'
                      : isActive
                        ? 'border-slate-500 bg-slate-800/80'
                        : 'border-slate-700 bg-slate-950/50 hover:border-slate-500 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-900 p-1 text-violet-200">
                    <TermIcon entry={entry} size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-100">{entry.term[language]}</span>
                      <span className="rounded-full border border-slate-600 bg-slate-900 px-1.5 py-0.5 text-[0.58rem] font-semibold text-slate-400">
                        {compendiumCategoryLabel(entry.category, language)}
                      </span>
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-[0.7rem] leading-4 text-slate-400">
                      {entry.description[language]}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="min-h-0 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950/60 p-3" aria-live="polite">
          {selected ? (
            <div data-testid="compendium-detail">
              <div className="flex items-start gap-3">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-700/70 bg-violet-950/50 p-2 text-violet-200">
                  <TermIcon entry={selected} size={34} />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-violet-300">
                    {compendiumCategoryLabel(selected.category, language)}
                  </p>
                  <h3 className="mt-1 text-xl font-black leading-tight text-white">{selected.term[language]}</h3>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-700 pt-3">
                <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-400">
                  {t.description || 'Descripción'}
                </h4>
                <p className="mt-1.5 text-sm leading-6 text-slate-200">{selected.description[language]}</p>
              </div>

              {selected.aliases[language].length > 1 && (
                <div className="mt-4">
                  <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {t.aliases || 'También conocido como'}
                  </h4>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {selected.aliases[language]
                      .filter((alias) => alias !== selected.term[language])
                      .slice(0, 4)
                      .map((alias) => (
                        <span key={alias} className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[0.62rem] text-slate-300">
                          {alias}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-400">
                  {t.explore || 'Explorar categorías'}
                </h4>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {(RELATED_TERMS[selected.category] || []).map((categoryId) => (
                    <button
                      key={categoryId}
                      type="button"
                      onClick={() => setCategory(categoryId)}
                      className="rounded-full border border-violet-800/70 bg-violet-950/40 px-2 py-1 text-[0.62rem] font-semibold text-violet-200 hover:border-violet-500 hover:text-white"
                    >
                      {compendiumCategoryLabel(categoryId, language)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-violet-300">
                <GiBookCover size={30} />
              </span>
              <h3 className="mt-3 text-base font-bold text-white">{t.selectTitle || 'Selecciona un término'}</h3>
              <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">{t.selectBody || 'Consulta su descripción, su icono y los términos relacionados.'}</p>
            </div>
          )}
        </aside>
      </div>
    </motion.div>
  );
}
