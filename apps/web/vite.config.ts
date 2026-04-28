import path from 'path'
import { fileURLToPath } from 'url'

import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths({ projects: [path.resolve(__dirname, '../../packages/ui/tsconfig.json')] }),
  ],

  /**
   * Workspace packages export raw TypeScript (no pre-compiled JS).
   * Without `noExternal`, Vite SSR treats them as Node externals and
   * feeds untransformed TS to the ESM loader, which chokes on type syntax.
   */
  ssr: {
    noExternal: [
      '@financial-app/ui',
      '@financial-app/tailwind-config',
      '@financial-app/tokens',
    ],
  },

  resolve: {
    /**
     * `.web.*` before `.*` — the web equivalent of Metro's `.native.*` resolution.
     * Ensures Vite picks `Button.web.tsx` over `Button.tsx` (types-only file).
     */
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
    ],
  },
})
