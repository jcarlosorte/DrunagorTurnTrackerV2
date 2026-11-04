// src/components/TileToast.jsx

import { useLanguage } from '@/context/LanguageContext';
import { GiRuneStone } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import TetrisPiece from './TetrisPiece';

const colorMap = {
  rojo: { border: 'border-red-500/60', bg: 'bg-red-500/15', text: 'text-red-200' },
  azul: { border: 'border-blue-500/60', bg: 'bg-blue-500/15', text: 'text-blue-200' },
  verde: { border: 'border-green-500/60', bg: 'bg-green-500/15', text: 'text-green-200' },
  naranja: { border: 'border-orange-500/60', bg: 'bg-orange-500/15', text: 'text-orange-200' },
  gris: { border: 'border-slate-500/60', bg: 'bg-slate-500/15', text: 'text-slate-200' },
};

const TileToast = ({ tile, tipo = 'add', onClose = () => {} }) => {
  const { translations } = useLanguage();
  if (!tile?.runa) return null;

  const ti = translations.trackerInit || {};
  const accent = colorMap[tile.runa] || colorMap.gris;
  const colorName = ti.colores?.[tile.runa] || tile.runa;
  const mensaje = tipo === 'remove'
    ? `−1 ${ti.rune || 'Runa'}: ${colorName}`
    : tipo === 'show'
      ? `🔮 ${ti.manifestar || 'Manifestar'}: ${colorName}`
      : tipo === 'retira'
        ? `❌ ${ti.retira || 'Retirada'}: ${colorName}`
        : `+1 ${ti.rune || 'Runa'}: ${colorName}`;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative flex w-64 flex-col gap-2 rounded-2xl border bg-slate-900/95 p-3 text-slate-100 shadow-2xl shadow-black/40 backdrop-blur ${accent.border}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent.bg} ${accent.text}`}>
            <GiRuneStone className="text-lg" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-400">
              {ti.runeCard || 'Runa'}
            </p>
            <p className="truncate text-sm font-bold text-slate-50">{colorName}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={ti.close || 'Cerrar'}
        >
          <IoClose className="text-sm" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-center rounded-xl border border-slate-700/70 bg-slate-950/60 p-2">
        <TetrisPiece type={tile.dibujo} color={accent.text} />
      </div>

      <p className="text-center text-xs font-semibold text-slate-300">{mensaje}</p>
    </div>
  );
};

export default TileToast;
