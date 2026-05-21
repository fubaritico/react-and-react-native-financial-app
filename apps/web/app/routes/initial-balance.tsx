import { InitialBalanceScreen } from '@financial-app/features'
import {
  getUsersMePreferencesQueryKey,
  postUsersMeInitialBalanceMutation,
  putUsersMePreferencesMutation,
} from '@financial-app/http-client'
import { getErrorMessage, requireAuth } from '@financial-app/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
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
 * Initial balance route — user enters starting balance for manual mode.
 * Persists mode preference + balance, then navigates to home (walkthrough later).
 * @returns The initial balance screen
 */
export default function InitialBalance() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const updatePreferences = useMutation(putUsersMePreferencesMutation())
  const setInitialBalance = useMutation(postUsersMeInitialBalanceMutation())

  const isSubmitting =
    updatePreferences.isPending || setInitialBalance.isPending

  const handleSubmit = useCallback(
    async (amount: number) => {
      setError('')

      try {
        await updatePreferences.mutateAsync({
          body: { mode: 'manual' },
        })
        await setInitialBalance.mutateAsync({
          body: { amount },
        })
        await queryClient.invalidateQueries({
          queryKey: getUsersMePreferencesQueryKey(),
        })
        void navigate('/welcome', { replace: true })
      } catch (err) {
        setError(getErrorMessage(err))
      }
    },
    [updatePreferences, setInitialBalance, queryClient, navigate]
  )

  const handleSubmitPress = useCallback(
    (amount: number) => {
      void handleSubmit(amount)
    },
    [handleSubmit]
  )

  const handleBack = useCallback(() => {
    void navigate('/mode-choice', { replace: true })
  }, [navigate])

  return (
    <InitialBalanceScreen
      onSubmit={handleSubmitPress}
      onBack={handleBack}
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
