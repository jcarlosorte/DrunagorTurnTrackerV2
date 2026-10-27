# Revisión de arquitectura y calidad — Drunagor Turn Tracker V2

> Documento de propuesta. **Nada de este documento se ha aplicado todavía**: cada punto es una decisión independiente que puedes **aceptar** o **posponer**.
> Fecha de revisión: 2026-10-27 · Rama: `main` · Build verificado: OK

---

## 1. Resumen ejecutivo

| Métrica | Valor actual | Objetivo propuesto |
|---|---|---|
| Tamaño de `dist/` | **32,15 MB** (147 archivos) | < 8 MB |
| Imagen más pesada | **2,3 MB** PNG | < 250 KB WebP |
| Archivo más grande | `InitTracker.jsx` **4.090 líneas** | < 500 por archivo |
| `<img>` totales / con `lazy` | 25 / **5** | 25 / 25 |
| Tests automatizados | **0** | Smoke E2E + unit de utilidades |
| Linter / formato | **ninguno** | ESLint + Prettier en CI |
| Backend / API | **no existe** (local-first) | Decisión explícita documentada |
| CI/CD | Deploy a GitHub Pages | + calidad y tests como *gates* |

**Fortalezas actuales** (no tocar): arquitectura por contextos, validación de snapshots, `ErrorBoundary`, code-splitting por ruta con `lazy`, `prefers-reduced-motion`, sin `dangerouslySetInnerHTML`, `noopener` en enlaces externos, persistencia versionada.

**Riesgos principales**: imágenes sin optimizar, monolito `InitTracker`, ausencia de tests, restauración de guardados que deja residuos, y datos de héroe sin validación al importar.

---

## 2. Sugerencias de diseño (UI/UX)

### D1 · Vista de eventos: historial cronológico con agrupación por ronda
- **Qué**: agrupar las entradas del historial por ronda/turno con cabeceras colapsables y contador por tipo.
- **Por qué**: hoy es una lista plana de 10 entradas; con 300 entradas el usuario pierde el hilo.
- **Cómo**: `groupBy(round)` en `HistoryPanel`, `<details>` por ronda, chips de recuento (`turnos`, `daño`, `runas`, `invocaciones`).
- **Impacto**: alto en legibilidad · **Esfuerzo**: M.

### D2 · Vista de eventos: línea temporal visual del turno
- **Qué**: una franja superior con el turno actual, el anterior y el siguiente (tarjetas mini), como un “carrusel” del orden de iniciativa.
- **Por qué**: el usuario sabe el número de turno, pero no ve de un vistazo el contexto.
- **Cómo**: derivar de `TURN_ORDER` + `turnIndex`; reutilizar `EnemyCard`/`CharacterCard` en tamaño reducido.
- **Impacto**: alto en orientación · **Esfuerzo**: M.

### D3 · Vista de eventos: filtros por tipo y búsqueda
- **Qué**: chips `Todos / Turnos / Daño / Runas / Invocaciones / Eventos` + caja de búsqueda.
- **Cómo**: `useMemo` sobre `readGameLog()`, filtro por `kind` y `message.toLowerCase().includes(q)`.
- **Impacto**: medio · **Esfuerzo**: S.

### D4 · Toasts de escenario: pila lateral con iconos y color por tipo
- **Qué**: mover los avisos de escenario a una columna inferior-izquierda, con icono por tipo (daño, runa, invocación, muerte) y barra de vida del afectado.
- **Por qué**: hoy son 5 toasts centrados que tapan el tablero en el móvil.
- **Cómo**: contenedor `fixed bottom-3 left-3`, `role="status"`, animación de entrada/salida respetando `reduced-motion`.
- **Impacto**: alto en móvil · **Esfuerzo**: S-M.

### D5 · Vista ampliada de héroe: cabecera fija con “chips” de estado
- **Qué**: al hacer scroll, mantener la cabecera con nombre, vida resumida y hasta 6 iconos de estado.
- **Cómo**: `sticky top-0` en el header del modal + `backdrop-blur`.
- **Impacto**: medio · **Esfuerzo**: S.

### D6 · Tablero: resaltado del slot activo y flecha de siguiente
- **Qué**: halo esmeralda en el slot en curso y flecha hacia el siguiente slot (útil en modo presentación).
- **Cómo**: `turn-active` ya existe en `index.css`; aplicarlo al `track-slot` cuyo `index === currentSlotIndex`.
- **Impacto**: alto en mesas grandes · **Esfuerzo**: S.

### D7 · Tablero: densidad conmutable (compacta / normal)
- **Qué**: botón que reduzca altura de slot y tamaño de carta un 15 % para mesas con muchos enemigos.
- **Cómo**: variable CSS `--track-density` en `.track-slot`.
- **Impacto**: medio · **Esfuerzo**: S-M.

### D8 · Accesibilidad de diálogos
- **Qué**: *focus trap* y devolución del foco al elemento que abrió el modal; `aria-describedby` en los campos.
- **Por qué**: hoy solo se enfoca el botón Cerrar y se escucha `Escape` (0 *focus traps* en el repo).
- **Cómo**: hook `useFocusTrap(ref)` reutilizable (~40 líneas) aplicado a los 4 modales.
- **Impacto**: alto (WCAG 2.4.3) · **Esfuerzo**: S.

### D9 · Sistema visual: tokens de color y tipografía
- **Qué**: centralizar en `index.css` los colores de facción, estados y tipos de evento hoy dispersos (`bgColorMap`, `KIND_STYLES`, `colorMap`).
- **Cómo**: variables CSS `--faction-white`, `--event-turn`, `--state-burn`… consumidas por las clases.
- **Impacto**: medio (coherencia y tema claro futuro) · **Esfuerzo**: M.

