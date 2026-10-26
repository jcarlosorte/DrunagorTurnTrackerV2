# Drunagor Turn Tracker

SPA para gestionar turnos de **Chronicles of Drunagor**, construida con React 18, Vite 6 y Tailwind CSS.

## Estado de la arquitectura

- Aplicación estática: no existe backend, autenticación, base de datos ni endpoint `/api`.
- Los catálogos y reglas están en `src/data/` y la configuración del usuario se conserva en `localStorage`.
- `localStorage` es por navegador/dispositivo: no sincroniza partidas entre jugadores.
- `VITE_API_BASE_URL` queda reservado para una futura API; no debe configurarse ni asumirse que existe.

## Requisitos y desarrollo local

Se recomienda Node.js 22 y npm 10 (`.nvmrc` y `package.json` lo fijan).

```bash
npm ci
npm run dev
```

Abrir la URL que muestre Vite. Para probar el artefacto final:

```bash
npm run build
npm run preview
```

El build también genera `dist/404.html` para que GitHub Pages pueda servir la SPA al recargar rutas profundas.

## Variables de entorno

Copiar `.env.example` a `.env.local` si se necesita personalizar el destino:

```dotenv
# GitHub Pages del repositorio
VITE_BASE_PATH=/DrunagorTurnTrackerV2/

# Dominio propio o hosting en la raíz
# VITE_BASE_PATH=/

# Por defecto false en producción; los mapas exponen el código fuente
VITE_SOURCEMAP=false
```

Vite solo publica variables `VITE_*` en el bundle. No colocar secretos en ellas.

`vite.config.js` normaliza `VITE_BASE_PATH`, `App.jsx` usa el mismo valor como `basename` y `index.html` usa `%BASE_URL%` para iconos y manifest. Así no hay que editar tres rutas distintas al cambiar de subruta.

## API y puntos finales

Actualmente no hay puntos finales que modificar: el proyecto no usa `fetch`, Axios, WebSocket ni autenticación.

Si posteriormente se necesita sincronización, no se debe almacenar un token secreto en `localStorage` sin un diseño de autenticación. Antes de implementarla hay que definir:

- URL HTTPS de la API y versionado, por ejemplo `/api/v1`.
- `POST /api/v1/sessions`, `GET /api/v1/sessions/:id`, `PUT /api/v1/sessions/:id` y `DELETE /api/v1/sessions/:id`.
- Identidad, permisos por partida, expiración/renovación de sesión y protección CSRF si se usan cookies.
- Validación de esquemas, límites de tamaño/frecuencia, CORS restringido al dominio real, logs sin tokens y persistencia transaccional.

No se ha creado una API ficticia porque no hay contrato ni proveedor backend solicitado.

## Estado de seguridad de dependencias

- `npm audit --omit=dev`: **0 vulnerabilidades** en las dependencias que llegan al navegador.
- La auditoría completa mantiene 3 avisos moderados en la cadena de build de Tailwind/PostCSS. La solución automática exige migrar Tailwind 3 a Tailwind 4, un cambio mayor que puede alterar estilos; se deja como tarea separada y no se ejecuta con `--force`.

## Publicación recomendada: GitHub Pages

El workflow `.github/workflows/deploy.yml` publica `main` automáticamente.

1. En GitHub, abrir **Settings → Pages**.
2. Seleccionar **GitHub Actions** como fuente.
3. Comprobar que el repositorio se llama `DrunagorTurnTrackerV2` o cambiar `VITE_BASE_PATH` en el workflow a `/<nombre-del-repo>/`.
4. Confirmar que el workflow tiene permisos `Pages: write` y `id-token: write`.
5. Hacer commit y push a `main`.
6. Esperar los jobs **Build and deploy / build** y **deploy**.
7. Abrir `https://<usuario>.github.io/<repositorio>/` y comprobar `/`, `/tracker`, `/config` e `/init`.
8. Probar una recarga directa en `/tracker`: `dist/404.html` evita el 404 típico de GitHub Pages.

El pipeline ejecuta `npm ci`, `npm audit --omit=dev`, `npm run build` y despliega un artefacto inmutable. `node_modules` y `dist` ya no deben versionarse.

## Dominio propio

1. Registrar el dominio y decidir si la web vivirá en la raíz (`VITE_BASE_PATH=/`) o en una subruta.
2. Para raíz, cambiar `VITE_BASE_PATH` en el workflow a `/` y regenerar el build.
3. En GitHub Pages, añadir el dominio en **Settings → Pages → Custom domain**.
4. Crear los registros DNS que indique GitHub: normalmente `A`/`AAAA` para el apex y `CNAME` para `www`.
5. Esperar la propagación, activar **Enforce HTTPS** y verificar que el certificado está vigente.
6. Si se usa un proveedor distinto, configurar un rewrite de todas las rutas desconocidas a `index.html`; mantener el fallback `404.html` solo como compatibilidad.

