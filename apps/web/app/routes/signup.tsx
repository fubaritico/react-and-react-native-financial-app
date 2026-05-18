import { SignupForm } from '@financial-app/features'
import { isAuthenticatedAtom } from '@financial-app/shared'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { authClient } from '../lib/supabase'

/**
 * Signup page — public route, no sidebar.
 * Redirects to Overview if already authenticated.
 */
export default function Signup() {
  const navigate = useNavigate()
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  useEffect(() => {
    if (isAuthenticated) {
      void navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSignupSuccess = useCallback(
    (email: string) => {
      void navigate(`/verify-email?email=${encodeURIComponent(email)}`, {
        replace: true,
      })
    },
    [navigate]
  )

  const handleNavigateToLogin = useCallback(() => {
    void navigate('/login')
  }, [navigate])

  return (
    <SignupForm
      authClient={authClient}
      onSignupSuccess={handleSignupSuccess}
      onNavigateToLogin={handleNavigateToLogin}
    />
  )
}
