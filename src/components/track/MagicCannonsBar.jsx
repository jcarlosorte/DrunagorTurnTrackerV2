import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import cannonNaranja from '@/assets/assets_logo/canon-magico-naranja.png';
import cannonVerde from '@/assets/assets_logo/canon-magico-verde.png';
import cannonRojo from '@/assets/assets_logo/canon_magico.png';
import cannonGris from '@/assets/assets_logo/canon-magico-gris.png';

export const MAGIC_CANNON_IMAGES = {
  naranja: cannonNaranja,
  verde: cannonVerde,
  rojo: cannonRojo,
  gris: cannonGris,
};

export const MAGIC_CANNON_COLORS = ['naranja', 'verde', 'rojo', 'gris'];

export default function MagicCannonsBar() {
  const { magicCannons, toggleMagicCannon } = useGame();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  if (!magicCannons.length) return null;

  return (
    <div className="mb-2 flex flex-wrap items-center gap-2 rounded-xl border border-orange-700/60 bg-orange-950/30 px-2 py-1.5 text-orange-100">
      <span className="text-[0.65rem] font-black uppercase tracking-wide">
        {t.magicCannons || 'Cañones Mágicos'}
      </span>
      {magicCannons.map((cannon) => (
        <button
          key={cannon.id}
          type="button"
          onClick={() => toggleMagicCannon(cannon.id)}
          title={`${t.colores?.[cannon.color] || cannon.color} · ${cannon.loaded ? (t.loaded || 'Cargado') : (t.unloaded || 'Descargado')}`}
          className={`flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[0.65rem] ${
            cannon.loaded
              ? 'border-emerald-400 bg-emerald-950/60 text-emerald-100'
              : 'border-slate-500 bg-slate-950/60 text-slate-300'
          }`}
        >
          <img src={MAGIC_CANNON_IMAGES[cannon.color]} alt="" className="h-6 w-6 rounded-full" />
          {t.colores?.[cannon.color] || cannon.color}
          <span>{cannon.loaded ? '●' : '○'}</span>
        </button>
      ))}
    </div>
  );
}
