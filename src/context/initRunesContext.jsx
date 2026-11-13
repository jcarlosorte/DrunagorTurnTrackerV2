import React, { createContext, useContext, useEffect, useState } from 'react';
import { isPlainObject, readJsonStorage, writeJsonStorage } from '@/utils/storage';
import { createId } from '@/utils/id';

const InitRunesContext = createContext();

export const InitRunesProvider = ({ children }) => {
  const persisted = readJsonStorage('initRunesState', {}, isPlainObject);
  const [placedRunes, setPlacedRunes] = useState(() => persisted.placedRunes || []);
  const [executedRunes, setExecutedRunes] = useState(() => persisted.executedRunes || []);

  useEffect(() => {
    writeJsonStorage('initRunesState', { placedRunes, executedRunes });
  }, [placedRunes, executedRunes]);

  const placeRune = ({ rune }) => {
    setPlacedRunes(prev => {
      // Comprobar dentro del updater evita que un reinicio pendiente quite la
      // carta recién añadida al activar una escena.
      if (prev.some((r) => r.rune.id === rune.id)) return prev;
      return [
        ...prev,
        {
          rune: {
            uuid: createId(),
            ...rune,
            colorIndex: 10,
            applyEffect: true,
          },
        },
      ];
    });
  };
  
  const removeRuneByUUID = (uuid) => { setPlacedRunes(prev => prev.filter(r => r.rune.uuid !== uuid)); };
  
  const resetPlacedRunes = () => {
    setPlacedRunes([]);
    setExecutedRunes([]); // ✅ también resetear ejecuciones
  };

  const toggleRuneEffect = (uuid) => {
    setPlacedRunes(prev =>
      prev.map(item =>
        item.rune.uuid === uuid
          ? {
              ...item,
              rune: {
                ...item.rune,
                applyEffect: !item.rune.applyEffect
              }
            }
          : item
      )
    );
  };

  const setRuneEstadoCount = (uuid, estadoId, count) => {
    setPlacedRunes(prev => prev.map(item => {
      if (item.rune.uuid !== uuid) return item;
      const estados = [...(item.rune.estadosAlterados || [])];
      const index = estados.findIndex(estado => estado.id === estadoId);
      if (index === -1) {
        estados.push({ id: estadoId, count });
      } else {
        estados[index] = { ...estados[index], count };
      }
      return { ...item, rune: { ...item.rune, estadosAlterados: estados } };
    }));
  };
                                                    

  return ( <InitRunesContext.Provider value={{ placedRunes, placeRune, removeRuneByUUID, resetPlacedRunes, setPlacedRunes, toggleRuneEffect, setRuneEstadoCount, executedRunes, setExecutedRunes }}> {children} </InitRunesContext.Provider> ); 

};

export const useInitRunes = () => useContext(InitRunesContext);

