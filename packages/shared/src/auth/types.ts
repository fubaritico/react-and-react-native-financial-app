/** Pluggable storage adapter for native session persistence */
export interface IAuthStorage {
  /** Retrieves a value by key from secure storage */
  getItem: (key: string) => Promise<string | null>
  /** Persists a key-value pair to secure storage */
  setItem: (key: string, value: string) => Promise<void>
  /** Removes a key-value pair from secure storage */
  removeItem: (key: string) => Promise<void>
}

/** Credentials for email/password sign-in */
export interface ISignInPayload {
  /** User email address */
  email: string
  /** User password */
  password: string
}

/** Credentials for email/password sign-up */
export interface ISignUpPayload {
  /** Display name for the new user */
  name: string
  /** User email address */
  email: string
  /** User password (min 6 chars enforced by Supabase) */
  password: string
}

/** Supported OAuth providers */
export type OAuthProvider = 'google'

/** Vendor-agnostic user representation */
export interface IUser {
  /** Unique user identifier (UUID) */
  id: string
  /** User email address */
  email?: string
  /** Arbitrary metadata attached to the user (e.g., name, avatar) */
  user_metadata?: Record<string, unknown>
}

/** Vendor-agnostic session representation */
export interface ISession {
  /** JWT access token for authenticating API requests */
  access_token: string
  /** Token used to obtain a new access token after expiration */
  refresh_token: string
  /** Authenticated user associated with this session */
  user: IUser
}

/** Normalized auth error returned by all IAuthClient methods */
export interface IAuthError {
  /** Human-readable error description */
  message: string
  /** HTTP status code (0 = network failure, 401 = unauthorized, etc.) */
  status?: number
}

/** Handle to an active auth state subscription */
export interface IAuthSubscription {
  /** Stops listening to auth state changes */
  unsubscribe: () => void
}

/**
 * Vendor-agnostic auth client interface.
 * Abstracts the auth provider (Supabase, Firebase, etc.) so the shared
 * package and consumers never depend on a concrete SDK.
 */
export interface IAuthClient {
  /** Fetches the currently authenticated user from the provider */
  getUser(): Promise<{ user: IUser | null; error: IAuthError | null }>
  /** Fetches the current session (access + refresh tokens) */
  getSession(): Promise<{
    session: ISession | null
    error: IAuthError | null
  }>
  /** Authenticates with email and password */
  signInWithPassword(
    payload: ISignInPayload
  ): Promise<{ user: IUser | null; error: IAuthError | null }>
  /** Creates a new user account with email and password */
  signUp(
    payload: ISignUpPayload
  ): Promise<{ user: IUser | null; error: IAuthError | null }>
  /** Initiates OAuth redirect flow (web only) */
  signInWithOAuth(
    provider: OAuthProvider,
    options: { redirectTo: string }
  ): Promise<{ url: string | null; error: IAuthError | null }>
  /** Authenticates with a third-party ID token (native only) */
  signInWithIdToken(
    provider: OAuthProvider,
    token: string
  ): Promise<{ user: IUser | null; error: IAuthError | null }>
  /** Signs out the current user and clears the session */
  signOut(): Promise<{ error: IAuthError | null }>
  /** Subscribes to auth state changes (sign-in, sign-out, token refresh) */
  onAuthStateChange(
    callback: (event: string, session: ISession | null) => void
  ): IAuthSubscription
}
