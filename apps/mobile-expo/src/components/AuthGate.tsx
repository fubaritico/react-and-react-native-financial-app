import {
  isAuthLoadingAtom,
  isAuthenticatedAtom,
  isHttpClientReadyAtom,
} from '@financial-app/shared'
import { Redirect, useSegments } from 'expo-router'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'

import { authClient } from '../lib/supabase'

import type { ReactNode } from 'react'

/** Redirects based on auth state — must be inside JotaiProvider + AuthBootstrap */
export function AuthGate({ children }: Readonly<{ children: ReactNode }>) {
  const isAuthLoading = useAtomValue(isAuthLoadingAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const isHttpClientReady = useAtomValue(isHttpClientReadyAtom)
  const segments = useSegments()
  const inAuthGroup = segments[0] === '(auth)'

  const [mfaChecked, setMfaChecked] = useState(false)
  const [needsMfaChallenge, setNeedsMfaChallenge] = useState(false)

  // Check MFA assurance level after auth is confirmed
  useEffect(() => {
    if (!isAuthenticated) {
      setMfaChecked(false)
      setNeedsMfaChallenge(false)
      return
    }
    async function checkMfa() {
      const { hasMfaEnrolled, currentLevel } =
        await authClient.getAssuranceLevel()
      setNeedsMfaChallenge(hasMfaEnrolled && currentLevel === 'aal1')
      setMfaChecked(true)
    }
    void checkMfa()
  }, [isAuthenticated])

  // Wait for the first auth state callback before deciding where to redirect
  if (isAuthLoading) return null

  if (!isAuthenticated && !inAuthGroup) {
    return <Redirect href="/login" />
  }

  // SEC-002: Wait for MFA assurance level check before navigating to protected routes
  if (isAuthenticated && !mfaChecked) return null

  // SEC-002: Enforce AAL2 when MFA is enrolled — prevents bypassing TOTP challenge.
  // OWASP A07:2021 — Identification and Authentication Failures.
  if (isAuthenticated && needsMfaChallenge && !inAuthGroup) {
    return <Redirect href="/totp-challenge" />
  }

  // Wait for HTTP client to be configured with auth before navigating to protected routes
  if (isAuthenticated && !isHttpClientReady && !inAuthGroup) return null

  if (isAuthenticated && inAuthGroup && !needsMfaChallenge) {
    return <Redirect href="/" />
  }

  return children
}