---

## 3. Arquitectura y refactor

### A1 · Dividir `InitTracker.jsx` (4.090 líneas)
Extraer en este orden (menor riesgo → mayor):

| Extracción | Destino | Líneas aprox. |
|---|---|---|
| Motor de turnos + refs | `src/hooks/useTurnEngine.js` | ~600 |
| Efectos de estados (enemigo/héroe) | `src/hooks/useStatusEffects.js` | ~250 |
| Tablero y slots | `src/components/track/TrackBoardSlots.jsx` | ~400 |
| Paneles de pilas/spawn | `src/components/track/ScenarioPanels.jsx` | ~350 |

- **Impacto**: alto (mantenibilidad, testabilidad) · **Esfuerzo**: L · **Riesgo**: medio (requiere verificación visual tras cada extracción).

### A2 · Caché de `getHeroExtras`
- **Problema**: hoy se llama en el render de cada carta y **parsea `localStorage` + normaliza** en cada render.
- **Solución**: memoizar por `heroId` e invalidar con un contador de versión.
- **Impacto**: medio (rendimiento con 5 héroes y muchos re-renders) · **Esfuerzo**: S.

### A3 · Escritura diferida de `heroExtras`
- **Problema**: cada clic `+`/`−` hace `JSON.stringify` + escritura síncrona.
- **Solución**: *debounce* de 250 ms con *flush* al cerrar el modal.
- **Impacto**: medio (jank en móvil) · **Esfuerzo**: S.

### A4 · Contexto único de “extras de héroe”
- **Problema**: el modal escribe en `localStorage` y el tablero lo relee; no hay fuente de verdad reactiva.
- **Solución**: `HeroExtrasContext` con `state` + `dispatch`, persistencia en el proveedor.
- **Impacto**: alto (elimina la clase de bugs de desincronización) · **Esfuerzo**: M.

### A5 · Unificar constantes de UI
`BASE_GAP`, `CARD_HEIGHT`, `MAX_STACK_HEIGHT` viven dentro del componente; moverlos a `src/components/track/constants.js`.
- **Impacto**: bajo · **Esfuerzo**: S.

### A6 · Tests mínimos
- Unit: `storage.js`, `saves.js`, `heroExtras.js`, `heroStatus.js` (Vitest).
- E2E: turno avanza, guardados contienen héroes, importación no deja residuos (Playwright).
- **Impacto**: alto (protege refactors) · **Esfuerzo**: M.

---

## 4. API y puntos finales

**Situación actual:** la aplicación es **local-first**; no hay backend ni llamadas HTTP (confirmado en `.env.example`: *“Reservada para una futura API; actualmente la app no realiza llamadas HTTP”*).

### P1 · Decisión explícita: mantener local-first (recomendado)
- Documentar en `README` que no hay API y que la persistencia es `localStorage`.
- **Impacto**: evita trabajo innecesario y costes de servidor · **Esfuerzo**: S.

### P2 · Contrato opcional si se añade sincronización multi-dispositivo

Si en el futuro quieres compartir partidas entre dispositivos, este sería el contrato mínimo (no implementado):

| Método | Ruta | Cuerpo | Respuesta |
|---|---|---|---|
| `POST` | `/api/v1/sessions` | `{ snapshot, name }` | `201 { id, createdAt }` |
| `GET` | `/api/v1/sessions/:id` | — | `200 { snapshot }` |
| `PUT` | `/api/v1/sessions/:id` | `{ snapshot }` | `200 { updatedAt }` |
| `DELETE` | `/api/v1/sessions/:id` | — | `204` |
| `GET` | `/api/v1/health` | — | `200 { status: "ok" }` |

Reglas: `snapshot` validado con el mismo `extractSnapshotData`, `schemaVersion` obligatorio, límite de 1 MB por sesión, `ETag`/`If-Match` para evitar sobrescrituras, y token anónimo por dispositivo (`X-Device-Id`).

### P3 · Versionado de datos
Cualquier API futura debe rechazar `schemaVersion` desconocido con `409` y devolver el `schemaVersion` soportado.

---

## 5. Variables de entorno

| Variable | Uso actual | Valor | Notas |
|---|---|---|---|
| `VITE_BASE_PATH` | base de Vite y `BrowserRouter` | `/DrunagorTurnTrackerV2/` | Cambiar a `/` con dominio propio |
| `VITE_SOURCEMAP` | mapas de producción | `false` | Nunca `true` en producción |
| `VITE_API_BASE_URL` | reservada | vacío | Solo si se acepta P2 |
| `VITE_APP_VERSION` | **propuesta** | `1.0.0` | Mostrar en “Acerca de” y en los guardados |
| `VITE_ENABLE_DEVTOOLS` | **propuesta** | `false` | Evita exponer paneles internos |

### E1 · Validar variables en build
Fallar el build si `VITE_BASE_PATH` no empieza y termina en `/`.
- **Impacto**: evita despliegues rotos · **Esfuerzo**: S.

### E2 · `.env.example` con codificación correcta
Detectado texto corrupto (`raÃ­z`, `producciÃ³n`) en el archivo actual.
- **Solución**: reescribir en UTF-8 sin BOM.

### E3 · Incluir la versión en el snapshot
`schemaVersion: 2` + `appVersion`, para diagnosticar guardados antiguos.

---

## 6. Dependencias

