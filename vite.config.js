import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const normalizeBase = (value) => {
  if (!value || value === '/') return '/';
  return `/${value.replace(/^\/+|\/+$/g, '')}/`;
};

/** Hash corto del commit (o marca de tiempo si no hay git). */
const buildId = (() => {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: rootDir }).toString().trim();
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
})();

const appVersion = (() => {
  try {
    return JSON.parse(readFileSync(path.join(rootDir, 'package.json'), 'utf8')).version || '1.0.0';
  } catch {
    return '1.0.0';
  }
})();

/**
 * F4 · CSP en producción.
 *
 * GitHub Pages no permite cabeceras propias, así que se inyecta como `<meta>`.
 * `frame-ancestors` y `report-uri` solo funcionan por cabecera: quedan fuera y
 * se documentan como limitación conocida del hosting.
 */
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self'",
  // framer-motion y react-toastify aplican estilos en línea.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
];

function cspMetaPlugin() {
  return {
    name: 'drunagor-csp-meta',
    apply: 'build',
    transformIndexHtml(html) {
      const meta = `    <meta http-equiv="Content-Security-Policy" content="${CSP_DIRECTIVES.join('; ')}" />\n`;
      return html.replace('<head>', `<head>\n${meta}`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');
  const base = normalizeBase(env.VITE_BASE_PATH || '/DrunagorTurnTrackerV2/');

  return {
    plugins: [react(), cspMetaPlugin()],
    base,
    define: {
      __BUILD_ID__: JSON.stringify(buildId),
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || appVersion),
    },
    build: {
      // Source maps are useful locally but expose source code in production.
      sourcemap: env.VITE_SOURCEMAP === 'true' || mode !== 'production',
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('react-icons')) return 'vendor-icons';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react';
            return undefined;
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(rootDir, './src'),
      },
    },
  };
});
