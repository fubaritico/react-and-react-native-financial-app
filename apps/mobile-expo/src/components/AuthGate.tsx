import { getUsersMePreferencesOptions } from '@financial-app/http-client'
import {
  isAuthLoadingAtom,
  isAuthenticatedAtom,
  isHttpClientReadyAtom,
} from '@financial-app/shared'
import { useQuery } from '@tanstack/react-query'
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
    /** Checks the Supabase MFA assurance level and updates component state. */
    async function checkMfa() {
      const { hasMfaEnrolled, currentLevel } =
        await authClient.getAssuranceLevel()
      setNeedsMfaChallenge(hasMfaEnrolled && currentLevel === 'aal1')
      setMfaChecked(true)
    }
    void checkMfa()
  }, [isAuthenticated])

  // Fetch preferences once HTTP client is ready — staleTime: Infinity (invalidated on mutation)
  const {
    data: preferences,
    isLoading: preferencesLoading,
    isError: preferencesError,
  } = useQuery({
    ...getUsersMePreferencesOptions(),
    enabled: isAuthenticated && isHttpClientReady,
    staleTime: Infinity,
  })

  // Derive onboarding state from preferences
  const needsModeChoice = preferences?.mode == null
  const needsInitialBalance =
    preferences?.mode === 'manual' && !preferences.initial_balance_set
  const onboardingComplete = !needsModeChoice && !needsInitialBalance

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

  // Wait for preferences to load before making onboarding decisions
  if (isAuthenticated && !inAuthGroup && preferencesLoading) return null

  // On preferences fetch error, let user through to avoid being stuck
  if (isAuthenticated && !inAuthGroup && preferencesError) {
    return children
  }

  // Redirect to onboarding screens if needed
  if (isAuthenticated && needsModeChoice && !inAuthGroup) {
    return <Redirect href="/mode-choice" />
  }
  if (isAuthenticated && needsInitialBalance && !inAuthGroup) {
    return <Redirect href="/initial-balance" />
  }

  // Authenticated user on auth screen with onboarding complete → go to home
  if (
    isAuthenticated &&
    inAuthGroup &&
    !needsMfaChallenge &&
    onboardingComplete
  ) {
    return <Redirect href="/" />
  }

  return children
}
