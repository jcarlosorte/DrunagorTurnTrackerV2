import React, { useMemo, useState, useEffect } from 'react';
import { GiAttachedShield, GiBadGnome, GiShadowFollower, GiSharpedTeethSkull, GiCheckMark, GiMagnifyingGlass } from 'react-icons/gi';
import { useNavigate } from "react-router-dom";
import { EXPANSIONS } from '@/data/expansions';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
import { ROLES } from '@/data/roles';
import { COLORS } from '@/data/color';
import { useLanguage } from '@/context/LanguageContext';
import { useExpansions } from '@/context/ExpansionContext';
import { useTracker } from '@/context/TrackerContext';
import PageTransition from "@/components/PageTransition";
import ConfirmDialog from "@/components/ConfirmDialog";

const MAX_HEROES = 5;
const BEHAVIORS = ["estandar", "alternativo", "complejo"];
const STEPS = ['heroes', 'roles', 'enemies'];
/** Icono de cada paso de configuración. */
const STEP_ICONS = { heroes: GiAttachedShield, roles: GiShadowFollower, enemies: GiSharpedTeethSkull };

const normalize = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const COLOR_SWATCH = {
  blanco: '#f8fafc',
  gris: '#94a3b8',
  negro: '#0f172a',
  comandante: '#facc15',
};

