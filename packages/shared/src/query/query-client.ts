import { QueryClient } from '@tanstack/react-query'

/**
 * Creates a QueryClient with shared defaults for all apps.
 * Each app calls this once at startup and passes it to QueryClientProvider.
 *
 * staleTime set to 60s per TanStack Query SSR docs — prevents immediate
 * refetch on the client after server-side hydration, while still keeping
 * data reasonably fresh.
 *
 * @returns Configured QueryClient with 60s stale time and retry policies
 */
export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
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
