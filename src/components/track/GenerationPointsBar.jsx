import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import genNaranja from '@/assets/assets_logo/generacion-naranja.png';
import genVerde from '@/assets/assets_logo/generacion-verde.png';
import genAzul from '@/assets/assets_logo/generacion-azul.png';
import genRojo from '@/assets/assets_logo/generacion.png';
import genGris from '@/assets/assets_logo/generacion-gris.png';

export const GENERATION_IMAGES = {
  naranja: genNaranja,
  verde: genVerde,
  azul: genAzul,
  rojo: genRojo,
  gris: genGris,
};

export const GENERATION_COLORS = ['naranja', 'verde', 'azul', 'rojo', 'gris'];

export default function GenerationPointsBar() {
  const { generationPoints, removeGenerationPoint } = useGame();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  if (!generationPoints.length) return null;

  return (
    <div className="mb-2 rounded-xl border border-cyan-700/60 bg-cyan-950/30 px-2 py-1.5 text-cyan-100">
      <span className="block text-[0.65rem] font-black uppercase tracking-wide">
        {t.generationPoints || 'Fichas de Generación'}
      </span>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {generationPoints.map((point) => (
          <button
            key={point.id}
            type="button"
            onClick={() => removeGenerationPoint(point.id)}
            title={`${t.remove || 'Quitar'} ${t.colores?.[point.color] || point.color}`}
            aria-label={`${t.remove || 'Quitar'} ${t.colores?.[point.color] || point.color}`}
            className="flex items-center gap-1 rounded-full border border-cyan-700/60 bg-slate-950/60 p-1 text-[0.65rem] text-cyan-100 hover:border-red-400"
          >
            <img src={GENERATION_IMAGES[point.color]} alt="" className="h-6 w-6 rounded-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
