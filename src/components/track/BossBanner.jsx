import { INMUNIDADES } from '@/data/estadosAlterados';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Ficha destacada del jefe, encima del tablero.
 *
 * Muestra la carta a tamaño grande, su vida y estadísticas, y late suavemente
 * para que no pase desapercibida.
 */
export default function BossBanner({ enemies = [], getEnemyName, onOpen, labels = {} }) {
  const { translations } = useLanguage();
  const immunityLabels = translations.condiciones_d || {};
  const jefes = enemies.filter((entry) => (
    entry?.enemy?.categoria === 'jefe' && entry.enemy.tipo !== 'especial'
  ));
  if (jefes.length === 0) return null;

  return (
    <section
      className="boss-banner mb-2 shrink-0 rounded-2xl border-2 border-red-500/60 bg-gradient-to-b from-red-950/70 via-slate-950 to-slate-950 p-2 shadow-xl shadow-red-950/40"
      aria-label={labels.boss || 'Jefe'}
    >
      <div className="flex flex-wrap justify-center gap-3">
        {jefes.map(({ enemy }) => {
          const vida = Math.max(0, Number(enemy.vida) || 0);
          const vidaMax = Math.max(1, Number(enemy.vidaMax) || 1);
          const ratio = Math.max(0, Math.min(1, vida / vidaMax));
          const nombre = getEnemyName?.(enemy.id, enemy.color) || enemy.nombre || enemy.id;

          return (
            <button
              key={enemy.uuid}
              type="button"
              onClick={() => onOpen?.(enemy.uuid)}
              className="boss-banner__card group flex items-center gap-3 rounded-xl border border-red-400/40 bg-slate-950/70 p-2 text-left transition hover:border-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              aria-label={`${labels.open || 'Abrir'} ${nombre}`}
            >
              <span className="boss-banner__portrait relative block h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-red-500/50 bg-slate-900 sm:h-32 sm:w-32">
                {enemy.imagen ? (
                  <img
                    src={enemy.imagen}
                    alt=""
                    className="h-full w-full object-cover object-top"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-slate-600">☠</span>
                )}
              </span>

              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-[0.6rem] font-black uppercase tracking-[0.25em] text-red-300">
                  {labels.boss || 'Jefe'}
                </span>
                <span className="truncate text-lg font-black text-white sm:text-2xl">{nombre}</span>

                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-32 overflow-hidden rounded-full bg-slate-800 sm:w-48">
                    <span
                      className={`block h-full rounded-full transition-all ${ratio > 0.5 ? 'bg-emerald-500' : ratio > 0.25 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </span>
                  <span className="font-mono text-xs font-bold tabular-nums text-white sm:text-sm">
                    {vida}/{vidaMax}
                  </span>
                </span>

                {(enemy.inmunidad || []).length > 0 && (
                  <span className="flex flex-wrap items-center gap-1">
                    {(enemy.inmunidad || []).slice(0, 8).map((immunityId) => {
                      const config = INMUNIDADES.find((item) => item.id === immunityId);
                      if (!config) return null;
                      const text = immunityLabels[immunityId] || immunityId;
                      return (
                        <img
                          key={immunityId}
                          src={config.imagen}
                          alt={text}
                          title={text}
                          className="h-5 w-5 rounded-full border border-white/80 shadow sm:h-6 sm:w-6"
                          loading="lazy"
                          decoding="async"
                        />
                      );
                    })}
                  </span>
                )}
                {(enemy.estadosAlterados || []).filter((estado) => (estado?.count || 0) > 0).length > 0 && (
                  <span className="flex flex-wrap gap-1 text-[0.65rem] font-semibold text-slate-300">
                    {(enemy.estadosAlterados || [])
                      .filter((estado) => (estado?.count || 0) > 0)
                      .slice(0, 4)
                      .map((estado) => (
                        <span key={estado.id} className="rounded bg-red-900/70 px-1.5 py-0.5 text-red-100">
                          {estado.id.replace(/_[IV]+$/, '')} ×{estado.count}
                        </span>
                      ))}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
