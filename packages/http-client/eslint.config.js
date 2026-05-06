/**
 * @fileoverview ESLint configuration for http-client package.
 *
 * Generated client files in src/client/ are ignored.
 * Scripts use Node globals (console, process).
 */
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['src/client/**', 'dist/**'],
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  }
)
