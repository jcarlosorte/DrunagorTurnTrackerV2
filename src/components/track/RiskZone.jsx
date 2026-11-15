import { GiTrashCan } from 'react-icons/gi';

/** Zona de riesgo común al final de los submenús del track. */
export default function RiskZone({ id, title, hint, children }) {
  return (
    <section aria-labelledby={id} className="rounded-xl border border-red-900/70 bg-red-950/20 p-3">
      <div className="mb-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
        <GiTrashCan className="text-xl text-red-400" aria-hidden="true" />
        <h3 id={id} className="text-sm font-semibold text-red-200">{title}</h3>
        <span className="text-xs text-red-200/80">{hint}</span>
      </div>
      {children}
    </section>
  );
}
