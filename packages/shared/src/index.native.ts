// Auth (native-safe only)
export { createNativeClient } from './auth/client.native'
export { signInWithGoogle } from './auth/oauth.native'
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