| Paquete | Versión | Acción | Motivo |
|---|---|---|---|
| `react` / `react-dom` | 18.2 | **Mantener** (o planificar 19) | React 19 exige revisar `framer-motion` y `react-toastify` |
| `react-router-dom` | 7.18 | Mantener | Correcto |
| `framer-motion` | 12.10 | Mantener | Usado en menús y rutas |
| `lucide-react` | 0.503 | **Revisar uso** | Conviven dos librerías de iconos (`react-icons` + `lucide`); unificar reduce bundle |
| `uuid` | 11.1 | **Sustituir por `crypto.randomUUID()`** | Ya usado en `saves.js`; elimina dependencia |
| `classnames` | 2.5 | Mantener | Uso extendido |
| `tailwindcss` | 3.4 | **No migrar a 4 todavía** | Requiere cambios de configuración y plugins |
| `vite` | 6.3 | Mantener | Correcto para Node 22 |
| `@playwright/test` | 1.64 | Mantener + CI | Base para los tests E2E |

### X1 · Unificar iconos
- **Impacto**: −30/60 KB de bundle · **Esfuerzo**: M.

### X2 · Eliminar `uuid`
- **Impacto**: −1 dependencia · **Esfuerzo**: S (`globalThis.crypto.randomUUID()`).

### X3 · Añadir `vitest` + `@testing-library/react` (dev)
- **Impacto**: permite A6 · **Esfuerzo**: S.

### X4 · Añadir `eslint` + `prettier` (dev)
- **Impacto**: evita bugs (hooks, imports) · **Esfuerzo**: S.

---

## 7. Configuración del framework

### F1 · `vite.config.js`: `manualChunks`
Separar `vendor-react`, `vendor-motion`, `vendor-icons` para caché de larga duración.
```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        'vendor-motion': ['framer-motion'],
        'vendor-icons': ['react-icons', 'lucide-react'],
      },
    },
  },
}
```

### F2 · Compresión de imágenes en build
Plugin de imágenes (`vite-imagetools` o `sharp` en script previo) → WebP/AVIF con `srcset`.
- **Impacto**: el mayor ahorro del proyecto (32 MB → < 8 MB) · **Esfuerzo**: M.

### F3 · `tailwind.config`: `content` correcto y `safelist`
Verificar que solo escanea `index.html` y `src/**/*.{js,jsx}`; añadir `safelist` para clases dinámicas de facción/estado.

### F4 · Cabeceras de seguridad en el hosting
`Content-Security-Policy` con `default-src 'self'`, `img-src 'self' data:`, `style-src 'self' 'unsafe-inline'`.
- En GitHub Pages no se pueden definir cabeceras: usar `<meta http-equiv>` como mitigación parcial, o mover a Cloudflare Pages/Netlify si se acepta F4.

### F5 · `robots.txt` y metadatos
Añadir `public/robots.txt`, `theme-color`, y `og:` básicos.

---

## 8. Hoja de ruta de publicación

1. **Preparación local** — `npm ci` · `npm run build` · `npm run preview` · `npm run visual:check`.
2. **Control de calidad** (nuevo) — `npm run lint` · `npm run test` · `npm run test:e2e`.
3. **Build de producción** — `VITE_BASE_PATH=/ VITE_SOURCEMAP=false npm run build`; verificar `dist/index.html`, tamaños y `404.html`.
4. **Dominio y hosting**
   - **GitHub Pages (actual)**: `VITE_BASE_PATH=/DrunagorTurnTrackerV2/`; el workflow ya publica en `main`.
   - **Dominio propio**: crear `public/CNAME` con `tracker.tudominio.com`, DNS `CNAME → jcarlosorte.github.io`, y cambiar `VITE_BASE_PATH=/`.
   - **Cloudflare Pages / Netlify (recomendado si aceptas F4)**: build `npm run build`, salida `dist`, cabeceras y redirección SPA.
5. **CI/CD**
   - Job `quality`: `npm ci` → `lint` → `test` → `build`.
   - Job `deploy`: solo en `main` tras `quality`, con `actions/deploy-pages`.
   - Añadir `npm audit --omit=dev --audit-level=high` (hoy sin umbral, puede romper el deploy por avisos bajos).
6. **Cache busting** — Vite ya genera hash; configurar `Cache-Control: max-age=31536000, immutable` para `/assets/*` y `no-cache` para `index.html`.
7. **Observabilidad** — opcional: Sentry (o `window.onerror` a un endpoint propio) y un `healthcheck` estático.
8. **Rollback** — conservar los últimos artefactos de Pages; el `workflow_dispatch` permite republicar cualquier commit.

---

## 9. Hallazgos de código (impacto · explicación · solución)

> Cada hallazgo es independiente. Marca **Aceptar** o **Posponer**.

### H1 · Restauración de guardados deja residuos ⚠️ *confirmado empíricamente*
- **Impacto**: alto — mezcla de datos entre partidas.
- **Explicación**: `applyStorageData` solo escribe las claves presentes en el snapshot. Si cargas una partida antigua sin `heroExtras` (o sin `gameLog`), **se conservan** los de la partida actual. Verificado: tras eliminar `heroExtras` del guardado y cargarlo, `heroExtras.vorn` seguía existiendo con `vida: 7`.
- **Solución**: limpiar el ámbito antes de aplicar.
```js
export function applyStorageData(data, { scope = 'full' } = {}) {
  if (!isPlainObject(data)) throw new Error('Datos de partida no válidos');
  if (scope === 'full' || scope === 'track') clearTrackState();
  Object.entries(data).forEach(([key, value]) => {
    if (GAME_STORAGE_KEYS.includes(key)) writeJsonStorage(key, value);
  });
}
```
- **Decisión sugerida**: **Aceptar** (bug real, arreglo pequeño).

### H2 · `clearGameSession` no borra `heroExtras`
- **Impacto**: medio — “nueva partida” conserva la vida/equipo de los héroes.
- **Explicación**: la lista de claves está duplicada y desactualizada respecto a `TRACK_STORAGE_KEYS`.
- **Solución**: usar la constante compartida.
```js
export function clearGameSession() {
  if (!canUseStorage()) return;
  ['trackerData', ...TRACK_STORAGE_KEYS].forEach((key) => removeStorage(key));
}
```
- **Decisión sugerida**: **Aceptar**.

