import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import canonTerrorifico from '@/assets/assets_logo/canon_terrorifico.png';

export default function TerribleCannonsBar() {
  const { terribleCannons, corruptShipEvent } = useGame();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};
  if (!corruptShipEvent?.active && terribleCannons.every((cannon) => cannon.time === 0)) return null;

  return (
    <div className="mb-2 flex flex-wrap items-center gap-2 rounded-xl border border-red-800/60 bg-red-950/30 p-2 text-red-100">
      <span className="text-[0.65rem] font-black uppercase tracking-wide">
        {t.terribleCannons || 'Cañones Terroríficos'}
      </span>
      {terribleCannons.map((cannon, index) => (
        <span
          key={cannon.id}
          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] ${
            cannon.time > 0
              ? 'border-red-500 bg-red-950/70 text-red-100'
              : 'border-emerald-600 bg-emerald-950/60 text-emerald-100'
          }`}
        >
          <img src={canonTerrorifico} alt="" className="h-6 w-6 rounded-full" />
          {index + 1}
          {cannon.time > 0 ? ` · ${t.damaged || 'Dañado'} ${cannon.time}` : ` · ${t.available || 'Disponible'}`}
        </span>
      ))}
    </div>
  );
}
