import { useEffect, useId, useMemo, useRef, useState } from 'react';
import useFocusTrap from '@/hooks/useFocusTrap';
import { useLanguage } from '@/context/LanguageContext';
import { HEROES } from '@/data/heroes';
import { ESTADOS_ALTERADOS, INMUNIDADES } from '@/data/estadosAlterados';
import {
  AURAS,
  CONSECUENCIAS,
  ESTADOS_HEROE,
  getHeroEffectName,
  getHeroEffectDescription,
} from '@/data/heroes/index';
import { CUBE_META, MOD_STATS, changeHeroActionCube, changeHeroActionCubeMax, changeHeroCubes, changeHeroVida, changeHeroVidaMax, getEquipmentBonus, getHeroExtras, recobrarCubos, setEquipmentMod, setHeroEquipment, setHeroStat, stepHeroEstadoAlterado, toggleHeroExtra } from '@/utils/heroExtras';
import { formatClock } from '@/utils/turnTimer';

const EQUIPMENT = [
  { key: 'arma', es: 'Arma', en: 'Weapon', mod: true },
  { key: 'manoTorpe', es: 'Mano torpe', en: 'Off hand' },
  { key: 'armadura', es: 'Armadura', en: 'Armor' },
  { key: 'amuleto', es: 'Amuleto', en: 'Amulet', mod: true },
  { key: 'bolsa1', es: 'Objeto de bolsa 1', en: 'Bag item 1' },
  { key: 'bolsa2', es: 'Objeto de bolsa 2', en: 'Bag item 2' },
];

const GROUPS = [
  { key: 'auras', label: { es: 'Auras', en: 'Auras' }, catalogue: AURAS },
  { key: 'consecuencias', label: { es: 'Consecuencias', en: 'Consequences' }, catalogue: CONSECUENCIAS },
  { key: 'estados', label: { es: 'Estados', en: 'Conditions' }, catalogue: ESTADOS_HEROE },
];

const ACTION_CUBES = CUBE_META.filter((cube) => !['trauma', 'maldicion'].includes(cube.key));
const CONDITION_CUBES = CUBE_META.filter((cube) => ['trauma', 'maldicion'].includes(cube.key));


const SOURCE_LABELS = {
  core: 'Adv.',
  desert: 'DH',
  undead_dragon: 'UD',
  shadow_world: 'SW',
  luccanor: 'LU',
};

const STAT_LABELS = {
  movimiento: { es: 'Movimiento', en: 'Movement' },
  ataque: { es: 'Ataque', en: 'Attack' },
  vida: { es: 'Vida', en: 'Life' },
};

