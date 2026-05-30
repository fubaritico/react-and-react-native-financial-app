/**
 * Tests for the Supabase auth adapter's getClaims method (local JWT verification).
 * getClaims validates an access token's signature + expiration locally (asymmetric
 * signing keys) and maps the Supabase JWT payload to the vendor-agnostic IAuthClaims.
 */
import { describe, expect, it, vi } from 'vitest'

import { createSupabaseAuthAdapter } from './adapter.supabase'

import type { SupabaseClient } from '@supabase/supabase-js'

/** A representative Supabase JWT payload as returned inside getClaims data.claims. */
const BASE_CLAIMS = {
  iss: 'https://project.supabase.co/auth/v1',
  sub: 'user-123',
  aud: 'authenticated',
  exp: 1_900_000_000,
  iat: 1_899_996_400,
  role: 'authenticated',
  aal: 'aal1',
  session_id: 'sess-1',
  email: 'ada@example.com',
  user_metadata: { name: 'Ada' },
}

/**
 * Builds an auth adapter backed by a mock SupabaseClient whose getClaims is a spy.
 * @param impl - Mock implementation for client.auth.getClaims
 * @returns The adapter under test and the getClaims spy
 */
function buildAdapter(impl: () => unknown) {
  const getClaims = vi.fn(impl)
  const client = { auth: { getClaims } } as unknown as SupabaseClient
  return { adapter: createSupabaseAuthAdapter(client), getClaims }
}

describe('createSupabaseAuthAdapter — getClaims', () => {
  describe('happy path', () => {
    it('maps verified JWT claims to IAuthClaims', async () => {
      const { adapter } = buildAdapter(() =>
        Promise.resolve({
          data: {
            claims: BASE_CLAIMS,
            header: {},
            signature: new Uint8Array(),
          },
          error: null,
        })
      )

      const { claims, error } = await adapter.getClaims()

      expect(error).toBeNull()
      expect(claims).toEqual({
        sub: 'user-123',
        email: 'ada@example.com',
        exp: 1_900_000_000,
        aal: 'aal1',
        user_metadata: { name: 'Ada' },
      })
    })

    it('forwards the provided jwt to the underlying client', async () => {
      const { adapter, getClaims } = buildAdapter(() =>
        Promise.resolve({
          data: {
            claims: BASE_CLAIMS,
            header: {},
            signature: new Uint8Array(),
          },
          error: null,
        })
      )

      await adapter.getClaims('raw.jwt.token')

      expect(getClaims).toHaveBeenCalledWith('raw.jwt.token')
    })
  })

  describe('variants', () => {
    it('maps aal2 (MFA-verified) tokens', async () => {
      const { adapter } = buildAdapter(() =>
        Promise.resolve({
          data: {
            claims: { ...BASE_CLAIMS, aal: 'aal2' },
            header: {},
            signature: new Uint8Array(),
          },
          error: null,
        })
      )

      const { claims } = await adapter.getClaims()

      expect(claims?.aal).toBe('aal2')
    })

    it('defaults aal to aal1 when the claim is absent', async () => {
      const { aal: _omitted, ...noAal } = BASE_CLAIMS
      const { adapter } = buildAdapter(() =>
        Promise.resolve({
          data: { claims: noAal, header: {}, signature: new Uint8Array() },
          error: null,
        })
      )

      const { claims } = await adapter.getClaims()

      expect(claims?.aal).toBe('aal1')
    })

    it('omits optional email and user_metadata when not present', async () => {
      const { email: _e, user_metadata: _m, ...minimal } = BASE_CLAIMS
      const { adapter } = buildAdapter(() =>
        Promise.resolve({
          data: { claims: minimal, header: {}, signature: new Uint8Array() },
          error: null,
        })
      )

      const { claims } = await adapter.getClaims()

      expect(claims?.sub).toBe('user-123')
      expect(claims?.email).toBeUndefined()
      expect(claims?.user_metadata).toBeUndefined()
    })
  })

  describe('managed errors', () => {
    it('returns a normalized error when verification fails', async () => {
      const { adapter } = buildAdapter(() =>
        Promise.resolve({
          data: null,
          error: { message: 'invalid signature', status: 401 },
        })
      )

      const { claims, error } = await adapter.getClaims()

      expect(claims).toBeNull()
      expect(error).toEqual({ message: 'invalid signature', status: 401 })
    })
  })

  describe('unmanaged errors', () => {
    it('normalizes a thrown network exception to a status-0 error', async () => {
      const { adapter } = buildAdapter(() =>
        Promise.reject(new Error('fetch failed'))
      )

      const { claims, error } = await adapter.getClaims()

      expect(claims).toBeNull()
      expect(error?.status).toBe(0)
      expect(error?.message).toBe('[auth] Network request failed')
    })
  })

  describe('edge cases', () => {
    it('returns null claims without error when no session is present', async () => {
      const { adapter } = buildAdapter(() =>
        Promise.resolve({ data: null, error: null })
      )

      const { claims, error } = await adapter.getClaims()

      expect(claims).toBeNull()
      expect(error).toBeNull()
    })
  })
})
