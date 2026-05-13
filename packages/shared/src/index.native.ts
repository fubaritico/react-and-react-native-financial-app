// Auth (native-safe only)
export { createNativeClient } from './auth/client.native'
export { signInWithGoogle } from './auth/oauth.native'
export { requireAuth } from './auth/guard'
export { useAuthListener } from './auth/hooks'
export {
  loginSchema,
  parseValidationErrors,
  signupSchema,
} from './auth/validation'
export type { LoginFormData, SignupFormData } from './auth/validation'
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
export {
  userAtom,
  isAuthenticatedAtom,
  isAuthLoadingAtom,
  isHttpClientReadyAtom,
  isLoadingAtom,
  modalConfigAtom,
} from './atoms'
export type { IModalAction, IModalConfig, ModalActionVariant } from './atoms'

// Hooks
export { useModal } from './hooks/useModal'
export {
  useConfigureHttpClient,
  useSessionExpiredHandler,
} from './hooks/useConfigureHttpClient'
export { useInactivityTimeout } from './hooks/useInactivityTimeout.native'

// Query
export { createAppQueryClient } from './query'

// Types
export type { IBalance, ITransaction, IBudget, IPot } from './types'

// Utils
export {
  BUDGET_MONTH,
  formatCurrency,
  convertCurrency,
  formatDate,
  resolveTokenColor,
  buildBudgetPageData,
  buildRecurringBillsPageData,
} from './utils'
export { getErrorMessage } from './utils/getErrorMessage'
export type {
  SupportedCurrency,
  CurrencySign,
  IFormatCurrencyOptions,
  IBudgetItem,
  IBudgetSpendingItem,
  IBudgetCategoryCard,
  IBudgetPageData,
  BillStatus,
  IRecurringBill,
  IRecurringBillsPageData,
} from './utils'

// Mocks
export { mockBalance, mockTransactions, mockBudgets, mockPots } from './mocks'
