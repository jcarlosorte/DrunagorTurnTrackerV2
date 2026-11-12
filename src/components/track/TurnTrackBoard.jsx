import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GiCardPick } from 'react-icons/gi';
import HeroPortrait from '@/components/HeroPortrait';
import { readJsonStorage, writeJsonStorage } from '@/utils/storage';
import trackBackground from '@/assets/backgrounds/track.avif';

const BASE_WIDTH = 1480;
const MIN_SCALE = 0.45;
const MAX_SCALE = 1.5;
const clamp = (value) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

export default function TurnTrackBoard({
  renderSlot,
  summaries = [],
  currentSlotIndex = -1,
  presentation = false,
  panelsBelow = false,
  onTogglePanelsBelow,
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
  overlap = 'normal',
  onToggleOverlap,
  carouselOpen = false,
  onToggleCarousel,
  carousel = null,
  bossBanner = null,
  canUndo = false,
  labels = {},
}) {
  const viewportRef = useRef(null);
  const gridRef = useRef(null);
  const sectionRef = useRef(null);
  const pinchRef = useRef({ distance: 0, scale: 1 });
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);
  const [simplified, setSimplified] = useState(false);
  const [manualHeight, setManualHeight] = useState(() => {
    if (typeof window === 'undefined') return null;
    const stored = readJsonStorage(
      'trackBoardHeight',
      0,
      (value) => typeof value === 'number' && value >= 360 && value <= 2400,
    );
    return stored || null;
  });
  const [view, setView] = useState(() => {
    if (typeof window === 'undefined') return 'board';
    return window.matchMedia('(max-width: 767px)').matches ? 'list' : 'board';
  });
  const [expandedIndex, setExpandedIndex] = useState(currentSlotIndex);

  useEffect(() => {
    if (currentSlotIndex >= 0) setExpandedIndex(currentSlotIndex);
  }, [currentSlotIndex]);

  const fitToViewport = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const width = viewport.clientWidth;
    if (!width) return;
    setScale(clamp((width - 16) / BASE_WIDTH));
  }, []);

  // Ajuste inicial para que el tablero quepa al entrar.
  useEffect(() => {
    if (view === 'board') fitToViewport();
  }, [view, fitToViewport]);

  // La escala se aplica con transform, así que el contenedor exterior necesita
  // la altura ya escalada para poder centrarse verticalmente.
  useEffect(() => {
    const element = gridRef.current;
    if (!element) return undefined;
    const update = () => setContentHeight(element.offsetHeight);
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [view, density, overlap, summaries]);

  // El panel lateral o la altura de la ventana cambian el espacio disponible.
  useEffect(() => {
    if (view !== 'board') return undefined;
    const element = viewportRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => fitToViewport());
    observer.observe(element);
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [view, fitToViewport]);

  const startResize = (event) => {
    const section = sectionRef.current;
    if (!section) return;
    event.preventDefault();
    const startY = event.clientY;
    const startHeight = section.getBoundingClientRect().height;
    const handleMove = (moveEvent) => {
      const next = Math.max(360, Math.min(2400, startHeight + moveEvent.clientY - startY));
      setManualHeight(next);
      writeJsonStorage('trackBoardHeight', next);
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const resetHeight = () => {
    setManualHeight(null);
    writeJsonStorage('trackBoardHeight', 0);
  };

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
    <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:overflow-x-auto" data-testid="track-toolbar">
      {/* Izquierda: vista del tablero y estado de la ronda */}
      <div className="flex items-center gap-2">
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

        {status}
      </div>

      {/* Centro: acciones de turno */}
      <div className="order-3 flex w-full items-center justify-center gap-2 sm:order-none sm:mx-auto sm:w-auto">
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

      {/* Derecha: vista del tablero y paneles adicionales */}
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
        <div className="flex items-center gap-0.5 rounded-xl border border-slate-700 bg-slate-950/70 p-0.5" role="group" aria-label={labels.boardGroup || 'Vista del tablero'}>
          <button
            type="button"
            data-testid="density-toggle"
            onClick={onToggleDensity}
            aria-pressed={density === 'compact'}
            title={density === 'compact' ? (labels.densityNormal || 'Densidad normal') : (labels.densityCompact || 'Densidad compacta')}
            aria-label={labels.density || 'Densidad'}
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              density === 'compact'
                ? 'border-sky-400/80 bg-sky-700 text-white'
                : 'border-transparent text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span aria-hidden="true" className="text-sm leading-none">{density === 'compact' ? '▦' : '▤'}</span>
            
          </button>

          <button
            type="button"
            data-testid="simplified-toggle"
            onClick={() => setSimplified((prev) => !prev)}
            aria-pressed={simplified}
            title={simplified ? (labels.simplifiedOff || 'Vista normal') : (labels.simplifiedOn || 'Vista simplificada')}
            aria-label={labels.simplified || 'Vista simplificada'}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              simplified
                ? 'border-sky-400/80 bg-sky-700 text-white'
                : 'border-transparent text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GiCardPick className="text-base" aria-hidden="true" />
          </button>

          <button
            type="button"
            data-testid="overlap-toggle"
            onClick={onToggleOverlap}
            aria-pressed={overlap === 'compact'}
            title={overlap === 'compact' ? (labels.overlapNormal || 'Separar cartas') : (labels.overlapCompact || 'Superponer más las cartas')}
            aria-label={labels.overlap || 'Solape de cartas'}
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              overlap === 'compact'
                ? 'border-amber-400/80 bg-amber-700 text-white'
                : 'border-transparent text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span aria-hidden="true" className="text-sm leading-none">{overlap === 'compact' ? '⧉' : '⧈'}</span>
            
          </button>

          {view === 'board' && (
            <div className="flex items-center" role="group" aria-label={labels.zoom || 'Zoom'}>
              <button
                type="button"
                onClick={() => setScale((prev) => clamp(prev - 0.1))}
                aria-label={labels.zoomOut || 'Reducir zoom'}
                className="flex h-9 w-8 items-center justify-center rounded-lg text-slate-200 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              >
                −
              </button>
              <button
                type="button"
                onClick={fitToViewport}
                title={labels.fit || 'Ajustar'}
                className="min-h-9 rounded-lg px-1.5 text-[0.7rem] font-semibold tabular-nums text-sky-200 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setScale((prev) => clamp(prev + 0.1))}
                aria-label={labels.zoomIn || 'Aumentar zoom'}
                className="flex h-9 w-8 items-center justify-center rounded-lg text-slate-200 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              >
                +
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onTogglePresentation}
            aria-pressed={presentation}
            title={labels.presentation || 'Modo presentación'}
            aria-label={labels.presentation || 'Modo presentación'}
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              presentation
                ? 'border-emerald-400 bg-emerald-700 text-white'
                : 'border-transparent text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span aria-hidden="true">🖵</span>
            
          </button>

          <button
            type="button"
            data-testid="panels-below-toggle"
            onClick={onTogglePanelsBelow}
            aria-pressed={panelsBelow}
            title={panelsBelow ? (labels.panelsBeside || 'Paneles al lado') : (labels.panelsBelow || 'Paneles debajo del track')}
            aria-label={labels.panelsBelow || 'Paneles debajo del track'}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              panelsBelow
                ? 'border-amber-400 bg-amber-700 text-white'
                : 'border-transparent text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span aria-hidden="true" className="text-sm leading-none">⇩</span>
          </button>
        </div>

        <div className="flex items-center gap-0.5 rounded-xl border border-slate-700 bg-slate-950/70 p-0.5" role="group" aria-label={labels.panels || 'Paneles'}>
          <button
            type="button"
            onClick={onToggleBag}
            aria-pressed={bagOpen}
            title={labels.bag || 'Bolsa de runas'}
            aria-label={labels.bag || 'Bolsa de runas'}
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              bagOpen
                ? 'border-emerald-400/80 bg-emerald-700 text-white'
                : 'border-transparent text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span aria-hidden="true" className="text-sm leading-none">🎒</span>
            
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
                ? 'border-sky-400/80 bg-sky-700 text-white'
                : 'border-transparent text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span aria-hidden="true" className="text-sm leading-none">📜</span>
            
          </button>

          <button
            type="button"
            data-testid="carousel-toggle"
            onClick={onToggleCarousel}
            aria-pressed={carouselOpen}
            title={labels.carousel || 'Turnos'}
            aria-label={labels.carousel || 'Turnos'}
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
              carouselOpen
                ? 'border-indigo-400/80 bg-indigo-700 text-white'
                : 'border-transparent text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span aria-hidden="true" className="text-sm leading-none">⏱</span>
            
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
                ? 'border-amber-400/80 bg-amber-700 text-white'
                : 'border-transparent text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span aria-hidden="true" className="text-sm leading-none">🎲</span>
            
          </button>
        </div>
      </div>
    </div>
  );

  const boardView = (
    <div
      ref={viewportRef}
      className="flex min-h-[560px] flex-1 items-start overflow-auto rounded-2xl border border-slate-700 bg-slate-900/80 p-2"
      style={{
        minHeight: contentHeight ? `${Math.max(560, contentHeight * scale + 32)}px` : '560px',
        backgroundColor: '#1e293b',
        backgroundImage: `linear-gradient(rgba(203, 213, 225, 0.18), rgba(15, 23, 42, 0.10)), url(${trackBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      role="region"
      aria-label={labels.track || 'Orden de iniciativa'}
      tabIndex={0}
    >
      <div
        className="mx-auto my-auto"
        style={{
          width: `${BASE_WIDTH * scale}px`,
          height: contentHeight ? `${contentHeight * scale}px` : undefined,
        }}
      >
        <div style={{ width: `${BASE_WIDTH}px`, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <div
            ref={gridRef}
            className="grid snap-x snap-mandatory grid-cols-11 auto-rows-auto items-start gap-0 p-2"
          >
            {summaries.map(({ index }) => (
              <div key={index} className="min-w-0">{renderSlot(index, { density, overlap, simplified })}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const listView = (
    <div className="min-h-0 flex-1 overflow-y-auto">
    <ul className="space-y-2">
      {summaries.map(({ index, label, count, names, entities = [], slotColor = null }) => {
        const isOpen = expandedIndex === index;
        const isCurrent = currentSlotIndex === index;
        const accent = entities[0]?.color || slotColor || '#475569';
        const hasColor = count > 0 || Boolean(slotColor);
        return (
          <li key={index} data-slot-index={index} className="scroll-mt-32">
            <div
              className={`overflow-hidden rounded-xl border transition ${isCurrent ? 'ring-2 ring-emerald-400' : ''}`}
              style={{
                borderColor: hasColor ? accent : '#334155',
                backgroundColor: hasColor ? `${accent}1f` : '#0f172a',
              }}
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
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: hasColor ? accent : '#1e293b' }}
                >
                  {index + 1}
                </span>

                {entities.length > 0 && (
                  <span className="flex shrink-0 -space-x-2" aria-hidden="true">
                    {entities.slice(0, 4).map((entity, entityIndex) => (
                      <span
                        key={`${entity.kind}-${entityIndex}`}
                        className="relative flex h-8 w-8 overflow-hidden rounded-full border-2 bg-slate-950"
                        style={{ borderColor: entity.color }}
                      >
                        {entity.kind === 'hero' ? (
                          <HeroPortrait heroId={entity.heroId} className="h-full w-full" />
                        ) : entity.image ? (
                          <img
                            src={entity.image}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[0.55rem] font-bold text-slate-300">
                            {entity.name.slice(0, 1)}
                          </span>
                        )}
                      </span>
                    ))}
                    {entities.length > 4 && (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-900 text-[0.55rem] font-bold text-slate-300">
                        +{entities.length - 4}
                      </span>
                    )}
                  </span>
                )}

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
                  <div className="w-full min-w-0">{renderSlot(index, { compact: true })}</div>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
    </div>
  );

  const content = view === 'board' ? boardView : listView;

  return (
    <section
      ref={sectionRef}
      aria-label={labels.section || 'Tablero de iniciativa'}
      className={`flex h-full min-h-0 flex-col ${presentation ? 'text-base' : ''}`}
      style={manualHeight ? { height: `${manualHeight}px` } : undefined}
    >
      {presentation ? (
        <>
          <button
            type="button"
            onClick={onTogglePresentation}
            className="fixed right-3 top-3 z-[80] min-h-9 rounded-xl border border-slate-500 bg-slate-900/95 px-3 text-xs font-semibold text-slate-100 shadow-lg backdrop-blur hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            {labels.exitPresentation || 'Salir de presentación'}
          </button>
          <div className="mb-2 rounded-xl border border-slate-700/70 bg-slate-900/95 p-2 shadow-lg backdrop-blur-xl">
            {toolbar}
          </div>
        </>
      ) : (
        <>
          {typeof document !== 'undefined' && createPortal(
            <div
              role="toolbar"
              aria-label={labels.toolbar || 'Controles de turno'}
              className="fixed inset-x-0 top-16 z-30 border-b border-slate-700/70 bg-slate-900/95 px-2 py-2 shadow-lg backdrop-blur-xl"
            >
              <div className="mx-auto max-w-[1600px]">{toolbar}</div>
            </div>,
            document.body
          )}
        </>
      )}
      {bossBanner}
      {content}
      {!presentation && (
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label={labels.resizeTrack || 'Ajustar altura del tablero'}
          title={labels.resizeTrackHint || 'Arrastra para ampliar. Doble clic para ajustar.'}
          onPointerDown={startResize}
          onDoubleClick={resetHeight}
          className="mt-1 flex h-4 shrink-0 cursor-ns-resize touch-none items-center justify-center rounded bg-slate-800/70 hover:bg-slate-700"
        >
          <span className="h-0.5 w-12 rounded bg-slate-500" aria-hidden="true" />
        </div>
      )}
      {carouselOpen && carousel && (
        <div className="mt-2 shrink-0">{carousel}</div>
      )}
    </section>
  );
}
