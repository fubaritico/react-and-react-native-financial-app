/**
 * SEC-002/005: Adversarial tests for TOTP challenge hook.
 * Probes for MFA bypass scenarios — verifying without a factor,
 * challenge failures, and empty factor lists.
 * Uses renderHook to test the hook in isolation with a mock IAuthClient.
 */
import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useTotpChallenge } from './useTotpChallenge'

import type { IAuthClient, IMfaFactor } from '../auth/types'

const MOCK_FACTOR: IMfaFactor = {
  id: 'factor-abc',
  type: 'totp',
}

/** Creates a mock auth client with configurable MFA behavior */
function createMockAuthClient(
  mfaOverrides: Partial<IAuthClient['mfa']> = {}
): IAuthClient {
  return {
    getUser: () => Promise.resolve({ user: null, error: null }),
    getSession: () => Promise.resolve({ session: null, error: null }),
    refreshSession: () => Promise.resolve({ session: null, error: null }),
    signInWithPassword: () => Promise.resolve({ user: null, error: null }),
    signUp: () =>
      Promise.resolve({ user: null, error: null, isExistingEmail: false }),
    signInWithOAuth: () => Promise.resolve({ url: null, error: null }),
    signInWithIdToken: () => Promise.resolve({ user: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAuthStateChange: () => ({ unsubscribe: () => {} }),
    getAssuranceLevel: () =>
      Promise.resolve({
        currentLevel: 'aal1' as const,
        hasMfaEnrolled: false,
        error: null,
      }),
    mfa: {
      enroll: () => Promise.resolve({ factor: null, error: null }),
      challenge: () => Promise.resolve({ challenge: null, error: null }),
      verify: () => Promise.resolve({ error: null }),
      listFactors: () => Promise.resolve({ factors: [], error: null }),
      unenroll: () => Promise.resolve({ error: null }),
      ...mfaOverrides,
    },
  }
}

describe('SEC-002/005: TOTP challenge bypass probing', () => {
  describe('no enrolled factors — verify must fail', () => {
    it('returns false from verify when no factors are enrolled', async () => {
      const client = createMockAuthClient({
        listFactors: () => Promise.resolve({ factors: [], error: null }),
      })

      const { result } = renderHook(() => useTotpChallenge(client))

      await waitFor(() => {
        expect(result.current.loadingFactors).toBe(false)
      })

      let verifyResult = false
      await act(async () => {
        verifyResult = await result.current.verify()
      })

      expect(verifyResult).toBe(false)
    })

    it('never calls challenge or verify when no factor exists', async () => {
      const challenge = vi.fn(() =>
        Promise.resolve({ challenge: null, error: null })
      )
      const verify = vi.fn(() => Promise.resolve({ error: null }))

      const client = createMockAuthClient({
        listFactors: () => Promise.resolve({ factors: [], error: null }),
        challenge,
        verify,
      })

      const { result } = renderHook(() => useTotpChallenge(client))

      await waitFor(() => {
        expect(result.current.loadingFactors).toBe(false)
      })

      await act(async () => {
        await result.current.verify()
      })

      expect(challenge).not.toHaveBeenCalled()
      expect(verify).not.toHaveBeenCalled()
    })
  })

  describe('challenge failure — verify must not proceed', () => {
    it('returns false when challenge step fails', async () => {
      const verify = vi.fn(() => Promise.resolve({ error: null }))

      const client = createMockAuthClient({
        listFactors: () =>
          Promise.resolve({
            factors: [MOCK_FACTOR],
            error: null,
          }),
        challenge: () =>
          Promise.resolve({
            challenge: null,
            error: { message: 'Challenge expired', status: 400 },
          }),
        verify,
      })

      const { result } = renderHook(() => useTotpChallenge(client))

      await waitFor(() => {
        expect(result.current.loadingFactors).toBe(false)
      })

      let verifyResult = false
      await act(async () => {
        verifyResult = await result.current.verify()
      })

      expect(verifyResult).toBe(false)
      expect(result.current.serverError).toBe('Challenge expired')
      // verify must NOT be called if challenge failed
      expect(verify).not.toHaveBeenCalled()
    })
  })

  describe('invalid TOTP code — verify must return false', () => {
    it('returns false and sets error when code is wrong', async () => {
      const client = createMockAuthClient({
        listFactors: () =>
          Promise.resolve({
            factors: [MOCK_FACTOR],
            error: null,
          }),
        challenge: () =>
          Promise.resolve({
            challenge: { id: 'challenge-1', factorId: 'factor-abc' },
            error: null,
          }),
        verify: () =>
          Promise.resolve({
            error: { message: 'Invalid TOTP code', status: 422 },
          }),
      })

      const { result } = renderHook(() => useTotpChallenge(client))

      await waitFor(() => {
        expect(result.current.loadingFactors).toBe(false)
      })

      act(() => {
        result.current.setCode('000000')
      })

      let verifyResult = false
      await act(async () => {
        verifyResult = await result.current.verify()
      })

      expect(verifyResult).toBe(false)
      expect(result.current.serverError).toBe('auth.totp.invalidCode')
    })
  })

  describe('successful verification — only path to true', () => {
    it('returns true only when full challenge+verify cycle succeeds', async () => {
      const client = createMockAuthClient({
        listFactors: () =>
          Promise.resolve({
            factors: [MOCK_FACTOR],
            error: null,
          }),
        challenge: () =>
          Promise.resolve({
            challenge: { id: 'challenge-1', factorId: 'factor-abc' },
            error: null,
          }),
        verify: () => Promise.resolve({ error: null }),
      })

      const { result } = renderHook(() => useTotpChallenge(client))

      await waitFor(() => {
        expect(result.current.loadingFactors).toBe(false)
      })

      act(() => {
        result.current.setCode('123456')
      })

      let verifyResult = false
      await act(async () => {
        verifyResult = await result.current.verify()
      })

      expect(verifyResult).toBe(true)
      expect(result.current.serverError).toBe('')
    })
  })

  describe('listFactors failure — must not expose stale state', () => {
    it('does not set a factorId when listFactors errors', async () => {
      const challenge = vi.fn(() =>
        Promise.resolve({ challenge: null, error: null })
      )

      const client = createMockAuthClient({
        listFactors: () =>
          Promise.resolve({
            factors: [],
            error: { message: 'Network error', status: 0 },
          }),
        challenge,
      })

      const { result } = renderHook(() => useTotpChallenge(client))

      await waitFor(() => {
        expect(result.current.loadingFactors).toBe(false)
      })

      await act(async () => {
        await result.current.verify()
      })

      expect(challenge).not.toHaveBeenCalled()
    })
  })
})
