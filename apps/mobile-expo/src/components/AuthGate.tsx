import {
  isAuthLoadingAtom,
  isAuthenticatedAtom,
  isHttpClientReadyAtom,
} from '@financial-app/shared'
import { Redirect, useSegments } from 'expo-router'
import { useAtomValue } from 'jotai'

import type { ReactNode } from 'react'

/** Redirects based on auth state — must be inside JotaiProvider + AuthBootstrap */
export function AuthGate({ children }: Readonly<{ children: ReactNode }>) {
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
