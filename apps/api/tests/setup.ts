import { afterAll, afterEach, beforeAll } from 'vitest'

import { SUPABASE_URL } from './helpers.js'

// Set env vars BEFORE any app module is imported (supabase.ts validates at import time)
process.env.SUPABASE_URL = SUPABASE_URL
process.env.SUPABASE_SERVICE_ROLE_KEY = 'fake-service-role-key'

// Lazy-import server after env is set (dynamic import avoids hoisting)
const { server } = await import('./server.js')

beforeAll(() => {
  server.listen({
    onUnhandledRequest(request, print) {
      // Let supertest requests through — only warn on unhandled Supabase calls
      const url = new URL(request.url)
      if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') return
      print.warning()
    },
  })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
