import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React 17+ / Vite usa el JSX transform automático; no requiere `import React`.
      'react/react-in-jsx-scope': 'off',

      // El proyecto es TS, no necesitamos propTypes.
      'react/prop-types': 'off',

      // La regla de fast-refresh es útil pero hoy hay exports mixtos; lo dejamos como warning.
      'react-refresh/only-export-components': 'warn',

      // En este repo hay varias rutas/imports en movimiento; evitamos falsos positivos.
      'import/no-unresolved': 'off',

      // Permite placeholders en esta fase de maquetado.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // A11y: durante maquetado puede haber href="#" y labels temporales.
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/label-has-associated-control': 'off',

      // React Compiler / librerías no compatibles -> no bloquear.
      'react-hooks/incompatible-library': 'off',

      // Maquetado UI: no bloquear por dependencias de hooks en mocks.
      'react-hooks/exhaustive-deps': 'off',
    },
  },
])
