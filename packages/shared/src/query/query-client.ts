import { QueryClient } from '@tanstack/react-query'

/**
 * Creates a QueryClient with shared defaults for all apps.
 * Each app calls this once at startup and passes it to QueryClientProvider.
 *
 * @returns Configured QueryClient with 5-min stale time and retry policies
 */
export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}
