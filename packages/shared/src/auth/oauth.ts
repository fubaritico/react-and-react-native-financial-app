import type { IAuthClient, IAuthError } from './types'

/**
 * SEC-003: Validates that a redirect URL is safe (same-origin or relative path).
 * Prevents open redirect attacks by rejecting absolute URLs to external domains.
 * Without this, an attacker could craft a malicious OAuth link like
 * `?redirectTo=https://evil.com/steal-token` to exfiltrate the auth token.
 * OWASP A10:2021 — Server-Side Request Forgery / CWE-601 — Open Redirect.
 * @param redirectTo - URL to validate
 * @returns true if the URL is safe to redirect to
 */
function isValidRedirectUrl(redirectTo: string): boolean {
  // Allow relative paths — but reject protocol-relative URLs (//evil.com)
  // which browsers resolve to https://evil.com (inheriting current protocol).
  if (redirectTo.startsWith('/') && !redirectTo.startsWith('//')) return true

  // Allow same-origin absolute URLs
  try {
    const url = new URL(redirectTo)
    if (typeof globalThis.location !== 'undefined') {
      return url.origin === globalThis.location.origin
    }
    // Non-browser context — reject absolute URLs
    return false
  } catch {
    // Invalid URL — reject
    return false
  }
}

/**
 * Initiates Google OAuth sign-in via redirect flow (web only).
 * Validates redirectTo against same-origin policy to prevent open redirects.
 * @param authClient - Browser auth client
 * @param redirectTo - URL to redirect to after successful authentication
 * @returns Promise resolving to `{ url: string | null; error: IAuthError | null }`
 */
export async function signInWithGoogle(
  authClient: IAuthClient,
  redirectTo: string
) {
  if (!isValidRedirectUrl(redirectTo)) {
    const error: IAuthError = {
      message: 'Invalid redirect URL',
      status: 400,
    }
    return { url: null, error }
  }
  return authClient.signInWithOAuth('google', { redirectTo })
}

/**
 * Initiates Apple OAuth sign-in via redirect flow (web only).
 * Required by App Store when any social login is offered on iOS.
 * Validates redirectTo against same-origin policy to prevent open redirects.
 * @param authClient - Browser auth client
 * @param redirectTo - URL to redirect to after successful authentication
 * @returns Promise resolving to `{ url: string | null; error: IAuthError | null }`
 */
export async function signInWithApple(
  authClient: IAuthClient,
  redirectTo: string
) {
  if (!isValidRedirectUrl(redirectTo)) {
    const error: IAuthError = {
      message: 'Invalid redirect URL',
      status: 400,
    }
    return { url: null, error }
  }
  return authClient.signInWithOAuth('apple', { redirectTo })
}
