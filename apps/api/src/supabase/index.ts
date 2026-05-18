export { getBalance } from './balance.js'
export {
  createBudget,
  deleteBudget,
  getBudgetsWithSpent,
  updateBudget,
} from './budgets.js'
export {
  createPot,
  deletePot,
  getPots,
  rpcUpdatePotTotal,
  updatePot,
} from './pots.js'
export { getRecurringBills } from './recurring-bills.js'
export {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from './transactions.js'
export {
  checkInitialBalanceNotSet,
  ensurePreferencesRow,
  getInitialBalanceSet,
  getOrCreatePreferences,
  getUserPreferences,
  setInitialBalance,
  updateUserPreferences,
  upsertPreferences,
} from './user-preferences.js'

export type {
  SupabaseDeleteResult,
  ISupabaseErrorOnly,
  SupabaseListResult,
  SupabaseResult,
} from './types.js'
export type { IBalanceRow } from './balance.js'
export type { BudgetRow } from './budgets.js'
export type { PotRow } from './pots.js'
export type { IRecurringBillRow } from './recurring-bills.js'
export type { TransactionRow } from './transactions.js'
export type { UserPreferencesRow } from './user-preferences.js'
