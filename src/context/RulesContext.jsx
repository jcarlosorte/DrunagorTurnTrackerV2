import { createContext, useContext, useMemo, useState } from 'react';
import { useExpansions } from '@/context/ExpansionContext';
import {
  AUTO,
  RULES_VERSIONS,
  detectRulesVersion,
  readRulesOverride,
  writeRulesOverride,
} from '@/utils/rulesVersion';

const RulesContext = createContext(null);

/**
 * Versión de reglas vigente: automática por expansiones o forzada a mano.
 *
 * Todavía no altera catálogos; deja el terreno preparado para que las
 * expansiones de Apocalipsis añadan estados, capacidades y mecánicas propias.
 */
export function RulesProvider({ children }) {
  const { selectedExpansions } = useExpansions();
  const [override, setOverride] = useState(readRulesOverride);

  const detected = detectRulesVersion(selectedExpansions);
  const rulesVersion = override ?? detected;

  const value = useMemo(() => ({
    rulesVersion,
    detected,
    override,
    isAuto: override === null,
    setRulesVersion(next) {
      const normalized = next === AUTO ? null : (RULES_VERSIONS.includes(next) ? next : null);
      setOverride(normalized);
      writeRulesOverride(normalized);
    },
  }), [rulesVersion, detected, override]);

  return <RulesContext.Provider value={value}>{children}</RulesContext.Provider>;
}

export const useRules = () => useContext(RulesContext);
