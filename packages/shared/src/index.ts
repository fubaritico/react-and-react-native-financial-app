// Auth
export { createBrowserClient } from './auth/client'
export { createNativeClient } from './auth/client.native'
// createServerClient is NOT re-exported here — import from '@financial-app/shared/auth/client.server'
// to avoid pulling @supabase/ssr into non-SSR bundles
export { signInWithGoogle, signInWithApple } from './auth/oauth'
export { requireAuth } from './auth/guard'
export { useAuthListener } from './auth/hooks'
export {
  loginSchema,
  parseValidationErrors,
  signupSchema,
} from './auth/validation'
export type { LoginFormData, SignupFormData } from './auth/validation'
export type {
  AuthAssuranceLevel,
  IAuthClient,
  IAuthError,
  IAuthStorage,
  IAuthSubscription,
  IMfaChallenge,
  IMfaClient,
  IMfaFactor,
  ISession,
  ISignInPayload,
  ISignUpPayload,
  ISignUpResult,
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
export { useFormValidation } from './hooks/useFormValidation'
export { useModal } from './hooks/useModal'
export {
  useConfigureHttpClient,
  useSessionExpiredHandler,
} from './hooks/useConfigureHttpClient'
export { useInactivityTimeout } from './hooks/useInactivityTimeout'
export { useSessionExpiry } from './hooks/useSessionExpiry'
export { useTotpEnroll } from './hooks/useTotpEnroll'
export type { IUseTotpEnrollReturn } from './hooks/useTotpEnroll'
export { useTotpChallenge } from './hooks/useTotpChallenge'
export type { IUseTotpChallengeReturn } from './hooks/useTotpChallenge'
export { usePasswordRules } from './hooks/usePasswordRules'
export type {
  IPasswordRuleResult,
  PasswordRuleState,
} from './hooks/usePasswordRules'
export { useCurrency } from './hooks/useCurrency'
export type { IUseCurrencyReturn } from './hooks/useCurrency'
export { CurrencyContext, useCurrencyConfig } from './contexts/CurrencyContext'
export type { ICurrencyConfig } from './contexts/CurrencyContext'

// Query
export { createAppQueryClient } from './query'

// Types
export type { IBalance, ITransaction, IBudget, IPot } from './types'

// Utils
export {
  getCurrentBudgetMonth,
  formatCurrency,
  convertCurrency,
  initRates,
  formatDate,
  toTimestamptz,
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
