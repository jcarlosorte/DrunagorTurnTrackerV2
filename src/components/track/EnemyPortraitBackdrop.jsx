import cardTemplate from '@/assets/enemies/Template_Card_Monster.webp';
import trackBackground from '@/assets/backgrounds/track.avif';
import { getEnemyTone } from './enemyVisuals';

const CATEGORY_LABELS = {
  jefe: 'JEFE',
  overlord: 'OVERLORD',
  comandante: 'COMANDANTE',
  esbirro: 'ESBIRRO',
  escenario: 'ESCENARIO',
};

/**
 * Fondo común de las cartas de enemigo: plantilla de calavera, color del tipo
 * y un halo difuminado. La imagen del enemigo se coloca encima con `children`.
 */
export default function EnemyPortraitBackdrop({ color, categoria, className = '', subtle = false, children }) {
  const tone = getEnemyTone(color, categoria);
  const isBoss = categoria === 'jefe';
  const isOverlord = categoria === 'overlord';
  const isCommander = categoria === 'comandante';
  const isMinion = categoria === 'esbirro';
  const isScenario = categoria === 'escenario';

  return (
    <div
      className={`relative overflow-hidden bg-slate-950 ${className}`}
      style={{
        backgroundColor: '#020617',
        backgroundImage: isBoss
          ? `linear-gradient(155deg, ${tone}dd 0%, ${tone}66 42%, rgba(2, 6, 23, 0.88) 100%), url(${trackBackground})`
          : subtle
            ? `linear-gradient(180deg, ${tone} 0%, ${tone}dd 70%, #020617 100%)`
            : [
              `radial-gradient(ellipse at 50% 18%, ${tone} 0%, ${tone}aa 45%, transparent 78%)`,
              `linear-gradient(180deg, ${tone} 0%, ${tone}55 58%, #020617 100%)`,
            ].join(', '),
        backgroundSize: isBoss ? 'cover' : undefined,
        backgroundPosition: isBoss ? 'center' : undefined,
        backgroundRepeat: isBoss ? 'no-repeat' : undefined,
      }}
    >
      <div
        className={`pointer-events-none absolute -inset-8 blur-2xl ${subtle ? 'opacity-15' : 'opacity-60'}`}
        style={{ background: `radial-gradient(circle at 50% 28%, ${tone}88 0%, transparent 65%)` }}
        aria-hidden="true"
      />
      {!isBoss && !subtle && (
        <img
          src={cardTemplate}
          alt=""
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.45] ${
            color === 'negro' ? 'invert mix-blend-screen' : 'mix-blend-multiply'
          }`}
          aria-hidden="true"
        />
      )}
      {!subtle && (
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background: `linear-gradient(145deg, ${tone}33 0%, transparent 45%, ${tone}22 100%)`,
          }}
          aria-hidden="true"
        />
      )}
      {(isBoss || isOverlord || isCommander || isMinion || isScenario) && (
        <span className="pointer-events-none absolute right-1 top-1 z-10 rounded bg-slate-950/70 px-1 py-0.5 text-[0.45rem] font-black uppercase tracking-wider text-white/85">
          {CATEGORY_LABELS[categoria] || categoria}
        </span>
      )}
      {children}
    </div>
  );
}
