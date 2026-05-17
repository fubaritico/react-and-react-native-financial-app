import type {
  AuthAssuranceLevel,
  IAuthClient,
  IAuthError,
  IAuthSubscription,
  IMfaChallenge,
  IMfaClient,
  IMfaFactor,
  ISession,
  ISignInPayload,
  ISignUpPayload,
  IUser,
  OAuthProvider,
} from './types'
import type { SupabaseClient } from '@supabase/supabase-js'

/** Minimal Supabase user shape used for mapping */
interface ISupabaseUser {
  /** Unique user identifier */
  id: string
  /** User email address */
  email?: string
  /** Arbitrary metadata attached to the user */
  user_metadata?: Record<string, unknown>
}

/** Minimal Supabase session shape used for mapping */
interface ISupabaseSession {
  /** JWT access token */
  access_token: string
  /** Token used to refresh an expired access token */
  refresh_token: string
  /** Unix timestamp (seconds) when the access token expires */
  expires_at?: number
  /** User associated with this session */
  user: ISupabaseUser
}

/**
 * Normalizes a Supabase AuthError into IAuthError.
 * @param error - Supabase error object or null
 * @returns Normalized IAuthError, or null when no error is present
 */
function toAuthError(
  error: { message: string; status?: number } | null
): IAuthError | null {
  if (!error) return null
  return { message: error.message, status: error.status }
}

/**
 * Wraps unexpected thrown exceptions (network timeout, DNS failure, etc.)
 * into a normalized IAuthError. Raw messages are logged for debugging
 * but never forwarded to callers (avoids leaking hostnames/infra details).
 * @param thrown - The caught exception (unknown type)
 * @returns Sanitized IAuthError with status 0 indicating network failure
 */
function toNetworkError(thrown: unknown): IAuthError {
  if (__DEV__) {
    const detail =
      thrown instanceof Error
        ? `${thrown.name}: ${thrown.message}`
        : String(thrown)
    console.error('[auth] Network request failed —', detail)
  }
  return { message: '[auth] Network request failed', status: 0 }
}

/**
 * Maps a Supabase User to the vendor-agnostic IUser interface.
 * @param user - Supabase user object or null
 * @returns Mapped IUser, or null if input is null
 */
function toUser(user: ISupabaseUser | null): IUser | null {
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
  }
}

/**
 * Maps a Supabase Session to the vendor-agnostic ISession interface.
 * @param session - Supabase session object or null
 * @returns Mapped ISession, or null if input is null or user mapping fails
 */
function toSession(session: ISupabaseSession | null): ISession | null {
  if (!session) return null
  const user = toUser(session.user)
  if (!user) return null
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    user,
  }
}

/**
 * Wraps a SupabaseClient into the vendor-agnostic IAuthClient interface.
 * This is the only place in the codebase that depends on Supabase auth API shape.
 * All methods catch network-level exceptions and normalize them to IAuthError.
 * @param client - Supabase client instance from any factory
 * @returns Vendor-agnostic IAuthClient implementation
 */
