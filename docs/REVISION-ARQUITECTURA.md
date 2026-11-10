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

# Imágenes (después de añadir ilustraciones nuevas)
npm run images:webp      # PNG/JPG → WebP
npm run images:avif      # WebP/PNG → AVIF (actualiza imports)
npm run images:variants  # 320/640 para miniaturas + manifiesto
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
### 14.ª tanda — filtros del selector manual de enemigos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Filtros en cabecera** | Chips de color y categoría (con «Todos/Todas»), contador `visibles de total` y el buscador existente; el color inicial es el del menú y se valida contra las expansiones activas | `InitTracker.jsx`, `manualEnemyFilter.js` |
| **Facetas reales** | Solo se ofrecen colores y categorías presentes; las categorías se recalculan al cambiar de color y se limpian si dejan de aplicar | `manualEnemyFilter.js` |
| **Búsqueda sin acentos** | La consulta normaliza mayúsculas y diacríticos y busca por nombre traducido o id | `manualEnemyFilter.js` |
| **Pantallas bajas** | En móvil horizontal el modal crece a 94 dvh, compacta cabecera/chips/pie y mantiene la lista con scroll propio; en vertical los chips pasan a varias líneas | `index.css`, `InitTracker.jsx` |
| **Limpieza** | Se elimina `getEnemiesByColor`, sin uso tras unificar el filtrado | `InitTracker.jsx` |

**Medición**

```text
Unit       72 tests (9 nuevos del filtro)
E2E        21/21 (3 nuevos: apertura por color, combinación con contador, añadir)
Lint       0 problemas
Build      OK
Modal 844×390   cabecera compacta · lista 154 px · sin desborde horizontal · pie visible
Modal 667×375   lista 140 px · pie visible
Modal 390×844   chips en 3 líneas · lista 288 px
Modal 1440×950  lista 322 px
```

### 15.ª tanda — rediseño de runas y escenario

| Cambio | Detalle | Archivos |
|---|---|---|
| **Runas con cabecera fija** | Cabecera sticky con runas colocadas y fichas en bolsa; rejilla responsive de tarjetas (cartas, bolsa, manifestar, fichas, cascada) | `TopMenu.jsx` |
| **Zona de riesgo** | Las acciones sin deshacer (retirar del medidor, eliminar de la bolsa, reset) se agrupan al final y piden confirmación indicando el color afectado | `TopMenu.jsx`, `es.json`, `en.json` |
| **Escenario por secciones** | Monstruo y cartas con contadores en la cabecera; los retratos pasan a botones con `aria-pressed` | `TopMenu.jsx` |
| **Nodos en Runas** | `ScenarioPanels` (pilas, nodos, áreas) se mantiene en Runas con sección y contador propios | `TopMenu.jsx` |
| **Diálogos en portal** | Pulsar dentro de un `ConfirmDialog` ya no cierra el menú que lo abrió | `TopMenu.jsx` |

**Medición**

```text
Unit       72 tests
E2E        24/24 (3 nuevos: runas, confirmación de retirada, escenario)
Lint       0 problemas
Build      OK
Cabecera   sticky verificada tras scroll (top constante)
Contadores Runas 0 · Fichas 36/36 · Nodos 0 · Monstruo 0/3 · Cartas 0/2
Anchos     sin overflow horizontal (844 y 1440)
```

### 16.ª tanda — nodos de vuelta a Runas y cierre de D9

| Cambio | Detalle | Archivos |
|---|---|---|
| **Nodos en Runas** | `ScenarioPanels` vuelve a Runas como sección «Nodos y áreas» con contador; Escenario queda en monstruo y cartas | `TopMenu.jsx`, `es.json`, `en.json`, `runas-escenario.spec.js` |
| **D9 · botones** | 30 pares verde/rojo (`green-700`/`red-700`) pasan a `.state-btn-add`/`.state-btn-remove`; mismos colores, sin cambio visual | `TopMenu.jsx`, `ScenarioPanels.jsx`, `InitTracker.jsx`, `ModalHeroCard.jsx` |
| **D9 · verificación** | El E2E comprueba la clase y el color computado del botón de activación | `runas-escenario.spec.js` |

**Medición**

```text
Unit       72 tests
E2E        24/24
Lint       0 problemas
Build      OK
Botones    30 sustituciones automáticas + 2 manuales
Color      Activa Invadidos → rgb(21, 128, 61) desde --state-add
Nodos      chip «Nodos 0» y sección con «Añadir Pila de Runas» en Runas
```

### 17.ª tanda — nueva disposición de los menús

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enemigos en dos bloques** | Aleatorios 2×2 a la izquierda; manuales en dos filas (5+4) y botón genérico que abre el selector sin preselección; reset centrado debajo | `TopMenu.jsx`, `es.json`, `en.json` |
| **Runas en tres columnas** | Cartas \| bolsa \| añadir+manifestar en la primera fila; zona de riesgo en la segunda y nodos en la última | `TopMenu.jsx` |
| **Escenario lado a lado** | Monstruo y cartas en la misma fila desde `sm`; retratos limitados a 190 px con `srcset` | `TopMenu.jsx` |
| **Pruebas de estructura** | Cuatro E2E miden 2×2, dos filas, centrado del reset, tres columnas y fila de escenario | `enemigos-manual.spec.js`, `runas-escenario.spec.js` |

**Medición**

```text
E2E        28/28
Enemigos   aleatorios 2×2 · manuales 5+4 · reset centrado (±0 px)
Runas      3 columnas (y=123, 461 px) · riesgo antes que nodos
Escenario  2 columnas en 1440 y 844 · retratos 190 px (121 px en 844)
```

### 18.ª tanda — F2: AVIF y `srcset`

| Cambio | Detalle | Archivos |
|---|---|---|
| **AVIF** | 101 ilustraciones convertidas a AVIF q60; los imports pasan a `.avif` y los WebP/PNG quedan como respaldo sin importarse | `scripts/convert-to-avif.mjs`, `enemies.js`, `heroes.js`, `expansions.js`, `HomeMenu.jsx` |
| **Variantes 320/640** | 82 miniaturas con 91 variantes y manifiesto generado | `scripts/generate-image-variants.mjs`, `assets/imageVariants.js` |
| **`ResponsiveImage`** | Componente con `srcset`/`sizes` usado en cartas, héroes y retratos de escenario; cae al `src` normal si no hay variantes | `ResponsiveImage.jsx`, `EnemyCard.jsx`, `CharacterCard.jsx`, `TopMenu.jsx` |
| **Comandos** | `npm run images:avif` y `npm run images:variants` documentados | `package.json`, este documento |

**Medición**

```text
dist       8,9 MB → 8,36 MB (7,0 MB sin las variantes de srcset)
Imágenes   5,45 MB en dist (187 AVIF; los originales WebP/PNG no se importan)
Transfer   retrato de héroe 39 KB → 13 KB (−66 %) · tracker 269 KB → 196 KB (−27 %)
E2E        28/28 · Unit 72 · Lint 0
```

### 19.ª tanda — F4: CSP reforzada dentro de lo que permite Pages

| Cambio | Detalle | Archivos |
|---|---|---|
| **CSP endurecida** | `script-src-attr 'none'`, `worker-src 'none'`, `frame-src 'none'` y `upgrade-insecure-requests`; se mantiene `style-src 'unsafe-inline'` por los estilos de React/framer-motion | `vite.config.js` |
| **Metas de privacidad** | `referrer=no-referrer`, `color-scheme=dark` y `format-detection=telephone=no` | `index.html` |
| **Prueba de seguridad** | El E2E verifica las directivas nuevas, las metas y que `frame-ancestors` no se declara (se ignoraría en `<meta>`) | `seguridad.spec.js` |
| **Límites documentados** | `docs/SEGURIDAD.md`: cabeceras reales de Pages, clickjacking residual y qué haría falta para cerrarlo | `docs/SEGURIDAD.md` |

**Medición**

```text
CSP        14 directivas · 0 violaciones al cargar y al abrir un modal
HSTS       max-age=31556952, servido por GitHub Pages (curl -I)
Pages      sin frame-ancestors, report-to ni Permissions-Policy (documentado)
E2E        28/28 · Unit 72 · Lint 0
```

### 20.ª tanda — ajustes finos de menús y submenú Nodos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enemigos** | El botón «Manual» pasa a ser el 10.º de la rejilla, con el mismo icono de monstruo: dos filas de 5 | `TopMenu.jsx`, `es.json`, `en.json` |
| **Cartas de runa** | Tres filas: Oscuridad · Asalto · (Rey Redivivo + Huésped + Invadidos) | `TopMenu.jsx` |
| **Añadir y manifestar** | «Añadir Runas en Masa» y «Manifestar Runa» comparten fila en la tercera columna | `TopMenu.jsx` |
| **Zona de riesgo** | La frase va junto al título y las tarjetas se centran | `TopMenu.jsx` |
| **Submenú Nodos** | Sale de Runas: menú propio entre Runas y Escenario, icono `GiPositionMarker` y contador en la cabecera; desaparece el número suelto de la sección | `TopMenu.jsx`, i18n, specs |

**Medición**

```text
Enemigos   10 botones · 2 filas (5+5)
Runas      cartas y=164/214/264 · en masa y manifestar y=213
Riesgo     cabecera de 20 px (título + frase en una línea)
Nodos      menú entre Runas y Escenario · 1 sección · chip «Nodos 0»
E2E        29/29
```

### 21.ª tanda — Fase A: navegación, reglas y tutorial

| Cambio | Detalle | Archivos |
|---|---|---|
| **Portada** | Barra sin Partidas/Gestionar; botón Configurar con el texto correcto; accesos a Partidas y Tutorial en el contenido | `HomeMenu.jsx`, `TopMenuLanguage.jsx` |
| **Pie** | Marca DaRkFiDoDiDo (a la espera del logo definitivo), versión del build y enlaces a GitHub e Instagram | `SiteFooter.jsx` |
| **Tutorial** | Página `/tutorial` bilingüe con ocho secciones, ampliable con cada mejora | `pages/Tutorial.jsx`, `AnimatedRoutes.jsx`, i18n |
| **Versión de reglas** | `RulesProvider` con detección automática por Apocalipsis, forzado manual persistido y aviso de incoherencia | `utils/rulesVersion.js`, `context/RulesContext.jsx`, `Config.jsx` |
| **Partidas en Configuración** | Panel plegable con `SavesPanel`; desaparece el botón «Ir a Partidas» | `Config.jsx` |
| **Menú de juego** | Partidas, música, inicio, configuración e idioma bajo un desplegable en el track | `TopMenu.jsx` |
| **Estilos de configuración** | Títulos de paso con acento lateral, sin iconos; título principal en blanco | `Tracker.jsx` |

**Medición**

```text
E2E       34/34 (5 nuevos de Fase A)
Reglas    1.5 sin Apocalipsis · 2.0 con apocalypse_adventures · override 1.5 avisa
Menú      4 acciones + idioma · Escape cierra
Pie       GitHub, Instagram y v1.0.0 · hash visibles
```

### 22.ª tanda — Fase B: clases, recursos y reinicio de héroe

| Cambio | Detalle | Archivos |
|---|---|---|
| **Clases** | Mapa normalizado profesión → clase (Maga/Mago, Bárbara/Bárbaro, Paladina/Paladín…) con etiquetas bilingües | `data/heroClasses.js` |
| **Recursos** | Concentración (todos), Ki (monje), Furia (bárbaro) y Fruto de vida (druida), máximo 4, ligados a la clase y con icono propio | `data/estadosAlterados.js`, assets |
| **Enemigos** | Su paleta y su estado inicial excluyen los recursos de héroe | `ModalEnemyCard.jsx`, `InitTracker.jsx` |
| **Reinicio de héroe** | Botón con confirmación: quita estados y estados alterados, trauma/maldición a 0 y cubos al máximo; la vida no cambia | `ModalHeroCard.jsx`, `heroExtras.js` |
| **Guardado** | Los recursos entran en `heroExtras` y en el saneado de importación existente | `heroSanitize.js` |
| **Pruebas** | 8 unitarios nuevos (clases, catálogos, reinicio) y 3 E2E (Sun/Katarina, iconos en carta, reinicio) | tests |

**Medición**

```text
Unit       80 tests
E2E        37/37
Sun        Concentración + Ki · sin Furia ni Fruto
Katarina   Furia · sin Ki
Reinicio   estadosAlterados [] · trauma/maldición 0 · cubos = máximos · vida intacta
```

### 23.ª tanda — Fase C: habilidades, capacidades, equipo y almacén

