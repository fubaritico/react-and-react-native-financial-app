import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [reactRouter()],

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
