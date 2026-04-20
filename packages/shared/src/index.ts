// Auth
export { createBrowserClient } from './auth/client'
export { createNativeClient } from './auth/client.native'
// createServerClient is NOT re-exported here — import from '@financial-app/shared/auth/client.server'
// to avoid pulling @supabase/ssr into non-SSR bundles
export { signInWithGoogle } from './auth/oauth'
export { requireAuth } from './auth/guard'
export { useAuthListener } from './auth/hooks'
export type {
  IAuthClient,
  IAuthError,
  IAuthStorage,
  IAuthSubscription,
  ISession,
  ISignInPayload,
  ISignUpPayload,
  IUser,
  OAuthProvider,
} from './auth/types'
export type { INativeClientConfig } from './auth/client.native'
export type { IAuthResult } from './auth/guard'

// Atoms
export { userAtom, isAuthenticatedAtom, isLoadingAtom } from './atoms'

// Types
export type { IBalance, ITransaction, IBudget, IPot } from './types'

// Utils
export { formatCurrency, formatDate } from './utils'
