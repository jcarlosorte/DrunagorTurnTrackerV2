import { useCallback, useEffect, useRef, useState } from 'react';

const BASE_WIDTH = 1100;
const MIN_SCALE = 0.45;
const MAX_SCALE = 1.5;
const clamp = (value) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

export default function TurnTrackBoard({
  renderSlot,
  summaries = [],
  currentSlotIndex = -1,
  presentation = false,
  onTogglePresentation,
  onNextTurn,
  onUndoTurn,
  status = null,
  bagOpen = false,
  onToggleBag,
  historyOpen = false,
  onToggleHistory,
  diceOpen = false,
  onToggleDice,
  density = 'normal',
  onToggleDensity,
  carousel = null,
  canUndo = false,
  labels = {},
}) {
  const viewportRef = useRef(null);
  const pinchRef = useRef({ distance: 0, scale: 1 });
  const [scale, setScale] = useState(1);
  const [view, setView] = useState(() => {
    if (typeof window === 'undefined') return 'board';
    return window.matchMedia('(max-width: 767px)').matches ? 'list' : 'board';
  });
  const [expandedIndex, setExpandedIndex] = useState(currentSlotIndex);

  useEffect(() => {
    if (currentSlotIndex >= 0) setExpandedIndex(currentSlotIndex);
  }, [currentSlotIndex]);

  const fitToWidth = useCallback(() => {
    const width = viewportRef.current?.clientWidth;
    if (!width) return;
    setScale(clamp((width - 16) / BASE_WIDTH));
  }, []);

  // Ajuste inicial para que el tablero quepa al entrar.
  useEffect(() => {
    if (view === 'board') fitToWidth();
  }, [view, fitToWidth]);

  // El panel lateral cambia el ancho disponible: reajustamos el zoom automáticamente.
  useEffect(() => {
    if (view !== 'board') return undefined;
    const element = viewportRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => fitToWidth());
    observer.observe(element);
    return () => observer.disconnect();
  }, [view, fitToWidth]);

  const handleTouchStart = (event) => {
    if (event.touches.length !== 2) return;
    const [a, b] = event.touches;
    pinchRef.current = {
      distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
      scale,
    };
  };

  const handleTouchMove = (event) => {
    if (event.touches.length !== 2) return;
    const [a, b] = event.touches;
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    if (!pinchRef.current.distance) return;
    event.preventDefault();
    setScale(clamp(pinchRef.current.scale * (distance / pinchRef.current.distance)));
  };

  const toolbar = (
    <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-2 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label={labels.viewMode || 'Vista del tablero'} className="flex rounded-xl border border-slate-700 bg-slate-900 p-1">
          <button
            type="button"
            aria-pressed={view === 'board'}
            onClick={() => setView('board')}
            className={`min-h-9 rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              view === 'board' ? 'bg-sky-700 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            {labels.board || 'Tablero'}
          </button>
          <button
            type="button"
            aria-pressed={view === 'list'}
            onClick={() => setView('list')}
            className={`min-h-9 rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              view === 'list' ? 'bg-sky-700 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            {labels.list || 'Lista'}
          </button>
        </div>

        {/* Ronda y turno, junto al selector de vista */}
        {status}
      </div>

      {/* Acciones de turno, centradas */}
      <div className="order-3 flex w-full items-center justify-center gap-2 sm:order-none sm:w-auto sm:flex-1">
        <button
          type="button"
          data-testid="density-toggle"
          onClick={onToggleDensity}
          aria-pressed={density === 'compact'}
          title={density === 'compact' ? (labels.densityNormal || 'Densidad normal') : (labels.densityCompact || 'Densidad compacta')}
          className={`flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
            density === 'compact'
              ? 'border-sky-300 bg-sky-800 text-white'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <span aria-hidden="true" className="text-base leading-none">{density === 'compact' ? '▦' : '▤'}</span>
          <span className="hidden md:inline">{labels.density || 'Densidad'}</span>
        </button>
        <button
          type="button"
          data-testid="undo-turn"
          onClick={onUndoTurn}
          disabled={!canUndo}
          className="flex min-h-10 items-center gap-2 rounded-xl border border-emerald-800 bg-emerald-950/60 px-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-600 hover:bg-emerald-900/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:opacity-40"
        >
          <span aria-hidden="true" className="text-base">↶</span>
          <span className="hidden sm:inline">{labels.undoTurn || 'Deshacer'}</span>
        </button>
        <button
          type="button"
          data-testid="next-turn"
          onClick={onNextTurn}
          className="min-h-10 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-700 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition hover:from-emerald-400 hover:to-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
        >
          {labels.nextTurn || 'Siguiente turno'}
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {view === 'board' && (
          <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950/70 p-0.5" role="group" aria-label={labels.zoom || 'Zoom'}>
            <button
              type="button"
              onClick={() => setScale((prev) => clamp(prev - 0.1))}
              aria-label={labels.zoomOut || 'Reducir zoom'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-200 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              −
            </button>
            <button
              type="button"
              onClick={fitToWidth}
              title={labels.fit || 'Ajustar'}
              className="min-h-8 rounded-lg px-1.5 text-[0.7rem] font-semibold tabular-nums text-sky-200 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setScale((prev) => clamp(prev + 0.1))}
              aria-label={labels.zoomIn || 'Aumentar zoom'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-200 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              +
            </button>
          </div>
        )}

        {/* Submenús del tablero: bolsa de runas e historial */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/70 p-0.5" role="group" aria-label={labels.panels || 'Paneles'}>
          <button
            type="button"
            onClick={onToggleBag}
            aria-pressed={bagOpen}
            title={labels.bag || 'Bolsa de runas'}
            aria-label={labels.bag || 'Bolsa de runas'}
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              bagOpen
                ? 'border-emerald-400/80 bg-emerald-700 text-white shadow-inner shadow-emerald-950/40'
                : 'border-transparent text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span aria-hidden="true" className="text-sm leading-none">🎒</span>
            <span className="hidden lg:inline">{labels.bag || 'Bolsa'}</span>
          </button>

          <button
            type="button"
            data-testid="history-toggle"
            onClick={onToggleHistory}
            aria-pressed={historyOpen}
            title={labels.history || 'Historial'}
            aria-label={labels.history || 'Historial'}
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              historyOpen
                ? 'border-sky-400/80 bg-sky-700 text-white shadow-inner shadow-sky-950/40'
                : 'border-transparent text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span aria-hidden="true" className="text-sm leading-none">📜</span>
            <span className="hidden lg:inline">{labels.history || 'Historial'}</span>
          </button>
          <button
            type="button"
            data-testid="dice-toggle"
            onClick={onToggleDice}
            aria-pressed={diceOpen}
            title={labels.dice || 'Dados'}
            aria-label={labels.dice || 'Dados'}
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              diceOpen
                ? 'border-amber-400/80 bg-amber-700 text-white shadow-inner shadow-amber-950/40'
                : 'border-transparent text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span aria-hidden="true" className="text-sm leading-none">🎲</span>
            <span className="hidden lg:inline">{labels.dice || 'Dados'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onTogglePresentation}
          aria-pressed={presentation}
          title={labels.presentation || 'Modo presentación'}
          className={`flex h-9 items-center gap-1.5 rounded-xl border px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
            presentation
              ? 'border-emerald-400 bg-emerald-700 text-white'
              : 'border-slate-700 bg-slate-950/70 text-slate-200 hover:border-slate-500 hover:text-white'
          }`}
        >
          <span aria-hidden="true">🖵</span>
          <span className="hidden lg:inline">{presentation ? (labels.exitPresentation || 'Salir') : (labels.presentation || 'Presentación')}</span>
        </button>
      </div>
    </div>
  );

  const boardView = (
    <div
      ref={viewportRef}
      className="h-full min-h-0 flex-1 overflow-auto rounded-2xl border border-slate-700 bg-slate-900/80 p-2"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      role="region"
      aria-label={labels.track || 'Orden de iniciativa'}
      tabIndex={0}
    >
      <div style={{ width: `${BASE_WIDTH * scale}px` }}>
        <div style={{ width: `${BASE_WIDTH}px`, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <div className="grid snap-x snap-mandatory grid-cols-11 auto-rows-auto items-start gap-0 bg-slate-800 p-2">
            {summaries.map(({ index }) => (
              <div key={index} className="min-w-0">{renderSlot(index, { density })}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const listView = (
    <ul className="space-y-2">
      {summaries.map(({ index, label, count, names }) => {
        const isOpen = expandedIndex === index;
        const isCurrent = currentSlotIndex === index;
        return (
          <li key={index}>
            <div
              className={`overflow-hidden rounded-xl border transition ${
                isCurrent ? 'border-emerald-400 bg-emerald-950/30' : 'border-slate-700 bg-slate-900'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                aria-controls={`turn-slot-${index}`}
                className="flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isCurrent ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-bold text-slate-100">{label}</span>
                    {isCurrent && (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-white">
                        {labels.current || 'Turno actual'}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-400">
                    {count > 0 ? names : (labels.empty || 'Sin personajes')}
                  </span>
                </span>
                <span aria-hidden="true" className="text-slate-400">{isOpen ? '▾' : '▸'}</span>
              </button>

              {isOpen && (
                <div id={`turn-slot-${index}`} className="overflow-x-auto border-t border-slate-700/70 p-2">
                  <div className="min-w-[520px]">{renderSlot(index, { compact: true })}</div>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );

  const content = view === 'board' ? boardView : listView;

  return (
    <section
      aria-label={labels.section || 'Tablero de iniciativa'}
      className={`flex h-full min-h-0 flex-col ${presentation ? 'text-base' : ''}`}
    >
      {presentation ? (
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={onTogglePresentation}
            className="min-h-9 rounded-xl border border-slate-600 bg-slate-900 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            {labels.exitPresentation || 'Salir de presentación'}
          </button>
        </div>
      ) : toolbar}
      {content}
    </section>
  );
}
