import type { SupabaseClient } from '@supabase/supabase-js'

import type {
  IAuthClient,
  IAuthError,
  IAuthSubscription,
  ISession,
  ISignInPayload,
  ISignUpPayload,
  IUser,
  OAuthProvider,
} from './types'

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
  if (__DEV__ && thrown instanceof Error) {
    console.error('[auth] Network failure:', thrown.message)
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
        return { user: toUser(data.user), error: toAuthError(error) }
      } catch (e) {
        return { user: null, error: toNetworkError(e) }
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

    async signOut() {
      try {
        const { error } = await client.auth.signOut()
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
  }
}
