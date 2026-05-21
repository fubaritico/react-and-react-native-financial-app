import { WelcomeScreen } from '@financial-app/features'
import {
  getUsersMePreferencesQueryKey,
  putUsersMePreferencesMutation,
} from '@financial-app/http-client'
import { requireAuth } from '@financial-app/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { redirect, useNavigate } from 'react-router'

import { authClient } from '../lib/supabase'

/**
 * SEC-001: Route guard — requires authenticated session before rendering.
 * OWASP A01:2021 — Broken Access Control.
 * @returns Null when authenticated; throws redirect to /login otherwise
 */
export async function clientLoader() {
  const result = await requireAuth(authClient)
  if ('message' in result) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect('/login')
  }
  return null
}

/**
 * Welcome route — shown after initial balance is set.
 * Marks onboarding as seen and navigates to home.
 * @returns The welcome screen
 */
export default function Welcome() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const updatePreferences = useMutation(putUsersMePreferencesMutation())

  const handleGetStarted = useCallback(() => {
    void (async () => {
      await updatePreferences.mutateAsync({
        body: { has_seen_onboarding: true },
      })
      await queryClient.invalidateQueries({
        queryKey: getUsersMePreferencesQueryKey(),
      })
      void navigate('/', { replace: true })
    })()
  }, [updatePreferences, queryClient, navigate])

  return <WelcomeScreen onGetStarted={handleGetStarted} />
}
