import { GiAura, GiHealthDecrease, GiScrollUnfurled } from 'react-icons/gi';
import FitText from '@/components/track/FitText';
import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';
import { getAura } from '@/data/heroes/index';
import { getHeroClass } from '@/data/heroClasses';
import HeroPortrait from '@/components/HeroPortrait';

/**
 * Carta de héroe dentro del track.
 *
 * Muestra la barra de vida y los iconos de estado cuando la gestión de héroes
 * está activa; en ese caso la carta además abre la vista ampliada.
 */
export default function CharacterCard({
  name,
  image,
  prof,
  heroId,
  onOpen,
  clickable = false,
  extras = null,
  estadosLabels = {},
  campaign = 'core',
  sharedConsequencesCount = 0,
  statusLabels = {},
}) {
  const estadosAlterados = extras?.estadosAlterados || [];
  const condiciones = extras?.estados || [];
  const tieneAlterados = estadosAlterados.length > 0;
  const classColor = getHeroClass(heroId)?.color || '#800020';
  const aura = getAura((extras?.auras || [])[0]);
  const auraCount = aura && aura.campaign === campaign ? 1 : 0;
  const consequencesCount = Math.max(0, Number(sharedConsequencesCount) || 0);
  const statesCount = condiciones.length;
  const badges = [
    {
      id: 'aura',
      count: auraCount,
      label: statusLabels.campAura || 'Aura',
      icon: GiAura,
      className: 'border-amber-300/80 bg-amber-950/90 text-amber-100',
    },
    {
      id: 'consequences',
      count: consequencesCount,
      label: statusLabels.campConsequences || 'Consecuencias',
      icon: GiScrollUnfurled,
      className: 'border-rose-300/80 bg-rose-950/90 text-rose-100',
    },
    {
      id: 'states',
      count: statesCount,
      label: statusLabels.campConditions || 'Estados',
      icon: GiHealthDecrease,
      className: 'border-sky-300/80 bg-sky-950/90 text-sky-100',
    },
  ].filter((badge) => badge.count > 0);

  return (
    <div className="flex flex-col items-center mx-1">
      <div
        className={`relative w-full max-w-[140px] hover:scale-105 ${clickable ? 'cursor-pointer' : ''}`}
        onClick={clickable ? onOpen : undefined}
        onKeyDown={clickable ? (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen?.();
          }
        } : undefined}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        aria-label={clickable ? `${name} · ${prof}` : undefined}
        data-hero-id={heroId}
      >
        <HeroPortrait
          heroId={heroId}
          fallback={image}
          alt={name}
          className="aspect-[3/4] w-full rounded-lg border-2"
          style={{ borderColor: classColor }}
        />

        {/* Avisos flotantes: aura, consecuencias compartidas y estados. */}
        {clickable && extras && badges.length > 0 && (
          <div
            className="absolute right-0.5 top-1/2 z-20 flex -translate-y-1/2 flex-col items-end gap-0.5"
            data-testid="hero-status-badges"
          >
            {badges.map((badge) => {
              const Icon = badge.icon;
              const text = `${badge.label}: ${badge.count}`;
              return (
                <span
                  key={badge.id}
                  data-testid={`hero-status-${badge.id}`}
                  title={text}
                  aria-label={text}
                  className={`inline-flex h-[1.15rem] min-w-[1.15rem] items-center justify-center gap-0.5 rounded-full border px-1 text-[0.5rem] font-bold leading-none shadow-md backdrop-blur-sm ${badge.className}`}
                >
                  <Icon className="text-[0.65rem]" aria-hidden="true" />
                  <span>{badge.count}</span>
                </span>
              );
            })}
          </div>
        )}

        {/* Estados alterados del héroe sobre la imagen (iconos, como en enemigos) */}
        {clickable && tieneAlterados && (
          <div className="absolute left-0.5 top-0.5 grid grid-rows-3 grid-flow-col gap-0.5">
            {estadosAlterados.slice(0, 5).map((estado) => {
              const meta = ESTADOS_ALTERADOS.find((item) => item.id === estado.id);
              if (!meta) return null;
              return (
                <span key={estado.id} className="relative" title={`${estadosLabels[meta.texto] || meta.texto} ×${estado.count}`}>
                  <img
                    src={meta.imagen}
                    alt=""
                    className="h-4 w-4 rounded-full border border-white/80 bg-slate-950/60"
                    loading="lazy"
                    decoding="async"
                  />
                  {estado.count > 1 && (
                    <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-0.5 text-[0.45rem] font-bold leading-none text-white">
                      {estado.count}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        )}

        <div
          className="absolute bottom-0 left-1/2 w-[94%] -translate-x-1/2 rounded-lg px-1 text-center text-white leading-tight"
          style={{ backgroundColor: classColor, textShadow: '0 0 4px #b87333aa' }}
          data-hero-band
        >
          <FitText text={name} max={12} min={6.5} className="w-full text-center font-semibold" />
          <span className="block text-[0.50rem] italic opacity-90 mb-1">{prof}</span>

          {/* Vida del héroe, como en las cartas de enemigo */}
          {clickable && extras && (
            <span className="relative mb-0.5 mt-0.5 block h-1.5 w-full">
              <span className="absolute inset-0 z-10 flex items-center justify-center text-[0.5rem] font-bold leading-none text-white">
                {extras.vida}/{extras.vidaMax}
              </span>
              <span className="block h-full w-full rounded bg-red-900">
                <span
                  className={`block h-full rounded ${extras.vida > extras.vidaMax ? 'bg-amber-400' : 'bg-red-500'}`}
                  style={{ width: `${Math.max(0, Math.min(100, (extras.vida / Math.max(extras.vidaMax, 1)) * 100))}%` }}
                />
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