| Cambio | Detalle | Archivos |
|---|---|---|
| **Logo** | La marca definitiva de DaRkFiDoDiDo se integra en el pie con fondo transparente | `SiteFooter.jsx`, `assets_logo/darkfidodido.png` |
| **Habilidades** | Cinco categorías con dos rombos de nivel; cada nivel añade un cubo del color de la categoría. El rol de mazmorra permite elegir entre los cuatro colores y mueve su cubo | `heroExtras.js`, `ModalHeroCard.jsx` |
| **Capacidades de clase** | Tres capacidades con nombre manual y dos rombos de estrella; el nivel 2 exige el 1 | `heroExtras.js`, `ModalHeroCard.jsx` |
| **Equipo** | Iconos de Game Icons en las seis ranuras (arma, mano torpe, armadura, amuleto, bolsas) | `ModalHeroCard.jsx` |
| **Almacén** | Objetos manuales por héroe (hasta 20) con alta, borrado y persistencia | `heroExtras.js`, `heroSanitize.js` |
| **Layout** | El modal pasa a `max-w-5xl` y las secciones se apilan en móvil | `ModalHeroCard.jsx` |
| **Pruebas** | 5 unitarios nuevos y 2 E2E (cubos por nivel, capacidades y almacén persistente) | tests |

**Medición**

```text
Unit       85 tests
E2E        39/39
Habilidad  nivel 1 → +1 cubo del color · nivel 2 exige el 1
Mazmorra   cambiar de color mueve el cubo
Almacén    persiste tras recargar
Modal      1024×920 · 11 secciones
```

### 24.ª tanda — Fase E: campamento del grupo y reinicio de partida

| Cambio | Detalle | Archivos |
|---|---|---|
| **Campamento** | Objetos compartidos del grupo (hasta 30) en un modal del menú de juego; viven en `gameState` y viajan en los guardados | `GameContext.jsx`, `CampDialog.jsx` |
| **Reinicio por capas** | Siempre reinicia turno, historial y enemigos; dos casillas opcionales para runas (cartas, fichas, pilas, mecánicas) y héroes (vida, estados, recursos, cubos) | `InitTracker.jsx`, `RestartGameDialog.jsx` |
| **Menú de juego** | Nuevas entradas «Campamento» y «Reiniciar partida» separadas de la navegación | `TopMenu.jsx` |
| **Pruebas** | Un unitario (`resetHeroForNewGame`) y dos E2E: persistencia del campamento y reinicio completo | tests |

**Medición**

```text
Unit       86 tests
E2E        41/41
Campamento persiste tras recargar
Reinicio   gameLog 0 · enemigos 0 · pilas/fichas 0 · vida al máximo · cubos al máximo
```

### 25.ª tanda — Ajustes de la ficha y orden por clase

| Cambio | Detalle | Archivos |
|---|---|---|
| **Habilidades** | Los dos rombos de cada habilidad viven dentro de su cubo de acción; el rol de mazmorra va debajo de los cuatro | `ModalHeroCard.jsx` |
| **Color de mazmorra** | Se elige al marcar el primer rombo y se puede cambiar después con el círculo de color; el cubo se mueve de color | `ModalHeroCard.jsx` |
| **Capacidades** | Tres rombos por capacidad; el 2 y el 3 exigen el 1 y son independientes entre sí | `heroExtras.js`, `heroSanitize.js` |
| **Reinicio** | El botón de reiniciar héroe deja también la vida al máximo | `heroExtras.js` |
| **Orden** | Selector Nombre/Clase en la selección de héroes, con orden alfabético dentro de cada clase | `Tracker.jsx` |
| **Compatibilidad** | Guardados con `nivel` 0-2 se migran a tres booleanos | `heroSanitize.js` |
| **Pruebas** | Un unitario nuevo y dos E2E (color de mazmorra y orden por clase) | tests |

**Medición**

```text
Unit       86 tests
E2E        43/43
Mazmorra   color elegido al marcar · cambio de color mueve el cubo
Capacidad  tres rombos · 2 y 3 bloqueados sin el 1
Orden      Clase: Maya, Elros, Jaheen, Vorn, Lorelai · Nombre: Elros, Jaheen, Lorelai, Maya, Vorn
```

### 26.ª tanda — Fase D: compañeros y mascotas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Catálogo** | 23 criaturas (7 mascotas y 16 compañeros) con alias, subtipo, ataque, movimiento, vida y capacidades | `data/companions.js` |
| **Asignación** | En la ficha del héroe, con selector por tipo y sin límite de compañeros ni mascotas | `ModalHeroCard.jsx` |
| **Ficha** | Modal con ataque, movimiento, vida editable y estados alterados propios | `ModalCompanionCard.jsx` |
| **Turno** | Se insertan tras su héroe en orden de aparición y actúan una vez por vuelta; el carrusel los muestra con icono propio | `utils/turnOrder.js`, `InitTracker.jsx` |
| **Persistencia** | `trackerData.companions` guarda asignación, vida y estados; el reinicio de partida los restaura | `TrackerContext.jsx` |
| **Pruebas** | 3 unitarios de orden y 2 E2E (asignación/persistencia y turno) | tests |

**Medición**

```text
Unit       89 tests
E2E        45/45
Catálogo   23 criaturas
Turno      Vorn → Drumm → Bronx (orden de aparición, una vez cada uno)
Persistencia vida 0/1 y 1 estado tras recargar
```

> El stub anterior de `companions.js` (Alyra, Koragg, Sir Thorend, Jorgen, Nereida y Renz, sin datos) se retiró; la tabla nueva es la fuente.

### 27.ª tanda — Assets de los PDF de compañeros y mascotas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Extracción** | 23 cartas recortadas de las fotos (16 compañeros en dos hojas y 7 mascotas), con coordenadas medidas sobre una rejilla | temporal |
| **Assets** | WebP de 480 px de alto, esquinas redondeadas y transparencia; 0,41 MB en total | `src/assets/companions/` |
| **Integración** | Imagen en la cabecera de la ficha y miniatura en la lista del héroe | `ModalCompanionCard.jsx`, `ModalHeroCard.jsx` |
| **Pruebas** | 89 unitarios y 45 E2E sin cambios | |

**Medición**

```text
Assets     23 WebP · 0,41 MB
Tamaño     480 px de alto · alfa
Build      24 WebP emitidos (23 + Apocalipsis)
```

> El recorte se hizo por coordenadas medidas (las fotos tienen perspectiva y sombras). `rembg` se probó para aislar la figura, pero dejaba restos del marco; se conserva la carta completa recortada, que es la que se usa en la app.

### 28.ª tanda — Compañeros ligados a expansiones

| Cambio | Detalle | Archivos |
|---|---|---|
| **Catálogo** | Las 23 criaturas declaran `expansionId: 'base'` | `data/companions.js` |
| **Expansiones** | `base` lista sus 16 compañeros y 7 mascotas; el resto queda vacío | `data/expansions.js` |
| **Selector** | `getCompanionsForExpansions` filtra por las expansiones activas y avisa si no hay criaturas | `ModalHeroCard.jsx` |
| **Futuro** | Una expansión nueva solo añade entradas con su `expansionId`; la UI no cambia | — |
| **Pruebas** | 3 unitarios del filtro | tests |

**Medición**

```text
Unit       92 tests
E2E        45/45
base       → 23 criaturas
luccanor   → 0
base+luccanor → 23
```

### 29.ª tanda — Compañeros: menú superior, track y capacidades

| Cambio | Detalle | Archivos |
|---|---|---|
| **Menú** | Botón «Compañeros» en la barra superior; selector con catálogo por expansión, asignación a héroes en juego y lista de asignados | `TopMenu.jsx`, `CompanionPicker.jsx` |
| **Track** | Tarjeta del compañero detrás de su héroe, con borde ámbar, vida, estados y resaltado de turno; al pulsarla abre su ficha | `TrackSlot.jsx`, `CompanionTrackCard.jsx` |
| **Ficha** | Capacidades separadas por `;`, `,` y `:`, con textos y descripciones del diccionario de condiciones | `companionAbilities.js`, `ModalCompanionCard.jsx` |
| **Imágenes** | PNG con alfa normalizados a WebP 480×640 y centrados | `assets/companions/` |
| **Héroe** | La ficha del héroe solo lista sus criaturas y remite al menú para añadir | `ModalHeroCard.jsx` |
| **Pruebas** | 5 unitarios del parser y 2 E2E del flujo completo | tests |

**Medición**

```text
Unit       97 tests
E2E        45/45
Criaturas  23 (16 compañeros + 7 mascotas)
```

> Las variantes «Conner (desarmado)», «Janina (desarmada)» y «Tharmagar (resentido)» comparten imagen con su versión normal porque los PNG recibidos son idénticos.

### 30.ª tanda — GenCon Exclusive y rol Asistente

| Cambio | Detalle | Archivos |
|---|---|---|
| **Expansión** | Nueva expansión «GenCon Exclusive» antes de las de Apocalipsis; solo aporta el rol Asistente | `expansions.js`, `gencon.avif` |
| **Rol** | Asistente/Attendant ligado a `gencon`; ocupa la posición de Apoyo (índice 2 abajo) | `roles.js`, `turnOrder.js` |
| **Exclusión** | Al asignar Asistente se libera Apoyo y viceversa; el track usa el mismo hueco | `Tracker.jsx` |
| **Disponibilidad** | Solo con la expansión activa; si se desactiva, el rol se descarta | `getRolesForExpansions` |
| **Pruebas** | 3 unitarios de roles y 2 E2E (exclusión y visibilidad) | tests |

**Medición**

```text
Unit       100 tests
E2E        47/47
Roles      base 5 · con GenCon 6
```

### 31.ª tanda — Dice Tower Exclusive y rol Lanza Dados

| Cambio | Detalle | Archivos |
|---|---|---|
| **Expansión** | «Dice Tower Exclusive» después de GenCon y antes de Apocalipsis; solo aporta el rol Lanza Dados | `expansions.js`, `dicetower.avif` |
| **Rol** | Lanza Dados/Dice Roller ligado a `dicetower`; ocupa la posición de Líder (índice 4 arriba) | `roles.js`, `turnOrder.js` |
| **Exclusión** | Al asignar Lanza Dados se libera Líder y viceversa | `Tracker.jsx` |
| **Track** | `rolesPositionMap` incluye Lanza Dados (4) y Asistente (2) | `InitTracker.jsx` |
| **Pruebas** | 2 unitarios y 2 E2E | tests |

**Medición**

```text
Unit       102 tests
E2E        49/49
Roles      base 5 · GenCon 6 · Dice Tower 6 · ambas 7
```

### 32.ª tanda — Selección de héroes agrupada por clase

| Cambio | Detalle | Archivos |
|---|---|---|
| **Agrupación** | Grupos por clase con cabecera, icono, color y contador; orden alfabético | `Tracker.jsx`, `heroClasses.js` |
| **Iconos** | 16 PNG de `assets/classes` mapeados a las 16 clases | `heroClasses.js` |
| **Orden** | Selector Clase (agrupado, por defecto) / Nombre (grid plano) | `Tracker.jsx` |
| **Pruebas** | 2 unitarios y 1 E2E de cabeceras, iconos y color | tests |

**Medición**

```text
Unit       104 tests
E2E        50/50
Clases     16 con icono y color
```

### 33.ª tanda — Selección compacta y compañeros con vida/escudo

| Cambio | Detalle | Archivos |
|---|---|---|
| **Selección** | Los grupos de clase se empaquetan en una rejilla de 6 columnas; varios grupos comparten fila | `Tracker.jsx`, `index.css` |
| **Compañeros** | Tarjeta circular con fondo claro, barra de vida y sin el icono de patitas | `CompanionTrackCard.jsx` |
| **Ficha** | Barra de vida y solo botones −1/+1 | `ModalCompanionCard.jsx` |
| **Capacidades** | `capacidades` normalizadas en la entry y ESCUDO X aplicado al inicio del turno, como los enemigos | `companionAbilities.js`, `InitTracker.jsx` |
| **Datos** | Excel de mascotas revisado; coincide con el catálogo actual | — |
| **Pruebas** | 4 unitarios de claves/escudo y E2E ampliado | tests |

**Medición**

```text
Unit       109 tests
E2E        50/50
Escudo     Bronx gana 2 al inicio de su turno (máx. 4)
```

### 34.ª tanda — Menú de compañeros: disponibilidad y tipos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Disponibilidad** | Las criaturas asignadas desaparecen de «Disponibles» y vuelven al eliminarlas | `CompanionPicker.jsx` |
| **Agrupación** | «Disponibles» y «En juego» separados en Mascotas y Compañeros, con contadores por tipo | `CompanionPicker.jsx` |
| **Pruebas** | 1 E2E nuevo de asignación → no disponible → eliminación → disponible | tests |

**Medición**

```text
Unit       109 tests
E2E        51/51
```

### 35.ª tanda — Eliminar compañero y resetear el grupo

| Cambio | Detalle | Archivos |
|---|---|---|
| **Vista ampliada** | Botón «Eliminar» con confirmación; quita la criatura de `trackerData` y cierra la ficha | `ModalCompanionCard.jsx` |
| **Menú** | Botón «Resetear» con confirmación; restaura vida y quita estados de todas las criaturas asignadas | `CompanionPicker.jsx` |
| **Pruebas** | 2 E2E nuevos (reset y eliminación) | tests |

**Medición**

```text
Unit       109 tests
E2E        53/53
```

### 36.ª tanda — Héroes de Daren como grupo propio

