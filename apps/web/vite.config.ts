import path from 'path'
import { fileURLToPath } from 'url'

import netlifyPlugin from '@netlify/vite-plugin-react-router'
import { reactRouter } from '@react-router/dev/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ command }) => ({
  plugins: [
    svgr(),
    reactRouter(),
    netlifyPlugin(),
    tsconfigPaths({ projects: [path.resolve(__dirname, '../../packages/ui/tsconfig.json')] }),
    sentryVitePlugin({
      org: 'fubaratico',
      project: 'epouch-web',
      sourcemaps: {
        filesToDeleteAfterUpload: ['build/**/*.map'],
      },
    }),
  ],

  build: {
    sourcemap: true,
  },

  /**
   * Bundle everything for serverless (Netlify Functions).
   * Only applied during build — in dev, Vite SSR needs CJS packages (React)
   * as externals to avoid "module is not defined" errors.
   */
  ssr: {
    noExternal: command === 'build' ? /^(?!node:).*$/ : undefined,
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
