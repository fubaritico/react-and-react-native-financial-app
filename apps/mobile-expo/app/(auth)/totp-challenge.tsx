import { TotpChallengeScreen } from '@financial-app/features'
import { router } from 'expo-router'
import { useCallback } from 'react'

import { authClient } from '../../src/lib/supabase'

export default function TotpChallenge() {
  const handleVerified = useCallback(() => {
    router.replace('/')
  }, [])

  return (
    <TotpChallengeScreen authClient={authClient} onVerified={handleVerified} />
  )
}
