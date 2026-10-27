import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  getHeroExtras,
  invalidateHeroExtrasCache,
  patchHeroExtras,
} from '@/utils/heroExtras';

const HeroExtrasContext = createContext(null);

/**
 * Fuente de verdad reactiva de los datos de héroe (vida, cubos, estados…).
 *
 * Envuelve las utilidades de `heroExtras` y mantiene un contador de versión
 * para que cualquier tarjeta o modal se repinte al cambiar un héroe.
 */
export function HeroExtrasProvider({ children }) {
  const [version, setVersion] = useState(0);

  const updateExtras = useCallback((heroId, patch) => {
    const next = patchHeroExtras(heroId, patch);
    setVersion((value) => value + 1);
    return next;
  }, []);

  const refresh = useCallback(() => {
    invalidateHeroExtrasCache();
    setVersion((value) => value + 1);
  }, []);

  const value = useMemo(() => ({
    version,
    getExtras: getHeroExtras,
    updateExtras,
    refresh,
  }), [version, updateExtras, refresh]);

  return <HeroExtrasContext.Provider value={value}>{children}</HeroExtrasContext.Provider>;
}

export function useHeroExtras() {
  const context = useContext(HeroExtrasContext);
  if (!context) {
    throw new Error('useHeroExtras debe usarse dentro de HeroExtrasProvider');
  }
  return context;
}
