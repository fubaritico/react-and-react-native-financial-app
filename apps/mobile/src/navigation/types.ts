/**
 * Route param lists for React Navigation type safety.
 *
 * These use `type` instead of `interface` because React Navigation's
 * ParamListBase requires an implicit index signature that interfaces
 * cannot provide (TS limitation).
 */

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AuthStackParamList = {
  Login: undefined
  Signup: undefined
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TabParamList = {
  Overview: undefined
  Transactions: undefined
  Budgets: undefined
  Pots: undefined
  Recurring: undefined
}

/**
 * Root navigator uses conditional rendering (auth gate),
 * so it doesn't need a combined ParamList — each branch
 * is a separate navigator with its own types.
 */
