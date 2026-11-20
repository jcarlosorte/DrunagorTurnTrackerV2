// src/context/ExpansionContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { EXPANSIONS } from '../data/expansions';
import { MAIN_BOXES, getCampaignExpansionIds, getMainBox, isBoxUnlocked } from '../data/boxes';
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
    return isBoxUnlocked(box, selectedExpansions) ? box.id : 'core';
  });
  const [previewOtherBoxes, setPreviewOtherBoxes] = useState(false);

  useEffect(() => {
    writeJsonStorage('expansions', selectedExpansions);
  }, [selectedExpansions]);

  useEffect(() => {
    writeJsonStorage('mainBox', mainBox);
  }, [mainBox]);

  useEffect(() => {
    const current = getMainBox(mainBox);
    if (isBoxUnlocked(current, selectedExpansions)) return;
    const fallback = MAIN_BOXES.find((box) => isBoxUnlocked(box, selectedExpansions)) || getMainBox('core');
    if (fallback.id !== mainBox) setMainBoxState(fallback.id);
  }, [mainBox, selectedExpansions]);

  const toggleExpansion = (id) => {
    setSelectedExpansions(prev =>
      prev.includes(id)
        ? prev.filter(expId => expId !== id)
        : [...prev, id]
    );
  };

  const setMainBox = (id) => {
    const box = getMainBox(id);
    if (!box || !isBoxUnlocked(box, selectedExpansions)) return;
    setMainBoxState(box.id);
    const campaignExpansions = getCampaignExpansionIds(box.id).filter((expansionId) => {
      const expansion = EXPANSIONS.find((entry) => entry.id === expansionId);
      return expansion && expansion.active !== 'off';
    });
    setSelectedExpansions((prev) => [...new Set([...prev, ...campaignExpansions])]);
  };

  const togglePreview = () => setPreviewOtherBoxes((value) => !value);

  const clearExpansions = () => setSelectedExpansions([]);

  const unlockedBoxes = MAIN_BOXES.filter((box) => isBoxUnlocked(box, selectedExpansions));
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
