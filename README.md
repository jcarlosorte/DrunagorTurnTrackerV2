# Drunagor Turn Tracker V2

Aplicación web para dirigir las partidas de **Chronicles of Drunagor**: iniciativa,
turnos, runas, estados alterados, enemigos y escenario en una sola pantalla.

> **En producción:** <https://jcarlosorte.github.io/DrunagorTurnTrackerV2/>

Es una SPA local-first: funciona sin cuenta y sin conexión una vez cargada. Las
partidas se guardan en el navegador y se pueden exportar como JSON.

## Características

- **Tablero de iniciativa** con vista de tablero o lista, zoom, ajuste al ancho,
  modo presentación y densidad de cartas configurable.
- **Turnos** de héroes, enemigos y runas: ronda, turnos extra, deshacer y cola de
  iniciativa.
- **Cronómetro** por turno (`mm:ss`, en rojo a partir de 5:00) y tiempo total por
  héroe, consultable en el historial.
- **Historial** de hasta 300 eventos con filtros por tipo y búsqueda.
- **Enemigos**: alta aleatoria por color, alta manual con buscador y filtros de
  color y categoría, bolsa de colores y jefes con inmunidades.
- **Runas**: cartas de runa (oscuridad, asalto, rey redivivo, huésped, invadidos),
  estado de la bolsa, manifestar, fichas y zona de riesgo con confirmaciones.
- **Nodos y áreas**: pilas de runas, nodos de niebla, barricadas, puntos de
  aparición, llaves rúnicas y rescate.
- **Escenario**: monstruo de escenario y cartas de incursión y defensa.
- **Héroes**: vista ampliada con vida, estados alterados, cubos de acción y equipo;
  edición de estados, vida y dados, y reinicio de la ficha (estados, recursos y cubos).
- **Recursos por clase**: Concentración para todos, Ki del monje, Furia del bárbaro y
  Fruto de vida del druida, con un máximo de 4 fichas cada uno.
- **Guardados**: autoguardado, hasta 10 partidas con nombre, exportación e
  importación JSON (partida completa, solo configuración o solo track).
- **Bilingüe** español/inglés, con detección y selector de idioma.

## Stack

| Área | Tecnología |
|---|---|
| UI | React 18, Vite 6, Tailwind CSS 3 |
| Rutas | React Router 7 (`basename` configurable) |
| Animación | framer-motion |
| Iconos y avisos | react-icons, react-toastify |
| Pruebas | Vitest (unidad), Playwright (E2E) |
| Calidad | ESLint flat config |
| Imágenes | WebP/AVIF + `srcset` en miniaturas |

Requiere **Node.js 22** y **npm 10** (véase `.nvmrc`).

## Inicio rápido

```bash
npm ci
npm run dev
```

Para probar el artefacto de producción:

```bash
npm run build
npm run preview
```

El build genera `dist/404.html` para que GitHub Pages sirva la SPA al recargar
rutas profundas.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción + fallback SPA |
| `npm run preview` | Sirve `dist` en local |
| `npm run lint` | ESLint (0 errores y 0 avisos como objetivo) |
| `npm run test` | Tests unitarios (Vitest) |
| `npm run test:e2e` | Tests E2E (Playwright; usa `vite preview` en el puerto 4173) |
| `npm run visual:check` | Capturas y comprobaciones visuales |
| `npm run images:webp` | PNG/JPG → WebP |
| `npm run images:avif` | WebP/PNG → AVIF y actualización de imports |
| `npm run images:variants` | Variantes 320/640 para miniaturas + manifiesto |

## Estructura

```text
src/
  pages/            Inicio, configuración, selección y tablero
  components/       UI general, track, escenario y guardados
  context/          Estado global (partida, enemigos, runas, idioma…)
  hooks/            Cursor de turno, estados, foco
  utils/            Lógica pura y persistencia
  data/             Catálogos: héroes, enemigos, runas, cartas…
  i18n/             Textos es/en
  assets/           Ilustraciones y variantes optimizadas
tests/e2e/          Pruebas Playwright
docs/               Arquitectura y seguridad
scripts/            Build, imágenes y verificación visual
```

## Rutas

| Ruta | Pantalla |
|---|---|
| `/` | Inicio: continuar, nueva partida, contenido y partidas |
| `/tracker` | Configuración de la partida: héroes, roles y enemigos |
| `/init` | Partida activa (protegida: exige héroes) |
| `/config` | Configuración: idioma, expansiones, versión de reglas y panel de partidas |
| `/tutorial` | Guía de uso de la aplicación |
| `/saves` | Partidas guardadas: guardar, cargar, exportar, importar |

