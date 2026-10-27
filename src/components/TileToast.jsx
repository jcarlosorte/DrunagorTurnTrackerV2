// src/components/TileToast.jsx
import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import TetrisPiece from './TetrisPiece';
import { IoClose } from 'react-icons/io5';

const colorMap = {
  rojo: 'bg-red-600',
  azul: 'bg-blue-600',
  verde: 'bg-green-600',
  naranja: 'bg-orange-500',
  gris: 'bg-gray-500',
};


const TileToast = ({ tile, tipo = 'add', onClose = () => {} }) => {
  // El hook debe ejecutarse siempre, antes de cualquier retorno condicional.
  const { translations } = useLanguage();
  if (!tile?.runa) return null;
  const ti = translations.trackerInit || {};
  const mensaje = tipo === 'remove'
    ? `−1 ${ti.rune}: ${ti.colores[tile.runa]}`
    : tipo === 'show'
    ? `🔮 ${ti.manifestar || 'Manifestar'}: ${ti.colores[tile.runa]}`
    : tipo === 'retira'
    ? `❌ ${ti.retira || 'Retirada'}: ${ti.colores[tile.runa]}`
    : `+1 ${ti.rune}: ${ti.colores[tile.runa]}`;

return (
    <div
      role="status"
      aria-live="polite"
      className={`relative flex flex-col items-center justify-center p-4 rounded-xl shadow-2xl text-white ${colorMap[tile.runa]} border-2 border-white`}
    >
      {/* Botón cerrar */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label={ti.close || 'Cerrar'}
      >
        <IoClose className="text-white" aria-hidden="true" />
      </button>

      <div className="text-xs font-bold mb-2">{mensaje}</div>
      <TetrisPiece type={tile.dibujo} color="text-white" />
    </div>
  );
};

export default TileToast;
