export { getBalance } from './balance.js'
export {
  createBudget,
  deleteBudget,
  getBudgetsWithSpent,
  updateBudget,
} from './budgets.js'
export {
  createCategory,
  deleteCategory,
  ensureDefaultCategories,
  getCategoryRefCount,
  listCategories,
} from './categories.js'
export {
  createPot,
  deletePot,
  getPots,
  rpcUpdatePotTotal,
  updatePot,
} from './pots.js'
export { getRecurringBills } from './recurring-bills.js'
export { insertSeedData, resetAndCreateUser } from './seed.js'
export {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from './transactions.js'
export {
  checkInitialBalanceNotSet,
  deleteUserAccount,
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
export type { BudgetRow, IBudgetWithSpentRow } from './budgets.js'
export type { CategoryRow } from './categories.js'
export type { PotRow } from './pots.js'
export type { IRecurringBillRow } from './recurring-bills.js'
export type { ITransactionListRow, TransactionRow } from './transactions.js'
export type { ISeedData, ISeedUserResult } from './seed.js'
export type { IAuthErrorOnly, UserPreferencesRow } from './user-preferences.js'
