import cardTemplate from '@/assets/enemies/Template_Card_Monster.webp';
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
        backgroundImage: subtle
          ? `linear-gradient(180deg, ${tone}55 0%, #020617 82%)`
          : [
            `radial-gradient(ellipse at 50% 18%, ${tone}${isBoss ? 'cc' : '99'} 0%, ${tone}55 38%, transparent 72%)`,
            `linear-gradient(180deg, ${tone}44 0%, #020617 72%)`,
          ].join(', '),
      }}
    >
      <div
        className={`pointer-events-none absolute -inset-8 blur-2xl ${subtle ? 'opacity-15' : 'opacity-60'}`}
        style={{ background: `radial-gradient(circle at 50% 28%, ${tone}88 0%, transparent 65%)` }}
        aria-hidden="true"
      />
      {!subtle && (
        <img
          src={cardTemplate}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.22] mix-blend-screen"
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
