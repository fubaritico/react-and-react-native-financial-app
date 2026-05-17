import { HttpResponse, http } from 'msw'

import { SUPABASE_URL, TEST_USER_EMAIL, TEST_USER_ID } from '../helpers.js'

/**
 * MSW handlers for Supabase Auth API.
 * Supabase client calls GET /auth/v1/user with the Bearer token.
 */
export const authHandlers = {
  /** Valid token → returns authenticated user. */
  authenticated: http.get(`${SUPABASE_URL}/auth/v1/user`, () => {
    return HttpResponse.json({
      id: TEST_USER_ID,
      email: TEST_USER_EMAIL,
      aud: 'authenticated',
      role: 'authenticated',
    })
  }),

  /** Invalid/expired token → 401. */
  unauthorized: http.get(`${SUPABASE_URL}/auth/v1/user`, () => {
    return HttpResponse.json(
      { error: 'invalid_token', error_description: 'Token is expired or invalid' },
      { status: 401 }
    )
  }),

  /** No MFA factors enrolled → AAL check passes. */
  noMfaFactors: http.get(
    `${SUPABASE_URL}/auth/v1/admin/users/${TEST_USER_ID}/factors`,
    () => {
      return HttpResponse.json([])
    }
  ),

  /** Verified TOTP factor enrolled → AAL2 enforcement triggers on aal1 tokens. */
  mfaEnrolled: http.get(
    `${SUPABASE_URL}/auth/v1/admin/users/${TEST_USER_ID}/factors`,
    () => {
      return HttpResponse.json([
        {
          id: 'factor-001',
          factor_type: 'totp',
          friendly_name: 'Authenticator',
          status: 'verified',
        },
      ])
    }
  ),
}
