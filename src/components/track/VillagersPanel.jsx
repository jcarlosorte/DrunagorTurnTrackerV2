import { GiPerson } from 'react-icons/gi';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';

const COLORS = {
  beige: 'border-[#c9b892] bg-[#d9cba8] text-slate-900',
  azul: 'border-sky-300 bg-sky-700 text-sky-50',
  naranja: 'border-orange-300 bg-orange-700 text-orange-50',
  verde: 'border-emerald-300 bg-emerald-700 text-emerald-50',
  rojo: 'border-red-300 bg-red-700 text-red-50',
  gris: 'border-slate-300 bg-slate-600 text-slate-50',
};

const LABELS = {
  beige: 'Beige',
  azul: 'Azul',
  naranja: 'Naranja',
  verde: 'Verde',
  rojo: 'Rojo',
  gris: 'Gris',
};

export default function VillagersPanel() {
  const { translations } = useLanguage();
  const t = translations?.trackerInit || {};
  const {
    aldeanos,
    aldeanosRescatados,
    setAldeanoVida,
    removeAldeano,
    rescueAldeano,
  } = useGame();

  if (!aldeanos?.length && !aldeanosRescatados) return null;
  const completed = aldeanosRescatados >= 3;

  return (
    <section data-testid="villagers-panel" className="track-surface-raised p-2 shadow-md">
      <div className="mb-2 flex items-center gap-1.5">
        <GiPerson className="shrink-0 text-amber-200" aria-hidden="true" />
        <h3 className="min-w-0 flex-1 truncate text-xs font-bold text-amber-100">
          {t.villagersTitle || 'Aldeanos en apuros'}
        </h3>
        <span className="rounded-full bg-slate-950 px-1.5 py-0.5 text-[0.65rem] font-bold text-amber-100">
          {t.villagersRescued || 'Rescatados'} {aldeanosRescatados}/3
        </span>
      </div>

      {completed && (
        <p role="alert" className="mb-2 rounded-lg border border-emerald-500/70 bg-emerald-950/70 px-2 py-1.5 text-[0.7rem] font-bold text-emerald-100">
          🏆 {t.villagersEnd || 'Fin de la aventura: Un nuevo amanecer'}
        </p>
      )}

      <div className="space-y-2">
        {aldeanos.map((aldeano) => {
          const name = translations.defensaCard?.cartas_aldeano?.nombre?.[aldeano.cardId] || aldeano.cardId;
          const colorClass = COLORS[aldeano.color] || COLORS.gris;
          return (
            <div key={aldeano.uuid} className={`rounded-lg border p-2 ${colorClass}`}>
              <div className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/20" aria-hidden="true">
                  <GiPerson className="text-sm" />
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-bold">{name}</span>
                <span className="text-[0.6rem] font-semibold opacity-80">{LABELS[aldeano.color] || aldeano.color}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="text-[0.65rem] font-bold">{t.villagersLife || 'Firmeza'}</span>
                <div className="flex flex-1 gap-0.5" aria-label={`${t.villagersLife || 'Firmeza'} ${aldeano.vida}/${aldeano.vidaMax}`}>
                  {Array.from({ length: aldeano.vidaMax || 4 }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-2 flex-1 rounded-sm ${index < aldeano.vida ? 'bg-emerald-300' : 'bg-black/25'}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setAldeanoVida(aldeano.uuid, aldeano.vida - 1)}
                  disabled={aldeano.vida <= 0}
                  aria-label={`${name}: -1 ${t.villagersLife || 'Firmeza'}`}
                  className="flex h-5 w-5 items-center justify-center rounded bg-black/25 text-xs font-bold text-white disabled:opacity-40"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setAldeanoVida(aldeano.uuid, aldeano.vida + 1)}
                  disabled={aldeano.vida >= aldeano.vidaMax}
                  aria-label={`${name}: +1 ${t.villagersLife || 'Firmeza'}`}
                  className="flex h-5 w-5 items-center justify-center rounded bg-black/25 text-xs font-bold text-white disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <div className="mt-1.5 flex gap-1">
                <button
                  type="button"
                  onClick={() => removeAldeano(aldeano.uuid)}
                  className="min-h-7 flex-1 rounded-md border border-black/20 bg-black/30 px-1.5 text-[0.65rem] font-bold text-white hover:bg-black/45"
                >
                  💀 {t.villagersDeath || 'Muerte'}
                </button>
                <button
                  type="button"
                  onClick={() => rescueAldeano(aldeano.uuid)}
                  className="min-h-7 flex-1 rounded-md border border-emerald-900/50 bg-emerald-600 px-1.5 text-[0.65rem] font-bold text-white hover:bg-emerald-500"
                >
                  🏠 {t.villagersRescue || 'Rescatar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