### H3 · Sin validación de datos de héroe al importar
- **Impacto**: alto — un JSON manipulado puede dejar `vida: -5`, `vidaMax: 0` o `cubos` con 99.
- **Explicación**: `validateStorageData` solo comprueba que `heroExtras` sea objeto plano.
- **Solución**: normalizador con topes.
```js
const HERO_LIMITS = { vidaMax: [1, 99], trauma: [0, 2], maldicion: [0, 5], impactoMod: [-20, 20] };
function clamp(value, [min, max]) { return Math.min(max, Math.max(min, Number(value) || 0)); }
export function sanitizeHeroExtras(raw) {
  /* recorre cada héroe, aplica clamp a vida/vidaMax/trauma/maldicion/impactoMod,
     valida cubos 0..cubosMax, estadosAlterados con max por estado y descarta ids desconocidos */
}
```
- **Decisión sugerida**: **Aceptar** (seguridad + integridad).

### H4 · `schemaVersion` no sube con las nuevas funciones
- **Impacto**: medio — no se puede distinguir un guardado previo a la gestión de héroes.
- **Solución**: `schemaVersion: 3` + migrador `migrateSnapshot(snapshot)` que rellene `heroExtras` con valores base y lo registre.
- **Decisión sugerida**: **Aceptar**.

### H5 · Cálculo de daño duplicado entre enemigos y héroes
- **Impacto**: medio — riesgo de divergencia (ya ocurrió: reducción no aplicada a héroes).
- **Solución**: una sola función `applyStatusEffects(entity, phase, { getConfig, labels })` usada por ambos; los héroes pasan un adaptador `extras → { vida, estadosAlterados }`.
- **Decisión sugerida**: **Aceptar** (evita la clase de bug que acabas de reportar).

### H6 · Modales sin *focus trap*
- **Impacto**: medio (accesibilidad).
- **Solución**: `useFocusTrap` y restaurar foco al abridor.
- **Decisión sugerida**: **Aceptar** (D8).

### H7 · Imágenes sin `lazy` ni formatos modernos
- **Impacto**: alto (32 MB de `dist`; 20 de 25 `<img>` sin `loading="lazy"`).
- **Solución**: `loading="lazy" decoding="async"` en las 20 restantes + conversión a WebP con `srcset`.
- **Decisión sugerida**: **Aceptar** (F2).

### H8 · `InitTracker.jsx` monolítico
- **Impacto**: alto (mantenibilidad y riesgo en cada cambio).
- **Solución**: ver A1, extracción por fases con verificación visual.
- **Decisión sugerida**: **Posponer** hasta cerrar funcionalidad; ejecutar A1.1 (motor de turnos) primero.

### H9 · Sin tests ni linter
- **Impacto**: alto (cada cambio se valida a mano).
- **Solución**: X3 + X4 + A6 y *gates* en CI.
- **Decisión sugerida**: **Aceptar** (empezar por `heroStatus` y `storage`).

### H10 · `npm audit` sin umbral en CI
- **Impacto**: medio — un aviso de severidad baja rompe el deploy.
- **Solución**: `npm audit --omit=dev --audit-level=high`.
- **Decisión sugerida**: **Aceptar**.

### H11 · Escritura síncrona por clic en `heroExtras`
- **Impacto**: medio-bajo (jank en móviles lentos).
- **Solución**: A3 (*debounce* 250 ms + flush al cerrar).
- **Decisión sugerida**: **Posponer** (medir antes).

### H12 · `getHeroExtras` en el render de cada carta
- **Impacto**: medio-bajo.
- **Solución**: A2 (caché por versión).
- **Decisión sugerida**: **Aceptar** (barato).

---

## 10. Guardados: verificación de datos de héroe

**Prueba realizada** (guardar partida con héroe configurado y leer el registro):

```text
trackKeys  = ["gameState","initEnemiesState","initRunesState","heroExtras"]
heroFields = [vida, vidaMax, trauma, maldicion, impactoMod, auras, consecuencias,
              estados, estadosAlterados, equipo, equipoMods, cubos, cubosMax, cubosVersion]
muestra    = { vida: 7, vidaMax: 12, impactoMod: 3,
               cubos: {amarillo:1,rojo:1,verde:1,azul:1},
               equipoMods: {arma:{value:2,stat:"ataque"}, amuleto:{value:1,stat:"movimiento"}},
               estadosAlterados: [{id:"VENENO_I",count:2}] }
```

**Conclusión**: el guardado **sí contiene toda la información nueva de los héroes**. Los problemas están en la **restauración** (H1), en la **limpieza** (H2) y en la **validación** (H3).

### G1 · Falta `heroManagement` en el snapshot
- **Impacto**: medio — el interruptor de gestión vive fuera de `GAME_STORAGE_KEYS`; al cargar una partida no se restaura.
- **Solución**: añadir `heroManagement` a `GAME_STORAGE_KEYS` y persistir como booleano.
- **Decisión sugerida**: **Aceptar**.

### G2 · Residuos al importar (ver H1)
### G3 · Sin validación de héroe al importar (ver H3)
### G4 · Añadir `appVersion` y `heroesVersion` al snapshot
- **Impacto**: bajo — facilita migraciones futuras.

---

## 11. Tabla de decisión

