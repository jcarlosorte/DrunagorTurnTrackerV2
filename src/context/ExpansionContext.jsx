// src/context/ExpansionContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { EXPANSIONS } from '../data/expansions';
import { readJsonStorage, writeJsonStorage } from '../utils/storage';

const ExpansionContext = createContext();
const expansionIds = new Set(EXPANSIONS.map(({ id }) => id));
const defaultExpansions = ['base'];

export const ExpansionProvider = ({ children }) => {
  const [selectedExpansions, setSelectedExpansions] = useState(() => {
    const stored = readJsonStorage('expansions', defaultExpansions, Array.isArray);
    return stored.filter((id) => typeof id === 'string' && expansionIds.has(id));
  });

  useEffect(() => {
    writeJsonStorage('expansions', selectedExpansions);
  }, [selectedExpansions]);

  const toggleExpansion = (id) => {
    setSelectedExpansions(prev =>
      prev.includes(id)
        ? prev.filter(expId => expId !== id)
        : [...prev, id]
    );
  };

  const clearExpansions = () => setSelectedExpansions([]);

  return (
    <ExpansionContext.Provider value={{ selectedExpansions, toggleExpansion, clearExpansions }}>
      {children}
    </ExpansionContext.Provider>
  );
};

export const useExpansions = () => useContext(ExpansionContext);

export default ExpansionContext;
