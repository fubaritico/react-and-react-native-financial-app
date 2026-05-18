import type { transactionsModel } from '@financial-app/prisma'

import { supabase } from '../lib/supabase.js'

import type {
  SupabaseDeleteResult,
  SupabaseListResult,
  SupabaseResult,
} from './types.js'

/** Full transaction row as returned by Supabase (mirrors Prisma model). */
export type TransactionRow = transactionsModel

/** Projected transaction row for list queries (excludes heavy fields). */
type TransactionListRow = Pick<
  TransactionRow,
  'id' | 'avatar' | 'name' | 'category' | 'date' | 'amount' | 'recurring'
>

/** Payload for creating a new transaction. */
interface ICreateTransactionPayload {
  /** Payee / description */
  name: string
  /** Transaction category */
  category: string
  /** ISO date string */
  date: string
  /** Transaction amount (positive = income, negative = expense) */
  amount: number
  /** Whether this transaction repeats monthly */
  recurring: boolean
}

/** Payload for updating an existing transaction (all fields optional). */
interface IUpdateTransactionPayload {
  /** Payee / description */
  name?: string
  /** Transaction category */
  category?: string
  /** ISO date string */
  date?: string
  /** Transaction amount */
  amount?: number
  /** Whether this transaction repeats monthly */
  recurring?: boolean
}

/** Maps sort identifiers to Supabase column + direction. */
const SORT_MAP: Record<string, { column: string; ascending: boolean }> = {
  latest: { column: 'date', ascending: false },
  oldest: { column: 'date', ascending: true },
  'a-z': { column: 'name', ascending: true },
  'z-a': { column: 'name', ascending: false },
  highest: { column: 'amount', ascending: false },
  lowest: { column: 'amount', ascending: true },
}

/** Parameters for listing transactions with filtering, sorting, and pagination. */
interface ITransactionListParams {
  /** Current page number (1-based) */
  page: number
  /** Number of rows per page */
  limit: number
  /** Optional category filter */
  category?: string
  /** Optional search term (ILIKE on name) */
  search?: string
  /** Sort key (latest, oldest, a-z, z-a, highest, lowest) */
  sort?: string
}

/**
 * Builds the Supabase query for listing transactions with filters, sort, and pagination.
 * @param userId - Authenticated user UUID
 * @param params - List query parameters
 * @returns Supabase query builder (not yet awaited)
 */
function buildListQuery(userId: string, params: ITransactionListParams) {
  const { page, limit, category, search, sort = 'latest' } = params

  let query = supabase
    .from('transactions')
    .select('id, avatar, name, category, date, amount, recurring', {
      count: 'exact',
    })
    .eq('user_id', userId)

  if (category) query = query.eq('category', category)
  if (search) {
    const escaped = search.replace(/[%_\\]/g, '\\$&')
    query = query.ilike('name', `%${escaped}%`)
  }

  const sortConfig = SORT_MAP[sort] ?? SORT_MAP.latest
  query = query.order(sortConfig.column, { ascending: sortConfig.ascending })
  query = query.range((page - 1) * limit, page * limit - 1)

  return query
}

/**
 * Lists transactions for a user with filtering, sorting, and pagination.
 * @param userId - Authenticated user UUID
 * @param params - List query parameters (page, limit, category, search, sort)
 * @returns Paginated list of transaction rows with total count
 */
export async function listTransactions(
  userId: string,
  params: ITransactionListParams
): Promise<SupabaseListResult<TransactionListRow>> {
  const result = await buildListQuery(userId, params)

  if (result.error) return { data: null, error: result.error }
  /* eslint-disable @typescript-eslint/no-unnecessary-condition -- data/count can be null at runtime */
  return {
    data: (result.data ?? []) as TransactionListRow[],
    count: result.count ?? 0,
    error: null,
  }
  /* eslint-enable @typescript-eslint/no-unnecessary-condition */
}

/**
 * Creates a new manual transaction for a user.
 * @param userId - Authenticated user UUID
 * @param body - Transaction creation payload
 * @returns The created transaction row
 */
export async function createTransaction(
  userId: string,
  body: ICreateTransactionPayload
): Promise<SupabaseResult<TransactionRow>> {
  const result = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      ...body,
      avatar: '',
      source: 'manual',
    })
    .select()
    .single()

  if (result.error) return { data: null, error: result.error }
  return { data: result.data as TransactionRow, error: null }
}

/**
 * Updates an existing transaction owned by the user.
 * @param id - Transaction UUID
 * @param userId - Authenticated user UUID
 * @param body - Partial transaction fields to update
 * @returns The updated transaction row
 */
export async function updateTransaction(
  id: string,
  userId: string,
  body: IUpdateTransactionPayload
): Promise<SupabaseResult<TransactionRow>> {
  const updates: Record<string, unknown> = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.category !== undefined) updates.category = body.category
  if (body.date !== undefined) updates.date = body.date
  if (body.amount !== undefined) updates.amount = body.amount
  if (body.recurring !== undefined) updates.recurring = body.recurring

  const result = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (result.error) return { data: null, error: result.error }
  return { data: result.data as TransactionRow, error: null }
}

/**
 * Deletes a transaction owned by the user.
 * @param id - Transaction UUID
 * @param userId - Authenticated user UUID
 * @returns Delete result with count of affected rows
 */
export async function deleteTransaction(
  id: string,
  userId: string
): Promise<SupabaseDeleteResult> {
  const result = await supabase
    .from('transactions')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('user_id', userId)

  if (result.error) return { data: null, error: result.error }
  return { count: result.count ?? 0, error: null }
}
