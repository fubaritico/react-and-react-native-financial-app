/**
 * Tests for skipServerHop — the clientLoader body that skips the server hop on
 * client navigations (React Router BFF pattern). It returns an empty dehydrated
 * state so HydrationBoundary is a no-op and useQuery drives data from the
 * persistent browser QueryClient.
 */
import { describe, expect, it } from 'vitest'

import { skipServerHop } from './skip-server-hop'

describe('skipServerHop', () => {
  describe('happy path', () => {
    it('returns an empty dehydrated state', () => {
      const { dehydratedState } = skipServerHop()
      expect(dehydratedState.queries).toEqual([])
      expect(dehydratedState.mutations).toEqual([])
    })
  })

  describe('variants', () => {
    it('exposes both dehydrated collections as arrays', () => {
      const { dehydratedState } = skipServerHop()
      expect(Array.isArray(dehydratedState.queries)).toBe(true)
      expect(Array.isArray(dehydratedState.mutations)).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('returns a fresh, independent dehydrated state on each call', () => {
      // No shared module-level state: the route module is imported server-side
      // too, so each call must produce its own object to avoid cross-request leakage.
      expect(skipServerHop().dehydratedState).not.toBe(
        skipServerHop().dehydratedState
      )
    })

    // L3 managed errors / L4 unmanaged errors: N/A — pure function, no inputs,
    // no async work, no failure modes.
  })
})
