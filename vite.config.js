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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');
  const base = normalizeBase(env.VITE_BASE_PATH || '/DrunagorTurnTrackerV2/');

  return {
    plugins: [react()],
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
