import { supabase } from '../lib/supabase.js'

import type { SupabaseResult } from './types.js'

/** Computed balance returned by the `get_balance` RPC. */
export interface IBalanceRow {
  /** Current balance (reference − pots) */
  current: number
  /** Total income for the period */
  income: number
  /** Total expenses for the period */
  expenses: number
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