| Cambio | Detalle | Archivos |
|---|---|---|
| **Agrupación** | Tercer grupo «Héroes de Daren» en Disponibles y En juego, separado de Compañeros | `CompanionPicker.jsx` |
| **Detección** | `getCompanionGroup` clasifica por tipo y alias normalizado («Héroe de Daren») | `data/companions.js` |
| **Pruebas** | 1 unitario de clasificación y 1 E2E de los tres grupos | tests |

**Medición**

```text
Unit       110 tests
E2E        54/54
Grupos     Mascotas 7 · Compañeros 10 · Héroes de Daren 6
```

### 37.ª tanda — Color de clase en carta y ficha

| Cambio | Detalle | Archivos |
|---|---|---|
| **Track** | Borde de la carta y banda del nombre con el color de la clase del héroe | `CharacterCard.jsx` |
| **Ficha** | Borde del modal, barra superior, cabecera, avatar y chip de clase con el mismo color | `ModalHeroCard.jsx` |
| **Pruebas** | 1 E2E de borde de carta, banda, modal y chip | tests |

**Medición**

```text
Unit       110 tests
E2E        55/55
```

### 38.ª tanda — Fondos de interacción y tarjeta circular

| Cambio | Detalle | Archivos |
|---|---|---|
| **Fondos** | 6 imágenes de interacción convertidas a AVIF y asignadas de forma estable por posición en el catálogo | `assets/interactions/`, `companions.js` |
| **Track** | Círculo centrado, nombre superpuesto abajo, barra de vida debajo y fondo de interacción | `CompanionTrackCard.jsx` |
| **Ficha** | Cabecera con el fondo de la criatura y retrato sobre él | `ModalCompanionCard.jsx` |
| **Menú** | Miniaturas y filas con el mismo fondo | `CompanionPicker.jsx` |
| **Pruebas** | 1 unitario del fondo y E2E ampliado (fondo y nombre dentro del círculo) | tests |

**Medición**

```text
Unit       112 tests
E2E        55/55
Fondos     6 (runic, seed, barricade, beer factory, altar, forge)
```

### 39.ª tanda — Fondo del track, desplegable inline y cabeceras

| Cambio | Detalle | Archivos |
|---|---|---|
| **Track** | Fondo de tentáculos con `cover` y overlay; se adapta al grid que crece con las cartas | `TurnTrackBoard.jsx`, `backgrounds/track.avif` |
| **Menú** | El panel de añadir aparece dentro de la tarjeta seleccionada, justo debajo | `CompanionPicker.jsx` |
| **Compañero** | Retrato sobre fondo claro y sin el botón ✕ superior duplicado | `ModalCompanionCard.jsx` |
| **Héroe** | Cabecera con imagen grande, nombre/rol/clase, fondo de interacción y fila Vida/Ataque/Movimiento/Impactar | `ModalHeroCard.jsx` |
| **Pruebas** | 13 E2E de compañeros, colores, habilidades y recursos verificados | tests |

**Medición**

```text
Unit       112 tests
E2E        55/55
Fondo      track.avif 1600×855 (0,1 MB)
```

### 40.ª tanda — Cuatro fondos más para criaturas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Fondos** | Añadidos `flood`, `ship`, `knight` y `portal` a la rotación, que pasa a 10 imágenes | `companions.js`, `assets/interactions/` |
| **Asignación** | Se mantiene estable por posición en el catálogo | `getCompanionBackground` |

**Medición**

```text
Unit       112 tests
E2E        55/55
Fondos     10 (6 previos + 4 nuevos)
```

### 41.ª tanda — Vista de lista con color e imagen

| Cambio | Detalle | Archivos |
|---|---|---|
| **Lista** | Cada turno usa el color de su entidad (clase del héroe, enemigo o runa) en borde, fondo y número | `TurnTrackBoard.jsx` |
| **Imágenes** | Miniaturas solapadas de hasta 4 entidades por turno, con borde de su color | `TurnTrackBoard.jsx` |
| **Datos** | `slotSummaries` añade `entities` (nombre, imagen y color) y `slotColor` para runas | `InitTracker.jsx` |
| **Pruebas** | 1 E2E de color de borde e imagen en la lista | tests |

**Medición**

```text
Unit       112 tests
E2E        56/56
```

### 42.ª tanda — Retratos de héroe en tres capas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Componente** | `HeroPortrait`: gradiente del color de clase, icono de clase como marca de agua y PNG sin fondo encima | `components/HeroPortrait.jsx` |
| **Datos** | `getHeroPortrait` indexa `assets/hero` y resuelve alias (`brihitte`, `lordwrath`, `vacren`/`vacron`) | `data/heroPortraits.js` |
| **Vistas** | Track, ficha ampliada, selección de héroes y miniaturas de la lista usan el retrato | `CharacterCard`, `ModalHeroCard`, `Tracker`, `TurnTrackBoard` |
| **Pruebas** | 1 unitario de retratos y E2E de color actualizados | tests |

**Medición**

```text
Unit       113 tests
E2E        56/56
Retratos   40 PNG sin fondo
```

### 43.ª tanda — Capacidades personales y ajuste del panel

| Cambio | Detalle | Archivos |
|---|---|---|
| **Capacidades** | Las capacidades usan la clave de enemigo `ESCUDO_2`; el parser acepta `ESCUDO_2` y `ESCUDO 2` y recupera número y descripción | `companionAbilities.js`, `companions.js` |
| **Panel** | El marco del track se ajusta al grid (374 px con una carta) en lugar de estirarse al alto de la columna | `TurnTrackBoard.jsx` |
| **Pruebas** | 2 unitarios de capacidades actualizados | tests |

**Medición**

```text
Unit       115 tests
E2E        56/56
```

### 44.ª tanda — Iconos de expansión

| Cambio | Detalle | Archivos |
|---|---|---|
| **Datos** | 14 símbolos de caja mapeados a las 16 expansiones, cada una con su color | `data/expansionIcons.js` |
| **Componente** | `ExpansionIcon` con `title`/`aria-label` del nombre y fondo del color de la expansión | `components/ExpansionIcon.jsx` |
| **Vistas** | Config, selección de héroes y enemigos, carta del track y fichas de héroe y enemigo | varios |
| **Pruebas** | 1 unitario de cobertura y E2E del icono en la tarjeta | tests |

**Medición**

```text
Unit       115 tests
E2E        56/56
Símbolos   14 para 16 expansiones
```

### 45.ª tanda — Retrato de Arkhanos y limpieza de recursos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Alias** | `hero-arkhanos-mage.png` se asigna al héroe `arkanos` | `heroPortraits.js` |
| **Cobertura** | 35 de 36 héroes con retrato; solo falta Garamond (`hero-gramosh-shaman.png` no coincide con su id) | tests |
| **Limpieza** | Eliminadas 36 variantes `.webp`/`.png` no referenciadas de `assets/heroes` (2,16 MB) | assets |
| **Pruebas** | 1 unitario de cobertura (116 en total) | tests |

**Medición**

```text
Unit       116 tests
E2E        56/56
Retratos   35/36 (falta Garamond)
Liberado   2,16 MB
```

### 46.ª tanda — Iconos fuera del track, toolbar fijo y expansiones de Apocalipsis

| Cambio | Detalle | Archivos |
|---|---|---|
| **Iconos** | Se retiran de la carta del track y de las fichas de héroe y enemigo; se mantienen en selección y Config | `CharacterCard`, `ModalHeroCard`, `ModalEnemyCard` |
| **Toolbar** | El panel de turnos y opciones queda fijo bajo el menú superior al hacer scroll | `TurnTrackBoard.jsx` |
| **Expansiones** | Lorien y Pack de Héroes #1 pasan a activas; datos, imágenes y traducciones completos | `expansions.js` |
| **Faltante** | Retrato sin fondo de Garamond (no bloquea: usa la carta como respaldo) | assets |
| **Pruebas** | 2 unitarios de expansiones (118 en total) | tests |

**Medición**

```text
Unit       118 tests
E2E        56/56
```

### 47.ª tanda — Cubos y clases de Lorien y el Pack de Héroes

| Cambio | Detalle | Archivos |
|---|---|---|
| **Cubos** | Los 9 héroes usan sus valores oficiales: 1/2/1/1 o 2/1/1/1 según la carta | `heroCubes.js` |
| **Gramosh** | Garamond pasa a Gramosh, que coincide con su retrato; actualizados pack y traducciones | `heroes.js`, `expansions.js`, i18n |
| **Clases** | Necromante, Espadachín, Adalid, Chamán y Mago verificadas | datos |
| **Pruebas** | Cubos oficiales y cobertura completa de retratos | tests |

**Medición**

```text
Unit       119 tests
E2E        56/56
```

### 48.ª tanda — Neva, Hakkon y las claves NO MUERTO/DRAUGR

| Cambio | Detalle | Archivos |
|---|---|---|
| **Mascotas** | Neva y Hakkon añadidas al Pack de Héroes | `companions.js`, `expansions.js` |
| **Draugr** | Se permiten varias copias; Hakkon no desaparece de Disponibles | `CompanionPicker.jsx` |
| **Claves** | `NO_MUERTO` y `DRAUGR` con descripción en español e inglés; el parser asocia DRAUGR a la frase | i18n, `companionAbilities.js` |
| **Reglas** | Las expansiones de Apocalipsis ya activan el reglamento 2.0 | `rulesVersion.js` |
| **Imágenes** | Neva y Hakkon con retrato WebP (`neva.webp` y `hakkon.webp`) | assets |
| **Pruebas** | 1 unitario de mascotas, 1 de claves y 1 E2E de duplicado | tests |

**Medición**

```text
Unit       122 tests
E2E        57/57
```

### 49.ª tanda — Glosario 2.0, logos de estado y barra de turnos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Glosario** | 182 descripciones 2.0 en español e inglés, superpuestas solo con reglas 2.0 | `glosario2.*.json`, `useGlossary` |
| **Logos** | 12 logos de estado 2.0 en las fichas, solo con reglas 2.0 | `estados2.js` |
| **Barra** | El panel de turnos sale del track y queda fijo bajo el menú superior; el contenido reserva su altura | `TurnTrackBoard`, `InitTracker` |
| **Pruebas** | 2 unitarios del glosario (124 en total) | tests |

**Medición**

```text
Unit       124 tests
E2E        57/57
Glosario   182 claves ES/EN
```

### 50.ª tanda — Discord en el pie

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enlace** | Icono de Discord con el usuario `darkfidodido`; al pulsar abre Discord y copia el nombre | `SiteFooter.jsx` |

**Medición**

```text
Unit       124 tests
E2E        57/57
```

### 51.ª tanda — Glosario español corregido

| Cambio | Detalle | Archivos |
|---|---|---|
| **Codificación** | Reconstruido desde el TXT original leyendo bytes (`Ã±` → `ñ`, `Ã�` → `Í`) | `glosario2.es.json` |
| **Prefijos** | 62 términos iniciales que repetían la clave eliminados, igual que en inglés | `glosario2.es.json` |
| **Pruebas** | 1 unitario de acentos y prefijos (125 en total) | tests |

**Medición**

```text
Unit       125 tests
E2E        57/57
```

### 52.ª tanda — Estados alterados de la versión 2.0

| Cambio | Detalle | Archivos |
|---|---|---|
| **Estados** | Frágil, Polimorfismo y Restricción (máximo 1) solo con reglas 2.0 | `estadosAlterados.js` |
| **Semilla** | Semilla del caos (máximo 4) reservada para el héroe que la use; aún sin clase asignada | `estadosAlterados.js` |
| **Fichas** | Los catálogos de héroe, enemigo y compañero respetan la versión de reglas | `Modal*` |
| **Pruebas** | 2 unitarios de versión y límites (127 en total) | tests |

**Medición**

```text
Unit       127 tests
E2E        57/57
```

### 53.ª tanda — Recursos por clase, Draugr y tope de vida

| Cambio | Detalle | Archivos |
|---|---|---|
| **Recursos** | Entropía para Mago de la Espada, cuatro ídolos para Chamán y Semilla del caos general | `estadosAlterados.js` |
| **Clase** | «Mago de la Espada» en lugar de «Mago Espadachín» | `heroClasses.js`, i18n |
| **Draugr** | Solo se asigna a un Nigromante activo en el track; admite copias | `CompanionPicker.jsx` |
| **Vida** | Tope global de 17 en vida y vida máxima | `heroExtras.js`, `ModalHeroCard` |
| **Pruebas** | 1 unitario de vida y E2E de Draugr (128 en total) | tests |

**Medición**

```text
Unit       128 tests
E2E        57/57
```

### 54.ª tanda — Descripción de Semilla del Caos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Glosario** | Descripción en español e inglés de la condición acumulable | `glosario2.*.json` |
| **Fichas** | El estado muestra la descripción al pasar por encima | `ModalCompanionCard`, `ModalHeroCard`, `ModalEnemyCard` |
| **Pruebas** | Clave incluida en el test del glosario (128 en total) | tests |

**Medición**

```text
Unit       128 tests
E2E        57/57
```

