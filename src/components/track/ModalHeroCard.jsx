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
import {
  MAX_CUBES,
  changeHeroCubes,
  changeHeroVida,
  getHeroExtras,
  setHeroEquipment,
  stepHeroEstado,
  toggleHeroExtra,
} from '@/utils/heroExtras';

const EQUIPMENT = [
  { key: 'arma', es: 'Arma', en: 'Weapon' },
  { key: 'manoTorpe', es: 'Mano torpe', en: 'Off hand' },
  { key: 'armadura', es: 'Armadura', en: 'Armor' },
  { key: 'amuleto', es: 'Amuleto', en: 'Amulet' },
  { key: 'bolsa1', es: 'Objeto de bolsa 1', en: 'Bag item 1' },
  { key: 'bolsa2', es: 'Objeto de bolsa 2', en: 'Bag item 2' },
];

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
  const [extras, setExtras] = useState(() => getHeroExtras(heroId));
  const [picker, setPicker] = useState(null);

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

  const apply = (next) => setExtras({ ...extras, ...next });

  const addEstado = (id) => {
    apply(stepHeroEstado(heroId, id, 1));
    setPicker(null);
  };

  const addSimple = (group, id) => {
    apply(toggleHeroExtra(heroId, group, id));
    setPicker(null);
  };

  const estadosDisponibles = GROUPS[2].catalogue.filter(
    (item) => !extras.estados.some((estado) => estado.id === item.id),
  );
  const estadosConDatos = extras.estados
    .map((estado) => ({
      ...estado,
      meta: ESTADOS_HEROE.find((item) => item.id === estado.id),
    }))
    .filter((estado) => estado.meta);

  return (
    <div className="layer-modal fixed inset-0 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border-2 border-rose-900/70 bg-slate-900 text-slate-100 shadow-2xl"
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
              <span className="rounded-full border border-slate-600 px-2 py-0.5 text-slate-300">
                {t.baseMoveLabel || 'Mov.'} {hero?.baseMove ?? '—'}
              </span>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3">
          {/* Vida */}
          <section className="rounded-xl border border-red-900/60 bg-red-950/40 p-2" aria-label={t.lifeTitle || 'Vida'}>
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-red-200">
              <span>{t.lifeTitle || 'Vida'}</span>
              <span className="tabular-nums text-base text-white">{extras.vida} / {extras.vidaMax}</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-red-950">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-[width] duration-300"
                style={{ width: `${Math.max(0, Math.min(100, (extras.vida / Math.max(extras.vidaMax, 1)) * 100))}%` }}
              />
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {[-5, -1, 1, 5].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => apply(changeHeroVida(heroId, delta))}
                  className={`min-h-10 rounded-lg border text-sm font-bold transition ${
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

          {/* Cubos de Trauma y Maldición */}
          <section className="grid grid-cols-2 gap-2">
            {[
              { key: 'trauma', label: t.traumaCubes || 'Trauma', tone: 'amber' },
              { key: 'maldicion', label: t.curseCubes || 'Maldición', tone: 'violet' },
            ].map(({ key, label, tone }) => (
              <div key={key} className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
                <p className="mb-1 text-center text-[0.7rem] font-semibold uppercase tracking-wide text-slate-300">{label}</p>
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => apply(changeHeroCubes(heroId, key, -1))}
                    disabled={extras[key] <= 0}
                    aria-label={`${label}: −1`}
                    className="flex h-8 w-8 items-center justify-center rounded bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-40"
                  >
                    −
                  </button>
                  <div className="flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: MAX_CUBES }, (_, i) => (
                      <span
                        key={i}
                        className={`h-2.5 w-2.5 rounded-sm ${
                          i < extras[key]
                            ? (tone === 'amber' ? 'bg-amber-400' : 'bg-violet-400')
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => apply(changeHeroCubes(heroId, key, 1))}
                    disabled={extras[key] >= MAX_CUBES}
                    aria-label={`${label}: +1`}
                    className="flex h-8 w-8 items-center justify-center rounded bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <p className="mt-1 text-center text-xs font-bold tabular-nums text-white">{extras[key]}</p>
              </div>
            ))}
          </section>

          {/* Equipo */}
          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">{t.equipment || 'Equipo'}</p>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {EQUIPMENT.map(({ key, es, en }) => (
                <label key={key} className="text-[0.65rem] text-slate-400">
                  <span className="mb-0.5 block truncate">{language === 'en' ? en : es}</span>
                  <input
                    type="text"
                    value={extras.equipo?.[key] || ''}
                    onChange={(event) => apply(setHeroEquipment(heroId, key, event.target.value))}
                    maxLength={40}
                    className="min-h-9 w-full rounded-lg border border-slate-600 bg-slate-900 px-2 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Estados activos: una sola línea */}
          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-300">{t.conditions || 'Estados'}</p>
              <button
                type="button"
                onClick={() => setPicker(picker === 'estados' ? null : 'estados')}
                className="min-h-7 rounded-lg bg-rose-800 px-2 text-[0.7rem] font-semibold text-white hover:bg-rose-700"
              >
                + {t.add || 'Añadir'}
              </button>
            </div>

            {picker === 'estados' && (
              <div className="mb-1.5 max-h-40 space-y-1 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-1">
                {estadosDisponibles.length === 0 && (
                  <p className="px-1 py-1 text-[0.7rem] text-slate-400">{t.allAdded || 'Todos añadidos'}</p>
                )}
                {estadosDisponibles.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addEstado(item.id)}
                    className="block w-full rounded px-1.5 py-1 text-left text-[0.7rem] text-slate-200 hover:bg-slate-800"
                  >
                    {getHeroEffectName(item.id, language) || item.name?.es}
                  </button>
                ))}
              </div>
            )}

            {estadosConDatos.length === 0 ? (
              <p className="px-1 text-[0.7rem] text-slate-400">{t.noConditions || 'Sin estados activos.'}</p>
            ) : (
              <div className="flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-1">
                {estadosConDatos.map((estado) => (
                  <div
                    key={estado.id}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/70 px-1 py-0.5"
                    title={getHeroEffectDescription(estado.id, language)}
                  >
                    <button
                      type="button"
                      onClick={() => apply(stepHeroEstado(heroId, estado.id, -1))}
                      aria-label={`${estado.id}: −1`}
                      className="flex h-7 w-7 items-center justify-center rounded bg-red-800 text-sm text-white hover:bg-red-700"
                    >
                      −
                    </button>
                    <span className="px-0.5 text-[0.65rem] font-semibold text-slate-200">
                      {getHeroEffectName(estado.id, language)}
                    </span>
                    <span className="text-xs font-bold tabular-nums text-white">{estado.count}</span>
                    <button
                      type="button"
                      onClick={() => apply(stepHeroEstado(heroId, estado.id, 1))}
                      aria-label={`${estado.id}: +1`}
                      className="flex h-7 w-7 items-center justify-center rounded bg-emerald-800 text-sm text-white hover:bg-emerald-700"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Auras y consecuencias: solo las añadidas */}
          {[GROUPS[0], GROUPS[1]].map((group) => {
            const added = (extras[group.key] || []);
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
                      <p className="px-1 py-1 text-[0.7rem] text-slate-400">{t.allAdded || 'Todos añadidos'}</p>
                    )}
                    {available.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => addSimple(group.key, item.id)}
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
