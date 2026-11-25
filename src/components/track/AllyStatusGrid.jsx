/**
 * Paleta compacta de estados para aliados.
 *
 * Igual que en enemigos y héroes: el nombre queda en el tooltip y en las
 * etiquetas accesibles, pero la interfaz muestra solo el icono y el contador.
 */
export default function AllyStatusGrid({
  catalogue,
  countOf,
  onChange,
  getImage,
  descriptions = {},
}) {
  return (
    <div data-testid="ally-status-grid" className="flex flex-wrap items-stretch justify-center gap-1">
      {catalogue.map((estado) => {
        const count = countOf(estado.id);
        const max = estado.max || 1;
        const nombre = estado.texto;
        const imagen = getImage?.(estado) || estado.imagen;
        const descripcion = descriptions[estado.id] || '';
        return (
          <div
            key={estado.id}
            data-testid={`ally-status-${estado.id}`}
            className="state-chip flex min-w-[2.1rem] max-w-[3.5rem] flex-1 basis-0 flex-col items-center rounded-lg border py-0.5"
          >
            <button
              type="button"
              onClick={() => onChange(estado, 1)}
              disabled={count >= max}
              aria-label={`${nombre}: +1`}
              className="state-btn-add flex h-5 w-8 items-center justify-center rounded text-xs font-bold leading-none text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40"
            >
              +
            </button>
            <div
              className="relative flex flex-col items-center py-0.5"
              title={`${nombre} ×${count}${descripcion ? `\n${descripcion}` : ''}`}
            >
              {imagen && (
                <img
                  src={imagen}
                  alt=""
                  className="h-6 w-6 flex-shrink object-contain"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span className="text-[0.6rem] font-bold leading-none text-white">{count}</span>
            </div>
            <button
              type="button"
              onClick={() => onChange(estado, -1)}
              disabled={count <= 0}
              aria-label={`${nombre}: −1`}
              className="state-btn-remove flex h-5 w-8 items-center justify-center rounded text-xs font-bold leading-none text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40"
            >
              −
            </button>
          </div>
        );
      })}
    </div>
  );
}
