import { useState } from 'react';
import { GiFootprint, GiBroadsword, GiBowArrow } from 'react-icons/gi';
import { FiInfo, FiTrash2, FiX } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { getEstadoMeta } from '@/data/estadosAlterados';

const normalizeAttackType = (value) => {
  const text = String(value || '').toLowerCase();
  if (text.includes('distancia')) return 'distancia';
  if (text.includes('magia')) return 'magia';
  return 'cuerpo';
};

/**
 * Ficha común de mascotas, compañeros y seguidores.
 *
 * Cabecera con retrato y fondo difuminado, cuatro paneles (movimiento, ataque,
 * firmeza y capacidades), estados alterados debajo y pie con dos botones.
 */
export default function AllyDetailModal({
  dialogRef,
  titleId,
  image,
  background,
  name,
  subtitle,
  roleLabel,
  movement,
  attack,
  attackType,
  life,
  lifeMax,
  lifeTestId,
  onLifeChange,
  abilities = [],
  activeStatuses = [],
  statusPanel,
  onDelete,
  onClose,
}) {
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  const [openAbility, setOpenAbility] = useState(null);

  const type = normalizeAttackType(attackType);
  const AttackIcon = type === 'distancia' ? GiBowArrow : GiBroadsword;
  const attackTitle = type === 'distancia' ? 'Ataque · A distancia' : 'Ataque · Cuerpo a cuerpo';
  const lifePercent = Math.max(0, Math.min(100, (life / Math.max(lifeMax, 1)) * 100));

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border-2 border-emerald-900/60 bg-slate-900 text-slate-100 shadow-2xl"
    >
      <header className="relative h-48 shrink-0 overflow-hidden sm:h-56">
        {background && (
          <img
            src={background}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-sm"
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" aria-hidden="true" />
        {image && (
          <img
            src={image}
            alt={name}
            className="absolute bottom-0 left-1/2 h-[92%] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_6px_16px_rgba(0,0,0,0.8)]"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 p-3">
          {roleLabel && (
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-emerald-300">{roleLabel}</p>
          )}
          <h2 id={titleId} className="truncate text-2xl font-black text-white">{name}</h2>
          {subtitle && <p className="truncate text-xs text-slate-300">{subtitle}</p>}
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {activeStatuses.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-amber-800/60 bg-amber-950/30 px-2 py-1">
            <span className="text-[0.6rem] font-bold uppercase tracking-wide text-amber-200">
              {t.alteredStatesShort || 'Estados'}
            </span>
            {activeStatuses.map((estado) => {
              const meta = getEstadoMeta(estado.id);
              if (!meta) return null;
              return (
                <span key={estado.id} className="relative" title={`${meta.texto} ×${estado.count}`}>
                  <img
                    src={meta.imagen}
                    alt=""
                    className="h-5 w-5 rounded-full border border-white/70 bg-slate-950/60"
                    loading="lazy"
                    decoding="async"
                  />
                  {estado.count > 1 && (
                    <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-0.5 text-[0.4rem] font-bold leading-none text-white">
                      {estado.count}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div
            title="Movimiento"
            aria-label="Movimiento"
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-950/60 p-2 text-center"
          >
            <GiFootprint className="text-xl text-sky-300" aria-hidden="true" />
            <p className="text-xl font-black tabular-nums">{movement ?? '—'}</p>
          </div>

          <div
            title={attackTitle}
            aria-label={attackTitle}
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-950/60 p-2 text-center"
          >
            <AttackIcon className="text-xl text-amber-300" aria-hidden="true" />
            <p className="text-xl font-black tabular-nums">{attack ?? '—'}</p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <p className="text-center text-[0.65rem] font-bold uppercase tracking-wide text-slate-300">
              {t.firmness || 'Firmeza'}
            </p>
            <div className="my-1 h-2 w-full overflow-hidden rounded bg-red-950">
              <div className="h-full rounded bg-red-500" style={{ width: `${lifePercent}%` }} />
            </div>
            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => onLifeChange?.(-1)}
                aria-label="-1"
                className="min-h-8 flex-1 rounded-lg border border-red-800 bg-red-900/70 text-sm font-bold text-red-100 hover:bg-red-800"
              >
                −
              </button>
              <span data-testid={lifeTestId} className="text-sm font-bold tabular-nums">{life} / {lifeMax}</span>
              <button
                type="button"
                onClick={() => onLifeChange?.(1)}
                aria-label="+1"
                className="min-h-8 flex-1 rounded-lg border border-emerald-800 bg-emerald-900/70 text-sm font-bold text-emerald-100 hover:bg-emerald-800"
              >
                +
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-2">
            <p className="text-center text-[0.65rem] font-bold uppercase tracking-wide text-slate-300">
              {t.abilities || 'Capacidades'}
            </p>
            {abilities.length === 0 ? (
              <p className="mt-1 text-center text-xs text-slate-400">—</p>
            ) : (
              <ul className="mt-1 space-y-1">
                {abilities.map((ability) => {
                  const isOpen = openAbility === ability.id;
                  return (
                    <li key={ability.id} className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-1.5 py-1">
                      <div className="flex items-center gap-1">
                        <span className="min-w-0 flex-1 truncate text-[0.6rem] font-semibold text-slate-200">{ability.label}</span>
                        {ability.description && (
                          <button
                            type="button"
                            onClick={() => setOpenAbility(isOpen ? null : ability.id)}
                            aria-label={`${ability.label}: descripción`}
                            aria-expanded={isOpen}
                            className="shrink-0 text-slate-400 hover:text-emerald-300"
                          >
                            <FiInfo className="text-xs" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                      {isOpen && ability.description && (
                        <p className="mt-1 text-[0.6rem] leading-snug text-slate-300">{ability.description}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {statusPanel}
      </div>

      <footer className="flex items-center justify-between border-t border-slate-700 px-4 py-2">
        <button
          type="button"
          onClick={onDelete}
          aria-label="Eliminar"
          title="Eliminar"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-800 bg-red-950/60 text-red-200 hover:bg-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        >
          <FiTrash2 aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close || 'Cerrar'}
          title={t.close || 'Cerrar'}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700 text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          <FiX aria-hidden="true" />
        </button>
      </footer>
    </div>
  );
}
