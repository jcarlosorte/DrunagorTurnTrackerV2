import { useState } from 'react';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { INMUNIDADES, ESTADOS_ALTERADOS } from '@/data/estadosAlterados';
import { useLanguage } from '@/context/LanguageContext';
import { useInitEnemies } from '@/context/InitEnemiesContext';
import EnemyPortraitBackdrop from './EnemyPortraitBackdrop';
import { applyBossRuneEffect } from '@/utils/bossRunes';
import BossRunesColumn from './BossRunesColumn';

/**
 * Ficha destacada del jefe, encima del tablero.
 *
 * Muestra la carta a tamaño grande, su vida y estadísticas, y late suavemente
 * para que no pase desapercibida.
 */
export default function BossBanner({ enemies = [], getEnemyName, onOpen, labels = {} }) {
  const { translations } = useLanguage();
  const { setPlacedEnemies } = useInitEnemies();
  const [compact, setCompact] = useState(false);
  const immunityLabels = translations.condiciones_d || {};
  const jefes = enemies.filter((entry) => (
    entry?.enemy?.categoria === 'jefe' && entry.enemy.tipo !== 'especial'
  ));
  if (jefes.length === 0) return null;

  return (
    <section
      className={`boss-banner relative mb-2 max-w-full shrink-0 overflow-hidden rounded-2xl border-2 border-red-500/60 bg-gradient-to-b from-red-950/70 via-slate-950 to-slate-950 shadow-xl shadow-red-950/40 ${compact ? 'p-1' : 'p-2'}`}
      aria-label={labels.boss || 'Jefe'}
    >
      <button
        type="button"
        onClick={() => setCompact((prev) => !prev)}
        aria-pressed={compact}
        title={compact ? (labels.expandBoss || 'Expandir jefe') : (labels.compactBoss || 'Compactar jefe')}
        aria-label={compact ? (labels.expandBoss || 'Expandir jefe') : (labels.compactBoss || 'Compactar jefe')}
        className="absolute right-1.5 top-1.5 z-20 flex h-7 items-center gap-1 rounded-lg border border-red-400/50 bg-slate-950/90 px-1.5 text-[0.6rem] font-bold text-red-100 shadow hover:bg-red-900/70"
      >
        {compact ? <FiMaximize2 /> : <FiMinimize2 />}
        <span className="hidden sm:inline">{compact ? (labels.expandBoss || 'Expandir') : (labels.compactBoss || 'Compactar')}</span>
      </button>
      <div className={`flex flex-wrap justify-center gap-3 ${compact ? 'pr-8' : 'pr-20 sm:pr-24'}`}>
        {jefes.map(({ enemy }) => {
          const vida = Math.max(0, Number(enemy.vida) || 0);
          const vidaMax = Math.max(1, Number(enemy.vidaMax) || 1);
          const ratio = Math.max(0, Math.min(1, vida / vidaMax));
          const nombre = getEnemyName?.(enemy.id, enemy.color) || enemy.nombre || enemy.id;
          const isSoulHarvester = enemy.id === 'soul_harvester_boss';
          const activeBossRune = enemy.bossRune || 'gris';
          const visibleStatuses = (enemy.estadosAlterados || []).filter(
            (estado) => (estado.count || 0) > 0,
          );

          if (compact) {
            return (
              <button
                key={enemy.uuid}
                type="button"
                onClick={() => onOpen?.(enemy.uuid)}
                title={nombre}
                aria-label={`${labels.open || 'Abrir'} ${nombre}`}
                className="boss-banner__card flex items-center gap-2 rounded-lg border border-red-400/40 bg-slate-950/70 p-1 text-left transition hover:border-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                <EnemyPortraitBackdrop
                  color={enemy.color}
                  categoria={enemy.categoria}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-red-500/50"
                >
                  {enemy.imagen ? (
                    <img src={enemy.imagen} alt="" className="h-full w-full object-contain object-bottom p-0.5" loading="eager" decoding="async" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-slate-600">☠</span>
                  )}
                </EnemyPortraitBackdrop>
                <span className="flex w-24 flex-col gap-1">
                  <span className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <span
                      className={`block h-full rounded-full ${ratio > 0.5 ? 'bg-emerald-500' : ratio > 0.25 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </span>
                  <span className="font-mono text-[0.65rem] font-bold tabular-nums text-white">{vida}/{vidaMax}</span>
                </span>
              </button>
            );
          }

          return (
            <button
              key={enemy.uuid}
              type="button"
              onClick={() => onOpen?.(enemy.uuid)}
              className="boss-banner__card group flex flex-wrap items-center gap-3 rounded-xl border border-red-400/40 bg-slate-950/70 p-2 text-left transition hover:border-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              aria-label={`${labels.open || 'Abrir'} ${nombre}`}
            >
              <EnemyPortraitBackdrop
                color={enemy.color}
                categoria={enemy.categoria}
                className="boss-banner__portrait relative flex h-24 w-20 shrink-0 items-center justify-center rounded-lg border border-red-500/50 sm:h-32 sm:w-24"
              >
                {enemy.imagen ? (
                  <img
                    src={enemy.imagen}
                    alt=""
                    className="h-full w-full object-contain object-bottom p-1"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-slate-600">☠</span>
                )}
                {visibleStatuses.length > 0 && (
                  <span className="absolute left-1 top-1 flex flex-col gap-0.5">
                    {visibleStatuses.map((estado) => {
                      const config = ESTADOS_ALTERADOS.find((item) => item.id === estado.id);
                      if (!config) return null;
                      return (
                        <span key={estado.id} className="relative block">
                          <img
                            src={config.imagen}
                            alt=""
                            className="h-5 w-5 rounded-full border border-white/80 bg-slate-950/80 shadow"
                            loading="lazy"
                            decoding="async"
                          />
                          {(estado.count > 1 || estado.id === 'ATURDIMIENTO_I') && (
                            <span className="absolute -right-1 -top-1 rounded-full bg-red-700 px-1 text-[0.55rem] font-black leading-3 text-white">
                              {estado.count || 0}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </span>
                )}
              </EnemyPortraitBackdrop>

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
                    {(enemy.inmunidad || []).map((immunityId) => {
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
              </span>

              {isSoulHarvester && (
                <BossRunesColumn
                  selected={activeBossRune}
                  labels={labels}
                  texts={enemy.bossRuneTexts || {}}
                  className="ml-auto"
                  onSelect={(runeId) => setPlacedEnemies((prev) => prev.map((entry) => (
                    entry.enemy.uuid === enemy.uuid
                      ? { ...entry, enemy: applyBossRuneEffect(entry.enemy, runeId) }
                      : entry
                  )))}
                />
              )}
            </button>
          );
        })}
      </div>
      {jefes.some(({ enemy }) => enemy.kingInvulnerable) && (
        <p className="mt-1 rounded-lg border border-amber-500/60 bg-amber-950/70 px-2 py-1 text-center text-[0.65rem] font-bold text-amber-100">
          🛡 {labels.kingInvulnerable || 'El Rey Avivado es inmune a estados y daño.'}
        </p>
      )}
      {jefes.some(({ enemy }) => enemy.kingStateImmune && !enemy.kingInvulnerable) && (
        <p className="mt-1 rounded-lg border border-amber-500/60 bg-amber-950/70 px-2 py-1 text-center text-[0.65rem] font-bold text-amber-100">
          🛡 {labels.kingStateImmune || 'El Rey Avivado es inmune a estados.'}
        </p>
      )}
      {jefes.some(({ enemy }) => enemy.kingCriticalAttacks) && (
        <p className="mt-1 rounded-lg border border-red-500/60 bg-red-950/70 px-2 py-1 text-center text-[0.65rem] font-bold text-red-100">
          ⚔️ {labels.kingCriticalAttacks || 'Todos los Ataques con Arma, Hechizo y Purga son críticos si golpean.'}
        </p>
      )}
    </section>
  );
}
