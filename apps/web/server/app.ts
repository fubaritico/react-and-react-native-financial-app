/**
 * Custom Express server for React Router SSR.
 *
 * This file is compiled by Vite as the SSR entry point (via rollupOptions.input).
 * The `virtual:react-router/server-build` import is resolved by the reactRouter()
 * Vite plugin during build to the actual route modules and manifest.
 *
 * @remarks
 * - On Netlify: `handler` is used by the serverless function wrapper
 * - Locally: the server self-starts on the configured port
 * - Static files are served by Netlify CDN in production — Express.static
 *   is only used for local production testing
 */
import { createRequestHandler } from '@react-router/express'
import express from 'express'
import serverless from 'serverless-http'

const app = express()

// Static asset serving — fingerprinted assets get long cache
app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }))
app.use(express.static('build/client', { maxAge: '1h' }))

// React Router SSR handler — catches all routes not matched by static files
app.all(
  '*',
  createRequestHandler({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    build: () => import('virtual:react-router/server-build'),
  })
)

/** Serverless handler for Netlify Functions (Lambda). */
export const handler = serverless(app)

// Self-start for local production testing: `node build/server/index.js`
if (!process.env.NETLIFY) {
  const port = Number(process.env.PORT ?? 3000)
  app.listen(port, () => {
    console.warn(`Web server running on http://localhost:${String(port)}`)
  })
}