| ID | Tema | Impacto | Esfuerzo | Sugerencia |
|---|---|---|---|---|
| H1 | Residuos al cargar partidas | Alto | S | **Aceptar** |
| H2 | `clearGameSession` incompleto | Medio | S | **Aceptar** |
| H3 | Validación de `heroExtras` | Alto | M | **Aceptar** |
| G1 | Guardar `heroManagement` | Medio | S | **Aceptar** |
| H4 | `schemaVersion` 3 + migrador | Medio | S | **Aceptar** |
| H10 | Umbral de `npm audit` | Medio | S | **Aceptar** |
| H7 | Imágenes lazy + WebP | Alto | M | **Aceptar** |
| H12 | Caché `getHeroExtras` | Medio-bajo | S | **Aceptar** |
| H6 | Focus trap en modales | Medio | S | Aceptar |
| H9 | Linter + tests | Alto | M | Aceptar |
| H5 | Unificar motor de estados | Medio | M | Aceptar |
| D1 | Historial agrupado por ronda | Alto | M | Aceptar |
| D4 | Toasts laterales | Alto | S-M | Aceptar |
| D6 | Slot activo resaltado | Alto | S | Aceptar |
| D3 | Filtros de historial | Medio | S | Posponer |
| D2 | Carrusel de turnos | Alto | M | Posponer |
| D7 | Densidad del tablero | Medio | S-M | Posponer |
| D9 | Tokens de color | Medio | M | Posponer |
| A1 | Dividir `InitTracker` | Alto | L | Posponer |
| A4 | Contexto de extras | Alto | M | Posponer |
| H11 | Escritura diferida | Medio-bajo | S | Posponer |
| P2 | API de sincronización | — | L | Posponer |

**Orden recomendado si aceptas todo lo marcado**: H1 → H2 → G1 → H3 → H4 → H10 → H12 → D6 → D4 → D1 → H6 → H7 → H9 → H5.

---

## 12. Anexo: comandos

```bash
npm ci
npm run build
npm run preview
npm run visual:check

# Con las mejoras propuestas
npm run lint
npm run test
npm run test:e2e
```

---

## 13. Estado de implementación

### 1.ª tanda — guardados y sincronización de UI

| ID | Cambio | Archivos |
|---|---|---|
| H1 | Cargar partida limpia el track antes de aplicar (`applyStorageData(data, { scope })`) | `storage.js`, `SavesPanel.jsx` |
| H2 | `clearGameSession` usa `TRACK_STORAGE_KEYS` (incluye `heroExtras`) | `storage.js` |
| G1 | `heroManagement` viaja en el snapshot (configuración) | `storage.js` |
| H3 | `sanitizeHeroExtras`: topes de vida, cubos, trauma/maldición, impacto y estados válidos | `heroSanitize.js` |
| H4 | `schemaVersion: 3` + `migrateSnapshot` (v1/v2 → v3) | `storage.js`, `SavesPanel.jsx` |
| H10 | `npm audit --omit=dev --audit-level=high` | `deploy.yml` |
| H12 | Caché de `getHeroExtras` con invalidación en escritura y `storage` | `heroExtras.js` |
| D6 | Resaltado del slot activo (`.track-slot--active`) | `InitTracker.jsx`, `index.css` |
| D4 | Avisos de escenario en pila lateral con icono y color por tipo | `InitTracker.jsx`, `toastKind.js` |
| H13 | Los efectos de inicio de turno persisten (`processed.hero`, `lastHeroTurn`): recargar ya no los repite | `InitTracker.jsx` |

### 2.ª tanda — motor único, accesibilidad y calidad

| ID | Cambio | Archivos |
|---|---|---|
| H5 | Motor único `applyStatusEffects` para enemigos y héroes (daño, escudos, reducción, tope 4) | `statusEngine.js`, `heroStatus.js` |
| H6 | *Focus trap* reutilizable en héroes, enemigos, dados y confirmaciones | `useFocusTrap.js`, modales |
| H7 | `loading="lazy" decoding="async"` en 19 imágenes + optimización PNG en origen | varios, `optimize-images.mjs` |
| H9 | ESLint (flat config) + Vitest + *gates* en CI | `eslint.config.js`, `vitest.config.js`, `deploy.yml` |

**Resultados**: `dist` 32,15 MB → 14,83 MB · 26 tests · 3 bugs reales detectados por el linter (`setHeroStat` sin exportar, `useLanguage` condicional, `t.emptyPila` inexistente).

> `vite-plugin-image-optimizer` se descartó: duplicaba los archivos optimizados en la raíz del repositorio en cada build.

### 3.ª tanda — historial, cabecera de héroe y limpieza

| ID | Cambio | Archivos |
|---|---|---|
| D1 | Historial agrupado por turno con cabeceras colapsables y contadores | `HistoryPanel.jsx` |
| D3 | Filtros por tipo + búsqueda de texto | `HistoryPanel.jsx` |
| D5 | Cabecera fija del héroe con vida resumida e iconos de estado | `ModalHeroCard.jsx` |
| X1 | Eliminada `lucide-react` (0 usos) | `package.json` |
| X2 | Eliminada `uuid`: `createId()` usa `crypto.randomUUID()` | `id.js` |

### 4.ª tanda — bug de la paleta de estados y primera parte de A1

| Cambio | Detalle | Archivos |
|---|---|---|
| **Bug corregido** | Al consumirse un estado desaparecían todos los botones del panel; ahora la paleta sale del catálogo y siempre está visible | `ModalEnemyCard.jsx` |
| A1 (1/2) | Geometría del tablero extraída (`overlapFor`, `stepFor`, `stackHeight`, `boardSlotHeightFrom`, `compactSlotHeight`, `cardDistance`) | `trackLayout.js` |
| A1 (2/2) | `CharacterCard` y `TrackSlot` extraídos con dependencias explícitas | `CharacterCard.jsx`, `TrackSlot.jsx` |

`InitTracker.jsx`: 4.199 → 3.829 líneas (−370).

