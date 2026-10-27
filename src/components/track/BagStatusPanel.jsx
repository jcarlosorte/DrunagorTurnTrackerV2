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
    <section className="track-surface p-2 shadow-md" aria-label={labels.title || 'Bolsa de runas'}>
      <div className="mb-2 flex items-center justify-center gap-1.5">
        <GiSwapBag className="text-base text-yellow-300" aria-hidden="true" />
        <h2 className="truncate text-xs font-bold uppercase tracking-wide text-slate-200">
          {labels.title || 'Bolsa de runas'}
        </h2>
      </div>

      <p className="mb-2 text-center text-[0.7rem] text-slate-400">
        {labels.drawn || 'Extraídas'} <b className="text-slate-100">{usedTiles.length}</b>
        <span aria-hidden="true"> · </span>
        {labels.total || 'Total'} <b className="text-slate-100">{availableTiles.length + usedTiles.length}</b>
      </p>

      <ul className="grid grid-cols-2 gap-1">
        {RUNE_COLORS.map(({ id, color }) => {
          const used = usedTiles.filter((tile) => tile.runa === id).length;
          const available = availableTiles.filter((tile) => tile.runa === id).length;
          return (
            <li
              key={id}
              className="flex items-center justify-between gap-1 rounded-md px-1.5 py-1 text-[0.65rem] font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              <span className="truncate">{colors[id] || id}</span>
              <span className="shrink-0 tabular-nums opacity-90">{used}/{used + available}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