### 55.ª tanda — Explosión de la cuarta Semilla del Caos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Mecánica** | Al recibir la cuarta semilla se descartan todas y sufre 4 de daño no prevenible | `chaosSeed.js`, `heroExtras.js`, `Modal*` |
| **Alcance** | Héroes, enemigos y compañeros; solo con reglas 2.0 | varios |
| **Pruebas** | 2 unitarios: regla de explosión y efecto en héroe (130 en total) | tests |

**Medición**

```text
Unit       130 tests
E2E        57/57
```

### 56.ª tanda — Semilla del Caos en enemigos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enemigos** | La explosión se aplica al persistir los estados del enemigo, cubriendo cualquier vía y no solo la ficha | `InitTracker.jsx` |
| **Pruebas** | 1 E2E: enemigo de 12 a 8 y sin semilla (58 en total) | tests |

**Medición**

```text
Unit       130 tests
E2E        58/58
```

### 57.ª tanda — Semilla del Caos solo para héroes y aliados

| Cambio | Detalle | Archivos |
|---|---|---|
| **Alcance** | Excluida de los enemigos; disponible en héroes y en compañeros/mascotas | `estadosAlterados.js` |
| **Catálogo** | `getAllyStatusCatalog` para las fichas de aliados | `estadosAlterados.js`, `ModalCompanionCard` |
| **Enemigos** | Retirada la lógica de explosión de la ficha de enemigo | `ModalEnemyCard`, `InitTracker` |
| **Pruebas** | E2E de la explosión en un héroe (130 unit · 58 E2E) | tests |

**Medición**

```text
Unit       130 tests
E2E        58/58
```

### 58.ª tanda — Nigromante y colores de capacidades 2.0

| Cambio | Detalle | Archivos |
|---|---|---|
| **Clase** | «Necromante» pasa a «Nigromante» en la clase y la profesión | `heroClasses.js`, i18n |
| **Colores** | Verde para EMBATE/ANDANADA y morado para SOBREPRESIÓN, solo con reglas 2.0; azul y rosa se mantienen | `enemyVisuals.js` |
| **Pruebas** | 2 unitarios de colores (132 en total) | tests |

**Medición**

```text
Unit       132 tests
E2E        58/58
```

### 59.ª tanda — Hermanas Fatídicas (Señor Supremo)

| Cambio | Detalle | Archivos |
|---|---|---|
| **Cartas** | 10 cartas `over_11`…`over_20` con nombre, descripción ES/EN, runa y posición | `cartasEspeciales.js`, i18n |
| **Carta principal** | `fallen_sisters`: vida 8 (× jugadores), runa roja, inmunidades y capacidades | `enemies.js` |
| **Expansión** | `apocalypse_sisters` disponible para activar | `expansions.js` |
| **Pruebas** | 3 unitarios: cartas, runas y expansión (135 en total) | tests |

**Medición**

```text
Unit       135 tests
E2E        58/58
```

### 60.ª tanda — Resolvedor de cartas de las Hermanas Fatídicas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Resolvedor** | Aplica al Señor Supremo `SANA X`, `ESCUDO X`, `ACTIVA`, `EVOLUCIONA` y estados (hemorragia, veneno, quemadura), respetando inmunidades | `InitTracker.jsx` |
| **Confirmación** | La hemorragia de FURIA HEMORRÁGICA se confirma antes de aplicarse; si no se sufre, se cura X | `InitTracker.jsx` |
| **Instrucciones** | Desequipar, objetivos, saltos y daños a héroes quedan como texto de la carta | cartas |
| **Pruebas** | 135 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       135 tests
E2E        58/58
```

### 61.ª tanda — Color de las cartas de Señor Supremo

| Cambio | Detalle | Archivos |
|---|---|---|
| **Cartas** | Las cartas de Señor Supremo usan el morado de su carta de enemigo: borde, anillo, fondo de fuego y título | `CommanderCard`, `CommanderCardModal` |
| **Resto** | Comandantes y jefes mantienen sus colores actuales | — |
| **Pruebas** | 135 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       135 tests
E2E        58/58
```

### 62.ª tanda — Correcciones de las Hermanas Fatídicas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Nombre** | «Hermanas Caídas» pasa a «Hermanas Fatídicas» | i18n |
| **Colocación** | Los señores supremos ignoran el comportamiento y pueden colocarse desde las expansiones activas | `enemyVariant`, `InitTracker` |
| **Pruebas** | 1 unitaria: los señores supremos ignoran el comportamiento (136 en total) | tests |

**Medición**

```text
Unit       136 tests
E2E        58/58
```

### 63.ª tanda — Barajas por Señor Supremo y nuevo Demon Lord

| Cambio | Detalle | Archivos |
|---|---|---|
| **Barajas** | Las Hermanas Fatídicas usan `over_11`…`over_20`; los demás señores supremos mantienen `over_1`…`over_10` | `cartasEspeciales`, `InitTracker` |
| **Imagen** | Demon Lord usa el nuevo archivo PNG | `enemies.js` |
| **Pruebas** | 1 unitaria de barajas por Señor Supremo (137 en total) | tests |

**Medición**

```text
Unit       137 tests
E2E        58/58
```

### 64.ª tanda — Nueva portada

| Cambio | Detalle | Archivos |
|---|---|---|
| **Fondo** | La portada usa la imagen de mazmorra en lugar del caballero esqueleto | `HomeMenu` |
| **Panel** | El Rey Redivivo preside los tres logos (base, Apocalipsis y Awakenings), que se mueven en bucle | `HomeMenu` |
| **Pruebas** | 137 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       137 tests
E2E        58/58
```

### 65.ª tanda — Ajustes de las cartas de Señor Supremo

| Cambio | Detalle | Archivos |
|---|---|---|
| **Histeria** | Añade +X al ataque durante la activación y se limpia al avanzar el turno | `InitTracker` |
| **Furia** | Sin diálogo del sistema: la hemorragia se aplica directamente | `InitTracker` |
| **Armazón** | Escudos según las cartas activas del Señor Supremo propietario, con tope de 4 | `InitTracker` |
| **Vista ampliada** | Tema actual de la app y botón «Eliminar carta» | `CommanderCard`, `CommanderCardModal` |
| **Pruebas** | 137 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       137 tests
E2E        58/58
```

### 66.ª tanda — Composición de la portada

| Cambio | Detalle | Archivos |
|---|---|---|
| **Panel** | El Rey Redivivo ocupa el panel y los tres logos palpitan en su borde inferior, cada uno con su tono | `HomeMenu` |
| **Botones** | Configurar y Partidas quedan en dos columnas | `HomeMenu` |
| **Pruebas** | 137 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       137 tests
E2E        58/58
```

### 67.ª tanda — Fondo de las cartas especiales

| Cambio | Detalle | Archivos |
|---|---|---|
| **Fondo** | Señores supremos, comandantes, jefes y héroes caídos usan un degradado difuminado con su tono, como las fichas de héroe | `CommanderCard`, `enemyVisuals` |
| **Tonos** | Morado para señores y jefes, dorado para comandantes, naranja para héroes caídos y cian para escenario | `enemyVisuals` |
| **Pruebas** | 1 unitaria de tonos (138 en total) | tests |

**Medición**

```text
Unit       138 tests
E2E        58/58
```

### 68.ª tanda — Logos transparentes y panel horizontal

| Cambio | Detalle | Archivos |
|---|---|---|
| **Logos** | Fondo transparente con tinte y borde del tono, dejando ver la imagen del panel | `HomeMenu`, assets |
| **Panel** | El panel del Rey Redivivo pasa a ser más horizontal en escritorio | `HomeMenu` |
| **Pruebas** | 138 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       138 tests
E2E        58/58
```

### 69.ª tanda — Roles, logos y capas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Roles** | Asistente (Apoyo) y Lanza Dados (Líder) indican a quién sustituyen | i18n |
| **Logos** | Ocupan todo el ancho disponible, sin borde y solo con el tinte translúcido | `HomeMenu` |
| **Capas** | El menú de juego y las ventanas de enemigos y runas quedan por encima de la barra del track | `TopMenu`, `TurnTrackBoard`, `PageTransition` |
| **Pruebas** | 138 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       138 tests
E2E        58/58
```

### 70.ª tanda — Cartas de runa compactas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Track** | La carta muestra solo el título y la cara cuando la usa | `InitTracker` |
| **Vista ampliada** | Mecánicas, estados, aplicar efecto y eliminar, con el tono del tipo | `InitTracker` |
| **Tonos** | Índigo para runa/asalto, verde para defensa, rojo para incursión y morado para acecho | `InitTracker` |
| **Pruebas** | 138 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       138 tests
E2E        58/58
```

### 71.ª tanda — Cartas de runa, cajas y correcciones

| Cambio | Detalle | Archivos |
|---|---|---|
| **Cartas de runa** | Fondo de bandera por tipo, título y acción arriba y cara en la banderola | `RuneCard`, assets |
| **Vista ampliada** | Componente fuera de `InitTracker` para que el modal no se cierre al iniciar los turnos | `RuneCard` |
| **Cajas** | Paso previo en Configuración con Core, Despertar y Apocalipsis; solo las desbloqueadas | `boxes`, `ExpansionContext`, `Config` |
| **Contenido** | Core: Asalto, Acecho, Monstruo Huésped, Invadidos, Defensa, Pila de runas y Control de áreas; previsualización si hay otra caja activa | `TopMenu` |
| **Pruebas** | 2 unitarias de cajas (140 en total) | tests |

**Medición**

```text
Unit       140 tests
E2E        58/58
```

### 72.ª tanda — Logos de la portada en carrusel

| Cambio | Detalle | Archivos |
|---|---|---|
| **Logos** | Los tres logos se superponen y aparece uno cada 3,2 s, más grandes y con su tono | `HomeMenu` |
| **Pruebas** | 140 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       140 tests
E2E        58/58
```

### 73.ª tanda — Portada: logos a la izquierda y fondo al borde superior

| Cambio | Detalle | Archivos |
|---|---|---|
| **Logos** | Conjunto a la izquierda y a la altura completa del panel, con el carrusel | `HomeMenu` |
| **Fondo** | La imagen del Rey Redivivo se alinea al borde superior | `HomeMenu` |
| **Pruebas** | 140 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       140 tests
E2E        58/58
```

### 74.ª tanda — Colores del carrusel a toda la portada

| Cambio | Detalle | Archivos |
|---|---|---|
| **Logos** | El tono del logo activo llena todo el panel y los logos se alinean al borde izquierdo | `HomeMenu` |
| **Pruebas** | 140 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       140 tests
E2E        58/58
```

### 75.ª tanda — Caja Despertar

| Cambio | Detalle | Archivos |
|---|---|---|
| **Roles** | Sanador, Matón, Asesino, Embaucador y Guardián con sustituto y logo | `roles`, `Tracker` |
| **Héroes** | Andreas, Catharina, Nyx y Vacrem con sus dos clases y cubos | `heroes`, `heroCubes` |
| **Caja** | Despertar desbloqueada; al elegirla se activa su expansión | `boxes`, `ExpansionContext` |
| **Pruebas** | 140 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       140 tests
E2E        58/58
```

### 76.ª tanda — Despertar, retratos y avisos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Retratos** | Dos retratos por personaje (Andreas, Catharina, Nyx y Vacrem) | `heroPortraits` |
| **Vida** | 8/10/10/8/10/10/10/12 para las ocho variantes | `heroes` |
| **Caja** | El paso de caja principal pasa a la configuración de partida, antes de héroes | `Tracker`, `Config` |
| **Avisos** | Runas y enemigos con tarjetas acordes al tema | `TileToast`, `AnimatedEnemyToast` |
| **Pruebas** | 140 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       140 tests
E2E        58/58
```

### 77.ª tanda — Compañeros de Core y seguidores de Despertar

| Cambio | Detalle | Archivos |
|---|---|---|
| **Compañeros** | Compañeros y héroes de Daren se ocultan fuera de la caja Core | `CompanionPicker` |
| **Seguidores** | Seis seguidores con dos estados, colocados en la posición de su rol | `followers`, `FollowerCard` |
| **Track** | Los seguidores se apilan en el **lado contrario** al de su rol y permiten cambiar de estado | `TrackSlot`, `InitTracker` |
| **Datos** | Base de seguidores importada del Excel de referencia | `followers` |
| **Imágenes** | Retratos de los seis seguidores, compartidos por ambos estados | `followers`, `FollowerCard` |
| **Pruebas** | 142 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       142 tests
E2E        58/58
```

### 78.ª tanda — Vista de otras cajas en compañeros

| Cambio | Detalle | Archivos |
|---|---|---|
| **Compañeros** | Botón local «Ver otras cajas» en el selector de compañeros; no afecta al menú de juego | `CompanionPicker` |
| **Pruebas** | 142 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       142 tests
E2E        58/58
```

### 79.ª tanda — Retratos de los seguidores

| Cambio | Detalle | Archivos |
|---|---|---|
| **Seguidores** | Retratos de los seis seguidores, compartidos por ambos estados | `followers`, `FollowerCard` |
| **Pruebas** | 142 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       142 tests
E2E        58/58
```

