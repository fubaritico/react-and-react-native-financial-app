import '../src/i18n'

import { ModalProvider } from '@financial-app/features'
import { client } from '@financial-app/http-client/client'
import {
  createAppQueryClient,
  isAuthLoadingAtom,
  isAuthenticatedAtom,
  useAuthListener,
  useConfigureHttpClient,
} from '@financial-app/shared'
import { PortalProvider } from '@financial-app/ui/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { Redirect, Slot, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAtomValue } from 'jotai'
import { Provider as JotaiProvider } from 'jotai'
import { useState } from 'react'
import { Platform } from 'react-native'

import { DevBadge } from '../src/components/DevBadge'
import { authClient } from '../src/lib/supabase'

import type { ReactNode } from 'react'

const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'
/** Android emulator can't reach host's localhost — remap to 10.0.2.2 */
const API_URL =
  Platform.OS === 'android'
    ? RAW_API_URL.replace('localhost', '10.0.2.2')
    : RAW_API_URL

console.warn('[DEBUG] Platform:', Platform.OS, '| API_URL:', API_URL)

/** Bootstraps auth listener and HTTP client configuration */
function AuthBootstrap({ children }: Readonly<{ children: ReactNode }>) {
  useAuthListener(authClient)
  useConfigureHttpClient(client, authClient, API_URL)
  return children
}

/** Redirects based on auth state — must be inside JotaiProvider + AuthBootstrap */
function AuthGate({ children }: Readonly<{ children: ReactNode }>) {
  const isAuthLoading = useAtomValue(isAuthLoadingAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const segments = useSegments()
  const inAuthGroup = segments[0] === '(auth)'

  // Wait for the first auth state callback before deciding where to redirect
  if (isAuthLoading) return null

  if (!isAuthenticated && !inAuthGroup) {
    return <Redirect href="/login" />
  }

  if (isAuthenticated && inAuthGroup) {
    return <Redirect href="/" />
  }

  return children
}

/**
 * Root layout — auth gate.
 * Reads isAuthenticatedAtom and conditionally redirects
 * between (auth) and (tabs) route groups.
 */
export default function RootLayout() {
  const [queryClient] = useState(createAppQueryClient)

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <PortalProvider>
          <AuthBootstrap>
            <AuthGate>
              <ModalProvider>
                <StatusBar style="dark" />
                <DevBadge />
                <Slot />
              </ModalProvider>
            </AuthGate>
          </AuthBootstrap>
        </PortalProvider>
      </QueryClientProvider>
    </JotaiProvider>
  )
}