export default function ModalHeroCard({ heroId, role, onClose, onChanged }) {
  const { language, translations } = useLanguage();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const titleId = useId();
  const [extras, setExtras] = useState(() => getHeroExtras(heroId));
  const [picker, setPicker] = useState(null);
  const [recobrado, setRecobrado] = useState(false);

  useFocusTrap(dialogRef, true);

  const hero = useMemo(() => HEROES.find((item) => item.id === heroId), [heroId]);
  const heroName = translations.heroes?.[heroId] || heroId;
  const roleName = translations.roles?.[role] || role || '';
  const profession = hero?.profession
    ? (translations.heroes?.profession?.[hero.profession] || hero.profession)
    : '';
  const t = translations.heroes || {};

  useEffect(() => {
    closeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const apply = (next) => {
    setExtras({ ...extras, ...next });
    onChanged?.();
  };

  const movement = (hero?.baseMove ?? 0) + getEquipmentBonus(extras, 'movimiento');
  const attack = getEquipmentBonus(extras, 'ataque');
  const lifeBonus = getEquipmentBonus(extras, 'vida');
  const vidaMaxTotal = extras.vidaMax + lifeBonus;

  // Iconos de estado alterado (quemadura, veneno, escudo…), igual que en enemigos.
  const estadosActivos = (extras.estadosAlterados || []).filter((estado) => estado.count > 0);
  const estadosAlteradosDisponibles = ESTADOS_ALTERADOS.filter((item) => item.mostrar === 'si');
  const countAlterado = (id) => (extras.estadosAlterados || []).find((item) => item.id === id)?.count || 0;
  // Inmunidades: solo si los datos del héroe las definen.
  const inmunidades = Array.isArray(hero?.inmunidad) ? hero.inmunidad : [];

  return (
    <div className="layer-modal fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div
        role="dialog"
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby={titleId}
        className="modal-enter relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border-2 border-rose-900/70 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-rose-700 via-rose-500 to-rose-800" aria-hidden="true" />

        <header className="shrink-0 border-b border-slate-700 bg-slate-900/95 px-3 py-2.5 backdrop-blur">
          <div className="flex items-center gap-3">
            {hero?.image && (
              <img src={hero.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-rose-900" loading="lazy" decoding="async" />
            )}
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="truncate text-lg font-bold text-white">{heroName}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-1 text-[0.65rem]">
                {profession && (
                  <span className="rounded-full bg-rose-800 px-2 py-0.5 font-semibold uppercase tracking-wide text-white">
                    {profession}
                  </span>
                )}
                {roleName && (
                  <span className="rounded-full border border-slate-600 px-2 py-0.5 text-slate-300">{roleName}</span>
                )}
                {/* Vida resumida siempre visible */}
                <span className="rounded-full border border-red-800/70 bg-red-950/60 px-2 py-0.5 font-bold tabular-nums text-red-100">
                  {extras.vida}/{vidaMaxTotal}
                </span>
              </div>
            </div>
            <dl className="flex shrink-0 gap-3 text-center">
              <div>
                <dt className="text-[0.6rem] uppercase text-slate-400">{t.movementShort || 'Mov.'}</dt>
                <dd className="text-base font-bold text-white">{movement}</dd>
              </div>
              <div>
                <dt className="text-[0.6rem] uppercase text-slate-400">{t.attackShort || 'Ata.'}</dt>
                <dd className="text-base font-bold text-white">{attack}</dd>
              </div>
              <div>
                <dt className="text-[0.6rem] uppercase text-slate-400">{t.impactShort || 'Imp.'}</dt>
                <dd className={`text-base font-bold ${extras.impactoMod ? 'text-emerald-300' : 'text-white'}`}>
                  {extras.impactoMod > 0 ? `+${extras.impactoMod}` : extras.impactoMod}
                </dd>
              </div>
            </dl>
          </div>

          {/* Iconos de estado activos: hasta 6, con su contador */}
          {estadosActivos.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1">
              {estadosActivos.slice(0, 6).map((estado) => {
                const meta = ESTADOS_ALTERADOS.find((item) => item.id === estado.id);
                if (!meta) return null;
                return (
                  <span
                    key={estado.id}
                    className="relative flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 bg-slate-950/70"
                    title={`${meta.texto} ×${estado.count}`}
                  >
                    <img src={meta.imagen} alt="" className="h-4 w-4" />
                    <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1 text-[0.5rem] font-bold leading-tight text-white">
                      {estado.count}
                    </span>
                  </span>
                );
              })}
              {estadosActivos.length > 6 && (
                <span className="text-[0.6rem] text-slate-400">+{estadosActivos.length - 6}</span>
              )}
            </div>
          )}
        </header>

        <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-3">
          {/* Estados alterados: iconos sobre la tarjeta, igual que en enemigos */}
          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
              {t.conditions || 'Estados alterados'}
            </p>
            <div className="flex flex-wrap items-stretch justify-center gap-1">
              {estadosAlteradosDisponibles.map((estadoConfig) => {
                const count = countAlterado(estadoConfig.id);
                const maxCount = estadoConfig.max || 1;
                const nombre = translations.estadosAlterados?.[estadoConfig.texto] || estadoConfig.texto;
                return (
                  <div
                    key={estadoConfig.id}
                    className="flex min-w-[2.1rem] max-w-[3.5rem] flex-1 basis-0 flex-col items-center rounded-lg border border-slate-700 bg-slate-800/70 py-0.5"
                    title={`${nombre} ×${count}`}
                  >
                    <button
                      type="button"
                      onClick={() => apply(stepHeroEstadoAlterado(heroId, estadoConfig.id, +1))}
                      disabled={maxCount === 1 && count >= maxCount}
                      aria-label={`${nombre}: +1`}
                      className="flex h-5 w-8 items-center justify-center rounded bg-emerald-700 text-xs font-bold leading-none text-white hover:bg-emerald-600 disabled:opacity-40"
                    >
                      +
                    </button>
                    <img src={estadoConfig.imagen} alt={nombre} className="my-0.5 h-5 w-5" loading="lazy" decoding="async" />
                    <span className="text-[0.6rem] font-bold leading-none text-white">{count}</span>
                    <button
                      type="button"
                      onClick={() => apply(stepHeroEstadoAlterado(heroId, estadoConfig.id, -1))}
                      disabled={count <= 0}
                      aria-label={`${nombre}: −1`}
                      className="mt-0.5 flex h-5 w-8 items-center justify-center rounded state-btn-remove text-xs font-bold leading-none text-white disabled:opacity-40"
                    >
                      −
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Inmunidades: solo si el héroe las declara */}
            {inmunidades.length > 0 && (
              <div className="mt-2 border-t border-slate-700 pt-1.5">
                <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-wide text-slate-400">
                  {t.immunities || 'Inmunidades'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {inmunidades.map((clave) => {
                    const meta = INMUNIDADES.find((item) => item.id === clave);
                    return (
                      <span
                        key={clave}
                        title={translations.condiciones_d?.[clave] || clave}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-800 px-1.5 py-0.5 text-[0.6rem] text-slate-200"
                      >
                        {meta?.imagen && <img src={meta.imagen} alt="" className="h-3.5 w-3.5" loading="lazy" decoding="async" />}
                        {translations.condiciones_t?.[clave] || clave}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Vida: máximo a los lados de la barra, actual en botones ±5 */}
          <section className="rounded-xl border border-red-900/60 bg-red-950/40 p-2" aria-label={t.lifeTitle || 'Vida'}>
            <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-red-200">
              <span>{t.lifeTitle || 'Vida'}</span>
              <span className="tabular-nums text-base text-white">{extras.vida} / {vidaMaxTotal}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => apply(changeHeroVidaMax(heroId, -1))}
                title={t.maxLife || 'Vida máxima'}
                aria-label={`${t.maxLife || 'Vida máxima'}: −1`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-sm font-bold text-white hover:bg-slate-600"
              >
                −
              </button>

              <div className="h-4 flex-1 overflow-hidden rounded-full bg-red-950">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-[width] duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, (extras.vida / Math.max(vidaMaxTotal, 1)) * 100))}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => apply(changeHeroVidaMax(heroId, 1))}
                title={t.maxLife || 'Vida máxima'}
                aria-label={`${t.maxLife || 'Vida máxima'}: +1`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-sm font-bold text-white hover:bg-slate-600"
              >
                +
              </button>
            </div>

            <div className="mt-1.5 grid grid-cols-4 gap-1.5">
              {[-5, -1, 1, 5].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => apply(changeHeroVida(heroId, delta))}
                  className={`min-h-9 rounded-lg border text-sm font-bold transition ${
                    delta < 0
                      ? 'border-red-800 bg-red-900/70 text-red-100 hover:bg-red-800'
                      : 'border-emerald-800 bg-emerald-900/70 text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
            {lifeBonus !== 0 && (
              <p className="mt-1 text-[0.6rem] text-slate-400">
                {t.base || 'Base'} {extras.vidaMax} {lifeBonus > 0 ? '+' : '−'} {Math.abs(lifeBonus)}
              </p>
            )}
          </section>

          {/* Cubos: acción a la izquierda, trauma/maldición a la derecha */}
          <section className="grid grid-cols-1 gap-2 sm:grid-cols-[1.6fr_1fr]">
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
                  {t.actionCubes || 'Cubos de acción'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    apply(recobrarCubos(heroId));
                    setRecobrado(true);
                  }}
                  className="min-h-7 rounded-lg bg-emerald-700 px-2 text-[0.7rem] font-semibold text-white hover:bg-emerald-600"
                >
                  ↺ {t.recover || 'Recobrar'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {ACTION_CUBES.map((cube) => {
                  const value = extras.cubos?.[cube.key] || 0;
                  const max = extras.cubosMax?.[cube.key] ?? 0;
                  return (
                    <div
                      key={cube.key}
                      className="flex flex-col items-center gap-0.5 rounded-lg border border-slate-700 bg-slate-800/70 px-0.5 py-0.5"
                      title={cube.label[language] || cube.label.es}
                    >
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => apply(changeHeroActionCube(heroId, cube.key, -1))}
                          disabled={value <= 0}
                          aria-label={`${cube.label.es}: −1`}
                          className="flex h-8 w-7 items-center justify-center rounded bg-slate-700 text-sm text-white hover:bg-slate-600 disabled:opacity-40"
                        >
                          −
                        </button>
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold"
                          style={{
                            backgroundColor: cube.color,
                            color: cube.key === 'azul' ? '#fff' : '#0f172a',
                          }}
                        >
                          {value}
                        </span>
                        <button
                          type="button"
                          onClick={() => apply(changeHeroActionCube(heroId, cube.key, 1))}
                          disabled={value >= max}
                          aria-label={`${cube.label.es}: +1`}
                          className="flex h-8 w-7 items-center justify-center rounded bg-slate-700 text-sm text-white hover:bg-slate-600 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      {/* Máximo alterable del color */}
                      <div className="flex items-center gap-0.5 text-[0.6rem] text-slate-400">
                        <button
                          type="button"
                          onClick={() => apply(changeHeroActionCubeMax(heroId, cube.key, -1))}
                          disabled={max <= 0}
                          aria-label={`${cube.label.es}: ${t.maxCubes || 'máximo'} −1`}
                          className="flex h-4 w-4 items-center justify-center rounded bg-slate-700 leading-none text-white hover:bg-slate-600 disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="min-w-3 text-center tabular-nums">{max}</span>
                        <button
                          type="button"
                          onClick={() => apply(changeHeroActionCubeMax(heroId, cube.key, 1))}
                          aria-label={`${cube.label.es}: ${t.maxCubes || 'máximo'} +1`}
                          className="flex h-4 w-4 items-center justify-center rounded bg-slate-700 leading-none text-white hover:bg-slate-600"
                        >
                          +
                        </button>
                      </div>

                      <span className="max-w-[4.5rem] truncate text-[0.55rem] uppercase tracking-wide text-slate-400">
                        {(cube.label[language] || cube.label.es).split(' · ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {recobrado && (
                <p className="mt-1.5 rounded-lg border border-amber-700/60 bg-amber-950/40 px-2 py-1 text-[0.65rem] leading-snug text-amber-200">
                  ⚠ {t.cursePenaltyWarning || 'No olvides aplicar la penalización de cubos de maldición que indique el escenario.'}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
              <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
                {t.conditionCubes || 'Estado'}
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {CONDITION_CUBES.map((cube) => {
                  const value = extras[cube.key] || 0;
                  return (
                    <div
                      key={cube.key}
                      className="flex items-center justify-between gap-1 rounded-lg border border-slate-700 bg-slate-800/70 px-1 py-0.5"
                      title={cube.label[language] || cube.label.es}
                    >
                      <span className="min-w-0 truncate text-[0.6rem] uppercase tracking-wide text-slate-300">
                        {(cube.label[language] || cube.label.es).split(' · ')[0]}
                      </span>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => apply(changeHeroCubes(heroId, cube.key, -1))}
                          disabled={value <= 0}
                          aria-label={`${cube.label.es}: −1`}
                          className="flex h-7 w-5 items-center justify-center rounded bg-slate-700 text-sm text-white hover:bg-slate-600 disabled:opacity-40"
                        >
                          −
                        </button>
                        <span
                          aria-hidden="true"
                          className="flex h-7 w-6 items-center justify-center rounded text-xs font-bold"
                          style={{ backgroundColor: cube.color, color: '#fff' }}
                        >
                          {value}
                        </span>
                        <button
                          type="button"
                          onClick={() => apply(changeHeroCubes(heroId, cube.key, 1))}
                          disabled={value >= cube.max}
                          aria-label={`${cube.label.es}: +1`}
                          className="flex h-7 w-5 items-center justify-center rounded bg-slate-700 text-sm text-white hover:bg-slate-600 disabled:opacity-40"
                        >
                          +
                        </button>
                        <span className="w-7 text-right text-[0.55rem] tabular-nums text-slate-500">{value}/{cube.max}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Equipo: arma y amuleto llevan su modificador al lado */}
          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">{t.equipment || 'Equipo'}</p>
              <label className="flex items-center gap-1 text-[0.65rem] text-slate-400">
                <span className="uppercase tracking-wide">{t.impactModifier || 'Mod. al impactar'}</span>
                <input
                  type="number"
                  value={extras.impactoMod ?? 0}
                  onChange={(event) => apply(setHeroStat(heroId, 'impactoMod', event.target.value))}
                  className="h-8 w-14 rounded-lg border border-slate-600 bg-slate-900 px-1 text-center text-xs text-white"
                />
              </label>
            </div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {EQUIPMENT.map(({ key, es, en, mod }) => (
                <div key={key} className="text-[0.65rem] text-slate-400">
                  <span className="mb-0.5 block truncate">{language === 'en' ? en : es}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={extras.equipo?.[key] || ''}
                      onChange={(event) => apply(setHeroEquipment(heroId, key, event.target.value))}
                      maxLength={40}
                      className="min-h-9 min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-900 px-2 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                    />
                    {mod && (
                      <>
                        <input
                          type="number"
                          value={extras.equipoMods?.[key]?.value ?? 0}
                          onChange={(event) => apply(setEquipmentMod(heroId, key, { value: Number(event.target.value) || 0 }))}
                          aria-label={`${es}: ${t.modifier || 'modificador'}`}
                          className="h-9 w-12 shrink-0 rounded-lg border border-slate-600 bg-slate-900 px-1 text-center text-xs text-white"
                        />
                        {/* El arma siempre modifica el ataque; el amuleto puede elegir. */}
                        {key === 'amuleto' ? (
                          <select
                            value={extras.equipoMods?.[key]?.stat || 'movimiento'}
                            onChange={(event) => apply(setEquipmentMod(heroId, key, { stat: event.target.value }))}
                            aria-label={`${es}: ${t.modifierTarget || 'estadística'}`}
                            className="h-9 shrink-0 rounded-lg border border-slate-600 bg-slate-900 px-1 text-[0.65rem] text-white"
                          >
                            {MOD_STATS.map((stat) => (
                              <option key={stat} value={stat}>
                                {(STAT_LABELS[stat][language] || STAT_LABELS[stat].es)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="flex h-9 shrink-0 items-center rounded-lg border border-slate-700 bg-slate-900/60 px-1.5 text-[0.6rem] uppercase text-slate-400">
                            {STAT_LABELS.ataque[language] || STAT_LABELS.ataque.es}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Auras y consecuencias */}
          {GROUPS.map((group) => {
            const added = extras[group.key] || [];
            const available = group.catalogue.filter((item) => !added.includes(item.id));
            return (
              <section key={group.key} className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
                    {group.label[language] || group.label.es}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPicker(picker === group.key ? null : group.key)}
                    className="min-h-7 rounded-lg bg-rose-800 px-2 text-[0.7rem] font-semibold text-white hover:bg-rose-700"
                  >
                    + {t.add || 'Añadir'}
                  </button>
                </div>

                {picker === group.key && (
                  <div className="mb-1.5 max-h-44 space-y-1 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-1">
                    {available.length === 0 && (
                      <p className="px-1 py-1 text-[0.7rem] text-slate-400">{t.allAdded || 'Todas añadidas'}</p>
                    )}
                    {available.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          apply(toggleHeroExtra(heroId, group.key, item.id));
                          setPicker(null);
                        }}
                        className="block w-full rounded px-1.5 py-1 text-left text-[0.7rem] text-slate-200 hover:bg-slate-800"
                      >
                        <span className="flex items-center gap-1">
                          <span className="truncate font-semibold">{getHeroEffectName(item.id, language)}</span>
                          <span className="shrink-0 rounded bg-slate-800 px-1 text-[0.55rem] text-slate-400">
                            {SOURCE_LABELS[item.source?.book] || item.source?.book} {item.source?.page}
                          </span>
                        </span>
                        <span className="block truncate text-[0.65rem] text-slate-400">
                          {getHeroEffectDescription(item.id, language)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {added.length === 0 ? (
                  <p className="px-1 text-[0.7rem] text-slate-400">{t.noneAdded || 'Ninguna añadida.'}</p>
                ) : (
                  <ul className="space-y-1">
                    {added.map((id) => (
                      <li key={id} className="flex items-start gap-1.5 rounded-lg border border-rose-900/60 bg-rose-950/30 px-1.5 py-1">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.7rem] font-semibold text-slate-100">
                            {getHeroEffectName(id, language)}
                          </span>
                          <span className="block text-[0.65rem] leading-snug text-slate-400">
                            {getHeroEffectDescription(id, language)}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => apply(toggleHeroExtra(heroId, group.key, id))}
                          aria-label={`${getHeroEffectName(id, language)}: ${t.remove || 'Quitar'}`}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-700 text-xs text-white hover:bg-red-700"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}

          {/* Tiempo total jugado con este héroe */}
          <section
            className="rounded-xl border border-slate-700 bg-slate-950/60 p-2"
            aria-label={t.totalTime || 'Tiempo total'}
          >
            <div className="flex items-center justify-between">
              <p className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">
                {t.totalTime || 'Tiempo total'}
              </p>
              <p
                data-testid="hero-total-time"
                className={`font-mono text-base font-bold tabular-nums ${
                  (extras.tiempoTotal || 0) >= 300 ? 'text-amber-300' : 'text-white'
                }`}
              >
                {formatClock(extras.tiempoTotal)}
              </p>
            </div>
            <p className="mt-0.5 text-[0.6rem] text-slate-500">
              {t.totalTimeHint || 'Suma de todos sus turnos.'}
            </p>
          </section>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-700 bg-slate-950/70 px-3 py-2">
          <span className="truncate text-[0.7rem] text-slate-400">{t.managementHint || 'Se guarda con la partida'}</span>
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