### 80.ª tanda — Ficha ampliada de los seguidores

| Cambio | Detalle | Archivos |
|---|---|---|
| **Track** | Tarjeta compacta de seguidor con fondo y retrato, como los compañeros | `FollowerCard` |
| **Ficha** | Vista ampliada con estados, capacidades, tipo de ataque y retirada | `FollowerModal` |
| **Pruebas** | 142 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       142 tests
E2E        58/58
```

### 81.ª tanda — Perfiles y ficha completa de seguidores

| Cambio | Detalle | Archivos |
|---|---|---|
| **Perfiles** | Las versiones de los seguidores pasan a llamarse perfil | `followers`, `CompanionPicker` |
| **Track** | Tarjeta rectangular con fondo aleatorio, nombre con color y barra de vida; sin rol | `FollowerCard` |
| **Ficha** | Vida, estados alterados, ataque con icono y capacidades con descripciones | `FollowerModal`, `followerAbilities` |
| **2.0** | Ataque doble en verde como capacidad de las reglas 2.0 | `followerAbilities` |
| **Pruebas** | 142 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       142 tests
E2E        58/58
```

### 82.ª tanda — Tarjetas y fichas de aliados unificadas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Track** | Seguidor con ancho de héroe, fondo de interacciones y vida dentro del marco | `FollowerCard` |
| **Ficha** | Ficha común para mascotas, compañeros y seguidores: 4 paneles, firmeza, estados y pie de dos botones | `AllyDetailModal`, `ModalCompanionCard`, `FollowerModal` |
| **Pruebas** | 142 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       142 tests
E2E        58/58
```

### 83.ª tanda — Iconos de estados en aliados

| Cambio | Detalle | Archivos |
|---|---|---|
| **Track** | Iconos de estados en la tarjeta del seguidor y en compañeros, aceptando ids con o sin `_I` | `FollowerCard`, `CompanionTrackCard` |
| **Ficha** | Franja de estados activos en la vista ampliada, además del panel de gestión | `AllyDetailModal` |
| **Pruebas** | 142 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       142 tests
E2E        58/58
```

### 84.ª tanda — Tarjetas de aliados: vida, tipo e iconos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Seguidores** | Vida bajo el nombre, dentro de su cuadro, y subtítulo «Seguidor» | `FollowerCard` |
| **Mascotas** | Sin barra de vida en el track | `CompanionTrackCard` |
| **Compañeros** | Nombre y vida subidos para ganar visibilidad | `CompanionTrackCard` |
| **Ficha** | Iconos de movimiento, ataque y firmeza iguales a los de los enemigos | `AllyDetailModal` |
| **Pruebas** | 142 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       142 tests
E2E        58/58
```

### 85.ª tanda — Turno y campamento de seguidores

| Cambio | Detalle | Archivos |
|---|---|---|
| **Turno** | Los seguidores ocupan el paso de su rol y el turno ya no se salta; el carrusel usa su icono | `turnOrder`, `InitTracker`, `TurnCarousel` |
| **Campamento** | Los seguidores se guardan y se colocan al iniciar cada partida | `campFollowers`, `CampDialog`, `InitTracker` |
| **Pruebas** | 147 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       147 tests
E2E        58/58
```

### 86.ª tanda — Orden de turno por líneas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Turno** | Primero la línea superior completa (roles, enemigos y runas de arriba) y después la inferior | `turnOrder` |
| **Roles** | Los roles de Despertar se añaden en la posición que les corresponde | `turnOrder` |
| **Pruebas** | 147 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       147 tests
E2E        58/58
```

### 87.ª tanda — Marcador de turno en seguidores

| Cambio | Detalle | Archivos |
|---|---|---|
| **Turno** | El marcador flotante aparece sobre el seguidor cuando es su turno | `TrackSlot` |
| **Pruebas** | 147 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       147 tests
E2E        58/58
```

### 88.ª tanda — Orden de turno de las dos líneas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Turno** | Ambas líneas recorren roles, enemigos y runas; héroes y seguidores actúan solo en su línea | `turnOrder`, `roles` |
| **Pruebas** | 147 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       147 tests
E2E        58/58
```

### 89.ª tanda — Estados alterados en mascotas, compañeros y seguidores

| Cambio | Detalle | Archivos |
|---|---|---|
| **Turno** | Aplica estados al inicio y al final del turno, con daño, escudos y reducción de fichas | `InitTracker` |
| **Capacidades** | ESCUDO X de las capacidades añade escudos al empezar el turno | `companionAbilities` |
| **Pruebas** | 147 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       147 tests
E2E        58/58
```

### 90.ª tanda — Nueva partida sin seguidores

| Cambio | Detalle | Archivos |
|---|---|---|
| **Guardado** | Al iniciar una nueva partida se vacían los seguidores del track y del campamento | `HomeMenu`, `Tracker`, `campFollowers` |
| **Pruebas** | 148 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       148 tests
E2E        58/58
```

### 91.ª tanda — Escenarios por caja en el selector manual

| Cambio | Detalle | Archivos |
|---|---|---|
| **Selector** | Los enemigos de escenario se filtran por la caja principal | `boxes`, `InitTracker` |
| **Botón** | «Ver todos» muestra los escenarios de las tres cajas | `InitTracker` |
| **Pruebas** | 149 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       149 tests
E2E        58/58
```

### 92.ª tanda — Colores independientes del rol de mazmorra

| Cambio | Detalle | Archivos |
|---|---|---|
| **Héroes** | Cada nivel del rol de mazmorra tiene su propio color y su propio cubo | `heroExtras`, `ModalHeroCard`, `heroSanitize` |
| **Pruebas** | 150 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       150 tests
E2E        58/58
```

### 93.ª tanda — Campañas y efectos de héroe por campaña

| Cambio | Detalle | Archivos |
|---|---|---|
| **UI** | Las cajas principales pasan a llamarse campañas en la selección y textos asociados | `Tracker`, i18n |
| **Héroes** | Auras, consecuencias y estados se filtran por la campaña; los actuales pertenecen a Core | `heroes/index`, `ModalHeroCard` |
| **Pruebas** | 152 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       152 tests
E2E        58/58
```

### 94.ª tanda — Fondo de los seguidores en el selector

| Cambio | Detalle | Archivos |
|---|---|---|
| **Compañeros** | Los seguidores del selector muestran un fondo de interacción; al colocarse conservan ese mismo fondo | `CompanionPicker`, `companions` |
| **Pruebas** | 152 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       152 tests
E2E        58/58
```

### 95.ª tanda — Rombos de mazmorra sin círculos extra

| Cambio | Detalle | Archivos |
|---|---|---|
| **Héroes** | El rol de mazmorra muestra solo los dos rombos; el color se cambia reabriendo el rombo | `ModalHeroCard` |
| **Pruebas** | 152 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       152 tests
E2E        58/58
```

### 96.ª tanda — Comandantes según enemigos y campaña

| Cambio | Detalle | Archivos |
|---|---|---|
| **Comandantes** | Aleatorio y manual solo usan comandantes seleccionados, de la campaña activa y que no sean de escenario | `commanderSelection`, `InitTracker` |
| **Pruebas** | 156 unitarios · 58 E2E | tests |

**Medición**

```text
Unit       156 tests
E2E        58/58
```

### 97.ª tanda — Campañas, expansiones por defecto y filtro manual

| Cambio | Detalle | Archivos |
|---|---|---|
| **Campañas** | Al iniciar partida se añaden las expansiones activas de la campaña | `ExpansionContext`, `boxes`, `Tracker` |
| **Comandantes** | Se retira el filtro de campaña; mandan los enemigos seleccionados | `commanderSelection` |
| **Manual** | Nuevo filtro por campaña y orden con la activa primero | `InitTracker` |
| **Pruebas** | 157 unitarios · 59 E2E | tests |

**Medición**

```text
Unit       157 tests
E2E        59/59
```

### 98.ª tanda — Colores de capacidades ampliados

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enemigos** | Nuevas capacidades con color rosa, azul, verde y violeta; los colores se aplican en todas las reglas | `enemyVisuals` |
| **Pruebas** | 159 unitarios · 59 E2E | tests |

**Medición**

```text
Unit       159 tests
E2E        59/59
```

### 99.ª tanda — Escudo X con fórmula

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enemigos** | `ESCUDO X±N` calcula X, aplica la fórmula y mantiene el mínimo 0; al aplicar el escudo se respeta el máximo de 4 | `adjustCapabilitiesByRunes`, `InitTracker` |
| **Pruebas** | 161 unitarios · 59 E2E | tests |

**Medición**

```text
Unit       161 tests
E2E        59/59
```

### 100.ª tanda — Aviso de héroes de la caja base en Despertar

| Cambio | Detalle | Archivos |
|---|---|---|
| **Héroes** | Los héroes de la caja base muestran «Se recomienda no usar» al configurar la campaña Despertar | `Tracker`, i18n |
| **Pruebas** | 161 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       161 tests
E2E        60/60
```

### 101.ª tanda — Traducciones de enemigos de Despertar

| Cambio | Detalle | Archivos |
|---|---|---|
| **i18n** | Nombres de Gorgoness, Gremlin Horde, Grim Doctor y Nagian Hunter, y de sus comandantes | `es.json`, `en.json` |
| **Pruebas** | 163 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       163 tests
E2E        60/60
```

### 102.ª tanda — Veneno X con fórmula y Carga en el glosario

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enemigos** | `VENENO X±N` calcula X, aplica la fórmula y mantiene el mínimo 0 | `adjustCapabilitiesByRunes`, `constants` |
| **Glosario** | La capacidad 2.0 pasa de `CARGAR` a `CARGA` | `glosario2.es.json`, `glosario2.en.json` |
| **Pruebas** | 165 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       165 tests
E2E        60/60
```

### 103.ª tanda — Fórmula de HEMORRAGIA

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enemigos** | `HEMORRAGIA X±N` usa el mismo cálculo de runas que el resto de capacidades X, con mínimo 0 | `adjustCapabilitiesByRunes` |
| **Pruebas** | 166 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       166 tests
E2E        60/60
```

### 104.ª tanda — ESPARCIR en el glosario 2.0

| Cambio | Detalle | Archivos |
|---|---|---|
| **Glosario** | Se añade ESPARCIR / SPREAD con su descripción en español e inglés | `glosario2.es.json`, `glosario2.en.json`, `es.json`, `en.json` |
| **Pruebas** | 167 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       167 tests
E2E        60/60
```

### 105.ª tanda — Fórmulas de ABSORBER SALUD y QUEMADURA

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enemigos** | `ABSORBER SALUD X±N` y `QUEMADURA X±N` calculan X, aplican la fórmula y mantienen el mínimo 0 | `adjustCapabilitiesByRunes`, `constants` |
| **Pruebas** | 168 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       168 tests
E2E        60/60
```

### 106.ª tanda — Traducciones de Hellspawn y Fell Asteris

| Cambio | Detalle | Archivos |
|---|---|---|
| **i18n** | Hellspawn Brute → Bruto Infernal, Brute Commander → Comandante Vástago, Fell Asteris → Aestris Letal, Ox Commander → Comandante Buey | `es.json`, `en.json` |
| **Pruebas** | 168 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       168 tests
E2E        60/60
```

### 107.ª tanda — Fórmula de FATIGA

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enemigos** | `FATIGA X±N` calcula X, aplica la fórmula y mantiene el mínimo 0 | `adjustCapabilitiesByRunes` |
| **Pruebas** | 169 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       169 tests
E2E        60/60
```

### 108.ª tanda — Fórmula de INTIMIDAR

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enemigos** | `INTIMIDAR X±N` calcula X, aplica la fórmula y mantiene el mínimo 0 | `adjustCapabilitiesByRunes` |
| **Pruebas** | 170 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       170 tests
E2E        60/60
```

### 109.ª tanda — Traducciones de Night Stalker y Gorgon Hexer

| Cambio | Detalle | Archivos |
|---|---|---|
| **i18n** | Night Stalker → Acechador Nocturno, Stalker Commander → Comandante Espantoso, Gorgon Hexer → Hechicero Gorgona, Hexer Commander → Comandante Hechicero | `es.json`, `en.json` |
| **Pruebas** | 170 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       170 tests
E2E        60/60
```

### 110.ª tanda — Traducción de Maya, La Montaraz

| Cambio | Detalle | Archivos |
|---|---|---|
| **i18n** | Maya, The Ranger → Maya, La Montaraz | `es.json`, `en.json` |
| **Pruebas** | 170 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       170 tests
E2E        60/60
```

### 111.ª tanda — Traducciones de esbirros de Despertar

| Cambio | Detalle | Archivos |
|---|---|---|
| **i18n** | Fallen Woodcutter → Leñador Caído, Nightmare → Pesadilla, Boatswain → Contramaestre, Tide Hunter → Cazamareas | `es.json`, `en.json` |
| **Pruebas** | 170 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       170 tests
E2E        60/60
```

### 112.ª tanda — Traducciones de monstruos de escenario de Despertar

