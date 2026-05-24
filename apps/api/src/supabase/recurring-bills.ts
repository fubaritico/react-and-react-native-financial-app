import { supabase } from '../lib/supabase.js'

import type { SupabaseResult } from './types.js'

/** Row returned by the `get_recurring_bills` RPC (includes joined category fields). */
export interface IRecurringBillRow {
  /** Transaction UUID */
  id: string
  /** Payee / description */
  name: string
  /** Bill amount (always negative for expenses) */
  amount: number
  /** ISO date string of the transaction */
  date: string
  /** Always true for recurring bills */
  recurring: boolean
  /** Category UUID */
  category_id: string
  /** Category display name (joined) */
  category_name: string
  /** Category icon identifier (joined) */
  category_icon: string
  /** Category design token color key (joined) */
  category_color: string
}

/**
 * Fetches all recurring bills for a user via the `get_recurring_bills` RPC.
 * The RPC JOINs on the categories table and returns category fields.
 * @param userId - Authenticated user UUID
 * @returns Array of recurring bill rows with category info
 */
export async function getRecurringBills(
  userId: string
): Promise<SupabaseResult<IRecurringBillRow[]>> {
  const result = await supabase.rpc('get_recurring_bills', {
    p_user_id: userId,
  })

  if (result.error) return { data: null, error: result.error }
  return { data: (result.data ?? []) as IRecurringBillRow[], error: null }
}
