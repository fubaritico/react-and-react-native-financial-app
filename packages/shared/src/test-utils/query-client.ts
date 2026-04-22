import { QueryClient } from '@tanstack/react-query'

/** Creates a QueryClient with retries disabled — suitable for tests. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}
