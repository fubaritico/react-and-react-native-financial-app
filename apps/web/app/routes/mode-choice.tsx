import { ModeChoiceScreen } from '@financial-app/features'
import { requireAuth } from '@financial-app/shared'
import { useCallback } from 'react'
import { redirect, useNavigate } from 'react-router'

import { authClient } from '../lib/supabase'

/**
 * SEC-001: Route guard — requires authenticated session before rendering.
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

/**
 * Mode choice route — user selects Manual or Bank mode.
 * @returns The mode choice screen
 */
export default function ModeChoice() {
  const navigate = useNavigate()

  const handleSelectManual = useCallback(() => {
    void navigate('/initial-balance', { replace: true })
  }, [navigate])

  return <ModeChoiceScreen onSelectManual={handleSelectManual} />
}
