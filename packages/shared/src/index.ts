// Auth
export { createBrowserClient } from './auth/client'
export { createServerClient } from './auth/client.server'
export { createNativeClient } from './auth/client.native'
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

// Atoms
export { userAtom, isAuthenticatedAtom, isLoadingAtom } from './atoms'

// Types
export type { IBalance, ITransaction, IBudget, IPot } from './types'

// Utils
export { formatCurrency, formatDate } from './utils'