| Cambio | Detalle | Archivos |
|---|---|---|
| **i18n** | Skeleton Guard → Guardia Esqueleto, Violent Bully → Matón Violento, Tangled Witch → Bruja Enredada, Infamous Monster → Engendro Infame, Infamous Striker → Artillero Infame | `es.json`, `en.json` |
| **Pruebas** | 170 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       170 tests
E2E        60/60
```

### 113.ª tanda — Capacidad del cañón terrorífico

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enemigos** | Nueva capacidad «Este monstruo se mueve hacia el cañón terrorífico más cercano y lo dispara», en azul, con etiqueta y descripciones ES/EN | `enemyVisuals`, `es.json`, `en.json`, `glosario2` |
| **Pruebas** | 171 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       171 tests
E2E        60/60
```

### 114.ª tanda — ARMADURA DE ASALTO / SIEGE ARMOR

| Cambio | Detalle | Archivos |
|---|---|---|
| **Glosario** | Se añade ARMADURA DE ASALTO / SIEGE ARMOR con su descripción en español e inglés | `glosario2.es.json`, `glosario2.en.json`, `es.json`, `en.json` |
| **Pruebas** | 172 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       172 tests
E2E        60/60
```

### 115.ª tanda — Nombres ingleses de enemigos de Despertar

| Cambio | Detalle | Archivos |
|---|---|---|
| **i18n** | Maya, The Ranger → Commander Maya; Violent Bully → Vicious Mauler; Tangled Witch → Coiled Harridan; Infamous Monster → Vile Spawn; Infamous Striker → Foul Shooter; Tide Hunter → Tidehunter; Fallen Woodcutter → Fell Woodman | `en.json` |
| **Pruebas** | 172 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       172 tests
E2E        60/60
```

### 116.ª tanda — GIGANTE / JUGGERNAUT

| Cambio | Detalle | Archivos |
|---|---|---|
| **Glosario** | Se añade GIGANTE / JUGGERNAUT con su descripción en español e inglés | `glosario2.es.json`, `glosario2.en.json`, `es.json`, `en.json` |
| **Pruebas** | 173 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       173 tests
E2E        60/60
```

### 117.ª tanda — Traducción de Minerva Maldita

| Cambio | Detalle | Archivos |
|---|---|---|
| **i18n** | Crused Minerva → Minerva Maldita | `es.json`, `en.json` |
| **Pruebas** | 173 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       173 tests
E2E        60/60
```

### 118.ª tanda — Nueva imagen de Soul Harvester

| Cambio | Detalle | Archivos |
|---|---|---|
| **Assets** | Nueva ilustración convertida a AVIF/WebP y variantes 320/640; el comandante usa la nueva imagen | `soul_harvester.png`, `soul_harvester.avif`, variantes |
| **i18n** | Cosechador de Almas añadido también al bloque de enemigos de escenario | `es.json`, `en.json` |
| **Pruebas** | 173 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       173 tests
E2E        60/60
```

### 119.ª tanda — Traducciones de los nuevos enemigos de escenario

| Cambio | Detalle | Archivos |
|---|---|---|
| **i18n** | Los esbirros, comandantes y monstruos nuevos añadidos al bloque `enemies.escenario` para que los menús superiores los muestren traducidos | `es.json`, `en.json` |
| **Pruebas** | 174 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       174 tests
E2E        60/60
```

### 120.ª tanda — Etiqueta Base en las cartas de comandante

| Cambio | Detalle | Archivos |
|---|---|---|
| **Comandantes** | Las 10 cartas actuales llevan `expansionId: 'base'` y muestran la etiqueta «Base» en la carta y en el detalle | `cartasEspeciales`, `InitTracker`, `CommanderCard`, `CommanderCardModal` |
| **Pruebas** | 175 unitarios · 60 E2E | tests |

**Medición**

```text
Unit       175 tests
E2E        60/60
```

### 121.ª tanda — Selector manual compacto y comportamiento aleatorio

| Cambio | Detalle | Archivos |
|---|---|---|
| **Manual** | Los enemigos blancos, grises y negros usan un selector compacto de comportamiento, con botón de comportamiento aleatorio | `InitTracker`, i18n |
| **Pruebas** | 175 unitarios · 61 E2E | tests |

**Medición**

```text
Unit       175 tests
E2E        61/61
```

### 122.ª tanda — Cartas de comandante de Despertar

| Cambio | Detalle | Archivos |
|---|---|---|
| **Comandantes** | 10 cartas nuevas (cmd_11–cmd_20), mazo según la expansión, etiquetas Despertar/Pasiva, notas y ayudas de resolución | `cartasEspeciales`, i18n, `CommanderCard`, `CommanderCardModal`, `InitTracker` |
| **Pruebas** | 176 unitarios · 61 E2E | tests |

**Medición**

```text
Unit       176 tests
E2E        61/61
```

### 123.ª tanda — SILENCIO con runa azul

| Cambio | Detalle | Archivos |
|---|---|---|
| **Comandantes** | La carta SILENCIO (`cmd_12`) pasa de runa Morado a runa Azul | `cartasEspeciales` |
| **Pruebas** | 176 unitarios · 61 E2E | tests |

**Medición**

```text
Unit       176 tests
E2E        61/61
```

### 124.ª tanda — Tablero adaptable y redimensionable

| Cambio | Detalle | Archivos |
|---|---|---|
| **Tablero** | Ajuste automático a ancho y alto de la ventana; panel ampliable arrastrando el tirador inferior y altura recordada | `TurnTrackBoard`, i18n |
| **Pruebas** | 176 unitarios · 62 E2E | tests |

**Medición**

```text
Unit       176 tests
E2E        62/62
```

### 125.ª tanda — Correcciones de las cartas de comandante

| Cambio | Detalle | Archivos |
|---|---|---|
| **Comandantes** | Calor Vital respeta el máximo; SILENCIO calcula X con runas azules; Aluvión roba del mazo de comandante; Brebaje pregunta con ventana propia; pasivas en panel superior; Hilo de Vida cura al derrotar monstruos | `CommanderCardModal`, `InitTracker`, `PassiveCardsPanel`, `hiloDeVida` |
| **Pruebas** | 178 unitarios · 62 E2E | tests |

**Medición**

```text
Unit       178 tests
E2E        62/62
```

### 126.ª tanda — Barajas de comandante y detalles del track

| Cambio | Detalle | Archivos |
|---|---|---|
| **Comandantes** | Ventana de PC con baraja estándar, aleatoria o manual (10 cartas, una por color y posición); textos de pasivas sin corchetes; Tirano muestra ataque normal y modificado; clic en toda la carta del enemigo; Hilo de Vida cura al retirar monstruos | `ModalCommanderPC`, `CommanderCardModal`, `CommanderCard`, `EnemyCard`, `InitTracker`, `commanderDeck`, `cardText` |
| **Pruebas** | 183 unitarios · 63 E2E | tests |

**Medición**

```text
Unit       183 tests
E2E        63/63
```

### 127.ª tanda — Etiquetas de capacidades de enemigo

| Cambio | Detalle | Archivos |
|---|---|---|
| **Traducciones** | Añadidas las etiquetas que faltaban para ENJAMBRE, CARGA, RETROCEDER, CÓLERA, ENCADENAR y otras capacidades presentes en el glosario | `es.json`, `en.json` |
| **Pruebas** | 184 unitarios · 63 E2E | tests |

**Medición**

```text
Unit       184 tests
E2E        63/63
```

### 128.ª tanda — Auditoría de etiquetas de capacidades

| Cambio | Detalle | Archivos |
|---|---|---|
| **Traducciones** | Resolución única para todas las capacidades de enemigo; cubiertas VUDÚ, ALIVIAR, CONTRAATAQUE y variantes `X-N`; prueba que exige etiqueta en español e inglés para todas las capacidades | `enemyCapability`, `ModalEnemyCard`, i18n |
| **Pruebas** | 187 unitarios · 63 E2E | tests |

**Medición**

```text
Unit       187 tests
E2E        63/63
```

### 129.ª tanda — Escenario filtrado por campaña

| Cambio | Detalle | Archivos |
|---|---|---|
| **Escenario** | «Oscuridad de Caza» e «Incursión» solo aparecen en la campaña Core; los monstruos de escenario se filtran por las expansiones de la campaña activa y se limpia la selección al cambiar de campaña | `TopMenu`, `scenarioCampaign` |
| **Pruebas** | 190 unitarios · 63 E2E | tests |

**Medición**

```text
Unit       190 tests
E2E        63/63
```

### 130.ª tanda — Runas e incursiones de Despertar

| Cambio | Detalle | Archivos |
|---|---|---|
| **Runas** | Añadidas las 5 cartas de runa de Despertar con caras A/B, textos y efecto guiado; añadidas las 3 incursiones con recuentos por héroes, chequeo previo y límites de invocación | `runasDespertar`, `incursionDespertar`, `TopMenu`, `RuneCard`, `InitTracker` |
| **Generación** | Fichas de Generación de los 5 colores, panel en Nodos, aviso sobre el track y comprobación en Batalla Naval | `GameContext`, `GenerationPointsBar`, assets |
| **Pruebas** | 192 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       192 tests
E2E        64/64
```

### 131.ª tanda — Cartas de Despertar independientes

| Cambio | Detalle | Archivos |
|---|---|---|
| **Runas e incursiones** | Eliminada la colocación conjunta; cada carta tiene su propio apartado con descripción, aclaración y caras A/B; solo puede haber una carta de runa y una de incursión en juego | `TopMenu`, `runasDespertar`, `incursionDespertar`, `RuneCard` |
| **Pruebas** | 192 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       192 tests
E2E        64/64
```

### 132.ª tanda — Pasos detallados en la vista ampliada

| Cambio | Detalle | Archivos |
|---|---|---|
| **Cartas** | La vista ampliada de las runas e incursiones de Despertar muestra una lista ordenada con todos los pasos de ejecución, además de la aclaración | `runasDespertar`, `incursionDespertar`, `RuneCard` |
| **Pruebas** | 192 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       192 tests
E2E        64/64
```

### 133.ª tanda — Refinado de cartas y menú Nodos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Cartas** | Los menús muestran solo el nombre y los botones; la vista ampliada muestra los pasos sin etiquetas y el pie con Eliminar, Aplicar efecto y Cerrar; se elimina el aspa superior | `TopMenu`, `RuneCard`, `runasDespertar`, `incursionDespertar` |
| **Nodos** | La sección de Nodos vuelve a mostrarse en todas las campañas, con pilas de runas y fichas de generación | `TopMenu` |
| **Pruebas** | 192 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       192 tests
E2E        64/64
```

### 134.ª tanda — Fichas de generación y escenario

| Cambio | Detalle | Archivos |
|---|---|---|
| **Generación** | Las fichas se borran al reiniciar la partida y solo se permite una por color, con el botón deshabilitado | `GameContext`, `TopMenu`, `generationPoints` |
| **Escenario** | El panel muestra únicamente enemigos con `scenario: "escenario"`, filtrados por la campaña activa | `scenarioCampaign` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 135.ª tanda — Animación y compactación visual

| Cambio | Detalle | Archivos |
|---|---|---|
| **Visualización** | Volteo animado en cartas de runa e incursión; monstruos de escenario en 3/4/6 columnas; cartas de los menús en dos columnas; control de áreas solo en Core y paneles de pilas/áreas separados | `RuneCard`, `TopMenu`, `ScenarioPanels` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 136.ª tanda — Cañones mágicos y ajustes de cartas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Cañones** | Fichas de cañón por color, cargadas/descargadas, panel en Nodos, barra sobre el track y persistencia; carga automática en Batalla Naval B | `GameContext`, `TopMenu`, `MagicCannonsBar`, assets |
| **Cartas** | Caza del Cosechador calcula y registra X por cada robo; Batalla Naval A invoca sin confirmación y calcula la vida `4+j`; se elimina la ficha de generación azul | `InitTracker`, `GenerationPointsBar` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 137.ª tanda — Incursiones, cañones y confirmaciones

| Cambio | Detalle | Archivos |
|---|---|---|
| **Incursiones** | Configuración copiada al colocar la carta; Incursión Incansable sin chequeo de enemigos y con recuentos correctos; Incursión Naval comprueba cañones; confirmaciones propias por colocación y aviso final de fallos | `InitTracker`, `incursionDespertar` |
| **Invocaciones** | Los lotes se lanzan juntos para conservar anillos de color distintos; Batalla Naval A evita repetir la invocación y calcula la vida `4+j` | `InitTracker` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 138.ª tanda — Historial, nodos y previsualización

