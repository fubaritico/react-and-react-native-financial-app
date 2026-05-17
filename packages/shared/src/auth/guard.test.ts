/**
 * SEC-001: Adversarial tests for requireAuth guard.
 * Probes for fail-open scenarios — partial sessions, thrown exceptions,
 * null users with valid sessions, and network failures.
 * Every test verifies the guard BLOCKS access, not that it works.
 */
import { describe, expect, it } from 'vitest'

import { requireAuth } from './guard'

import type { IAuthClient, IAuthError, ISession, IUser } from './types'

const MOCK_USER: IUser = {
  id: 'user-123',
  email: 'test@example.com',
}

const MOCK_SESSION: ISession = {
  access_token: 'valid-jwt-token',
  refresh_token: 'refresh-token',
  user: MOCK_USER,
}

/** Creates a mock auth client with configurable getUser/getSession behavior */
function createMockAuthClient(overrides: {
  getUser?: IAuthClient['getUser']
  getSession?: IAuthClient['getSession']
}): IAuthClient {
  return {
    getUser:
      overrides.getUser ?? (() => Promise.resolve({ user: null, error: null })),
    getSession:
      overrides.getSession ??
      (() => Promise.resolve({ session: null, error: null })),
    // Unused methods — should never be called by requireAuth
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
    },
  }
}

/** Type guard — true if result is an error (has 'message' key) */
function isError(result: unknown): result is IAuthError {
  return typeof result === 'object' && result !== null && 'message' in result
}

describe('SEC-001: requireAuth fail-open probing', () => {
  describe('must block when session is invalid', () => {
    it('blocks when getUser returns null user (no session)', async () => {
      const client = createMockAuthClient({
        getUser: () => Promise.resolve({ user: null, error: null }),
      })

      const result = await requireAuth(client)

      expect(isError(result)).toBe(true)
      if (isError(result)) {
        expect(result.status).toBe(401)
      }
    })

    it('blocks when getUser returns an error', async () => {
      const client = createMockAuthClient({
        getUser: () =>
          Promise.resolve({
            user: null,
            error: { message: 'JWT expired', status: 401 },
          }),
      })

      const result = await requireAuth(client)

      expect(isError(result)).toBe(true)
      if (isError(result)) {
        expect(result.message).toBe('JWT expired')
      }
    })

    it('blocks when getUser succeeds but getSession returns null', async () => {
      const client = createMockAuthClient({
        getUser: () => Promise.resolve({ user: MOCK_USER, error: null }),
        getSession: () => Promise.resolve({ session: null, error: null }),
      })

      const result = await requireAuth(client)

      expect(isError(result)).toBe(true)
      if (isError(result)) {
        expect(result.status).toBe(401)
      }
    })

    it('blocks when getUser succeeds but getSession returns error', async () => {
      const client = createMockAuthClient({
        getUser: () => Promise.resolve({ user: MOCK_USER, error: null }),
        getSession: () =>
          Promise.resolve({
            session: null,
            error: { message: 'Session revoked', status: 401 },
          }),
      })

      const result = await requireAuth(client)

      expect(isError(result)).toBe(true)
      if (isError(result)) {
        expect(result.message).toBe('Session revoked')
      }
    })
  })

  describe('must not leak internal data on success', () => {
    it('returns user and accessToken on valid session', async () => {
      const client = createMockAuthClient({
        getUser: () => Promise.resolve({ user: MOCK_USER, error: null }),
        getSession: () =>
          Promise.resolve({ session: MOCK_SESSION, error: null }),
      })

      const result = await requireAuth(client)

      expect(isError(result)).toBe(false)
      if (!isError(result)) {
        expect(result.user.id).toBe('user-123')
        expect(result.accessToken).toBe('valid-jwt-token')
        // Must NOT expose refresh_token — only access_token
        expect(result).not.toHaveProperty('refreshToken')
        expect(result).not.toHaveProperty('refresh_token')
      }
    })
  })

  describe('exception propagation (adapter contract violation)', () => {
    it('propagates thrown exception from getUser — caller must handle', async () => {
      const client = createMockAuthClient({
        // eslint-disable-next-line @typescript-eslint/require-await
        getUser: async () => {
          throw new Error('Network timeout')
        },
      })

      // requireAuth does NOT catch — thrown errors propagate to caller.
      // The Supabase adapter wraps in try/catch, but a different adapter might not.
      // If the caller (clientLoader) has no try/catch, React Router shows error boundary
      // instead of redirecting to /login. Not a security hole (no access granted)
      // but a reliability gap.
      await expect(requireAuth(client)).rejects.toThrow('Network timeout')
    })

    it('propagates thrown exception from getSession', async () => {
      const client = createMockAuthClient({
        getUser: () => Promise.resolve({ user: MOCK_USER, error: null }),
        // eslint-disable-next-line @typescript-eslint/require-await
        getSession: async () => {
          throw new Error('DNS resolution failed')
        },
      })

      await expect(requireAuth(client)).rejects.toThrow('DNS resolution failed')
    })
  })

  describe('error object integrity', () => {
    it('preserves status code from provider error', async () => {
      const client = createMockAuthClient({
        getUser: () =>
          Promise.resolve({
            user: null,
            error: { message: 'Token expired', status: 403 },
          }),
      })

      const result = await requireAuth(client)

      expect(isError(result)).toBe(true)
      if (isError(result)) {
        // Must preserve the original status, not overwrite with generic 401
        expect(result.status).toBe(403)
      }
    })

    it('returns 401 when user is null with no provider error', async () => {
      // Edge case: getUser returns { user: null, error: null }
      // This means no error but also no user — guard must still block
      const client = createMockAuthClient({
        getUser: () => Promise.resolve({ user: null, error: null }),
      })

      const result = await requireAuth(client)

      expect(isError(result)).toBe(true)
      if (isError(result)) {
        expect(result.status).toBe(401)
        expect(result.message).toBe('No authenticated user')
      }
    })
  })
})