const TrackerSelect = () => {
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [heroRoles, setHeroRoles] = useState({});
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  const [selectedBehaviors, setSelectedBehaviors] = useState(["estandar", "alternativo", "complejo"]);
  const [step, setStep] = useState('heroes');
  const [heroQuery, setHeroQuery] = useState('');
  const [enemyQuery, setEnemyQuery] = useState('');
  const [enemyExpansion, setEnemyExpansion] = useState('all');
  const [enemyColor, setEnemyColor] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const { selectedExpansions } = useExpansions();
  const { translations } = useLanguage();
  const { trackerData, setTrackerData } = useTracker();
  const t = translations?.trackerSelect || {};
  const navigate = useNavigate();

  const expansionKey = selectedExpansions.join(',');

  const heroesInSelectedExpansions = useMemo(
    () => HEROES.filter((h) => selectedExpansions.includes(h.expansionId)),
    [expansionKey]
  );
  const enemiesInSelectedExpansions = useMemo(
    () => ENEMIES.filter((e) => selectedExpansions.includes(e.expansionId)),
    [expansionKey]
  );

  useEffect(() => {
    const validHeroIds = new Set(heroesInSelectedExpansions.map((hero) => hero.id));
    const validEnemyIds = new Set(enemiesInSelectedExpansions.map((enemy) => enemy.id));
    const validRoleIds = new Set(ROLES.map((role) => role.id));

    const heroes = (Array.isArray(trackerData.heroes) ? trackerData.heroes : [])
      .filter((id) => validHeroIds.has(id));
    const roles = Object.fromEntries(
      Object.entries(trackerData.roles || {})
        .filter(([heroId, roleId]) => heroes.includes(heroId) && validRoleIds.has(roleId))
    );
    const enemies = (Array.isArray(trackerData.enemies) ? trackerData.enemies : [])
      .filter((id) => validEnemyIds.has(id));
    const behaviors = (Array.isArray(trackerData.behaviors) ? trackerData.behaviors : [])
      .filter((behavior) => BEHAVIORS.includes(behavior));

    setSelectedHeroes(heroes);
    setHeroRoles(roles);
    setSelectedEnemies(enemies);
    setSelectedBehaviors(behaviors.length > 0 ? behaviors : BEHAVIORS);
  }, [expansionKey, trackerData, heroesInSelectedExpansions, enemiesInSelectedExpansions]);

  const getHeroName = (heroId) => translations.heroes?.[heroId] || heroId;
  const getEnemyName = (enemyId) => translations.enemies?.[enemyId] || enemyId;
  const getRoleName = (roleId) => translations.roles?.[roleId] || roleId;
  const getExpansionName = (id) => translations.expansions?.[id] || id;

  const showMessage = (type, text) => setMessage({ type, text });

  const handleRoleSelect = (heroId, roleId) => {
    setHeroRoles((prev) => {
      const next = { ...prev };
      if (roleId) next[heroId] = roleId;
      else delete next[heroId];
      return next;
    });
  };

  const handleHeroSelect = (heroId) => {
    const isSelected = selectedHeroes.includes(heroId);
    if (!isSelected && selectedHeroes.length >= MAX_HEROES) {
      showMessage('error', t.maxHeroes || `Máximo ${MAX_HEROES} héroes`);
      return;
    }
    setHeroRoles((prev) => {
      const roles = { ...prev };
      if (roles[heroId]) delete roles[heroId];
      return roles;
    });
    setSelectedHeroes((prev) => (
      prev.includes(heroId) ? prev.filter((id) => id !== heroId) : [...prev, heroId]
    ));
    showMessage('', '');
  };

  const handleEnemySelect = (enemyId) => {
    setSelectedEnemies((prev) => (
      prev.includes(enemyId) ? prev.filter((id) => id !== enemyId) : [...prev, enemyId]
    ));
  };

  const handleBehaviorSelect = (behavior) => {
    setSelectedBehaviors((prev) => {
      if (prev.includes(behavior)) {
        const next = prev.filter((b) => b !== behavior);
        return next.length === 0 ? prev : next;
      }
      return [...prev, behavior];
    });
  };

  const toggleExpansionEnemies = (expansionId) => {
    const ids = ENEMIES.filter((e) => e.expansionId === expansionId).map((e) => e.id);
    if (ids.length === 0) return;
    const allSelected = ids.every((id) => selectedEnemies.includes(id));
    setSelectedEnemies((prev) => (
      allSelected
        ? prev.filter((id) => !ids.includes(id))
        : [...new Set([...prev, ...ids])]
    ));
  };

  const handleConfirm = () => {
    if (selectedHeroes.length === 0) {
      showMessage('error', t.noHeroesSelected || "Debes seleccionar al menos un héroe.");
      setStep('heroes');
      return;
    }

    const validHeroIds = new Set(heroesInSelectedExpansions.map((hero) => hero.id));
    const validEnemyIds = new Set(enemiesInSelectedExpansions.map((enemy) => enemy.id));
    const validRoleIds = new Set(ROLES.map((role) => role.id));
    const heroes = selectedHeroes.filter((id) => validHeroIds.has(id));
    const roles = Object.fromEntries(
      Object.entries(heroRoles)
        .filter(([heroId, roleId]) => heroes.includes(heroId) && validRoleIds.has(roleId))
    );
    const heroesWithoutRole = heroes.filter((heroId) => !roles[heroId]);
    if (heroesWithoutRole.length > 0) {
      const names = heroesWithoutRole.map(getHeroName).join(', ');
      showMessage(
        'error',
        t.heroesWithoutRoles?.replace('{heroes}', names) ||
        `Todos los héroes deben tener un rol asignado. Faltan: ${names}`
      );
      setStep('roles');
      return;
    }

    const validEnemies = selectedEnemies.filter((id) => validEnemyIds.has(id));
    const behaviors = selectedBehaviors.filter((behavior) => BEHAVIORS.includes(behavior));

    setTrackerData({
      heroes,
      roles,
      enemies: validEnemies,
      behaviors: behaviors.length > 0 ? behaviors : ["estandar"],
    });
    navigate("/init", { replace: true });
  };

  const handleReset = () => {
    const validEnemies = Array.from(new Set(enemiesInSelectedExpansions.map((e) => e.id)));
    setSelectedHeroes([]);
    setHeroRoles({});
    setSelectedEnemies(validEnemies);
    setSelectedBehaviors(BEHAVIORS);
    setMessage({ type: '', text: '' });
    setTrackerData({
      heroes: [],
      roles: {},
      enemies: validEnemies,
      behaviors: BEHAVIORS,
    });
  };

  const handleBack = () => navigate("/", { replace: true });

  const filteredHeroes = useMemo(() => {
    const q = normalize(heroQuery.trim());
    return heroesInSelectedExpansions.filter((hero) => (
      !q || normalize(getHeroName(hero.id)).includes(q) || normalize(hero.id).includes(q)
    ));
  }, [heroQuery, heroesInSelectedExpansions, translations]);

  const enemiesOfExpansion = useMemo(() => (
    enemyExpansion === 'all'
      ? enemiesInSelectedExpansions
      : enemiesInSelectedExpansions.filter((e) => e.expansionId === enemyExpansion)
  ), [enemyExpansion, enemiesInSelectedExpansions]);

  const enemyFilters = useMemo(() => (
    COLORS
      .map((color) => {
        const seen = new Set();
        const items = enemiesOfExpansion.filter((enemy) => {
          if (enemy.color !== color.id || seen.has(enemy.id)) return false;
          seen.add(enemy.id);
          return true;
        });
        return { color, items };
      })
      .filter(({ items }) => items.length > 0)
  ), [enemiesOfExpansion]);

  const visibleEnemyGroups = useMemo(() => {
    const q = normalize(enemyQuery.trim());
    const base = enemyColor === 'all'
      ? enemyFilters
      : enemyFilters.filter(({ color }) => color.id === enemyColor);
    return base
      .map(({ color, items }) => ({
        color,
        items: items.filter((enemy) => (
          !q || normalize(getEnemyName(enemy.id)).includes(q) || normalize(enemy.id).includes(q)
        )),
      }))
      .filter(({ items }) => items.length > 0);
  }, [enemyColor, enemyFilters, enemyQuery, translations]);

  const filteredEnemyCount = visibleEnemyGroups.reduce((total, group) => total + group.items.length, 0);

  const selectedHeroObjects = selectedHeroes
    .map((id) => HEROES.find((hero) => hero.id === id))
    .filter(Boolean);

  const rolesAssigned = Object.keys(heroRoles).length;
  const expansionOptions = selectedExpansions
    .filter((exp) => (EXPANSIONS.find((item) => item.id === exp)?.enemies?.length || 0) > 0);

  const stepIndex = STEPS.indexOf(step);

  const goToStep = (nextStep) => {
    setStep(nextStep);
    setMessage({ type: '', text: '' });
  };

  const stepLabel = { heroes: t.selectHeroes, roles: t.assignRoles, enemies: t.selectEnemies };

  return (
    <PageTransition>
      <main className="mx-auto min-h-[calc(100dvh-3.5rem)] max-w-7xl bg-slate-950 px-3 pb-40 pt-5 text-slate-100 sm:px-6 lg:px-8">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">Drunagor</p>
          <h1 className="mt-2 flex items-center gap-3 text-3xl font-black tracking-tight text-yellow-300 sm:text-4xl">
            <GiBadGnome className="text-4xl text-yellow-400 sm:text-5xl" aria-hidden="true" />
            <span>{t.title || 'Configurar partida'}</span>
          </h1>
        </header>

        {/* Paso actual */}
        <nav aria-label={t.stepsLabel || 'Pasos de configuración'} className="mb-6">
          <ol className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 p-2">
            {STEPS.map((item, index) => {
              const isActive = item === step;
              const isDone = index < stepIndex;
              const Icon = STEP_ICONS[item];
              return (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => goToStep(item)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-2 py-2 text-center text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:text-sm ${
                      isActive
                        ? 'border-emerald-400 bg-gradient-to-b from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-950/40'
                        : isDone
                          ? 'border-emerald-800 bg-emerald-950/60 text-emerald-200 hover:border-emerald-500'
                          : 'border-slate-700 bg-slate-950/60 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${
                        isActive ? 'bg-black/25 text-white' : isDone ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {isDone && !isActive ? <GiCheckMark /> : Icon ? <Icon /> : index + 1}
                    </span>
                    <span className="truncate">{stepLabel[item] || item}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div aria-live="assertive" role="status" className="min-h-0">
          {message.text && (
            <p className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${
              message.type === 'error'
                ? 'border-red-500/60 bg-red-950/50 text-red-100'
                : 'border-emerald-500/60 bg-emerald-950/50 text-emerald-100'
            }`}>
              {message.text}
            </p>
          )}
        </div>

        {/* PASO: HÉROES */}
        {step === 'heroes' && (
          <section aria-labelledby="heroes-heading" className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="heroes-heading" className="flex items-center gap-2 text-xl font-bold">
                <GiAttachedShield className="text-yellow-400" aria-hidden="true" />
                {t.selectHeroes || 'Héroes'}
              </h2>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-emerald-200">
                {selectedHeroes.length}/{MAX_HEROES}
              </span>
            </div>

            <div className="relative mb-4">
              <GiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <label htmlFor="hero-search" className="sr-only">{t.searchHeroes || 'Buscar héroe'}</label>
              <input
                id="hero-search"
                type="search"
                value={heroQuery}
                onChange={(event) => setHeroQuery(event.target.value)}
                placeholder={t.searchHeroes || 'Buscar héroe…'}
                className="min-h-11 w-full rounded-xl border border-slate-600 bg-slate-950 pl-10 pr-3 text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              />
            </div>

            {filteredHeroes.length === 0 ? (
              <p className="rounded-xl border border-slate-700 bg-slate-950 p-6 text-center text-slate-400">
                {t.noResults || 'No hay resultados con los filtros actuales.'}
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredHeroes.map((hero) => {
                  const isSelected = selectedHeroes.includes(hero.id);
                  const isBlocked = !isSelected && selectedHeroes.length >= MAX_HEROES;
                  return (
                    <li key={hero.id}>
                      <label
                        className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 transition focus-within:ring-2 focus-within:ring-sky-300 ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-950/50 shadow-lg shadow-emerald-950/40'
                            : isBlocked
                              ? 'cursor-not-allowed border-slate-800 bg-slate-900/40 opacity-50'
                              : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleHeroSelect(hero.id)}
                          disabled={isBlocked}
                          className="sr-only"
                          aria-label={getHeroName(hero.id)}
                        />
                        <span className="relative block">
                          {hero.image ? (
                            <span className="flex h-32 w-full items-center justify-center overflow-hidden bg-slate-950 sm:h-40">
                              <img
                                src={hero.image}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-contain"
                              />
                            </span>
                          ) : (
                            <span className="flex h-32 w-full items-center justify-center bg-slate-800 text-slate-500">—</span>
                          )}
                          <span
                            aria-hidden="true"
                            className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-black ${
                              isSelected
                                ? 'border-emerald-200 bg-emerald-500 text-slate-950'
                                : 'border-slate-400 bg-slate-900/80 text-transparent'
                            }`}
                          >
                            <GiCheckMark />
                          </span>
                        </span>
                        <span className="flex flex-1 flex-col justify-center gap-0.5 px-2 py-2 text-center">
                          <span className="line-clamp-2 text-sm font-bold text-slate-100">{getHeroName(hero.id)}</span>
                          <span className="truncate text-[0.7rem] text-slate-400">{getExpansionName(hero.expansionId)}</span>
                          {heroRoles[hero.id] && (
                            <span className="mt-1 truncate rounded-full bg-emerald-900/70 px-2 py-0.5 text-[0.7rem] font-semibold text-emerald-200">
                              {getRoleName(heroRoles[hero.id])}
                            </span>
                          )}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {/* PASO: ROLES */}
        {step === 'roles' && (
          <section aria-labelledby="roles-heading" className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="roles-heading" className="flex items-center gap-2 text-xl font-bold">
                <GiShadowFollower className="text-emerald-400" aria-hidden="true" />
                {t.assignRoles || 'Roles'}
              </h2>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-emerald-200">
                {rolesAssigned}/{selectedHeroes.length}
              </span>
            </div>

            {selectedHeroes.length === 0 ? (
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-6 text-center">
                <p className="text-slate-300">{t.noHeroesSelected || 'Todavía no has seleccionado héroes.'}</p>
                <button
                  type="button"
                  onClick={() => goToStep('heroes')}
                  className="mt-4 min-h-11 rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                >
                  {t.selectHeroes || 'Seleccionar héroes'}
                </button>
              </div>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {selectedHeroObjects.map((hero) => {
                  const usedRoles = Object.values(heroRoles).filter((id) => id !== heroRoles[hero.id]);
                  return (
                    <li key={hero.id} className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-2">
                      <img
                        src={hero.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-16 w-16 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-100">{getHeroName(hero.id)}</p>
                        <label htmlFor={`role-${hero.id}`} className="sr-only">{`${t.chooseRole || 'Rol'} — ${getHeroName(hero.id)}`}</label>
                        <select
                          id={`role-${hero.id}`}
                          value={heroRoles[hero.id] || ''}
                          onChange={(event) => handleRoleSelect(hero.id, event.target.value)}
                          className={`mt-1 min-h-11 w-full rounded-lg border bg-slate-900 px-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                            heroRoles[hero.id] ? 'border-emerald-600' : 'border-amber-600'
                          }`}
                        >
                          <option value="">{t.chooseRole || 'Elegir rol'}</option>
                          {ROLES
                            .filter((role) => !usedRoles.includes(role.id) || role.id === heroRoles[hero.id])
                            .map((role) => (
                              <option key={role.id} value={role.id}>{getRoleName(role.id)}</option>
                            ))}
                        </select>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {/* PASO: ENEMIGOS */}
        {step === 'enemies' && (
          <section aria-labelledby="enemies-heading" className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="enemies-heading" className="flex items-center gap-2 text-xl font-bold">
                <GiSharpedTeethSkull className="text-red-400" aria-hidden="true" />
                {t.selectEnemies || 'Enemigos'}
              </h2>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-red-200">
                {selectedEnemies.length} {t.selected || 'seleccionados'}
              </span>
            </div>

            {/* Comportamientos */}
            <div className="mb-4 rounded-xl border border-slate-700 bg-slate-950 p-3">
              <p id="behaviors-label" className="mb-2 text-sm font-bold text-slate-200">
                {t?.comportamientos?.comportamiento || 'Comportamientos'}
              </p>
              <div role="group" aria-labelledby="behaviors-label" className="flex flex-wrap gap-2">
                {BEHAVIORS.map((behavior) => {
                  const isOn = selectedBehaviors.includes(behavior);
                  return (
                    <button
                      key={behavior}
                      type="button"
                      aria-pressed={isOn}
                      onClick={() => handleBehaviorSelect(behavior)}
                      className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                        isOn
                          ? 'border-emerald-400 bg-emerald-600 text-white'
                          : 'border-slate-600 bg-slate-900 text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {t?.comportamientos?.[behavior] || behavior}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtros */}
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <GiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <label htmlFor="enemy-search" className="sr-only">{t.searchEnemies || 'Buscar enemigo'}</label>
                <input
                  id="enemy-search"
                  type="search"
                  value={enemyQuery}
                  onChange={(event) => setEnemyQuery(event.target.value)}
                  placeholder={t.searchEnemies || 'Buscar enemigo…'}
                  className="min-h-11 w-full rounded-xl border border-slate-600 bg-slate-950 pl-10 pr-3 text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                />
              </div>
              <div>
                <label htmlFor="enemy-expansion" className="sr-only">{t.filterExpansion || 'Filtrar por expansión'}</label>
                <select
                  id="enemy-expansion"
                  value={enemyExpansion}
                  onChange={(event) => setEnemyExpansion(event.target.value)}
                  className="min-h-11 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <option value="all">{t.allExpansions || 'Todas las expansiones'}</option>
                  {expansionOptions.map((exp) => (
                    <option key={exp} value={exp}>{getExpansionName(exp)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtro por color */}
            <div role="group" aria-label={t.filterColor || 'Filtrar por color'} className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={enemyColor === 'all'}
                onClick={() => setEnemyColor('all')}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                  enemyColor === 'all' ? 'border-sky-300 bg-sky-700 text-white' : 'border-slate-600 bg-slate-900 text-slate-300'
                }`}
              >
                {t.allColors || 'Todos'}
              </button>
              {enemyFilters.map(({ color, items }) => (
                <button
                  key={color.id}
                  type="button"
                  aria-pressed={enemyColor === color.id}
                  onClick={() => setEnemyColor(enemyColor === color.id ? 'all' : color.id)}
                  className={`min-h-11 rounded-full border px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                    enemyColor === color.id ? 'border-sky-300 bg-sky-700 text-white' : 'border-slate-600 bg-slate-900 text-slate-300'
                  }`}
                >
                  {t.colors?.[color.id] || color.id} ({items.length})
                </button>
              ))}
            </div>

            {/* Selección rápida por expansión */}
            {expansionOptions.length > 0 && (
              <div className="mb-5 rounded-xl border border-slate-700 bg-slate-950 p-3">
                <p className="mb-2 text-sm font-bold text-slate-200">{t.quickSelect || 'Selección rápida por expansión'}</p>
                <div className="flex flex-wrap gap-2">
                  {expansionOptions.map((exp) => {
                    const ids = ENEMIES.filter((enemy) => enemy.expansionId === exp).map((enemy) => enemy.id);
                    const seleccionados = ids.filter((id) => selectedEnemies.includes(id)).length;
                    const todos = ids.length > 0 && seleccionados === ids.length;
                    const alguno = seleccionados > 0 && !todos;
                    return (
                      <button
                        key={exp}
                        type="button"
                        aria-pressed={todos}
                        onClick={() => toggleExpansionEnemies(exp)}
                        title={todos
                          ? (t.quickSelectRemove || 'Quitar todos los enemigos de esta expansión')
                          : (t.quickSelectAdd || 'Añadir todos los enemigos de esta expansión')}
                        className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                          todos
                            ? 'border-emerald-300 bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                            : alguno
                              ? 'border-indigo-300 bg-indigo-800 text-white hover:bg-indigo-700'
                              : 'border-slate-600 bg-slate-900 text-slate-300 hover:border-indigo-400 hover:text-white'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`flex h-5 w-5 items-center justify-center rounded-full border text-[0.65rem] ${
                            todos ? 'border-emerald-100 bg-emerald-500 text-slate-950' : 'border-slate-500 text-slate-400'
                          }`}
                        >
                          {todos ? <GiCheckMark /> : seleccionados || ''}
                        </span>
                        <span className="truncate">{getExpansionName(exp)}</span>
                        <span className="text-[0.65rem] font-normal opacity-80">{seleccionados}/{ids.length}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredEnemyCount === 0 ? (
              <p className="rounded-xl border border-slate-700 bg-slate-950 p-6 text-center text-slate-400">
                {t.noResults || 'No hay resultados con los filtros actuales.'}
              </p>
            ) : (
              visibleEnemyGroups.map(({ color, items }) => {
                const filteredItems = items;
                return (
                  <div key={color.id} className="mb-6">
                    <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-200">
                      <span aria-hidden="true" className="h-3 w-3 rounded-full border border-white/40" style={{ backgroundColor: color.hex || COLOR_SWATCH[color.id] || '#64748b' }} />
                      {t.colors?.[color.id] || color.id}
                      <span className="text-xs font-normal text-slate-400">({filteredItems.length})</span>
                    </h3>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {filteredItems.map((enemy) => {
                        const isSelected = selectedEnemies.includes(enemy.id);
                        return (
                          <li key={enemy.id}>
                            <label
                              className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 transition focus-within:ring-2 focus-within:ring-sky-300 ${
                                isSelected
                                  ? 'border-emerald-400 bg-emerald-950/50 shadow-lg shadow-emerald-950/40'
                                  : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleEnemySelect(enemy.id)}
                                className="sr-only"
                                aria-label={getEnemyName(enemy.id)}
                              />
                              <span className="relative block">
                                {enemy.imagen ? (
                                  <img
                                    src={enemy.imagen}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="h-28 w-full object-cover sm:h-32"
                                  />
                                ) : (
                                  <span className="flex h-28 w-full items-center justify-center bg-slate-800 text-slate-500">—</span>
                                )}
                                <span
                                  aria-hidden="true"
                                  className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-black ${
                                    isSelected
                                      ? 'border-emerald-200 bg-emerald-500 text-slate-950'
                                      : 'border-slate-400 bg-slate-900/80 text-transparent'
                                  }`}
                                >
                                  <GiCheckMark />
                                </span>
                              </span>
                              <span className="flex flex-1 flex-col justify-center gap-0.5 px-2 py-2 text-center">
                                <span className="line-clamp-2 text-sm font-bold text-slate-100">{getEnemyName(enemy.id)}</span>
                                <span className="truncate text-[0.7rem] text-slate-400">{getExpansionName(enemy.expansionId)}</span>
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })
            )}
          </section>
        )}

        {/* Resumen sticky */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-700 bg-slate-950/95 backdrop-blur">
          <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
            <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
              <span><b className="text-emerald-300">{selectedHeroes.length}</b> {t.heroesSelected || 'héroes'}</span>
              <span><b className="text-emerald-300">{rolesAssigned}</b> {t.rolesAssigned || 'roles'}</span>
              <span><b className="text-red-300">{selectedEnemies.length}</b> {t.enemiesSelected || 'enemigos'}</span>
              <span className="hidden sm:inline"><b className="text-sky-300">{selectedBehaviors.length}</b> {t.behaviorsSelected || 'comportamientos'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="min-h-11 flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 font-bold text-slate-100 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:flex-none"
              >
                {t.back || 'Atrás'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmResetOpen(true)}
                className="min-h-11 flex-1 rounded-xl border border-red-700 bg-red-900/60 px-4 py-2 font-bold text-red-100 hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 sm:flex-none"
              >
                {t.reset || 'Restablecer'}
              </button>
              {step !== 'enemies' && (
                <button
                  type="button"
                  onClick={() => goToStep(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)])}
                  className="min-h-11 flex-1 rounded-xl border border-emerald-500 bg-emerald-800 px-4 py-2 font-bold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 sm:flex-none"
                >
                  {t.next || 'Continuar'}
                </button>
              )}
              <button
                type="button"
                onClick={handleConfirm}
                className="min-h-11 flex-1 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 sm:flex-none"
              >
                {t.confirm || 'Iniciar partida'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={confirmResetOpen}
        title={t.resetConfirmTitle || 'Restablecer configuración'}
        description={t.resetConfirm || 'Se borrarán los héroes, roles y enemigos seleccionados y se restaurarán los valores por defecto.'}
        confirmLabel={t.reset || 'Restablecer'}
        cancelLabel={t.cancel || 'Cancelar'}
        onCancel={() => setConfirmResetOpen(false)}
        onConfirm={() => {
          handleReset();
          setConfirmResetOpen(false);
        }}
      />
    </PageTransition>
  );
};

export default TrackerSelect;
