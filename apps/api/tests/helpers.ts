/** Test user UUID — matches mock auth handler response. */
export const TEST_USER_ID = 'd8e4f26e-dc4f-41a7-8e66-1b1805a00b41'

/** Test user email. */
export const TEST_USER_EMAIL = 'test@example.com'

/** Supabase project URL used in tests (must match env vars set in setup.ts). */
export const SUPABASE_URL = 'https://test-project.supabase.co'

/**
 * Builds a fake JWT with the given claims in the payload.
 * Not cryptographically valid — MSW auth handler accepts any token.
 * The middleware only decodes the payload (base64url), never verifies the signature.
 */
function buildFakeJwt(claims: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({ sub: TEST_USER_ID, ...claims })).toString('base64url')
  return `${header}.${payload}.fake-signature`
}

/** Fake bearer token with aal2 claim — MSW auth handler accepts any token. */
export const AUTH_HEADER = { Authorization: `Bearer ${buildFakeJwt({ aal: 'aal2' })}` }

/** Fake bearer token with aal1 claim — triggers AAL2 check in requireAuth. */
export const AUTH_HEADER_AAL1 = { Authorization: `Bearer ${buildFakeJwt({ aal: 'aal1' })}` }
