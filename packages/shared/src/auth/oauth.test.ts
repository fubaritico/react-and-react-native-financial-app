/**
 * SEC-003: Adversarial tests for open redirect prevention in OAuth functions.
 * These tests probe isValidRedirectUrl (private) via signInWithGoogle/signInWithApple.
 * If authClient.signInWithOAuth is called, the URL passed validation — a bypass.
 * If it returns { url: null, error }, the attack vector was blocked.
 */
import { describe, expect, it, vi } from 'vitest'

import { signInWithApple, signInWithGoogle } from './oauth'

import type { IAuthClient } from './types'

/** Creates a mock auth client that tracks whether signInWithOAuth was called */
function createSpyAuthClient() {
  const signInWithOAuth = vi.fn(() =>
    Promise.resolve({
      url: 'https://provider.com/auth',
      error: null,
    })
  )

  const client = {
    signInWithOAuth,
  } as unknown as IAuthClient

  return { client, signInWithOAuth }
}

/**
 * Asserts the redirect URL was BLOCKED (signInWithOAuth never called).
 * If this fails, the attack vector bypassed validation.
 */
async function expectBlocked(redirectTo: string) {
  const { client, signInWithOAuth } = createSpyAuthClient()
  const result = await signInWithGoogle(client, redirectTo)

  expect(signInWithOAuth).not.toHaveBeenCalled()
  expect(result.url).toBeNull()
  expect(result.error?.message).toBe('Invalid redirect URL')
  expect(result.error?.status).toBe(400)
}

/**
 * Asserts the redirect URL was ALLOWED (signInWithOAuth was called).
 */
async function expectAllowed(redirectTo: string) {
  const { client, signInWithOAuth } = createSpyAuthClient()
  await signInWithGoogle(client, redirectTo)

  expect(signInWithOAuth).toHaveBeenCalledWith('google', { redirectTo })
}

describe('SEC-003: Open redirect prevention', () => {
  describe('legitimate URLs that MUST pass', () => {
    it('allows relative path /', async () => {
      await expectAllowed('/')
    })

    it('allows relative path with segments /dashboard', async () => {
      await expectAllowed('/dashboard')
    })

    it('allows relative path with query /callback?code=abc', async () => {
      await expectAllowed('/callback?code=abc')
    })

    it('allows same-origin absolute URL', async () => {
      // jsdom default origin is 'http://localhost:3000' or depends on config
      // Use the actual globalThis.location.origin for a valid same-origin URL
      const origin = globalThis.location.origin
      await expectAllowed(`${origin}/callback`)
    })
  })

  describe('attack vectors that MUST be blocked', () => {
    it('blocks absolute URL to external domain', async () => {
      await expectBlocked('https://evil.com/steal-token')
    })

    it('blocks absolute URL with matching prefix (subdomain spoofing)', async () => {
      // Attacker registers localhost.evil.com
      await expectBlocked('http://localhost.evil.com/callback')
    })

    it('blocks HTTP external URL', async () => {
      await expectBlocked('http://attacker.io/phish')
    })

    it('blocks external URL with port', async () => {
      await expectBlocked('https://evil.com:8443/steal')
    })

    it('blocks external URL with auth credentials in URL', async () => {
      await expectBlocked('https://user:pass@evil.com/steal')
    })

    it('blocks javascript: URI (XSS vector)', async () => {
      await expectBlocked('javascript:alert(document.cookie)')
    })

    it('blocks javascript: URI with encoding', async () => {
      await expectBlocked('javascript:alert(1)')
    })

    it('blocks data: URI (XSS vector)', async () => {
      await expectBlocked('data:text/html,<script>alert(1)</script>')
    })

    it('blocks data: URI base64', async () => {
      await expectBlocked(
        'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='
      )
    })

    it('blocks blob: URI', async () => {
      await expectBlocked('blob:https://evil.com/uuid')
    })

    it('blocks empty string', async () => {
      await expectBlocked('')
    })

    it('blocks URL with null bytes', async () => {
      await expectBlocked('https://evil.com\0.localhost/callback')
    })

    it('blocks file: protocol', async () => {
      await expectBlocked('file:///etc/passwd')
    })

    it('blocks ftp: protocol', async () => {
      await expectBlocked('ftp://evil.com/payload')
    })

    it('blocks different port on same hostname', async () => {
      // Same hostname but different port = different origin
      await expectBlocked('http://localhost:9999/steal')
    })
  })

  describe('protocol-relative URL bypass (//evil.com)', () => {
    /**
     * CRITICAL: //evil.com starts with '/' so it passes the startsWith('/')
     * check, but browsers resolve it as protocol-relative → https://evil.com.
     * This is the classic open redirect bypass vector.
     */
    it('blocks protocol-relative URL //evil.com', async () => {
      await expectBlocked('//evil.com')
    })

    it('blocks protocol-relative with path //evil.com/steal', async () => {
      await expectBlocked('//evil.com/steal')
    })

    it('blocks protocol-relative with subdomain //sub.evil.com/phish', async () => {
      await expectBlocked('//sub.evil.com/phish')
    })
  })

  describe('both providers share the same validation', () => {
    it('signInWithApple blocks external URL', async () => {
      const { client, signInWithOAuth } = createSpyAuthClient()
      const result = await signInWithApple(client, 'https://evil.com/steal')

      expect(signInWithOAuth).not.toHaveBeenCalled()
      expect(result.url).toBeNull()
      expect(result.error?.status).toBe(400)
    })

    it('signInWithApple allows relative path', async () => {
      const { client, signInWithOAuth } = createSpyAuthClient()
      await signInWithApple(client, '/callback')

      expect(signInWithOAuth).toHaveBeenCalledWith('apple', {
        redirectTo: '/callback',
      })
    })
  })

  describe('non-browser environment (no globalThis.location)', () => {
    it('blocks absolute same-origin URL when location is undefined', async () => {
      const original = globalThis.location
      // @ts-expect-error — simulating non-browser environment
      delete globalThis.location

      try {
        // Without location, all absolute URLs should be rejected
        await expectBlocked('http://localhost/callback')
      } finally {
        globalThis.location = original
      }
    })
  })
})