### 5.ª tanda — deuda pequeña y E2E en CI

| ID | Cambio | Archivos |
|---|---|---|
| E2 | `.env.example` en UTF-8 (tenía `raÃ­z`) + `VITE_APP_VERSION` | `.env.example` |
| E3 | `appVersion` en cada snapshot | `storage.js` |
| F5 | `robots.txt`, `theme-color`, descripción y Open Graph | `index.html`, `public/robots.txt` |
| H11 | Escrituras de `heroExtras` agrupadas (250 ms) con volcado al guardar/ocultar/cerrar | `heroExtras.js`, `storage.js` |
| F1 | `manualChunks` por paquete (`vendor-icons`, `vendor-router`) | `vite.config.js` |
| — | Suite **E2E Playwright** (10 pruebas) + job en CI con reporte en fallo | `tests/e2e/*`, `playwright.config.js`, `deploy.yml` |

**Cobertura E2E**: 11 posiciones · resaltado del turno · lista compacta · estados del enemigo que se consumen · paleta siempre disponible · snapshot con versión y datos de héroe · saneado al cargar · cabecera del héroe · *focus trap* · dado trampa.

### 6.ª tanda — correcciones visuales y C (WebP)

| Cambio | Detalle | Archivos |
|---|---|---|
| **Regresión corregida** | `countsPerSlot` devolvía alturas y `boardSlotHeightFrom` volvía a aplicar `stackHeight`: el tablero crecía al doble y había que hacer scroll para ver el track | `InitTracker.jsx`, `trackLayout.test.js` |
| **Resaltado del turno** | Haz vertical de 3 px sobre la línea + anillo esmeralda en la etiqueta; no tapa cartas y funciona en tablero y lista | `index.css` |
| Configuración · héroes | Ilustraciones con `object-contain`: ya no se recortan | `Tracker.jsx` |
| Configuración · enemigos | Selección rápida por expansión con `aria-pressed`, color activo, check, contador `n/total` y tooltip | `Tracker.jsx` |
| Vistas ampliadas | Paleta de estados con `flex-wrap`: en móvil se reparte en varias filas sin salirse | `ModalEnemyCard.jsx`, `ModalHeroCard.jsx` |
| **C · WebP** | 57 ilustraciones convertidas (calidad 82) e imports actualizados por script | `convert-to-webp.mjs`, `src/assets/**` |

**Resultados**

```text
dist        32,15 MB → 8,87 MB  (−72 %)
tablero     slot 457 px · viewport 718/718 (sin scroll vertical)
resaltado   haz 3×448 px contenido + anillo rgb(52,211,153)
móvil 390   fila de estados 300/300 y 312/312 → sin desbordar
E2E         10/10 · Unit 33/33 · Lint 0 errores
```

Scripts: `npm run images:webp` (conversión + imports) y `npm run images:optimize` (compresión PNG).

### 7.ª tanda — correcciones persistentes y nuevas vistas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Tablero más bajo** | `MIN_SLOT_HEIGHT` 448 → 340 y `compact` 360 → 300: el track sube ~55 px y desaparece el espacio muerto | `trackLayout.js` |
| **Anillo en la carta** | El resaltado del turno pasa de la etiqueta a **la carta activa** (`.track-card--active`, radio 12 px + halo) | `TrackSlot.jsx`, `index.css` |
| Config · héroes | Ilustraciones `object-contain` sobre fondo oscuro (sin recortes) | `Tracker.jsx` |
| Config · enemigos | Selección rápida con `data-state`, tres tonos, check/contador y texto “Todos añadidos / 8/10 añadidos / Sin añadir” | `Tracker.jsx` |
| Modales | Paleta de estados con `flex-wrap` y chips `w-8` en móvil: 320 px → fila 230/230 y 242/242 sin desbordar | ambos modales |
| Móvil | La bolsa de runas arranca cerrada por debajo de 1024 px | `InitTracker.jsx` |
| **D2 · Carrusel** | Franja anterior / actual / siguiente con icono por tipo y anillo en el turno actual | `TurnCarousel.jsx` |
| **D7 · Densidad** | Botón en la barra: escala cartas y pilas 0,85× y se guarda en `trackDensity` | `TurnTrackBoard.jsx`, `TrackSlot.jsx` |
| **D9 · Tokens (parcial)** | Paleta de eventos (`--event-*`) y clases `.history-kind-*` usadas por el historial | `index.css`, `HistoryPanel.jsx` |
| **A4 · Contexto de héroe** | `HeroExtrasProvider` como fuente de verdad reactiva; `InitTracker` y el modal dejan de llevar contadores manuales | `HeroExtrasContext.jsx`, `InitTracker.jsx`, `AnimatedRoutes.jsx` |
| **H8 (1/3)** | `useStatusEffects`: efectos de enemigo y héroe fuera de `InitTracker` | `useStatusEffects.js` |

**Verificación**

```text
Carrusel    prev=Vorn · current=Arquero Esqueleto · next=Jaheen
Densidad    slot 347 → 251 px · aria-pressed=true · trackDensity="compact"
Anillo      box-shadow rgba(52,211,153,0.95) sobre la carta (radio 12 px)
Móvil 320   paleta enemigo 230/230 · héroe 242/242
Suite       Lint 0 errores · Unit 33 · E2E 12/12 · dist 8,88 MB
```

### 7.ª tanda (ajustes)

