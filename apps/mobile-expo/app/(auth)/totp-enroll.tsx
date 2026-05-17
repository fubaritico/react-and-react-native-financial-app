import { TotpEnrollScreen } from '@financial-app/features'
import { router } from 'expo-router'
import { useCallback } from 'react'

import { authClient } from '../../src/lib/supabase'

export default function TotpEnroll() {
  const handleContinue = useCallback(() => {
    router.replace('/')
  }, [])

  const handleSkip = useCallback(() => {
    router.replace('/')
  }, [])

  return (
    <TotpEnrollScreen
      authClient={authClient}
      onContinue={handleContinue}
      onSkip={handleSkip}
    />
  )
}
