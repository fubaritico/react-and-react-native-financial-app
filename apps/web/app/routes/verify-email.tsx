import { VerifyEmailScreen } from '@financial-app/features'
import { useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { authClient } from '../lib/supabase'

/** Basic email format check — prevents injection of arbitrary strings */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rawEmail = searchParams.get('email') ?? ''
  const email = useMemo(
    () => (EMAIL_REGEX.test(rawEmail) ? rawEmail : ''),
    [rawEmail]
  )

  const handleVerified = useCallback(() => {
    void navigate('/account-activated', { replace: true })
  }, [navigate])

  const handleBackToLogin = useCallback(() => {
    void navigate('/login')
  }, [navigate])

  return (
    <VerifyEmailScreen
      authClient={authClient}
      email={email}
      onVerified={handleVerified}
      onBackToLogin={handleBackToLogin}
    />
  )
}
