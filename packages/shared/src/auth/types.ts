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
export type OAuthProvider = 'google' | 'apple'

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

/** Result of a sign-up attempt — includes identity check for duplicate detection */
export interface ISignUpResult {
  /** The created user (may be a "fake" user if email already exists) */
  user: IUser | null
  /** Auth error from the provider */
  error: IAuthError | null
  /**
   * Whether the email is already registered.
   * Supabase returns a user with empty `identities[]` for duplicate emails
   * (to prevent user enumeration). true = email already taken.
   */
  isExistingEmail: boolean
}

/** Enrolled MFA factor returned by enroll */
export interface IMfaFactor {
  /** Unique factor identifier */
  id: string
  /** Factor type (currently only 'totp') */
  type: 'totp'
  /** TOTP-specific data (only present during enrollment) */
  totp?: {
    /** Base64-encoded QR code image */
    qr_code: string
    /** otpauth:// URI for manual entry in authenticator apps */
    uri: string
    /** Shared secret for manual entry */
    secret: string
  }
}

/** Active MFA challenge awaiting verification */
export interface IMfaChallenge {
  /** Unique challenge identifier */
  id: string
  /** Factor this challenge belongs to */
  factorId: string
}

/** Authenticator Assurance Level — aal1 = password only, aal2 = password + MFA verified */
export type AuthAssuranceLevel = 'aal1' | 'aal2'

/** MFA operations — grouped under `mfa` on IAuthClient */
export interface IMfaClient {
  /** Enrolls a new TOTP factor — returns QR code for authenticator setup */
  enroll(): Promise<{
    factor: IMfaFactor | null
    error: IAuthError | null
  }>
  /** Creates a challenge for an enrolled factor */
  challenge(factorId: string): Promise<{
    challenge: IMfaChallenge | null
    error: IAuthError | null
  }>
  /** Verifies a 6-digit TOTP code against an active challenge */
  verify(
    factorId: string,
    challengeId: string,
    code: string
  ): Promise<{ error: IAuthError | null }>
  /** Lists all enrolled factors for the current user */
  listFactors(): Promise<{
    factors: IMfaFactor[]
    error: IAuthError | null
  }>
  /** Unenrolls (removes) an enrolled factor */
  unenroll(factorId: string): Promise<{ error: IAuthError | null }>
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
  signUp(payload: ISignUpPayload): Promise<ISignUpResult>
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
  signOut(options?: {
    scope?: 'local' | 'global'
  }): Promise<{ error: IAuthError | null }>
  /** Subscribes to auth state changes (sign-in, sign-out, token refresh) */
  onAuthStateChange(
    callback: (event: string, session: ISession | null) => void
  ): IAuthSubscription
  /** Returns the current session's assurance level and whether MFA is enrolled */
  getAssuranceLevel(): Promise<{
    currentLevel: AuthAssuranceLevel
    hasMfaEnrolled: boolean
    error: IAuthError | null
  }>
  /** Multi-Factor Authentication operations */
  mfa: IMfaClient
}
