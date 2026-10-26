import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const normalizeBase = (value) => {
  if (!value || value === '/') return '/';
  return `/${value.replace(/^\/+|\/+$/g, '')}/`;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');
  const base = normalizeBase(env.VITE_BASE_PATH || '/drunagor-turn-tracker/');

  return {
    plugins: [react()],
    base,
    build: {
      // Source maps are useful locally but expose source code in production.
      sourcemap: env.VITE_SOURCEMAP === 'true' || mode !== 'production',
    },
    resolve: {
      alias: {
        '@': path.resolve(rootDir, './src'),
      },
    },
  };
});
