import { getUsersMePreferencesOptions } from '@financial-app/http-client'
import {
  isAuthLoadingAtom,
  isAuthenticatedAtom,
  isHttpClientReadyAtom,
} from '@financial-app/shared'
import { useQuery } from '@tanstack/react-query'
import { useSegments } from 'expo-router'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'

import { authClient } from '../lib/supabase'

/** Expo Router segment name for the auth group */
const AUTH_GROUP_SEGMENT = '(auth)'

/** Supabase MFA assurance level 1 — password only, TOTP not yet verified */
const MFA_ASSURANCE_LEVEL_1 = 'aal1'

/** Possible outcomes of the auth redirect decision */
type AuthRedirectResult =
  | {
      /** Auth state still loading — render nothing */
      status: 'loading'
    }
  | {
      /** Redirect user to a different route */
      status: 'redirect'
      href: string
    }
  | {
      /** Auth resolved — render children */
      status: 'ready'
    }

/**
 * Encapsulates all auth-gate routing logic: auth state, MFA assurance check,
 * HTTP client readiness, and onboarding preferences.
 * @returns The redirect decision for the current auth state
 */
export function useAuthRedirect(): AuthRedirectResult {
  const isAuthLoading = useAtomValue(isAuthLoadingAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const isHttpClientReady = useAtomValue(isHttpClientReadyAtom)
  const segments = useSegments()
  const inAuthGroup = segments[0] === AUTH_GROUP_SEGMENT

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
      setNeedsMfaChallenge(
        hasMfaEnrolled && currentLevel === MFA_ASSURANCE_LEVEL_1
      )
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

  // --- Routing decision chain ---

  // Wait for the first auth state callback before deciding where to redirect
  if (isAuthLoading) return { status: 'loading' }

  if (!isAuthenticated && !inAuthGroup) {
    return { status: 'redirect', href: '/login' }
  }

  // SEC-002: Wait for MFA assurance level check before navigating to protected routes
  if (isAuthenticated && !mfaChecked) return { status: 'loading' }

  // SEC-002: Enforce AAL2 when MFA is enrolled — prevents bypassing TOTP challenge.
  // OWASP A07:2021 — Identification and Authentication Failures.
  if (isAuthenticated && needsMfaChallenge && !inAuthGroup) {
    return { status: 'redirect', href: '/totp-challenge' }
  }

  // Wait for HTTP client to be configured with auth before navigating to protected routes
  if (isAuthenticated && !isHttpClientReady && !inAuthGroup) {
    return { status: 'loading' }
  }

  // Wait for preferences to load before making onboarding decisions
  if (isAuthenticated && !inAuthGroup && preferencesLoading) {
    return { status: 'loading' }
  }

  // On preferences fetch error, let user through to avoid being stuck
  if (isAuthenticated && !inAuthGroup && preferencesError) {
    return { status: 'ready' }
  }

  // Redirect to onboarding screens if needed
  if (isAuthenticated && needsModeChoice && !inAuthGroup) {
    return { status: 'redirect', href: '/mode-choice' }
  }
  if (isAuthenticated && needsInitialBalance && !inAuthGroup) {
    return { status: 'redirect', href: '/initial-balance' }
  }

  // Authenticated user on auth screen with onboarding complete → go to home
  if (
    isAuthenticated &&
    inAuthGroup &&
    !needsMfaChallenge &&
    onboardingComplete
  ) {
    return { status: 'redirect', href: '/' }
  }

  return { status: 'ready' }
}