| Cambio | Detalle | Archivos |
|---|---|---|
| **Halo eliminado** | Fuera el haz y el anillo delánime turno activo. Queda la flecha sobre la carta y `data-current-turn` como marca | `index.css`, `TrackSlot.jsx` |
| **Imágenes al ras** | Configuración de héroes y enemigos: `object-cover object-top`, de modo que el borde superior de la ilustración coincide con el marco | `Tracker.jsx` |
| **Arranque blindado** | `useHeroExtras` ya no lanza si falta el proveedor (caso de fragmentos antiguos en caché): usa las utilidades directamente | `HeroExtrasContext.jsx` |
| **ErrorBoundary útil** | Detecta fallos de *chunk* (“Hay una versión nueva…”), ofrece **Recargar** y muestra los detalles técnicos bajo demanda | `ErrorBoundary.jsx` |

**Verificación**

```text
Turno      ::before content = none · flecha presente · carta marcada
Tablero    slot 347 px · sin scroll de página
Héroe img  object-fit cover · object-position 50% 0% · borde superior alineado
Enemigo    object-fit cover · object-position 50% 0%
Suite      Lint 0 · Unit 33 · E2E 12/12 · dist 8,88 MB
```
### 8.ª tanda — reorganización de la barra del tablero

| Cambio | Detalle | Archivos |
|---|---|---|
| **Una sola fila** | Barra en tres zonas: izquierda (Tablero/Lista + ronda), centro (Deshacer/Siguiente) y derecha con dos cuadros: **Vista del tablero** y **Paneles** | `TurnTrackBoard.jsx` |
| **Cuadro Vista** | Densidad · solape de cartas · zoom (%) · modo presentación | `TurnTrackBoard.jsx` |
| **Cuadro Paneles** | Bolsa · historial · **turnos** · dados | `TurnTrackBoard.jsx` |
| **Carrusel abajo** | El panel anterior/actual/siguiente se mueve **debajo del tablero** y se muestra con su propio botón | `TurnTrackBoard.jsx`, `InitTracker.jsx` |
| **Solape de cartas** | Nuevo modo: acerca las cartas de cada pila al 72 % y reduce la altura del slot; se guarda en `trackOverlap` | `TrackSlot.jsx`, `initTracker` |
| Etiquetas | Botones de los cuadros solo con icono (tooltip y `aria-label`) para que quepa todo | `TurnTrackBoard.jsx` |

**Medición**

```text
1600×950   barra 64 px · una fila · grupos: Vista del tablero + Paneles
1280×800   barra 64 px · una fila
420×900    se apila en 3 filas (móvil) · carrusel oculto por defecto
Solape     separación 85 px → 61/53 px · slot 669 → 482 px · persistido
Carrusel   visible por defecto en escritorio · toggle 1 → 0
Suite      Lint 0 · Unit 33 · E2E 13/13
```
### 9.ª tanda — estados, portada y cronómetro

| Cambio | Detalle | Archivos |
|---|---|---|
| **Paleta de estados** | Chips flexibles (`flex-1 basis-0`, mínimo 2,1 rem y máximo 3,5 rem): ocupan **una sola fila** y se reparten todo el ancho, centrados; si no caben, pasan a varias filas | `ModalEnemyCard.jsx`, `ModalHeroCard.jsx` |
| **Portada animada** | Logo con latido (`homeLogoBeat`, 4,2 s) y esqueleto de fondo con deriva lenta (`SkeletonDrift`, 18 s, opacidad 7 %) | `HomeMenu.jsx`, `index.css` |
| **Cronómetro de turno** | `mm:ss` por turno, reiniciado al empezar cada uno; **rojo con anillo** a partir de 5:00 | `InitTracker.jsx`, `turnTimer.js` |
| **Tiempo por héroe** | Al cerrar el turno se suma a `tiempoTotal` del héroe y se registra en el historial: `⏱ Vorn: 00:04 · total 00:04` | `heroExtras.js`, `heroSanitize.js` |
| **Estadísticas** | El modal del héroe muestra **Tiempo total** al final, tras auras, consecuencias y estados | `ModalHeroCard.jsx` |
| **Versión visible** | `v1.0.0 · <commit>` en la barra superior para detectar builds antiguos | `BuildBadge.jsx`, `vite.config.js`, `TopMenu.jsx` |

**Medición**

```text
Cronómetro     00:01 → 00:03 (avanza 1 s)
Acumulado      vorn 4 s · historial "⏱ Vorn: 00:04 · total 00:04"
Modal héroe    Tiempo total 00:04
Paleta 1440    10 chips · 1 fila · 48 px cada uno · ocupa 518/518 px
Paleta 360     2 filas · 0 desbordamiento
Portada        logo homeLogoBeat · esqueleto homeSkeletonDrift (opacidad 0,07)
Suite          Lint 0 · Unit 36 · E2E 15/15 · dist 8,89 MB
```
### 10.ª tanda — seguridad, motor de turno y tokens

| Cambio | Detalle | Archivos |
|---|---|---|
| **F4 · CSP** | `<meta http-equiv="Content-Security-Policy">` inyectada solo en el build (GitHub Pages no permite cabeceras): `default-src 'self'`, `script-src 'self'`, `object-src 'none'`, `base-uri 'self'`, fuentes de Google permitidas | `vite.config.js` |
| **H8 2/3 · cursor** | `useTurnCursor` aísla índice, ronda, turnos extra y pila de deshacer (límite 10) | `hooks/useTurnCursor.js` |
| **H8 2/3 · orden** | `findNextActiveEntity` / `indexOfEntityInOrder` puros, con tests | `utils/turnOrder.js` |
| **H8 2/3 · historial** | `pushEntry` / `popEntry` con límite, con tests | `utils/turnHistory.js` |
| **D9 · facciones** | Tokens `--faction-*` y `--category-*`; clases `.faction-bg-*` y bordes tokenizados | `index.css` |
| **D9 · estados** | `--state-add`, `--state-remove`, `--state-chip-*` con `.state-btn-*` y `.state-chip` | `index.css`, `ModalEnemyCard.jsx` |
| **Avisos de lint** | **116 → 0**: imports muertos, variables sin usar, mapas obsoletos y 4 dependencias de hooks corregidas; los 2 efectos de turno intencionales quedan documentados con su `eslint-disable` | varios |
| **Tests** | +9 unitarios (`turnOrder`, `turnHistory`) y +1 E2E de CSP | `*.test.js`, `tests/e2e/seguridad.spec.js` |

