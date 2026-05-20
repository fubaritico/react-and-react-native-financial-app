import { supabase } from '../lib/supabase.js'

import type { SupabaseResult } from './types.js'

/** Computed balance returned by the `get_balance` RPC. */
export interface IBalanceRow {
  /** Current available balance (reference + income − expenses − pots) */
  current: number
  /** Total income for the period */
  income: number
  /** Total expenses for the period */
  expenses: number
}

/** Raw reference balance from the `balances` table. */
export interface IReferenceBalanceRow {
  /** Reference balance amount */
  reference: number
}

/**
 * Fetches the computed balance for a user via the `get_balance` RPC.
 * @param userId - Authenticated user UUID
 * @param month - ISO month string (YYYY-MM) or null for all-time
 * @returns Balance row or fallback zeros if no data exists
 */
export async function getBalance(
  userId: string,
  month: string | null
): Promise<SupabaseResult<IBalanceRow>> {
  const result = await supabase.rpc('get_balance', {
    p_user_id: userId,
    p_month: month,
  })

  if (result.error) return { data: null, error: result.error }

  const rows = (result.data ?? []) as IBalanceRow[]
  if (rows.length === 0) {
    return { data: { current: 0, income: 0, expenses: 0 }, error: null }
  }

  return { data: rows[0], error: null }
}

/**
 * Fetches the raw reference balance for a user from the `balances` table.
 * @param userId - Authenticated user UUID
 * @returns The reference balance row or fallback zero
 */
export async function getReferenceBalance(
  userId: string
): Promise<SupabaseResult<IReferenceBalanceRow>> {
  const result = await supabase
    .from('balances')
    .select('reference')
    .eq('user_id', userId)
    .single()

  if (result.error) {
    // No row yet — return 0
    if (result.error.code === 'PGRST116') {
      return { data: { reference: 0 }, error: null }
    }
    return { data: null, error: result.error }
  }

  return { data: result.data as IReferenceBalanceRow, error: null }
}

/**
 * Updates the reference balance for a user (upsert on `balances` table).
 * @param userId - Authenticated user UUID
 * @param amount - New reference balance amount
 * @returns The updated reference balance row
 */
export async function updateReferenceBalance(
  userId: string,
  amount: number
): Promise<SupabaseResult<IReferenceBalanceRow>> {
  const result = await supabase
    .from('balances')
    .upsert({ user_id: userId, reference: amount }, { onConflict: 'user_id' })
    .select('reference')
    .single()

  if (result.error) return { data: null, error: result.error }
  return { data: result.data as IReferenceBalanceRow, error: null }
}
