import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { isPlainObject, readJsonStorage, writeJsonStorage } from '@/utils/storage';
import { createId } from '@/utils/id';

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
      alert(t.RuneRepeat);
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
                                                    

  return ( <InitRunesContext.Provider value={{ placedRunes, placeRune, removeRuneByUUID, resetPlacedRunes, setPlacedRunes, toggleRuneEffect, executedRunes, setExecutedRunes }}> {children} </InitRunesContext.Provider> ); 

};

export const useInitRunes = () => useContext(InitRunesContext);

