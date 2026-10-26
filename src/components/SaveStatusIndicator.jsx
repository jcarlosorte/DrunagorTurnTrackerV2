import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getLastWriteAt } from '@/utils/storage';

const formatAgo = (seconds, t) => {
  if (seconds < 5) return t.justNow || 'Guardado ahora';
  if (seconds < 60) return (t.secondsAgo || 'Guardado hace {n} s').replace('{n}', seconds);
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return (t.minutesAgo || 'Guardado hace {n} min').replace('{n}', minutes);
  return t.saved || 'Partida guardada';
};

export default function SaveStatusIndicator({ className = '' }) {
  const { translations } = useLanguage();
  const t = translations?.saves || {};
  const [lastWriteAt, setLastWriteAt] = useState(() => getLastWriteAt());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const handleWrite = (event) => setLastWriteAt(event.detail?.at || Date.now());
    window.addEventListener('drunagor:storage-write', handleWrite);
    const timer = window.setInterval(() => setNow(Date.now()), 10000);
    return () => {
      window.removeEventListener('drunagor:storage-write', handleWrite);
      window.clearInterval(timer);
    };
  }, []);

  if (!lastWriteAt) {
    return (
      <span className={`text-xs text-slate-400 ${className}`} aria-live="polite">
        {t.notSavedYet || 'Sin guardar todavía'}
      </span>
    );
  }

  const seconds = Math.max(0, Math.round((now - lastWriteAt) / 1000));

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-emerald-300 ${className}`} aria-live="polite">
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-400" />
      {formatAgo(seconds, t)}
    </span>
  );
}