| Cambio | Detalle | Archivos |
|---|---|---|
| **Historial** | Eliminada la entrada duplicada de Caza del Cosechador; el aviso ya registra el evento | `InitTracker` |
| **Campañas** | La previsualización de otras cajas vuelve a mostrar contenido base, como el control de áreas y Oscuridad de Caza | `TopMenu`, `ScenarioPanels` |
| **Almacenamiento** | `trackerSession` se guarda solo con campos conocidos y colas limitadas; Batalla Naval evita repetir la invocación del Artillero | `InitTracker` |
| **Nodos** | Fichas y cañones en paralelo; panel compacto de pilas en el lateral, debajo de la bolsa y encima del historial | `TopMenu`, `PilaStatusPanel`, `InitTracker`, `CompanionPicker` |
| **Incursiones** | Confirmaciones propias, recuentos correctos, cañones y elección de cañón con runa azul; colores distintos por lote | `InitTracker` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 139.ª tanda — Menú de compañeros y pilas compactas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Compañeros** | El menú se abre como desplegable de la barra superior, integrado con el resto de menús | `TopMenu`, `CompanionPicker`, `InitTracker` |
| **Pilas** | Panel lateral con ladrillos por color, código editable, activar, añadir, devolver y combate estrecho | `PilaStatusPanel`, `GameContext` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 140.ª tanda — Recuento del aviso de invocación

| Cambio | Detalle | Archivos |
|---|---|---|
| **Incursiones** | El aviso de «El Monstruo no se ha podido invocar…» se muestra siempre con el número de veces, incluso si no hay punto de invocación o capacidad desde el principio | `InitTracker` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 141.ª tanda — Pilas compactas en dos columnas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Pilas** | Dos paneles por fila; runas ordenadas por color; en reserva solo se muestra el botón de activar; el panel activo mantiene código, ladrillos y gestión | `PilaStatusPanel` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 142.ª tanda — Dados en panel lateral

| Cambio | Detalle | Archivos |
|---|---|---|
| **Dados** | El botón de dados abre y cierra un panel encima de la Bolsa de Runas, en lugar de una ventana modal | `DiceRoller`, `InitTracker` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 143.ª tanda — Generación y cañones en paralelo

| Cambio | Detalle | Archivos |
|---|---|---|
| **Track** | Las barras de Fichas de Generación y Cañones Mágicos se muestran una al lado de la otra encima del track | `InitTracker` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 144.ª tanda — Gestión de turno en presentación

| Cambio | Detalle | Archivos |
|---|---|---|
| **Presentación** | El modo presentación conserva la barra de gestión de turno: vista, deshacer, siguiente, densidad, paneles, dados y salir | `TurnTrackBoard` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 145.ª tanda — Compañeros como panel integrado

| Cambio | Detalle | Archivos |
|---|---|---|
| **Compañeros** | Eliminado el contenedor central con borde, sombra y ancho máximo; el contenido ocupa el panel del menú superior | `CompanionPicker` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 146.ª tanda — Cierre automático de avisos de runas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Avisos** | Los avisos de runas se cierran solos a los 9 segundos, igual que el resto de avisos | `GameContext` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 147.ª tanda — Nombre traducido en confirmaciones

| Cambio | Detalle | Archivos |
|---|---|---|
| **Incursiones** | La ventana de confirmación muestra el nombre del enemigo traducido, no el nombre interno | `InitTracker` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 148.ª tanda — Orden del historial en cartas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Historial** | El turno de la carta se registra antes de sus avisos de runa/incursión; los eventos dejan de aparecer dentro del turno del jugador anterior | `InitTracker` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 149.ª tanda — Salir de presentación sin mover paneles

| Cambio | Detalle | Archivos |
|---|---|---|
| **Presentación** | El botón de salir pasa a posición fija en la esquina superior; la barra de gestión conserva su sitio | `TurnTrackBoard` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 150.ª tanda — Nodos de Oscuridad y Rompenodo

| Cambio | Detalle | Archivos |
|---|---|---|
| **Campañas** | Las pilas de runas base solo se muestran en la caja base; Despertar usa Nodos de Oscuridad con estado propio | `ScenarioPanels`, `NodosOscuridadPanel`, `GameContext` |
| **Rompenodo** | Devuelve `6 − héroes` runas, muestra el aviso de Concentración/Purificación y lo guarda en el historial | `ScenarioPanels`, `PilaStatusPanel`, `GameContext` |
| **Track** | Las pilas del lateral dejan solo Añadir Runa y Rompenodo | `PilaStatusPanel` |
| **Pruebas** | 193 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       193 tests
E2E        64/64
```

### 151.ª tanda — Exclusión de enemigos de escenario en aleatorios

| Cambio | Detalle | Archivos |
|---|---|---|
| **Aleatorios** | Los enemigos de escenario nunca salen en selecciones aleatorias; al elegir uno, se excluyen las versiones normales que comparten su imagen | `scenarioEnemyRandom`, `InitTracker` |
| **Pruebas** | 197 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       197 tests
E2E        64/64
```

### 152.ª tanda — Icono de pila de runas

| Cambio | Detalle | Archivos |
|---|---|---|
| **Interfaz** | Nuevo icono de pila de runas en el menú Nodos, sus cabeceras y el panel lateral de pilas | `TopMenu`, `ScenarioPanels`, `NodosOscuridadPanel`, `PilaStatusPanel` |
| **Pruebas** | 197 unitarios · 64 E2E | tests |

**Medición**

```text
Unit       197 tests
E2E        64/64
```

### 153.ª tanda — Eventos especiales: Sorpresa de Eradren

| Cambio | Detalle | Archivos |
|---|---|---|
| **Menú** | Nuevo menú Eventos con botón para añadir Sorpresa de Eradren, estado del mazo y reinicio | `TopMenu` |
| **Mazo** | Seis cartas barajadas sin reemplazo, descartadas al salir y persistidas | `eventosEspeciales`, `GameContext` |
| **Track** | Icono `mecanica_especial` y botón para robar cartas | `SpecialEventBar` |
| **Cartas** | Modal con título, texto completo, fondo de `assets/interactions` e invocación de MG – Bisoño | `EventCardModal`, `InitTracker` |
| **Pruebas** | 201 unitarios · 65 E2E | tests |

**Medición**

```text
Unit       201 tests
E2E        65/65
```

### 154.ª tanda — Fichas de Tiempo en cartas de runa

| Cambio | Detalle | Archivos |
|---|---|---|
| **Vista ampliada** | Sección exclusiva para gestionar fichas de Tiempo con −/+, máximo 4 y badge en la carta | `RuneCard`, `initRunesContext` |
| **Turno** | Al llegar el turno de la carta se retira 1 ficha; al llegar a 0 se avisa de qué carta ha terminado el contador y queda en el historial | `InitTracker` |
| **Pruebas** | 201 unitarios · 65 E2E | tests |

**Medición**

```text
Unit       201 tests
E2E        65/65
```

### 155.ª tanda — MG significa Monstruo Gris

| Cambio | Detalle | Archivos |
|---|---|---|
| **Sorpresa de Eradren** | Las cartas de Asalto invocan un Monstruo Gris (color gris) de categoría Bisoño, no un monstruo grande | `eventosEspeciales`, `InitTracker` |
| **Pruebas** | 201 unitarios · 65 E2E | tests |

**Medición**

```text
Unit       201 tests
E2E        65/65
```

### 156.ª tanda — Fin del mazo Sorpresa de Eradren

| Cambio | Detalle | Archivos |
|---|---|---|
| **Evento** | Al robar la última carta, el evento desaparece de la vista principal y el mazo queda reiniciado para poder añadirse de nuevo | `GameContext`, `SpecialEventBar` |
| **Pruebas** | 201 unitarios · 65 E2E | tests |

**Medición**

```text
Unit       201 tests
E2E        65/65
```

### 157.ª tanda — Cargar partida y abrir el track

| Cambio | Detalle | Archivos |
|---|---|---|
| **Partidas** | Al pulsar Cargar se aplican los datos y se navega a `/init`, recargando la escena del track con la partida cargada | `SavesPanel` |
| **Pruebas** | 201 unitarios · 65 E2E | tests |

**Medición**

```text
Unit       201 tests
E2E        65/65
```

### 158.ª tanda — Exclusiones de Incursión Naval

| Cambio | Detalle | Archivos |
|---|---|---|
| **Incursión Naval** | Mientras la carta está en juego, no salen aleatoriamente Cazamareas (`nagian_hunter`) ni Executioner; se mantienen disponibles para añadirlos manualmente | `scenarioEnemyRandom`, `InitTracker` |
| **Pruebas** | 202 unitarios · 65 E2E | tests |

**Medición**

```text
Unit       202 tests
E2E        65/65
```

### 159.ª tanda — Artillero Infame excluido con Batalla Naval

| Cambio | Detalle | Archivos |
|---|---|---|
| **Runa Batalla Naval** | Mientras está en juego, Fell Asteris y sus versiones con la misma imagen no salen en selecciones aleatorias | `scenarioEnemyRandom`, `InitTracker` |
| **Pruebas** | 203 unitarios · 65 E2E | tests |

**Medición**

```text
Unit       203 tests
E2E        65/65
```

### 160.ª tanda — Carga de cañones de Batalla Naval

| Cambio | Detalle | Archivos |
|---|---|---|
| **Batalla Naval B** | Carga los cañones coincidentes; si ya están cargados ofrece elegir otro descargado; la runa azul elige un cañón descargado | `navalCannons`, `CannonLoadDialog`, `InitTracker` |
| **Fallos** | Se avisa por cada runa que no puede cargar ningún cañón, incluida la azul | `InitTracker` |
| **Pruebas** | 208 unitarios · 65 E2E | tests |

**Medición**

```text
Unit       208 tests
E2E        65/65
```

### 161.ª tanda — Incursión Naval B: Contramaestres y Fichas de Generación

| Cambio | Detalle | Archivos |
|---|---|---|
| **Incurción Naval B** | Invoca Contramaestres (`boatswain`) junto a una Ficha de Generación del color revelado; con runa azul se elige la ficha | `incursionDespertar`, `InitTracker` |
| **Aleatorios** | Se mantiene la exclusión de las versiones normales asociadas a Cazamareas/Executioner | `scenarioEnemyRandom` |
| **Pruebas** | 208 unitarios · 65 E2E | tests |

**Medición**

```text
Unit       208 tests
E2E        65/65
```

### 162.ª tanda — Repetición del Artillero Infame

| Cambio | Detalle | Archivos |
|---|---|---|
| **Batalla Naval A** | Cada vez que se resuelve la cara A vuelve a invocar 1 Artillero Infame, respetando el máximo de 4 copias o 12 enemigos totales | `InitTracker` |
| **Pruebas** | 208 unitarios · 65 E2E | tests |

**Medición**

```text
Unit       208 tests
E2E        65/65
```

### 163.ª tanda — Evitar el crecimiento de trackerSession

| Cambio | Detalle | Archivos |
|---|---|---|
| **Sesión** | `trackerSession` guarda solo estado compacto: evoluciones limitadas, grupo de turno resumido, cola de turnos y efectos acotados | `InitTracker` |
| **Pruebas** | 208 unitarios · 66 E2E; prueba específica de tamaño tras avanzar turnos | tests |

**Medición**

```text
Unit       208 tests
E2E        66/66
```

### 164.ª tanda — Estado INSPIRACIÓN

| Cambio | Detalle | Archivos |
|---|---|---|
| **INSPIRACIÓN** | Nuevo estado exclusivo de héroes, único, primero de la fila y con imagen `inspiracion.png` | `estadosAlterados`, i18n |
| **Orden** | Frágil, Polimorfismo y Restricción se colocan entre Lentitud y Hemorragia | `estadosAlterados` |
| **Pruebas** | 210 unitarios · 66 E2E | tests |

**Medición**

```text
Unit       210 tests
E2E        66/66
```

### 165.ª tanda — Barajas PS del Navío Corrupto y del Buque Cisne

| Cambio | Detalle | Archivos |
|---|---|---|
| **Barajas** | Dos mazos de 6 cartas, activables a la vez y visibles en paralelo; aviso al agotarse | `eventosEspeciales`, `GameContext`, `StoryDeckBar`, `TopMenu` |
| **Fuego / Refuerzos** | Manifestar runa, recargar cañón o elegir Ficha de Generación y resolver la invocación | `InitTracker` |
| **Visión Clara** | Aviso sobre el track y retirada al alcanzar Gris Abajo | `InitTracker`, `VisionClaraModal` |
| **Cañones Terroríficos** | Dos fichas con tiempo, selección al sacar la carta y anuncio de disponibilidad | `TerribleCannonsBar`, `TerribleCannonDialog` |
| **Pruebas** | 212 unitarios · 67 E2E | tests |

**Medición**

```text
Unit       212 tests
E2E        67/67
```

### 166.ª tanda — Descripciones correctas de estados alterados

| Cambio | Detalle | Archivos |
|---|---|---|
| **Tooltips** | Los estados alterados usan la descripción del estado (`DERRIBO`) y no la de su inmunidad (`DERRIBO_I`) | `ModalHeroCard` |
| **Pruebas** | 212 unitarios · 67 E2E | tests |

**Medición**

```text
Unit       212 tests
E2E        67/67
```

### 167.ª tanda — Menú Escenas: Capítulo 4

| Cambio | Detalle | Archivos |
|---|---|---|
| **Escenas** | Nuevo menú con activación conjunta de Capítulo 4: Batalla en Alta Mar | `TopMenu` |
| **Activación** | Añade runa e incursión naval, fichas de generación, cañones descargados y las dos barajas PS | `TopMenu` |
| **Seguidores** | Pregunta el estado de Vorn (Animado/Sediento) y Elros (Desanimado/Enérgico) antes de añadirlos | `SceneFollowerDialog` |
| **Pruebas** | 212 unitarios · 68 E2E | tests |

