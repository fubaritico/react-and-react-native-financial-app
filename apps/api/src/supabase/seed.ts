import { supabase } from '../lib/supabase.js'

import { DEFAULT_CATEGORIES } from './categories.js'

import type { PostgrestError } from '@supabase/supabase-js'

/**
 * Returns the current month as YYYY-MM string.
 * @returns ISO month string (e.g. "2026-05")
 */
function getCurrentMonth(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${String(year)}-${month}`
}

/**
 * Shifts a date string from its original month to the current month, preserving day and time.
 * If the original day exceeds the current month's last day, clamps to the last day.
 * @param originalDate - ISO 8601 date string (e.g. "2024-08-19T14:23:11Z")
 * @returns ISO 8601 date string shifted to the current month
 */
function shiftToCurrentMonth(originalDate: string): string {
  const d = new Date(originalDate)
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const lastDay = new Date(year, month + 1, 0).getDate()
  const day = Math.min(d.getDate(), lastDay)

  const shifted = new Date(
    year,
    month,
    day,
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  )
  return shifted.toISOString()
}

/** Shape of a single transaction from data.json (without mock id). */
interface ISeedTransaction {
  /** Transaction counterpart name */
  name: string
  /** Transaction category name (matched to categories table) */
  category: string
  /** ISO 8601 date string */
  date: string
  /** Amount (positive = income, negative = expense) */
  amount: number
  /** Whether this is a recurring transaction */
  recurring: boolean
}

/** Shape of a single budget from data.json (without mock id). */
interface ISeedBudget {
  /** Budget category name (matched to categories table) */
  category: string
  /** Maximum spending limit */
  maximum: number
}

/** Shape of a single pot from data.json (without mock id). */
interface ISeedPot {
  /** Pot display name */
  name: string
  /** Savings target amount */
  target: number
  /** Current saved amount */
  total: number
  /** Color theme identifier */
  theme: string
}

/** Seed balance with reference amount. */
interface ISeedBalance {
  /** Starting reference balance for the user account */
  reference: number
}

/** Full seed data payload matching data.json structure. */
export interface ISeedData {
  /** Balance reference amount */
  balance: ISeedBalance
  /** All transactions to seed */
  transactions: ISeedTransaction[]
  /** All budgets to seed */
  budgets: ISeedBudget[]
  /** All pots to seed */
  pots: ISeedPot[]
}

/** Result of the reset-and-create user operation. */
export interface ISeedUserResult {
  /** User UUID if created successfully */
  userId: string | null
  /** Error message if failed */
  error: string | null
  /** Whether an existing user was deleted first (reset) */
  wasReset: boolean
}

/**
 * Ensures a clean user for seeding: if the email already exists, deletes that user
 * (CASCADE removes all their data), then creates a fresh user.
 * Only touches the specified email — other users are never affected.
 * @param email - User email address
 * @param password - User password
 * @returns Object with userId, error, and whether a reset occurred
 */
export async function resetAndCreateUser(
  email: string,
  password: string
): Promise<ISeedUserResult> {
  let wasReset = false

  // Check if user already exists
  const { data: listData, error: listError } =
    await supabase.auth.admin.listUsers()
  if (listError) return { userId: null, error: listError.message, wasReset }

  const existing = listData.users.find((u) => u.email === email)

  // Delete existing user — CASCADE removes all related data
  if (existing) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      existing.id
    )
    if (deleteError)
      return { userId: null, error: deleteError.message, wasReset }
    wasReset = true
  }

  // Create fresh user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (data.user) return { userId: data.user.id, error: null, wasReset }
  if (!error)
    return { userId: null, error: 'Unknown error creating user', wasReset }

  return { userId: null, error: error.message, wasReset }
}

/**
 * Inserts all seed data for a user (categories, balance, transactions, budgets, pots, preferences).
 * Assumes existing data has already been deleted via `resetAndCreateUser` CASCADE.
 * @param userId - Authenticated user UUID
 * @param data - Seed data payload from data.json
 * @returns Error-only result (null on success)
 */
export async function insertSeedData(
  userId: string,
  data: ISeedData
): Promise<{ error: PostgrestError | null }> {
  // 1. Insert default categories and get their IDs
  const categoryRows = DEFAULT_CATEGORIES.map((c) => ({
    user_id: userId,
    ...c,
    is_system: true,
  }))
  const { data: insertedCategories, error: catError } = await supabase
    .from('categories')
    .insert(categoryRows)
    .select('id, name')

  if (catError) return { error: catError }

  // Build name → id lookup
  const categoryMap = new Map<string, string>()
  /* eslint-disable @typescript-eslint/no-unnecessary-condition -- data can be null at runtime */
  for (const cat of insertedCategories ?? []) {
    const row = cat as { id: string; name: string }
    categoryMap.set(row.name, row.id)
  }
  /* eslint-enable @typescript-eslint/no-unnecessary-condition */

  // 2. User preferences with reference balance
  const { error: prefError } = await supabase.from('user_preferences').upsert(
    {
      user_id: userId,
      mode: 'manual',
      has_seen_onboarding: true,
      initial_balance_set: true,
      reference_balance: data.balance.reference,
    },
    { onConflict: 'user_id' }
  )
  if (prefError) return { error: prefError }

  // 3. Transactions — shift dates, resolve category_id
  const fallbackCategoryId = categoryMap.get('General') ?? ''
  const transactions = data.transactions.map(
    ({ name, category, date, amount, recurring }) => ({
      user_id: userId,
      name,
      category_id: categoryMap.get(category) ?? fallbackCategoryId,
      date: shiftToCurrentMonth(date),
      amount,
      recurring,
    })
  )
  const { error: txnError } = await supabase
    .from('transactions')
    .insert(transactions)
  if (txnError) return { error: txnError }

  // 4. Budgets — resolve category_id, assign current month
  const currentMonth = getCurrentMonth()
  const budgets = data.budgets.map(({ category, maximum }) => ({
    user_id: userId,
    category_id: categoryMap.get(category) ?? fallbackCategoryId,
    maximum,
    month: currentMonth,
  }))
  const { error: budgetError } = await supabase.from('budgets').insert(budgets)
  if (budgetError) return { error: budgetError }

  // 5. Pots
  const pots = data.pots.map(({ name, target, total, theme }) => ({
    user_id: userId,
    name,
    target,
    total,
    theme,
  }))
  const { error: potError } = await supabase.from('pots').insert(pots)
  if (potError) return { error: potError }

  return { error: null }
}
