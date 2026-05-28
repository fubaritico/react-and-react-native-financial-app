import { QueryClient } from '@tanstack/react-query'

/**
 * Creates a disposable QueryClient for server-side prefetching.
 * One instance per HTTP request — garbage collected after dehydration.
 *
 * gcTime set to 2000ms (not 0) to prevent premature garbage collection
 * before React finishes rendering the HTML (TanStack Query docs recommendation).
 * @returns Fresh QueryClient configured for SSR
 */
export function createServerQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 2000,
      },
    },
  })
}
