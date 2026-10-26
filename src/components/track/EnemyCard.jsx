import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ESTADOS_ALTERADOS, INMUNIDADES } from '@/data/estadosAlterados';
import { ENEMY_RING_COLORS } from '@/data/enemyRings';
import { ENEMY_RING_COLORS_BIG } from '@/data/enemyRingsBig';
import { useLanguage } from '@/context/LanguageContext';
import { borderColorMap, categoryTextGlowMap, textBgColorMap } from './enemyVisuals';

// Subcomponente propio para poder usar estado sin llamar a hooks dentro de un map.
function EstadoBadge({ estado, isBoss, label }) {
  const [hover, setHover] = useState(false);
  const config = ESTADOS_ALTERADOS.find((item) => item.id === estado.id);
  if (!config) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
      aria-label={`${label || config.texto}${estado.count > 1 ? ` x${estado.count}` : ''}`}
    >
      <img
        src={config.imagen}
        alt=""
        className={`${isBoss ? 'h-8 w-8' : 'h-5 w-5'} rounded-full border border-white shadow-md`}
      />
      {estado.count > 1 && (
        <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1 text-[0.6rem] font-bold text-white">
          {estado.count}
        </span>
      )}
      {hover && (
        <div className="absolute left-1/2 top-full z-30 mt-1 w-max max-w-[200px] -translate-x-1/2 whitespace-normal break-words rounded bg-black px-2 py-1 text-[0.65rem] text-white">
          <strong>{label || config.texto}</strong>
        </div>
      )}
    </div>
  );
}

function ImmunityBadge({ immunityId, isBoss, label }) {
  const [hover, setHover] = useState(false);
  const config = INMUNIDADES.find((item) => item.id === immunityId);
  if (!config) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
      aria-label={label || immunityId}
    >
      <img
        src={config.imagen}
        alt=""
        className={`${isBoss ? 'h-8 w-8' : 'h-5 w-5'} rounded-full border border-white shadow-md`}
      />
      {hover && (
        <div className="absolute left-1/2 top-full z-30 mt-1 w-max max-w-[200px] -translate-x-1/2 whitespace-normal break-words rounded bg-black px-2 py-1 text-[0.65rem] text-white">
          <strong>{label || immunityId}</strong>
        </div>
      )}
    </div>
  );
}

export default function EnemyCard({
  uuid,
  name,
  comportamiento,
  categoria,
  image,
  color,
  vida,
  vidaMax,
  openEnemyModal,
  ringColor,
  isFlipping,
  estadosAlterados = [],
  inmunidad = [],
}) {
  const [flipped, setFlipped] = useState(false);
  const { translations } = useLanguage();
  const conditions = translations.condiciones_t || {};
  const immunityLabels = translations.condiciones_d || {};
  const behaviors = translations.trackerSelect?.comportamientos || {};

  const isBoss = categoria === 'jefe';
  const ringClass = ENEMY_RING_COLORS.find((ring) => ring.id === ringColor)?.className
    || ENEMY_RING_COLORS_BIG.find((ring) => ring.id === ringColor)?.className
    || '';

  useEffect(() => {
    if (!isFlipping) return undefined;
    setFlipped(true);
    const timer = setTimeout(() => setFlipped(false), 1100);
    return () => clearTimeout(timer);
  }, [isFlipping]);

  return (
    <div
      key={uuid}
      className={classNames(
        'relative mx-1 flex transform-style-preserve-3d flex-col items-center transition-transform duration-1000',
        flipped ? 'rotate-y-180' : '',
      )}
      style={{ perspective: '1000px' }}
    >
      <div
        className={classNames(
          'relative w-full rounded-lg shadow-[0_6px_12px_rgba(0,0,0,0.5)] transition-transform hover:scale-110',
          !isBoss && ringClass,
          isBoss ? 'max-h-[250px]' : 'max-w-[140px]',
        )}
        style={isBoss ? { width: '20%' } : {}}
      >
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          className={classNames(
            'h-full w-full rounded-lg object-cover',
            isBoss ? 'max-h-[250px] object-top' : `border-2 ${borderColorMap[color] || ''}`,
          )}
        />

        {/* Estados alterados */}
        <div className={`absolute left-1 top-1 grid ${isBoss ? 'grid-rows-5' : 'grid-rows-3'} grid-flow-col gap-1`}>
          {estadosAlterados
            .filter((estado) => estado.count > 0)
            .map((estado) => (
              <EstadoBadge
                key={estado.id}
                estado={estado}
                isBoss={isBoss}
                label={conditions[estado.id]}
              />
            ))}
        </div>

        {/* Inmunidades */}
        <div className={`absolute right-1 top-1 grid ${isBoss ? 'grid-rows-5' : 'grid-rows-3'} grid-flow-col gap-1`}>
          {inmunidad.map((immunityId) => (
            <ImmunityBadge
              key={immunityId}
              immunityId={immunityId}
              isBoss={isBoss}
              label={immunityLabels[immunityId]}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => openEnemyModal(uuid)}
          aria-label={name}
          className={`enemy-text-wrapper absolute bottom-0 left-1/2 -translate-x-1/2 cursor-pointer rounded-lg border-2 px-1 py-0.5 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
            borderColorMap[color] || ''
          } ${textBgColorMap[color] || 'bg-black/60'} ${categoryTextGlowMap[categoria] || ''}`}
        >
          <span className="flex w-full flex-col items-center leading-none">
            <span className="enemy-text leading-none">{name}</span>
            {!isBoss && comportamiento && (
              <span className="mt-0.5 text-[0.5rem] italic leading-none opacity-90">
                {behaviors[comportamiento] || comportamiento}
              </span>
            )}
            <span className="relative mt-2 h-2 w-full">
              <span className="absolute inset-0 z-10 flex items-center justify-center text-[0.6rem] font-bold text-white">
                {vida} / {vidaMax}
              </span>
              <span className="block h-full w-full rounded bg-red-900">
                <span
                  className="block h-full rounded bg-red-500"
                  style={{ width: `${Math.max(0, Math.min(100, (vida / vidaMax) * 100))}%` }}
                />
              </span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
