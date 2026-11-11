import { INMUNIDADES } from '@/data/estadosAlterados';

const BOSS_RUNES = [
  { id: 'gris', className: 'bg-slate-400 border-slate-200' },
  { id: 'naranja', className: 'bg-orange-500 border-orange-200' },
  { id: 'rojo', className: 'bg-red-500 border-red-200' },
  { id: 'verde', className: 'bg-emerald-500 border-emerald-200' },
  { id: 'azul', className: 'bg-blue-500 border-blue-200' },
];

const RUNE_IMMUNITY = {
  naranja: 'QUEMADURA_I',
  rojo: 'HEMORRAGIA_I',
  verde: 'VENENO_I',
};

export default function BossRunesColumn({
  selected = 'gris',
  labels = {},
  texts = {},
  onSelect,
  className = '',
}) {
  const defaultTexts = {
    gris: labels.bossRuneGray || 'ARMADURA',
    naranja: labels.bossRuneOrange || 'Pierde ARMADURA y ya no es inmune a',
    rojo: labels.bossRuneRed || 'Pierde ARMADURA y ya no es inmune a',
    verde: labels.bossRuneGreen || 'Pierde ARMADURA y ya no es inmune a',
    azul: labels.bossRuneBlue || 'Sufre ATURDIMIENTO y pierde ARMADURA',
  };

  return (
    <div
      className={`flex shrink-0 flex-col items-stretch gap-1 rounded-lg border border-red-800/60 bg-slate-950/70 px-2 py-1 ${className}`}
      aria-label={labels.bossRunes || 'Runas de jefe'}
    >
      {BOSS_RUNES.map((rune) => {
        const active = selected === rune.id;
        const immunityId = RUNE_IMMUNITY[rune.id];
        const immunity = immunityId ? INMUNIDADES.find((item) => item.id === immunityId) : null;
        return (
          <button
            key={rune.id}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelect?.(rune.id);
            }}
            aria-pressed={active}
            className={`flex min-h-4 items-center gap-1.5 rounded px-1 text-left transition ${
              active ? 'bg-amber-950/60' : 'hover:bg-slate-800/70'
            }`}
          >
            <span className="relative flex w-5 shrink-0 items-center justify-center">
              {active && (
                <span className="absolute -left-2 text-[0.65rem] font-black text-amber-200" aria-hidden="true">▶</span>
              )}
              <span
                className={`h-3 w-3 rotate-45 border-2 ${rune.className} ${
                  active ? 'ring-2 ring-amber-200 ring-offset-1 ring-offset-slate-950' : ''
                }`}
              />
            </span>
            <span className="min-w-[4.5rem] text-[0.55rem] leading-tight text-slate-200">
              {texts?.[rune.id] || defaultTexts[rune.id]}
            </span>
            {immunity && (
              <img
                src={immunity.imagen}
                alt={immunityId}
                title={immunityId}
                className="h-3.5 w-3.5 rounded-full border border-white/70"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