**Medición**

```text
CSP            meta presente · 0 violaciones al cargar y al abrir modales
Facciones      borde rgb(255,255,255) desde --faction-blanco
Estados        chip rgba(30,41,59,.7) · + rgb(21,128,61) · − rgb(185,28,28)
InitTracker    4.087 → 4.000 líneas
Suite          Lint 0 errores/0 avisos · Unit 45 · E2E 16/16
```
### 11.ª tanda — volteo de cartas y fin de H8

| Cambio | Detalle | Archivos |
|---|---|---|
| **Volteo sin quedarse girado** | La carta ya no rota 180° de forma permanente: animación `cardFlipY` (0→90°→0) que la deja recta. El estado interno que se quedaba atascado desaparece | `index.css`, `EnemyCard.jsx`, `InitTracker.jsx` |
| **Alternancia A/B fiable** | La cara de partida se lee del tablero (no de la entidad, que puede estar desfasada) y la vuelta a A restaura un **respaldo** guardado en la propia carta | `InitTracker.jsx` |
| **Variante correcta** | Antes se copiaban estadísticas de otra categoría (`ataque 6 → 8`); ahora el respaldo conserva vida, ataque, movimiento y capacidades de la cara A, y la evolución se suma aparte | `InitTracker.jsx` |
| **Runas** | Mismo tratamiento: cara actual desde el tablero y animación sin giro persistente | `InitTracker.jsx` |
| **H8 3/3** | Paneles de escenario/pilas extraídos a `ScenarioPanels` (pilas, pila concentrada, barricadas, puntos de aparición, claves de runa y rescate): consume los contextos, sin props | `components/scenario/ScenarioPanels.jsx`, `TopMenu.jsx` |

**Medición**

```text
Animación   clase card-flip durante 0,6 s · al terminar transform:none
Caras       A → B → A → B alternando en turnos consecutivos
Estadísticas cara A  ataque 6 (+2 evolución) · movimiento 4 (+1) · vida 24
TopMenu     1.503 → 1.029 líneas · ScenarioPanels 540 líneas
Suite       Lint 0 · Unit 45 · E2E 18/18
```
### 12.ª tanda — historial acotado, versión y almacenamiento

| Cambio | Detalle | Archivos |
|---|---|---|
| **Historial acotado** | El panel ya no crece sin límite: `max-h-[55dvh]` en móvil y `max-h-[calc(100dvh-17rem)]` en escritorio, con scroll interno | `HistoryPanel.jsx`, `InitTracker.jsx` |
| **Sin arrastre** | Con el historial abierto la página vuelve a medir 900 px (antes 958): el tablero y la barra quedan fijos | `InitTracker.jsx` |
| **Versión solo en portada** | El badge `v1.0.0 · <commit>` sale del track y se coloca al pie de la página inicial | `TopMenu.jsx`, `HomeMenu.jsx` |
| **Rescate de cuota** | Si la escritura falla, se recorta el historial a 40 entradas y se reintenta; el aviso indica clave y tamaño | `storage.js`, `StorageWarning.jsx` |

**Medición**

```text
Historial   panel 628 px ≤ tablero 658 px · scroll interno activo
Página      900 px = ventana (sin arrastre)
Badge       track: ausente · portada: v1.0.0 · 1021a684
Suite       Lint 0 · Unit 45 · E2E 18/18
```
### 13.ª tanda — invocación de enemigos y cuota real

| Cambio | Detalle | Archivos |
|---|---|---|
| **Causa de la Plañidera** | `shadow_cultist_scenario` no declara `comportamiento` y no está en la lista configurable: el filtro exigía igualdad exacta y salía en silencio. Ahora se normaliza (`estandar`) y se aceptan las apariciones de escenario | `enemyVariant.js`, `InitTracker.jsx` |
| **Un solo criterio** | La selección de variante sale de una función pura usada por invocación manual, cartas y mecánicas; si no hay coincidencia se avisa, nunca se falla en silencio | `enemyVariant.js` |
| **Cuota acotada** | Al persistir se compacta cada enemigo (lista blanca de campos), se descartan estados a cero, se deduplica por `uuid` y se limita a 150 entradas | `enemySanitize.js`, `InitEnemiesContext.jsx` |
| **Barra móvil** | Botones de menú y grupo derecho con `shrink-0`: dejan de solaparse y el icono de Escenario queda pulsable | `TopMenu.jsx` |

**Medición**

```text
Datos de la Plañidera   categoría esbirro · color escenario · sin comportamiento · fuera de `enemies`
Antes                    filtro exacto → `selected = undefined` → return silencioso
Ahora                    findEnemyVariant la encuentra · toast si no hubiera coincidencia
Cuota                    payload de 1000 elementos descartado por la lista blanca (test)
Suite                    Lint 0 · Unit 59 · E2E 18/18
```
### Pendiente / pospuesto

- **H8**: cerrado en sus tres partes (cursor, orden/historial y paneles de escenario).
- **D9**: hecho para eventos, facciones y estados; quedan acentos sueltos de botones (verde/rojo) fuera de la paleta.
- **F2**: `srcset`/AVIF (WebP ya aplicado).
- **F4**: CSP por `<meta>`; `frame-ancestors`/`report-uri` siguen requiriendo cabeceras (solo con otro hosting).
- **P2**: API de sincronización (pospuesta por decisión de producto).