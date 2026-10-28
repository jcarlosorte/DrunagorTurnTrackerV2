# Seguridad — Drunagor Turn Tracker V2

Aplicación **estática** (SPA) publicada en GitHub Pages. No hay backend, cuentas
ni telemetría: todos los datos de partida viven en `localStorage` del navegador.

## 1. Defensas aplicadas

| Defensa | Dónde | Detalle |
|---|---|---|
| **CSP** | `vite.config.js` (solo build) | Se inyecta como `<meta http-equiv="Content-Security-Policy">` en `index.html`; el `404.html` se copia del mismo archivo y la hereda |
| **Sin scripts inline** | CSP | `script-src 'self'` + `script-src-attr 'none'`: React no emite `onclick`/`onerror` en el HTML |
| **Sin iframes ni workers** | CSP | `frame-src 'none'`, `worker-src 'none'`; la app no los usa |
| **Sin plugins** | CSP | `object-src 'none'` |
| **Formularios y base** | CSP | `form-action 'none'`, `base-uri 'self'` |
| **Recursos externos acotados** | CSP | Solo Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`); imágenes propias, `data:` y `blob:` |
| **HTTPS forzado** | CSP | `upgrade-insecure-requests` |
| **Privacidad de referrer** | `index.html` | `<meta name="referrer" content="no-referrer">` |
| **HSTS** | GitHub Pages | La envía el hosting: `Strict-Transport-Security: max-age=31556952` (verificado con `curl -I`) |
| **Sin sourcemaps en producción** | `vite.config.js` | Solo se generan con `VITE_SOURCEMAP=true` |

### Política vigente

```text
default-src 'self';
script-src 'self';
script-src-attr 'none';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' data: https://fonts.gstatic.com;
img-src 'self' data: blob:;
connect-src 'self';
manifest-src 'self';
worker-src 'none';
frame-src 'none';
object-src 'none';
base-uri 'self';
form-action 'none';
upgrade-insecure-requests
```

`style-src` conserva `'unsafe-inline'` porque React, framer-motion y
react-toastify aplican estilos en línea; eliminarlo exigiría reescribir esos
estilos y no aporta una barrera real frente a XSS (el vector peligroso es
`script-src`).

## 2. Lo que GitHub Pages no permite

GitHub Pages sirve archivos estáticos y **no admite cabeceras HTTP propias**
(tampoco `_headers`). Estas defensas solo funcionan por cabecera y quedan fuera:

| Cabecera | Efecto | Estado |
|---|---|---|
| `Content-Security-Policy: frame-ancestors` | Evita clickjacking (embebido en un iframe ajeno) | **No aplicable**; la CSP por `<meta>` ignora esta directiva |
| `X-Frame-Options` | Alternativa clásica a `frame-ancestors` | **No aplicable** |
| `Content-Security-Policy-Report-Only` / `report-uri` / `report-to` | Telemetría de violaciones | **No aplicable**; sin informe automático |
| `Permissions-Policy` | Desactiva cámara, micrófono, geolocalización… | **No aplicable**; la app no las usa, pero el navegador podría preguntar si un tercero inyectara código |
| `Cross-Origin-Opener-Policy` / `Cross-Origin-Resource-Policy` | Aislamiento entre orígenes | **No aplicable** |
| `X-Content-Type-Options: nosniff` | Evita sniffing de tipos | **No aplicable**; Pages no la envía |

### Riesgo residual aceptado: clickjacking

Sin `frame-ancestors`/`X-Frame-Options`, un tercero podría embeber la app en un
iframe y superponer elementos para inducir clics. Se acepta porque:

- La app no tiene acciones destructivas de cuenta ni pagos; el peor caso es
  modificar el estado de una partida local.
- El marco de JavaScript *framebuster* se descarta: no es una barrera fiable,
  puede romper usos legítimos y añade complejidad.
- La CSP sigue bloqueando la ejecución de scripts inyectados, que es el vector
  con impacto real.

Si en el futuro se cambia de hosting (Netlify, Cloudflare Pages, Vercel), bastará
un archivo `_headers` con `frame-ancestors 'none'` y `report-to`.

## 3. Verificación

```powershell
# Cabeceras reales del sitio publicado (HSTS incluido)
curl.exe -sI https://jcarlosorte.github.io/DrunagorTurnTrackerV2/

# CSP y metas en el HTML generado
Select-String -Path dist\index.html -Pattern 'Content-Security-Policy|referrer'

# Prueba E2E: la política se sirve, no bloquea la app y no hay violaciones
npx playwright test tests/e2e/seguridad.spec.js
```

El test E2E comprueba además que `frame-ancestors` **no** aparece en la meta
(porque se ignoraría) y que `referrer` es `no-referrer`.

## 4. Fuera de alcance

- **Contraseñas, sesiones o datos personales**: no existen.
- **Integridad de los datos de partida**: `localStorage` es accesible por
  cualquier script del mismo origen; la CSP reduce el riesgo de inyección, no
  lo elimina.
- **Dependencias de terceros**: Google Fonts es la única petición externa. Si se
  quiere CSP totalmente cerrada, habría que alojar la fuente en el propio sitio
  (`font-src 'self'`) y eliminar `fonts.googleapis.com`.
