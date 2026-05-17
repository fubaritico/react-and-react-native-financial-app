import { VerifyEmailScreen } from '@financial-app/features'
import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useMemo } from 'react'

import { authClient } from '../../src/lib/supabase'

/** Basic email format check — prevents deep link parameter injection */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function VerifyEmail() {
  const { email: rawEmail } = useLocalSearchParams<{ email: string }>()
  const email = useMemo(
    () => (rawEmail && EMAIL_REGEX.test(rawEmail) ? rawEmail : ''),
    [rawEmail]
  )

  const handleVerified = useCallback(() => {
    router.replace('/account-activated')
  }, [])

  const handleBackToLogin = useCallback(() => {
    router.replace('/login')
  }, [])

  return (
    <VerifyEmailScreen
      authClient={authClient}
      email={email}
      onVerified={handleVerified}
      onBackToLogin={handleBackToLogin}
    />
  )
}
