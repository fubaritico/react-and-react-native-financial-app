import { TotpChallengeScreen } from '@financial-app/features'
import { requireAuth } from '@financial-app/shared'
import { useCallback } from 'react'
import { redirect, useNavigate } from 'react-router'

import { authClient } from '../lib/supabase'

/**
 * SEC-001: Route guard — requires authenticated session before rendering.
 * Without this, an unauthenticated user could navigate directly to /totp-challenge
 * and attempt MFA verification without a valid session.
 * OWASP A01:2021 — Broken Access Control.
 */
export async function clientLoader() {
  const result = await requireAuth(authClient)
  if ('message' in result) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect('/login')
  }
  return null
}

export default function TotpChallenge() {
  const navigate = useNavigate()

  const handleVerified = useCallback(() => {
    void navigate('/', { replace: true })
  }, [navigate])

  return (
    <TotpChallengeScreen authClient={authClient} onVerified={handleVerified} />
  )
}
