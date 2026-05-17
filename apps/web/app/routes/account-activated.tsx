import { AccountActivatedScreen } from '@financial-app/features'
import { requireAuth } from '@financial-app/shared'
import { useCallback } from 'react'
import { redirect, useNavigate } from 'react-router'

import { authClient } from '../lib/supabase'

/**
 * SEC-001: Route guard — requires authenticated session before rendering.
 * Without this, an unauthenticated user could navigate directly to /account-activated
 * and bypass the email verification requirement.
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

export default function AccountActivated() {
  const navigate = useNavigate()

  const handleContinue = useCallback(() => {
    void navigate('/totp-enroll', { replace: true })
  }, [navigate])

  return <AccountActivatedScreen onContinue={handleContinue} />
}