## Servidor estático y caché

Para Nginx, el bloque equivalente es:

```nginx
server {
  listen 443 ssl http2;
  server_name tracker.example.com;
  root /srv/DrunagorTurnTrackerV2/dist;

  location /assets/ {
    try_files $uri =404;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-cache";
  }
}
```

Usar HTTPS, compresión Brotli/Gzip, CDN delante de los assets y despliegues atómicos. No cachear `index.html` durante un año porque debe apuntar al último hash.

## Ruta escalable

1. **PR:** `npm ci`, `npm audit --omit=dev`, build y revisión de bundle.
2. **Staging:** publicar el artefacto en una URL temporal, probar rutas, idioma, almacenamiento corrupto, selección y reinicio de partida.
3. **Producción:** promover el artefacto probado, no recompilar manualmente en el servidor.
4. **Rollback:** conservar el artefacto anterior y volver a apuntar el CDN/Pages al commit anterior.
5. **Observabilidad:** monitorizar disponibilidad, errores JavaScript, 404, tamaño de assets y Web Vitals; no registrar datos de partidas salvo consentimiento.
6. **Escala funcional:** para partidas compartidas, añadir una API versionada, autenticación, base de datos y control de concurrencia; localStorage no sustituye ese diseño.

## Correcciones aplicadas en esta revisión

- Parser seguro y tolerante a datos corruptos de `localStorage`, con fallback de idioma y validación de catálogos.
- Eliminación de efectos secundarios dentro de actualizadores funcionales de React.
- Operaciones atómicas para fichas, creación de pilas y reemplazo/devolución de puntos.
- Reset completo de fichas, mazos, avisos, contadores y estado auxiliar.
- Mazos inicializados una sola vez por partida.
- Resultado seguro de efectos de estados cuando la vida llega a cero.
- Base/basename, manifest, iconos, fallback SPA y sourcemaps parametrizados para publicación.
- Dependencias directas de `react-router-dom` y `uuid` actualizadas a versiones sin vulnerabilidades de producción.
- `.gitignore`, Node LTS, workflow CI/CD y carga diferida de imágenes de catálogo.

## Persistencia y partidas guardadas

- Autoguardado del estado de partida en `localStorage`: runas, fichas, pilas, enemigos, runas colocadas, turno y ronda.
- La configuración inicial (expansiones, héroes, roles, enemigos y comportamientos) se conserva al empezar una partida nueva.
- Hasta 10 partidas con nombre en el dispositivo, con carga y borrado individual.
- Exportación e importación JSON en tres alcances: partida completa, solo configuración o solo track.
- Compatibilidad con exportaciones antiguas (`schemaVersion: 1`).
- Los datos importados se validan contra los catálogos actuales; las entradas desconocidas se descartan y se avisa antes de aplicar.
- Indicador de cuota de almacenamiento con aviso al superar el 80 % del espacio disponible.
- Los conjuntos de efectos ya procesados se persisten para no repetir invocaciones, daño o cartas al restaurar una partida.
- Confirmaciones accesibles antes de restablecer, borrar runas, eliminar partidas guardadas o iniciar una partida nueva.

## Navegación y arquitectura de pantallas

- `/` Inicio: continuar partida, nueva partida y acceso a contenido y partidas.
- `/tracker` Selección de héroes, roles y enemigos.
- `/init` Partida activa.
- `/config` **Contenido**: idioma y expansiones activas.
- `/saves` **Partidas**: guardar, cargar, exportar, importar y cuota.

- `SavesPanel` ([src/components/saves/SavesPanel.jsx](src/components/saves/SavesPanel.jsx)) es el único componente de gestión de partidas y se reutiliza en la página `/saves` y en el panel lateral del track.
- El panel lateral se abre desde la barra superior (botón **Partidas**) o con `Ctrl/⌘ + S`, y se carga bajo demanda para no incluir los catálogos del juego en el bundle inicial.
- Una sola barra superior global: logo, indicador de autoguardado, botón Partidas y selector de idioma. La barra del track queda debajo, sin duplicar el selector de idioma.
- `ErrorBoundary` envuelve la aplicación y `StorageWarning` avisa si una escritura en `localStorage` falla.

## Capas y superficies del track

