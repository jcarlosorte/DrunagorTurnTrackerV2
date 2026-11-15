export default function TrackWarningBanner({ title, summary, details, labels = {} }) {
  if (!title) return null;
  return (
    <div
      role="status"
      className="mb-2 flex flex-wrap items-center gap-2 rounded-xl border border-fuchsia-700/70 bg-fuchsia-950/50 p-2 text-fuchsia-100"
    >
      <span className="shrink-0 text-xs font-black uppercase tracking-wide">🌫 {title}</span>
      <span className="min-w-0 flex-1 text-[0.7rem] text-fuchsia-100/85">{summary}</span>
      {details && (
        <details className="min-w-0">
          <summary className="cursor-pointer rounded bg-fuchsia-800 px-2 py-1 text-[0.65rem] font-bold text-white hover:bg-fuchsia-700">
            {labels.details || 'Detalles'}
          </summary>
          <p className="mt-1 max-w-xl whitespace-pre-line text-[0.68rem] leading-snug text-fuchsia-100/90">
            {details}
          </p>
        </details>
      )}
    </div>
  );
}
