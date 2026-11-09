import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { isPlainObject, readJsonStorage, writeJsonStorage } from '@/utils/storage';
import { createId } from '@/utils/id';
import { appNotify } from '@/utils/appDialogs';

const InitRunesContext = createContext();

export const InitRunesProvider = ({ children }) => {
  const persisted = readJsonStorage('initRunesState', {}, isPlainObject);
  const [placedRunes, setPlacedRunes] = useState(() => persisted.placedRunes || []);
  const [executedRunes, setExecutedRunes] = useState(() => persisted.executedRunes || []);
  const { translations } = useLanguage();

  useEffect(() => {
    writeJsonStorage('initRunesState', { placedRunes, executedRunes });
  }, [placedRunes, executedRunes]);
  const t = translations?.trackerInit || {};

  const placeRune = ({ rune }) => {
    // Verificar si ya existe una carta con el mismo id
    const exists = placedRunes.some((r) => r.rune.id === rune.id);
    if (exists) {
      appNotify(t.RuneRepeat);
      return;
    }

    setPlacedRunes(prev => [
      ...prev,
      {
        rune: {
          uuid: createId(),
          ...rune,
          colorIndex: 10, // siempre se colocan en índice 10
          applyEffect: true,
        },
      },
    ]);
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