- Escala única de capas en [src/index.css](src/index.css): `layer-app-bar` (50), `layer-track-bar` (40), `layer-menu` (45), `layer-toast` (60), `layer-drawer` (70), `layer-modal` (80) y `layer-dialog` (100). Ningún elemento usa ya valores `z-index` arbitrarios.
- Cada slot del track usa `track-slot`, que aplica `isolation: isolate`. Así las cartas apiladas nunca se dibujan por encima de la etiqueta del slot ni de los slots vecinos, aunque se escalen o destaquen en el turno actual.
- Etiqueta del slot (`track-slot__label`), pilas (`track-slot__stack`) e insignias (`track-slot__badge`) tienen capas internas explícitas.
- Superficies unificadas con `track-surface` y `track-surface-raised`: misma paleta slate, bordes y radios que el resto de la aplicación.
- Los avisos de fichas se renderizan una sola vez, desde `InitTracker`, para evitar toasts duplicados.

## Menús del track

- Una sola barra contextual con tres secciones: **Enemigos**, **Runas** y **Escenario**, cada una con `aria-expanded` y `aria-controls`.
- Un único botón de cierre en la barra, en lugar de un botón de cierre repetido en cada sección.
- El botón de borrar runas vive solo en su sección correspondiente, no duplicado en la barra.
- Los paneles son regiones desplazables con altura máxima para no tapar el tablero en móvil.

## Experiencia de tablero

- `TurnTrackBoard` ([src/components/track/TurnTrackBoard.jsx](src/components/track/TurnTrackBoard.jsx)) encapsula el tablero y ofrece dos vistas:
  - **Tablero**: rejilla de 11 posiciones con zoom.
  - **Lista**: vista vertical para móvil, con el turno actual destacado y el resto colapsado; se expande el slot que interese.
- Zoom con botones `−`/`+`, porcentaje visible y botón **Ajustar** para encajar el ancho; también admite gesto de pinza en pantallas táctiles.
- **Modo presentación**: oculta la barra de menús, oculta el selector de vista y muestra el tablero a mayor tamaño. Siempre hay un botón visible para salir.
- **Deshacer turno**: guarda hasta 10 instantáneas del cursor de turno (turno, ronda, grupo, turnos extra y entidad activa). Restaura el estado anterior sin recalcular daño ya aplicado.
- **Barra de acción flotante** en móvil con deshacer, añadir enemigo y siguiente turno, con objetivos de 48 px y espacio inferior reservado para no tapar contenido.
- `EnemyCard` ([src/components/track/EnemyCard.jsx](src/components/track/EnemyCard.jsx)) se extrajo de `InitTracker`. Además corrige un fallo latente: antes llamaba a `useState` dentro de un `map`, lo que rompe las reglas de hooks. Los iconos de estado e inmunidad son ahora subcomponentes propios.

### Tamaños fijos del tablero

- Cada slot tiene altura mínima de `32rem` y zonas superior e inferior fijas de `13rem`, de modo que la tarjeta nunca colapsa por falta de altura.
- Las tarjetas se posicionan con ancho fijo de `92px` y traslación centrada, así la imagen siempre tiene anchura y altura calculable.
- La etiqueta del slot usa `min-w-0` y `truncate`; ya no fuerza el ancho de la columna ni desborda el tablero (causa de que “Controlador” estirase la rejilla).
- La rejilla usa `auto-rows-[34rem]` para que las once columnas compartan altura aunque alguna quede vacía.

## Historial de la partida

- [gameLog.js](src/utils/gameLog.js) registra hasta 300 eventos con fecha, tipo y mensaje.
- Cada aviso de escenario, daño, invocación o runa se registra automáticamente con la ronda y el turno activos.
- El historial viaja dentro del JSON de guardado (`gameLog`) y se limpia al empezar una partida nueva.
- En **Partidas** se muestra el número de eventos y se puede exportar como `.txt`.



## Consistencia visual y de terminología

- Toda la paleta gris del track y de sus menús se migró a la escala `slate`, la misma que Inicio, Contenido, Partidas y Configuración. Solo quedan grises en los códigos de color de runas y enemigos, donde el gris es un valor semántico.
- Los paneles del track usan `track-surface` / `track-surface-raised` en lugar de combinaciones sueltas de fondo, radio y borde.
- Terminología unificada: **Partidas** para guardado, **Contenido** para expansiones, **Cerrar** para cerrar y **Cancelar** para descartar acciones.
- Claves i18n añadidas para todo el cromo del track (`turno`, `track`, `evento`, `eliminarRuna`, `enemiesMenu`, `runesMenu`, `scenarioMenu`) y para la selección (`searchHeroes`, `searchEnemies`, `noResults`, `stepsLabel`, `next`, `cancel`, etc.) en `es.json` y `en.json`.
- Extraídos `TrackTurnHeader` ([src/components/track/TrackTurnHeader.jsx](src/components/track/TrackTurnHeader.jsx)) y `BagStatusPanel` ([src/components/track/BagStatusPanel.jsx](src/components/track/BagStatusPanel.jsx)) como primera fase del refactor de `InitTracker`.


