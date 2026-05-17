import { useCallback, useEffect, useState } from 'react'

import type { IAuthClient, IMfaFactor } from '../auth/types'

/** State machine for the TOTP enrollment flow */
type EnrollStatus = 'enrolling' | 'ready' | 'verifying' | 'enrolled' | 'error'

/** Return type of useTotpEnroll */
export interface IUseTotpEnrollReturn {
  /** Current enrollment status */
  status: EnrollStatus
  /** Enrolled factor with QR code and secret */
  factor: IMfaFactor | null
  /** 6-digit code entered by the user */
  code: string
  /** Update the code value */
  setCode: (code: string) => void
  /** Server error message */
  serverError: string
  /** Whether verification is in progress */
  loading: boolean
  /** Verify the entered code */
  verify: () => Promise<void>
}

/**
 * Shared hook for TOTP enrollment flow.
 * Handles factor enrollment on mount, code verification, and state transitions.
 * @param authClient - Auth client with MFA capabilities
 * @returns Hook state and actions for the TOTP enrollment flow
 */
export function useTotpEnroll(authClient: IAuthClient): IUseTotpEnrollReturn {
  const [status, setStatus] = useState<EnrollStatus>('enrolling')
  const [factor, setFactor] = useState<IMfaFactor | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  // Enroll on mount
  useEffect(() => {
    async function enroll() {
      const { factor: f, error } = await authClient.mfa.enroll()
      if (error) {
        setServerError(error.message)
        setStatus('error')
        return
      }
      setFactor(f)
      setStatus('ready')
    }
    void enroll()
  }, [authClient])

  const verify = useCallback(async () => {
    if (!factor) return
    setServerError('')
    setLoading(true)
    setStatus('verifying')

    const { challenge, error: challengeError } = await authClient.mfa.challenge(
      factor.id
    )
    if (challengeError || !challenge) {
      setServerError(challengeError?.message ?? 'auth.totp.challengeFailed')
      setLoading(false)
      setStatus('ready')
      return
    }

    const { error: verifyError } = await authClient.mfa.verify(
      factor.id,
      challenge.id,
      code
    )
    setLoading(false)

    if (verifyError) {
      setServerError('auth.totp.invalidCode')
      setStatus('ready')
      return
    }

    setStatus('enrolled')
  }, [factor, code, authClient])

  return { status, factor, code, setCode, serverError, loading, verify }
}
