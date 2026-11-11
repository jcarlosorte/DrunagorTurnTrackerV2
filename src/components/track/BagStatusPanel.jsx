import { GiSwapBag } from 'react-icons/gi';
import { COLOR_RUNAS } from '@/data/fichas';

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

      <ul className="flex flex-nowrap items-center justify-between gap-1">
        {RUNE_COLORS.map(({ id, color }) => {
          const used = usedTiles.filter((tile) => tile.runa === id).length;
          const available = availableTiles.filter((tile) => tile.runa === id).length;
          const total = used + available;
          const runeIcon = COLOR_RUNAS.find((rune) => rune.id === id)?.imagenSin;
          return (
            <li key={id} className="flex min-w-0 items-center gap-0.5">
              <span
                className="flex h-6 w-6 shrink-0 rotate-45 items-center justify-center rounded-[3px] border border-white/60 shadow-sm"
                style={{ backgroundColor: color }}
                title={colors[id] || id}
              >
                {runeIcon ? (
                  <img src={runeIcon} alt="" className="h-4 w-4 -rotate-45 object-contain" loading="lazy" decoding="async" />
                ) : null}
              </span>
              <span className="whitespace-nowrap text-[0.55rem] font-bold tabular-nums text-white/90">
                {used}/{total}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