## Datos y contenido

- Los catálogos viven en `src/data/` (héroes, enemigos, runas, incursión, defensa,
  estados, roles, fichas, cubos por clase…).
- Los textos y descripciones están en `src/i18n/es.json` y `src/i18n/en.json`.
  Si se añaden estados o cartas, hay que actualizar ambos idiomas.
- Las expansiones activas filtran el contenido disponible y la selección manual.

## Partidas y persistencia

- Autoguardado en `localStorage` (runas, fichas, pilas, enemigos, turno, ronda,
  héroes y su estado).
- Hasta **10 partidas** con nombre en el dispositivo, con carga y borrado.
- **Exportación/importación JSON** con tres alcances: `configuration`, `track` y
  `full`. Los datos importados se validan y sanean contra los catálogos actuales;
  las entradas desconocidas se descartan.
- `schemaVersion` actual: **3**, con migraciones desde versiones anteriores.
- Indicador de cuota: avisa al superar el 80 % del espacio disponible y compacta
  los datos antes de fallar.
- La sincronización multi-dispositivo **no está implementada** (véase el roadmap).

## Seguridad

- Sin backend, sin cuentas y sin telemetría.
- **CSP por `<meta>`** en el build (GitHub Pages no permite cabeceras propias):
  `script-src 'self'`, `script-src-attr 'none'`, `frame-src 'none'`,
  `object-src 'none'`, `base-uri 'self'`, `form-action 'none'` y
  `upgrade-insecure-requests`.
- `referrer=no-referrer`, `color-scheme=dark` y sin sourcemaps en producción.
- Límites del hosting y riesgo residual de clickjacking documentados en
  [docs/SEGURIDAD.md](docs/SEGURIDAD.md).

## Calidad

Suite esperada antes de cada entrega:

```text
lint      0 errores / 0 avisos
unit      80 tests
e2e       37 tests
build     OK
```

Las pruebas E2E cubren tablero, estados, guardados, héroes, seguridad, menús de
enemigos/runas/nodos/escenario, volteo de cartas y CSP.

## Despliegue

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publica
`main` en GitHub Pages.

1. **Settings → Pages → Source: GitHub Actions**.
2. Push a `main` y esperar los jobs de build y deploy.
3. Comprobar que la barra de portada muestra el commit desplegado
   (`v1.0.0 · <hash>`); si no cambia, el deploy no se aplicó.
4. Verificar `/`, `/tracker`, `/init` y una recarga directa.

`VITE_BASE_PATH` se normaliza en `vite.config.js` y se comparte con el router y el
`index.html`, así que no hay que editar tres rutas al cambiar de subruta.

### Variables de entorno

```dotenv
VITE_BASE_PATH=/DrunagorTurnTrackerV2/
VITE_SOURCEMAP=false
```

Vite solo publica variables `VITE_*`; no colocar secretos en ellas.

## Limitaciones conocidas

- `localStorage` es por navegador y dispositivo: no sincroniza partidas.
- Sin cuentas ni permisos; cualquiera con acceso al navegador ve las partidas.
- El borrado del almacenamiento del navegador elimina las partidas no exportadas.
- GitHub Pages no permite `frame-ancestors` ni cabeceras de seguridad propias.

## Documentación

- [Arquitectura y decisiones](docs/REVISION-ARQUITECTURA.md)
- [Seguridad y límites de Pages](docs/SEGURIDAD.md)

## Roadmap

- Panel de habilidades del héroe (rombos y cubos por habilidad).
- Capacidades de clase y objetos de equipo con iconos.
- Almacén del héroe y campamento del grupo.
- Compañeros y mascotas con turno propio y vista de vida/estados.
- Reinicio de partida por capas (turno, runas, héroes…).
- Contenido de Apocalipsis para las reglas 2.0 (el selector 1.5/2.0 ya existe).
- Sincronización multi-dispositivo opcional (requiere backend).

## Autor

Proyecto personal de **jcarlosorte** (DaRkFiDoDiDo).

- GitHub: <https://github.com/jcarlosorte>
- Instagram: <https://www.instagram.com/carl_el_mazmorrero/>

Chronicles of Drunagor es una marca de sus respectivos propietarios. Este proyecto
es una herramienta no oficial para uso personal.
