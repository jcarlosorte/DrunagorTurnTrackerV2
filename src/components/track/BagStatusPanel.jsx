import { GiSwapBag } from 'react-icons/gi';

const RUNE_COLORS = [
  { id: 'naranja', color: '#ff8c00' },
  { id: 'verde', color: '#00aa00' },
  { id: 'azul', color: '#0077cc' },
  { id: 'rojo', color: '#cc0000' },
  { id: 'gris', color: '#999999' },
];

export default function BagStatusPanel({ usedTiles = [], availableTiles = [], labels = {}, colors = {} }) {
  return (
    <section className="track-surface mt-3 p-3 shadow-md" aria-label={labels.title || 'Estado de la bolsa de runas'}>
      <div className="mb-3 flex items-center justify-center gap-2">
        <GiSwapBag className="text-xl text-yellow-300" aria-hidden="true" />
        <h2 className="font-semibold text-white">{labels.title || 'Estado de la Bolsa de Runas'}</h2>
      </div>

      <div className="mb-2 flex justify-center gap-6 text-sm text-slate-200">
        <span>{labels.drawn || 'Extraídas'}: <b className="text-white">{usedTiles.length}</b></span>
        <span>{labels.total || 'Total'}: <b className="text-white">{availableTiles.length + usedTiles.length}</b></span>
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-2 text-xs">
        {RUNE_COLORS.map(({ id, color }) => {
          const used = usedTiles.filter((tile) => tile.runa === id).length;
          const available = availableTiles.filter((tile) => tile.runa === id).length;
          return (
            <li
              key={id}
              className="rounded-lg px-2 py-1 font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {colors[id] || id}: {used}/{used + available}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
