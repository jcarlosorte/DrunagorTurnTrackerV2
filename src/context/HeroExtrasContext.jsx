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

/**
 * Acceso tolerante: si el componente se ejecuta sin proveedor (por ejemplo con
 * fragmentos antiguos en caché tras un despliegue) se usan las utilidades
 * directamente en vez de romper la página.
 */
const FALLBACK = {
  version: 0,
  getExtras: getHeroExtras,
  updateExtras: (heroId, patch) => patchHeroExtras(heroId, patch),
  refresh: () => invalidateHeroExtrasCache(),
};

export function useHeroExtras() {
  return useContext(HeroExtrasContext) || FALLBACK;
}
