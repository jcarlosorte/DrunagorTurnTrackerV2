// src/components/CommanderCard.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';
import CommanderCardModal from '@/components/CommanderCardModal';

const CommanderCard = ({ carta }) => {
  const { translations } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [estadosLocal, setEstadosLocal] = useState(carta?.estadosAlterados || []);
  const ta = translations.cartas_ataque || {};
  const tea = translations.estadosAlterados || {};
  
  const nombre = ta.nombre?.[carta.id] || carta.nombre;
  const nombreEnemy = carta.nombreEnemy;
  // 🎨 Clases visuales condicionales por tipo
  const ringClass =
    carta.categoria === "overlord"
      ? 'ring-4 ring-orange-400 animate-pulse'
      : carta.categoria === "comandante" || carta.categoria === "hero"
      ? 'ring-4 ring-yellow-400 animate-pulse'
      : carta.categoria === "jefe"
      ? 'ring-4 ring-purple-400 animate-pulse'
      : '';

  const borderClass =
    carta.categoria === "overlord"
      ? 'border-orange-400'
      : carta.categoria === "comandante" || carta.categoria === "hero"
      ? 'border-yellow-400'
      : carta.categoria === "jefe"
      ? 'border-purple-400'
      : 'border-gray-500';
  
  const enemyClass =
    carta.categoria === "overlord"
      ? ta.ataqueO
      : carta.categoria === "comandante"
      ? ta.ataqueC
      : carta.categoria === "hero"
      ? ta.ataqueF
      : carta.categoria === "jefe"
      ? ta.ataqueB
      : '';

  useEffect(() => {
    setEstadosLocal(carta?.estadosAlterados ? [...carta.estadosAlterados] : []);
  }, [carta?.estadosAlterados]);
  
  return (
    <div className="flex flex-col items-center mx-1">
      <div className="relative w-full max-w-[140px]">

        <div
          onClick={() => setShowModal(true)}
          className={`cursor-custom relative w-full aspect-square p-2 rounded-lg border-2 shadow-md hover:scale-105 transition
            ${carta.highlight ? ringClass : borderClass}`}
        >

          {/* Fondo animado separado */}
          <div className="fire-bg-inner"></div>
          {/* Chispas */}
          <div className="fire-sparks">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i}></span>
            ))}
          </div>

          {/* Contenido de la carta (siempre por encima) */}
          <div className="absolute inset-0 flex flex-col items-center justify-between z-10 p-2">
    
            <div className="absolute top-1 left-1 grid grid-rows-4 grid-flow-col gap-1">
            {estadosLocal
              .filter(estado => estado.count > 0)
              .map((estado) => {
                const estadoConfig = ESTADOS_ALTERADOS.find(e => e.id === estado.id);
                if (!estadoConfig) return null;
                return (
                  <div key={estado.id} className="relative group cursor-help">
                    <img 
                      src={estadoConfig.imagen}
                      alt={estadoConfig.texto}
                      className="w-6 h-6 border border-white rounded-full shadow-md" loading="lazy" decoding="async" />
                    {estado.count > 1 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1 rounded-full">
                        {estado.count}
                      </span>
                    )}
                    {/* Tooltip */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black text-white text-[0.65rem] rounded px-2 py-1 opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap">
                      {tea[estadoConfig.texto] || estadoConfig.texto}
                    </div>
                  </div>
                );
              })}
            </div>
          
            <div
              className="text-sm text-yellow-300 text-center"
              style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}
            >
              {nombre}
            </div>
            <div
              className="text-[0.50rem] italic text-white-300 text-center"
              style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}
            >
              <div>-{enemyClass}-</div>
              <div>{nombreEnemy}</div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <CommanderCardModal carta={carta} onClose={() => setShowModal(false)} />
      )}
   </div>
  );
};

export default CommanderCard;
