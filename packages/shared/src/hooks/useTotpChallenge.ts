import { useCallback, useEffect, useState } from 'react'

import type { IAuthClient } from '../auth/types'

/** Maximum failed TOTP attempts before client-side lockout */
const MAX_ATTEMPTS = 5

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
  /** Whether the user is locked out after too many failed attempts */
  lockedOut: boolean
  /** Remaining attempts before lockout (null = no warning yet, shown from 2nd failure) */
  remainingAttempts: number | null
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
  const [attempts, setAttempts] = useState(0)
  const lockedOut = attempts >= MAX_ATTEMPTS
  const remainingAttempts = attempts >= 2 ? MAX_ATTEMPTS - attempts : null

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
    if (!factorId || lockedOut) return false
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
      setAttempts((prev) => {
        const next = prev + 1
        if (next >= MAX_ATTEMPTS) {
          setServerError('auth.totp.lockedOut')
        } else {
          setServerError('auth.totp.invalidCode')
        }
        return next
      })
      return false
    }

    return true
  }, [factorId, code, authClient, lockedOut])

  return {
    code,
    setCode,
    serverError,
    loading,
    loadingFactors,
    lockedOut,
    remainingAttempts,
    verify,
  }
}