export function createSupabaseAuthAdapter(client: SupabaseClient): IAuthClient {
  return {
    async getUser() {
      try {
        const { data, error } = await client.auth.getUser()
        return { user: toUser(data.user), error: toAuthError(error) }
      } catch (e) {
        return { user: null, error: toNetworkError(e) }
      }
    },

    async getSession() {
      try {
        const { data, error } = await client.auth.getSession()
        return { session: toSession(data.session), error: toAuthError(error) }
      } catch (e) {
        return { session: null, error: toNetworkError(e) }
      }
    },

    async refreshSession() {
      try {
        const { data, error } = await client.auth.refreshSession()
        return { session: toSession(data.session), error: toAuthError(error) }
      } catch (e) {
        return { session: null, error: toNetworkError(e) }
      }
    },

    async signInWithPassword(payload: ISignInPayload) {
      try {
        const { data, error } = await client.auth.signInWithPassword(payload)
        return { user: toUser(data.user), error: toAuthError(error) }
      } catch (e) {
        return { user: null, error: toNetworkError(e) }
      }
    },

    async signUp(payload: ISignUpPayload) {
      try {
        const { data, error } = await client.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: { data: { name: payload.name } },
        })
        // Supabase returns a user with empty identities[] when email is already taken
        // (prevents user enumeration — no explicit error is thrown)
        const user = data.user as { identities?: unknown[] } | null
        const identities = user?.identities
        const isExistingEmail =
          !error &&
          !!data.user &&
          Array.isArray(identities) &&
          identities.length === 0
        return {
          user: toUser(data.user),
          error: toAuthError(error),
          isExistingEmail,
        }
      } catch (e) {
        return { user: null, error: toNetworkError(e), isExistingEmail: false }
      }
    },

    async signInWithOAuth(
      provider: OAuthProvider,
      options: { redirectTo: string }
    ) {
      try {
        const { data, error } = await client.auth.signInWithOAuth({
          provider,
          options: { redirectTo: options.redirectTo },
        })
        return { url: data.url, error: toAuthError(error) }
      } catch (e) {
        return { url: null, error: toNetworkError(e) }
      }
    },

    async signInWithIdToken(provider: OAuthProvider, token: string) {
      try {
        const { data, error } = await client.auth.signInWithIdToken({
          provider,
          token,
        })
        return { user: toUser(data.user), error: toAuthError(error) }
      } catch (e) {
        return { user: null, error: toNetworkError(e) }
      }
    },

    async signOut(options) {
      try {
        const { error } = await client.auth.signOut(options)
        return { error: toAuthError(error) }
      } catch (e) {
        return { error: toNetworkError(e) }
      }
    },

    onAuthStateChange(
      callback: (event: string, session: ISession | null) => void
    ): IAuthSubscription {
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((event, session) => {
        callback(event, toSession(session))
      })
      return {
        unsubscribe() {
          subscription.unsubscribe()
        },
      }
    },

    async getAssuranceLevel() {
      try {
        const { data, error } =
          await client.auth.mfa.getAuthenticatorAssuranceLevel()
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Supabase types claim data is always non-null, but runtime can be null on error
        if (error || !data) {
          return {
            currentLevel: 'aal1' as AuthAssuranceLevel,
            hasMfaEnrolled: false,
            error: toAuthError(error),
          }
        }
        const { currentLevel, nextLevel, currentAuthenticationMethods } = data
        // If nextLevel is 'aal2' and current is 'aal1', MFA is enrolled but not verified
        const methods = currentAuthenticationMethods as {
          method: string
        }[]
        const hasMfaEnrolled =
          nextLevel === 'aal2' || methods.some((m) => m.method === 'totp')
        return {
          currentLevel: (currentLevel ?? 'aal1') as AuthAssuranceLevel,
          hasMfaEnrolled,
          error: null,
        }
      } catch (e) {
        return {
          currentLevel: 'aal1' as AuthAssuranceLevel,
          hasMfaEnrolled: false,
          error: toNetworkError(e),
        }
      }
    },

    mfa: createMfaAdapter(client),
  }
}

/**
 * Creates the MFA sub-adapter mapping Supabase MFA API to IMfaClient.
 * @param client - Supabase client instance
 * @returns Vendor-agnostic IMfaClient implementation
 */
function createMfaAdapter(client: SupabaseClient): IMfaClient {
  return {
    async enroll() {
      try {
        const { data, error } = await client.auth.mfa.enroll({
          factorType: 'totp',
        })
        if (error) {
          return { factor: null, error: toAuthError(error) }
        }
        return {
          factor: {
            id: data.id,
            type: 'totp' as const,
            totp: {
              qr_code: data.totp.qr_code,
              uri: data.totp.uri,
              secret: data.totp.secret,
            },
          },
          error: null,
        }
      } catch (e) {
        return { factor: null, error: toNetworkError(e) }
      }
    },

    async challenge(factorId: string) {
      try {
        const { data, error } = await client.auth.mfa.challenge({ factorId })
        if (error) {
          return { challenge: null, error: toAuthError(error) }
        }
        const challenge: IMfaChallenge = {
          id: data.id,
          factorId,
        }
        return { challenge, error: null }
      } catch (e) {
        return { challenge: null, error: toNetworkError(e) }
      }
    },

    async verify(factorId: string, challengeId: string, code: string) {
      try {
        const { error } = await client.auth.mfa.verify({
          factorId,
          challengeId,
          code,
        })
        return { error: toAuthError(error) }
      } catch (e) {
        return { error: toNetworkError(e) }
      }
    },

    async listFactors() {
      try {
        const { data, error } = await client.auth.mfa.listFactors()
        if (error) {
          return { factors: [], error: toAuthError(error) }
        }
        const factors: IMfaFactor[] = data.totp.map((f) => ({
          id: f.id,
          type: 'totp' as const,
        }))
        return { factors, error: null }
      } catch (e) {
        return { factors: [], error: toNetworkError(e) }
      }
    },

    async unenroll(factorId: string) {
      try {
        const { error } = await client.auth.mfa.unenroll({
          factorId,
        })
        return { error: toAuthError(error) }
      } catch (e) {
        return { error: toNetworkError(e) }
      }
    },
  }
}
