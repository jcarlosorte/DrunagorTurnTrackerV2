import { getHeroClass } from '@/data/heroClasses';
import { getHeroPortrait } from '@/data/heroPortraits';

/**
 * Retrato de héroe en tres capas: gradiente del color de clase, icono de la
 * clase como marca de agua y el recorte sin fondo del héroe encima.
 */
export default function HeroPortrait({ heroId, fallback, className = '', imgClassName = '', alt = '', style, ...rest }) {
  const classInfo = getHeroClass(heroId);
  const color = classInfo?.color || '#5e1f2a';
  const portrait = getHeroPortrait(heroId);
  const source = portrait || fallback;

  return (
    <div
      data-hero-portrait
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: '#0f172a',
        backgroundImage: `linear-gradient(160deg, ${color}cc 0%, ${color}66 55%, #0f172a 100%)`,
        ...style,
      }}
      {...rest}
    >
      {classInfo?.icon && (
        <img
          src={classInfo.icon}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-30 mix-blend-soft-light"
        />
      )}
      {source && (
        <img
          src={source}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`relative h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)] ${imgClassName}`}
        />
      )}
    </div>
  );
}
