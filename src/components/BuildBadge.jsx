/** Marca de versión y commit visibles para saber qué build está cargado. */
export default function BuildBadge({ className = '' }) {
  const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';
  const build = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev';

  return (
    <span
      className={`hidden shrink-0 rounded-full border border-slate-700 bg-slate-950/70 px-2 py-0.5 font-mono text-[0.6rem] text-slate-400 lg:inline ${className}`}
      title={`Versión ${version} · build ${build}`}
      data-testid="build-badge"
    >
      v{version} · {build}
    </span>
  );
}
