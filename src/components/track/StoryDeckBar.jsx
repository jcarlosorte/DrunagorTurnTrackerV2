import mecanicaEspecialIcon from '@/assets/assets_logo/mecanica_especial.png';

export default function StoryDeckBar({ title, event, onDraw, accent = 'fuchsia' }) {
  if (!event?.active || event.deck.length === 0) return null;
  const remaining = event.deck.length;
  const tones = accent === 'amber'
    ? 'border-amber-700/60 bg-amber-950/40 text-amber-100'
    : accent === 'cyan'
      ? 'border-cyan-700/60 bg-cyan-950/40 text-cyan-100'
      : 'border-fuchsia-700/60 bg-fuchsia-950/40 text-fuchsia-100';

  return (
    <div className={`rounded-xl border p-2 ${tones}`}>
      <p className="truncate text-[0.7rem] font-black uppercase tracking-wide">{title}</p>
      <div className="mt-1 flex items-center gap-2">
        <img src={mecanicaEspecialIcon} alt="" className="h-8 w-8 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <p className="text-[0.65rem] opacity-80">Cartas restantes: {remaining}/6</p>
        </div>
        <button
          type="button"
          onClick={onDraw}
          className="min-h-8 shrink-0 rounded-lg bg-slate-800 px-2.5 text-xs font-bold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          Robar
        </button>
      </div>
    </div>
  );
}
