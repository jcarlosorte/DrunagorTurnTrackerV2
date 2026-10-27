import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function StorageWarning() {
  const { translations } = useLanguage();
  const t = translations?.saves || {};
  const [failed, setFailed] = useState(null);

  useEffect(() => {
    const handleError = (event) => setFailed(event?.detail || {});
    window.addEventListener('drunagor:storage-error', handleError);
    return () => window.removeEventListener('drunagor:storage-error', handleError);
  }, []);

  if (!failed) return null;

  const detalle = failed.key ? ` (${failed.key}${failed.sizeKb ? ` · ${failed.sizeKb} KB` : ''})` : '';

  return (
    <div
      role="alert"
      className="layer-toast fixed bottom-4 left-1/2 w-[min(92vw,32rem)] -translate-x-1/2 rounded-xl border border-amber-500/70 bg-amber-950/95 p-3 text-sm text-amber-100 shadow-2xl"
    >
      <div className="flex items-start gap-2">
        <span aria-hidden="true">⚠️</span>
        <p className="flex-1">
          {t.storageError || 'No se ha podido guardar en este dispositivo. Exporta tu partida desde Partidas para no perder el progreso.'}
          {detalle && <span className="mt-1 block text-[0.7rem] text-amber-200/80">{detalle}</span>}
        </p>
        <button
          type="button"
          onClick={() => setFailed(null)}
          aria-label={t.close || 'Cerrar'}
          className="rounded px-2 font-bold hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
