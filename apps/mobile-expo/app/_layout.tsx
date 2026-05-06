import '../src/i18n'

import { client } from '@financial-app/http-client/client'
import {
  createAppQueryClient,
  useAuthListener,
  useConfigureHttpClient,
} from '@financial-app/shared'
import { PortalProvider } from '@financial-app/ui/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Provider as JotaiProvider } from 'jotai'
import { useState } from 'react'

import { DevBadge } from '../src/components/DevBadge'
import { authClient } from '../src/lib/supabase'

import type { ReactNode } from 'react'

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'

/** Bootstraps auth listener and HTTP client configuration */
function AuthBootstrap({ children }: Readonly<{ children: ReactNode }>) {
  useAuthListener(authClient)
  useConfigureHttpClient(client, authClient, API_URL)
  return children
}

/**
 * Root layout — auth gate.
 *
 * Auth state is synced to Jotai via useAuthListener.
 * The HTTP client is configured with the current session token.
 * When Google OAuth is configured, this layout will read isAuthenticatedAtom
 * from Jotai and conditionally render (auth) or (tabs) stack.
 */
export default function RootLayout() {
  const [queryClient] = useState(createAppQueryClient)

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <PortalProvider>
          <AuthBootstrap>
            <StatusBar style="light" />
            <DevBadge />
            <Slot />
          </AuthBootstrap>
        </PortalProvider>
      </QueryClientProvider>
    </JotaiProvider>
  )
}
