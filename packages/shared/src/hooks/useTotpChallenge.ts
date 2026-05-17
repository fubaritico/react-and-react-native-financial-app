import { useCallback, useEffect, useState } from 'react'

import type { IAuthClient } from '../auth/types'

/** Return type of useTotpChallenge */
export interface IUseTotpChallengeReturn {
  /** 6-digit code entered by the user */
  code: string
  /** Update the code value */
  setCode: (code: string) => void
  /** Server error message */
  serverError: string
  /** Whether verification is in progress */
  loading: boolean
  /** Whether factors are still being loaded */
  loadingFactors: boolean
  /** Verify the entered code — returns true on success */
  verify: () => Promise<boolean>
}

/**
 * Shared hook for TOTP challenge flow (returning MFA users).
 * Loads enrolled factors on mount, then handles challenge/verify cycle.
 * @param authClient - Auth client with MFA capabilities
 * @returns Hook state and actions for the TOTP challenge flow
 */
export function useTotpChallenge(
  authClient: IAuthClient
): IUseTotpChallengeReturn {
  const [factorId, setFactorId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingFactors, setLoadingFactors] = useState(true)
  const [serverError, setServerError] = useState('')

  // Load enrolled factors on mount
  useEffect(() => {
    async function loadFactors() {
      const { factors } = await authClient.mfa.listFactors()
      if (factors.length > 0) {
        setFactorId(factors[0].id)
      }
      setLoadingFactors(false)
    }
    void loadFactors()
  }, [authClient])

  const verify = useCallback(async (): Promise<boolean> => {
    if (!factorId) return false
    setServerError('')
    setLoading(true)

    const { challenge, error: challengeError } =
      await authClient.mfa.challenge(factorId)
    if (challengeError || !challenge) {
      setServerError(challengeError?.message ?? 'auth.totp.challengeFailed')
      setLoading(false)
      return false
    }

    const { error: verifyError } = await authClient.mfa.verify(
      factorId,
      challenge.id,
      code
    )
    setLoading(false)

    if (verifyError) {
      setServerError('auth.totp.invalidCode')
      return false
    }

    return true
  }, [factorId, code, authClient])

  return { code, setCode, serverError, loading, loadingFactors, verify }
}
