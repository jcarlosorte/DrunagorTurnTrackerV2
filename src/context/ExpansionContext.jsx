// src/context/ExpansionContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { EXPANSIONS } from '../data/expansions';
import { MAIN_BOXES, getMainBox, isBoxUnlocked } from '../data/boxes';
import { readJsonStorage, writeJsonStorage } from '../utils/storage';

const ExpansionContext = createContext();
const expansionIds = new Set(EXPANSIONS.map(({ id }) => id));
const defaultExpansions = ['base'];

export const ExpansionProvider = ({ children }) => {
  const [selectedExpansions, setSelectedExpansions] = useState(() => {
    const stored = readJsonStorage('expansions', defaultExpansions, Array.isArray);
    return stored.filter((id) => typeof id === 'string' && expansionIds.has(id));
  });
  const [mainBox, setMainBoxState] = useState(() => {
    const stored = readJsonStorage('mainBox', 'core', (value) => typeof value === 'string');
    const box = getMainBox(stored);
    return isBoxUnlocked(box) ? box.id : 'core';
  });
  const [previewOtherBoxes, setPreviewOtherBoxes] = useState(false);

  useEffect(() => {
    writeJsonStorage('expansions', selectedExpansions);
  }, [selectedExpansions]);

  useEffect(() => {
    writeJsonStorage('mainBox', mainBox);
  }, [mainBox]);

  const toggleExpansion = (id) => {
    setSelectedExpansions(prev =>
      prev.includes(id)
        ? prev.filter(expId => expId !== id)
        : [...prev, id]
    );
  };

  const setMainBox = (id) => {
    const box = getMainBox(id);
    if (!box || !isBoxUnlocked(box)) return;
    setMainBoxState(box.id);
    setSelectedExpansions((prev) => (
      prev.includes(box.expansionId) ? prev : [...prev, box.expansionId]
    ));
  };

  const togglePreview = () => setPreviewOtherBoxes((value) => !value);

  const clearExpansions = () => setSelectedExpansions([]);

  const unlockedBoxes = MAIN_BOXES.filter(isBoxUnlocked);
  const canPreviewOtherBoxes = unlockedBoxes.some((box) => box.id !== mainBox);

  return (
    <ExpansionContext.Provider value={{
      selectedExpansions,
      toggleExpansion,
      clearExpansions,
      mainBox,
      setMainBox,
      unlockedBoxes,
      previewOtherBoxes,
      togglePreview,
      canPreviewOtherBoxes,
    }}>
      {children}
    </ExpansionContext.Provider>
  );
};

export const useExpansions = () => useContext(ExpansionContext);

export default ExpansionContext;
