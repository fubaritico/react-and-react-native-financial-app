import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // svgr so tests importing components that transitively import .svg files resolve.
  // NOT the reactRouter() plugin — it is not compatible with the vitest runner.
  plugins: [svgr()],
  test: {
    // App-layer units under test (loaders, route helpers) are plain TS — no DOM
    // needed. Component tests can opt into jsdom per-file via `// @vitest-environment jsdom`.
    environment: 'node',
    include: ['app/**/*.test.ts', 'app/**/*.test.tsx'],
  },
})
