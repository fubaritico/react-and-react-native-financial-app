import { supabase } from '../lib/supabase.js'

import type { SupabaseResult } from './types.js'

/** Row returned by the `get_recurring_bills` RPC. */
export interface IRecurringBillRow {
  /** Transaction UUID */
  id: string
  /** Avatar URL or empty string */
  avatar: string
  /** Payee / description */
  name: string
  /** Transaction category */
  category: string
  /** Bill amount (always negative for expenses) */
  amount: number
  /** ISO date string of the transaction */
  date: string
  /** Always true for recurring bills */
  recurring: boolean
}

/**
 * Fetches all recurring bills for a user via the `get_recurring_bills` RPC.
 * @param userId - Authenticated user UUID
 * @returns Array of recurring bill rows
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
