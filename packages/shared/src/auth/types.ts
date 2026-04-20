/** Pluggable storage adapter for native session persistence */
export interface IAuthStorage {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
}

export interface ISignInPayload {
  email: string
  password: string
}

export interface ISignUpPayload {
  name: string
  email: string
  password: string
}

export type OAuthProvider = 'google'

/** Vendor-agnostic user representation */
export interface IUser {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
}

/** Vendor-agnostic session representation */
export interface ISession {
  access_token: string
  refresh_token: string
  user: IUser
}

export interface IAuthError {
  message: string
  status?: number
}

export interface IAuthSubscription {
  unsubscribe: () => void
}

/**
 * Vendor-agnostic auth client interface.
 * Abstracts the auth provider (Supabase, Firebase, etc.) so the shared
 * package and consumers never depend on a concrete SDK.
 */
export interface IAuthClient {
  getUser(): Promise<{ user: IUser | null; error: IAuthError | null }>
  getSession(): Promise<{
    session: ISession | null
    error: IAuthError | null
  }>
  signInWithPassword(
    payload: ISignInPayload
  ): Promise<{ user: IUser | null; error: IAuthError | null }>
  signUp(
    payload: ISignUpPayload
  ): Promise<{ user: IUser | null; error: IAuthError | null }>
  signInWithOAuth(
    provider: OAuthProvider,
    options: { redirectTo: string }
  ): Promise<{ url: string | null; error: IAuthError | null }>
  signInWithIdToken(
    provider: OAuthProvider,
    token: string
  ): Promise<{ user: IUser | null; error: IAuthError | null }>
  signOut(): Promise<{ error: IAuthError | null }>
  onAuthStateChange(
    callback: (event: string, session: ISession | null) => void
  ): IAuthSubscription
}
