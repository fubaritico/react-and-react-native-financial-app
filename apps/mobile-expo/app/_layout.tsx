import '../src/i18n'

import { ModalRenderer } from '@financial-app/features/shared'
import { client } from '@financial-app/http-client/client'
import {
  createAppQueryClient,
  isAuthLoadingAtom,
  isAuthenticatedAtom,
  isHttpClientReadyAtom,
  useAuthListener,
  useConfigureHttpClient,
  useInactivityTimeout,
  useModal,
  useSessionExpiredHandler,
} from '@financial-app/shared'
import { PortalProvider } from '@financial-app/ui/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { Redirect, Slot, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAtomValue } from 'jotai'
import { Provider as JotaiProvider } from 'jotai'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

/** Inactivity threshold before auto sign-out (30 seconds) */
const INACTIVITY_DELAY_MS = 30_000

/** Bootstraps auth listener, HTTP client, inactivity timeout, and session expired modal */
function AuthBootstrap({ children }: Readonly<{ children: ReactNode }>) {
  const { t } = useTranslation()
  const { open: openModal, close: closeModal } = useModal()
  const handleSignOut = useSessionExpiredHandler(authClient)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  const showSessionExpiredModal = useCallback(() => {
    openModal({
      title: t('auth.sessionExpired.title', 'Session expired'),
      description: t(
        'auth.sessionExpired.description',
        'Your session has expired. Please sign in again.'
      ),
      dismissable: false,
      actions: [
        {
          label: t('common.ok', 'OK'),
          variant: 'primary',
          onPress: () => {
            closeModal()
            handleSignOut()
          },
        },
      ],
    })
  }, [openModal, closeModal, handleSignOut, t])

  const showInactivityModal = useCallback(() => {
    openModal({
      title: t('auth.inactivity.title', 'Signed out due to inactivity'),
      description: t(
        'auth.inactivity.description',
        'You were signed out for security after a period of inactivity.'
      ),
      dismissable: false,
      actions: [
        {
          label: t('common.ok', 'OK'),
          variant: 'primary',
          onPress: () => {
            closeModal()
            handleSignOut()
          },
        },
      ],
    })
  }, [openModal, closeModal, handleSignOut, t])

  useAuthListener(authClient)
  useConfigureHttpClient(client, authClient, API_URL, showSessionExpiredModal)
  useInactivityTimeout(
    showInactivityModal,
    INACTIVITY_DELAY_MS,
    isAuthenticated
  )

  return children
}

/** Redirects based on auth state — must be inside JotaiProvider + AuthBootstrap */
function AuthGate({ children }: Readonly<{ children: ReactNode }>) {
  const isAuthLoading = useAtomValue(isAuthLoadingAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const isHttpClientReady = useAtomValue(isHttpClientReadyAtom)
  const segments = useSegments()
  const inAuthGroup = segments[0] === '(auth)'

  // Wait for the first auth state callback before deciding where to redirect
  if (isAuthLoading) return null

  if (!isAuthenticated && !inAuthGroup) {
    return <Redirect href="/login" />
  }

  // Wait for HTTP client to be configured with auth before navigating to protected routes
  if (isAuthenticated && !isHttpClientReady) return null

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
              <ModalRenderer>
                <StatusBar style="dark" />
                <DevBadge />
                <Slot />
              </ModalRenderer>
            </AuthGate>
          </AuthBootstrap>
        </PortalProvider>
      </QueryClientProvider>
    </JotaiProvider>
  )
}
