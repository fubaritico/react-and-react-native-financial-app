import { QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'

import { createTestQueryClient } from './query-client'

/** Provider wrapper for React Query — each render gets a fresh QueryClient. */
export function ReactQueryWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createTestQueryClient())
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
