import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react-native'

import type { RenderOptions } from '@testing-library/react-native'
import type { ReactElement } from 'react'

/** Creates a fresh QueryClient for each test (no retries, no caching). */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

/** Renders a component wrapped in QueryClientProvider for tests. */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const queryClient = createTestQueryClient()

  function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}
