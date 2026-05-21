import { WelcomeScreen } from '@financial-app/features'
import {
  getUsersMePreferencesQueryKey,
  putUsersMePreferencesMutation,
} from '@financial-app/http-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useCallback } from 'react'

/**
 * Welcome route — shown after initial balance is set.
 * Marks onboarding as seen and navigates to home.
 * @returns The welcome screen
 */
export default function Welcome() {
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
      router.replace('/')
    })()
  }, [updatePreferences, queryClient])

  return <WelcomeScreen onGetStarted={handleGetStarted} />
}