**Medición**

```text
Unit       212 tests
E2E        68/68
```

### 168.ª tanda — Cañones Terroríficos junto a los Mágicos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Track** | El panel de Cañones Terroríficos se muestra junto a los Cañones Mágicos | `InitTracker`, `TerribleCannonsBar` |
| **Visibilidad** | Aparece al añadir la baraja PS del Navío Corrupto, sin esperar a robar una carta | `TerribleCannonsBar` |
| **Pruebas** | 212 unitarios · 68 E2E | tests |

**Medición**

```text
Unit       212 tests
E2E        68/68
```

### 169.ª tanda — Visión Clara se retira al pasar Gris Abajo

| Cambio | Detalle | Archivos |
|---|---|---|
| **Visión Clara** | La ficha se retira al alcanzar el hueco Gris Abajo, exista o no una entidad colocada | `InitTracker` |
| **Pruebas** | 212 unitarios · 69 E2E, incluyendo el caso de hueco vacío | tests |

**Medición**

```text
Unit       212 tests
E2E        69/69
```

### 170.ª tanda — Fuego de respuesta con cañón ya cargado

| Cambio | Detalle | Archivos |
|---|---|---|
| **PS del Navío Corrupto** | Si el cañón del color manifestado ya está cargado, se ofrece elegir otro cañón descargado antes de invocar a los Cazamareas | `InitTracker` |
| **Pruebas** | 212 unitarios · 69 E2E | tests |

**Medición**

```text
Unit       212 tests
E2E        69/69
```

### 171.ª tanda — Eventos y Escenas solo en Despertar

| Cambio | Detalle | Archivos |
|---|---|---|
| **Menús** | Los iconos de Eventos y Escenas se ocultan en campañas sin contenido asociado; solo aparecen en Despertar | `TopMenu` |
| **Pruebas** | 212 unitarios · 70 E2E, incluyendo visibilidad por campaña | tests |

**Medición**

```text
Unit       212 tests
E2E        70/70
```

### 173.ª tanda — Ventanas propias de la app

| Cambio | Detalle | Archivos |
|---|---|---|
| **Avisos** | Todos los `alert` se sustituyen por avisos integrados de la app con historial | `AppDialogHost`, `appDialogs` |
| **Confirmaciones** | Los `window.confirm` pasan a diálogos propios, incluidos vida excedida, estados y consecuencias | `ConfirmDialog`, `ModalEnemyCard`, `InitTracker` |
| **Entradas** | Los `window.prompt` pasan a un diálogo propio con campo de texto/numérico | `PromptDialog` |
| **Pruebas** | 212 unitarios · 70 E2E | tests |

**Medición**

```text
Unit       212 tests
E2E        70/70
```

### 174.ª tanda — Restaurar visibilidad de avisos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Avisos** | Corregido el listener que impedía mostrar los avisos de `appNotify`; vuelven a verse y a registrarse | `AppDialogHost` |
| **Pruebas** | 212 unitarios · 71 E2E, incluyendo aviso al crear un Nodo sin runas | tests |

**Medición**

```text
Unit       212 tests
E2E        71/71
```

### 175.ª tanda — Elegir runa al aplicar Rompenodo

| Cambio | Detalle | Archivos |
|---|---|---|
| **Rompenodo** | Diálogo para elegir el color de cada runa retirada o dejar que sea aleatoria, manteniendo el total de `6 − héroes` | `useRompenodo`, `RompenodoDialog` |
| **Track y menú** | El diálogo está disponible tanto en el panel lateral del track como en el menú Nodos | `PilaStatusPanel`, `ScenarioPanels`, `NodosOscuridadPanel` |
| **Pruebas** | 212 unitarios · 72 E2E | tests |

**Medición**

```text
Unit       212 tests
E2E        72/72
```

### 176.ª tanda — Fichas de Tiempo en Despertar

| Cambio | Detalle | Archivos |
|---|---|---|
| **Fichas de Tiempo** | En Despertar ya no saltan el turno: solo reducen el contador y avisan; al llegar a 0 avisan del final | `InitTracker` |
| **Pruebas** | 212 unitarios · 72 E2E | tests |

**Medición**

```text
Unit       212 tests
E2E        72/72
```

### 177.ª tanda — Voltear cartas desde la vista ampliada

| Cambio | Detalle | Archivos |
|---|---|---|
| **Cartas de runa e incursión** | Botón **Voltear** en el pie de la vista ampliada para cambiar entre caras A y B | `RuneCard` |
| **Pruebas** | 212 unitarios · 72 E2E, con volteo real desde la vista ampliada | tests |

**Medición**

```text
Unit       212 tests
E2E        72/72
```

### 178.ª tanda — Escenas 1–4 de Despertar

| Cambio | Detalle | Archivos |
|---|---|---|
| **Escenas** | Añadidos Capítulos 1–3 y completado el 4 con runas en el track y enemigos por número de héroes | `scenes`, `TopMenu`, `InitTracker` |
| **Runa e incursión** | Capítulos 1–3 usan Influencia Creciente; el 2 añade Incursión Atroz y el 4 la incursión naval | `scenes` |
| **Invocaciones** | Los enemigos se añaden de forma acumulativa según los héroes, con casilla de color e inicial más orden en el historial | `InitTracker`, `HistoryPanel`, `gameLog` |
| **Nodos** | El Capítulo 2 crea 4 Nodos activos y el 3 crea 1, después de colocar las runas | `GameContext` |
| **Inglés** | Títulos de escena y «Dreadful Raid» corregidos | i18n |
| **Pruebas** | 212 unitarios · 76 E2E | tests |

**Medición**

```text
Unit       212 tests
E2E        76/76
```

### 179.ª tanda — Menú de escenas compacto y ordenado

| Cambio | Detalle | Archivos |
|---|---|---|
| **Escenas** | Capítulos ordenados 1–4 y tarjetas compactas en dos columnas con botón reducido | `TopMenu` |
| **Pruebas** | 212 unitarios · 76 E2E | tests |

**Medición**

```text
Unit       212 tests
E2E        76/76
```

### 180.ª tanda — Anillos distintos en invocaciones de escena

| Cambio | Detalle | Archivos |
|---|---|---|
| **Anillos** | Las invocaciones de una escena reservan un anillo distinto por enemigo y dejan libre el siguiente disponible | `InitTracker` |
| **Pruebas** | 212 unitarios · 76 E2E, verificando tres anillos únicos en el Capítulo 4 | tests |

**Medición**

```text
Unit       212 tests
E2E        76/76
```

### 181.ª tanda — Baraja del Jabalí Parpadeante

| Cambio | Detalle | Archivos |
|---|---|---|
| **Baraja** | 8 cartas con las acciones Adelante, Descanso, Viento del Oeste y Brisa del Este; las pares añaden FURIA | `flickeringBoarDeck` |
| **Ciclo** | Se baraja al inicializarse, descarta cada robo y recarga/baraja las 8 al agotarse | `flickeringBoarDeck` |
| **Enemigo** | Se inicializa automáticamente al colocar un enemigo con id `flickering_boar` y se retira al quitarlo | `InitTracker`, `GameContext` |
| **Pruebas** | 216 unitarios · 77 E2E | tests |

**Medición**

```text
Unit       216 tests
E2E        77/77
```

### 182.ª tanda — Enemigo Jabalí Parpadeante

| Cambio | Detalle | Archivos |
|---|---|---|
| **Enemigo** | Añadido `flickering_boar` como escenario de Despertar, con capacidad de desaparecer al recibir daño | `enemies`, i18n |
| **Cara de carta** | Botón Voltear con animación; la cara de carta muestra Manifestar 1 Runa y recolocación junto a una Pila de Runas activa | `ModalEnemyCard`, `InitTracker` |
| **Turno** | Cara carta: manifiesta, comprueba pila y vuelve al monstruo. Cara monstruo: roba de Comportamiento Jabalí Parpadeante | `InitTracker` |
| **FURIA** | Acumula +2 Ataque y +1 Movimiento; después avisa de la Activación | `InitTracker` |
| **Pruebas** | 216 unitarios · 78 E2E | tests |

**Medición**

```text
Unit       216 tests
E2E        78/78
```

### 183.ª tanda — Fichas y cañones solo con iconos

| Cambio | Detalle | Archivos |
|---|---|---|
| **Fichas de Generación** | Se retiran los nombres de color; solo queda el icono, manteniendo tooltip y etiqueta accesible | `GenerationPointsBar` |
| **Cañones Mágicos** | Se retiran los nombres de color; quedan el icono y el indicador de carga | `MagicCannonsBar` |
| **Pruebas** | 216 unitarios · 78 E2E | tests |

**Medición**

```text
Unit       216 tests
E2E        78/78
```

### 184.ª tanda — Comportamiento especial del Jabalí sin usar «comportamiento»

| Cambio | Detalle | Archivos |
|---|---|---|
| **Clave propia** | El Jabalí usa `specialBehavior: "flickering_boar"` en lugar de `comportamiento: "especial"` | `enemies`, `enemySanitize` |
| **Volteo y turno** | El volteo, la baraja y el comportamiento se detectan por `specialBehavior` o por id, nunca por `comportamiento` | `ModalEnemyCard`, `InitTracker` |
| **Pruebas** | 216 unitarios · 78 E2E | tests |

**Medición**

```text
Unit       216 tests
E2E        78/78
```

### 185.ª tanda — Ventana de comportamiento del Jabalí y turno único

| Cambio | Detalle | Archivos |
|---|---|---|
| **Daño** | El Jabalí ya no se elimina automáticamente al recibir daño | `InitTracker` |
| **Carta robada** | La carta y sus efectos se muestran en una ventana con fondo de interacción | `FlickeringBoarCardModal` |
| **Turno** | El comportamiento del Jabalí se procesa una sola vez por turno, aunque la carta se voltee durante ese turno | `InitTracker` |
| **Pruebas** | 216 unitarios · 78 E2E | tests |

**Medición**

```text
Unit       216 tests
E2E        78/78
```

### 186.ª tanda — Cara B del Jabalí en el tablero

| Cambio | Detalle | Archivos |
|---|---|---|
| **Cara B** | Se muestra como carta con fondo de interacción y título en el propio track, sin abrir la vista ampliada | `EnemyCard` |
| **Volteo** | Botón de volteo en la ficha del track; al pasar a Cara B no se abre ningún modal | `EnemyCard`, `TrackSlot` |
| **Mazo** | Eliminado el panel visual; se baraja al colocar y se recarga automáticamente al agotarse | `InitTracker`, `flickeringBoarDeck` |
| **FURIA** | Solo las cartas 2 y 4 tienen FURIA | `flickeringBoarDeck` |
| **Ventana** | El botón pasa a llamarse **Aceptar** | `FlickeringBoarCardModal`, i18n |
| **Pruebas** | 217 unitarios · 78 E2E | tests |

**Medición**

```text
Unit       217 tests
E2E        78/78
```

### 187.ª tanda — Nombre inglés de Furia del Cosechador

| Cambio | Detalle | Archivos |
|---|---|---|
| **Inglés** | La carta de runa pasa a llamarse **Harvester's Rage** | `i18n/en.json` |
| **Pruebas** | 217 unitarios · 78 E2E | tests |

**Medición**

```text
Unit       217 tests
E2E        78/78
```

### 188.ª tanda — Vista ampliada de ambas caras del Jabalí

| Cambio | Detalle | Archivos |
|---|---|---|
| **Cara B ampliada** | La Cara B muestra su carta con fondo, título y texto en la vista ampliada | `ModalEnemyCard` |
| **Volteo** | Botón de volteo disponible en las vistas ampliadas de ambas caras | `ModalEnemyCard` |
| **Pila** | Si no hay una Pila de Runas activa con el color manifestado, la carta no se voltea | `InitTracker` |
| **Pruebas** | 217 unitarios · 78 E2E | tests |

**Medición**

```text
Unit       217 tests
E2E        78/78
```

### Pendiente / pospuesto

- **Enemigos (paso 3)**: cerrado (chips de color/categoría y contador en el selector manual).
- **Runas (paso 2)**: cerrado (cabecera con contadores, rejilla, zona de riesgo y nodos).
- **Escenario (paso 3)**: cerrado (monstruo y cartas con contadores; retratos accesibles).
- **H8**: cerrado en sus tres partes (cursor, orden/historial y paneles de escenario).
- **D9**: cerrado (eventos, facciones, estados y botones de acción tokenizados; los badges y rojos oscuros conservan su matiz propio).
- **F2**: cerrado (AVIF + `srcset` en miniaturas; los originales WebP/PNG se conservan como respaldo).
- **F4**: cerrado hasta el límite de GitHub Pages; clickjacking residual y cabeceras imposibles documentados en `docs/SEGURIDAD.md`.
- **P2**: API de sincronización (pospuesta por decisión de producto).