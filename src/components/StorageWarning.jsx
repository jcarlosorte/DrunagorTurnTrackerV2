import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function StorageWarning() {
  const { translations } = useLanguage();
  const t = translations?.saves || {};
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const handleError = () => setFailed(true);
    window.addEventListener('drunagor:storage-error', handleError);
    return () => window.removeEventListener('drunagor:storage-error', handleError);
  }, []);

  if (!failed) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-1/2 z-[95] w-[min(92vw,32rem)] -translate-x-1/2 rounded-xl border border-amber-500/70 bg-amber-950/95 p-3 text-sm text-amber-100 shadow-2xl"
    >
      <div className="flex items-start gap-2">
        <span aria-hidden="true">⚠️</span>
        <p className="flex-1">
          {t.storageError || 'No se ha podido guardar en este dispositivo. Exporta tu partida desde Partidas para no perder el progreso.'}
        </p>
        <button
          type="button"
          onClick={() => setFailed(false)}
          aria-label={t.close || 'Cerrar'}
          className="rounded px-2 font-bold hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
