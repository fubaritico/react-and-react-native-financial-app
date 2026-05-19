import { InitialBalanceScreen } from '@financial-app/features'
import {
  getUsersMePreferencesQueryKey,
  postUsersMeInitialBalanceMutation,
  putUsersMePreferencesMutation,
} from '@financial-app/http-client'
import { getErrorMessage } from '@financial-app/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useCallback, useState } from 'react'

/**
 * Initial balance route — user enters starting balance for manual mode.
 * Persists mode preference + balance, then navigates to home (walkthrough later).
 * @returns The initial balance screen
 */
export default function InitialBalance() {
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
        router.replace('/')
      } catch (err) {
        setError(getErrorMessage(err))
      }
    },
    [updatePreferences, setInitialBalance, queryClient]
  )

  const handleSubmitPress = useCallback(
    (amount: number) => {
      void handleSubmit(amount)
    },
    [handleSubmit]
  )

  const handleBack = useCallback(() => {
    router.replace('/mode-choice')
  }, [])

  return (
    <InitialBalanceScreen
      onSubmit={handleSubmitPress}
      onBack={handleBack}
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
