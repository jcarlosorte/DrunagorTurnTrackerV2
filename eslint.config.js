import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'playwright-report/**', 'test-results/**', '.tmp-build/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        __BUILD_ID__: 'readonly',
        __APP_VERSION__: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      // Solo las reglas de hooks estables: las de React Compiler son demasiado
      // estrictas para el código actual y se revisarán en la refactorización.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // El proyecto no usa PropTypes (datos internos y contextos).
      'react/prop-types': 'off',
      // React 17+ con el runtime automático.
      'react/react-in-jsx-scope': 'off',
      // Avisos, no errores: no deben romper el build.
      // `ignoreRestSiblings` permite omitir campos con `const { a, ...resto } = obj`.
      'no-unused-vars': ['warn', {
        args: 'none',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        caughtErrors: 'none',
      }],
      'no-empty': 'warn',
      'no-cond-assign': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/display-name': 'off',
    },
  },
  {
    files: ['**/*.test.{js,jsx}', 'scripts/**/*.mjs', '*.config.js'],
    languageOptions: {
      // Los scripts de Playwright usan APIs del navegador dentro de page.evaluate.
      globals: { ...globals.node, ...globals.browser },
    },
  },
];
