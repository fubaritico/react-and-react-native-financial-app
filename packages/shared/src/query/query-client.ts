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
        retry: (failureCount, error) => {
          // Never retry on 401 — the interceptor handles sign-out
          if (
            typeof error === 'object' &&
            'status' in error &&
            (error as { status: number }).status === 401
          ) {
            return false
          }
          return failureCount < 1
        },
      },
      mutations: {
        retry: 0,
      },
    },
  })
}
