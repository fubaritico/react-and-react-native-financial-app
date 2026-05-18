import { SignupForm } from '@financial-app/features'
import { router } from 'expo-router'
import { useCallback } from 'react'

import { authClient } from '../../src/lib/supabase'

/** Signup screen — delegates to shared SignupForm feature component. */
export default function SignupScreen() {
  const handleSignupSuccess = useCallback((email: string) => {
    router.replace({
      pathname: '/verify-email',
      params: { email },
    })
  }, [])

  const handleNavigateToLogin = useCallback(() => {
    router.replace('/login')
  }, [])

  return (
    <SignupForm
      authClient={authClient}
      onSignupSuccess={handleSignupSuccess}
      onNavigateToLogin={handleNavigateToLogin}
    />
  )
}
