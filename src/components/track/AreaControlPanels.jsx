import { GiRuneStone, GiWoodenSign } from 'react-icons/gi';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { OTROS } from '@/data/estadosAlterados';

const COLOR_CHIP = {
  rojo: 'bg-red-800 text-red-50',
  azul: 'bg-blue-800 text-blue-50',
  verde: 'bg-emerald-800 text-emerald-50',
  naranja: 'bg-orange-800 text-orange-50',
  gris: 'bg-slate-700 text-slate-100',
};

/** Paneles compactos de control de áreas, visibles bajo la bolsa de runas. */
export default function AreaControlPanels() {
  const { translations } = useLanguage();
  const t = translations?.trackerInit || {};
  const {
    controlPoints,
    removeControlPoint,
    spawnPoints,
    removeSpawnPoint,
    runeKeys,
    removeRuneKey,
    rescue,
    removeRescue,
  } = useGame();

  const sections = [
    {
      id: 'barricadas',
      title: t.activeBarricade || 'Barricadas activas',
      items: controlPoints,
      onRemove: removeControlPoint,
    },
    {
      id: 'spawn',
      title: t.activeSpawnPoints || 'Puntos de aparición activos',
      items: spawnPoints,
      onRemove: removeSpawnPoint,
    },
    {
      id: 'rune-keys',
      title: t.activeRuneKeys || 'Llaves rúnicas activas',
      items: runeKeys,
      onRemove: removeRuneKey,
    },
    {
      id: 'rescue',
      title: t.activeRescue || 'Rescate de aldeanos activo',
      items: rescue,
      onRemove: removeRescue,
    },
  ].filter((section) => section.items?.length > 0);

  if (sections.length === 0) return null;

  return (
    <div data-testid="area-control-panels" className="flex flex-col gap-2">
      {sections.map((section) => (
        <section key={section.id} className="track-surface-raised p-2 shadow-md">
          <div className="mb-1.5 flex items-center gap-1.5">
            {section.id === 'barricadas' ? (
              <GiWoodenSign className="text-cyan-300" aria-hidden="true" />
            ) : (
              <GiRuneStone className="text-cyan-300" aria-hidden="true" />
            )}
            <h3 className="min-w-0 flex-1 truncate text-[0.7rem] font-bold text-yellow-200">
              {section.title}
            </h3>
            <span className="rounded-full bg-slate-900 px-1.5 text-[0.65rem] font-bold text-slate-200">
              {section.items.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {section.items.map((point) => {
              const isEvent = point.runa === 'evento';
              const eventImage = isEvent ? OTROS.find((entry) => entry.id === 'evento')?.imagen : null;
              return (
                <span
                  key={point.uuid}
                  className={`inline-flex min-h-6 items-center gap-1 rounded px-1.5 text-[0.65rem] font-semibold ${
                    COLOR_CHIP[point.runa] || 'bg-slate-700 text-slate-100'
                  }`}
                >
                  {eventImage && <img src={eventImage} alt="" className="h-4 w-4 object-contain" loading="lazy" decoding="async" />}
                  <span>{isEvent ? (t.PAevento || t.evento || 'Evento') : (t.colores?.[point.runa] || point.runa)}</span>
                  <button
                    type="button"
                    onClick={() => section.onRemove(point.uuid)}
                    aria-label={`${t.remove || 'Quitar'} ${t.colores?.[point.runa] || point.runa}`}
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-black/30 text-[0.6rem] text-white hover:bg-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
