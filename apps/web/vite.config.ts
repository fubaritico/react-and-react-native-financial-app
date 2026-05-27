import path from 'path'
import { fileURLToPath } from 'url'

import netlifyPlugin from '@netlify/vite-plugin-react-router'
import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    svgr(),
    reactRouter(),
    netlifyPlugin(),
    tsconfigPaths({ projects: [path.resolve(__dirname, '../../packages/ui/tsconfig.json')] }),
  ],

  /**
   * SSR build: compile the custom Express server entry instead of the default.
   * The virtual:react-router/server-build import is resolved by the reactRouter() plugin.
   */
  build: {
    rollupOptions: isSsrBuild ? { input: './server/app.ts' } : undefined,
  },

  /**
   * Workspace packages export raw TypeScript (no pre-compiled JS).
   * Without `noExternal`, Vite SSR treats them as Node externals and
   * feeds untransformed TS to the ESM loader, which chokes on type syntax.
   */
  ssr: {
    noExternal: [
      '@financial-app/features',
      '@financial-app/ui',
      '@financial-app/tailwind-config',
      '@financial-app/tokens',
    ],
  },

  server: {
    watch: {
      ignored: ['!**/node_modules/@financial-app/**'],
    },
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
}))
