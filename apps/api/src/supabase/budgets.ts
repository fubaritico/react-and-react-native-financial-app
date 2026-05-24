import type { budgetsModel } from '@financial-app/prisma'

import { supabase } from '../lib/supabase.js'

import type { SupabaseDeleteResult, SupabaseResult } from './types.js'

/** Full budget row as returned by Supabase (mirrors Prisma model). */
export type BudgetRow = budgetsModel

/** Row returned by the `get_budgets_with_spent` RPC (includes joined category fields). */
export interface IBudgetWithSpentRow {
  /** Budget UUID */
  id: string
  /** Category UUID */
  category_id: string
  /** Category display name (joined) */
  category_name: string
  /** Category icon identifier (joined) */
  category_icon: string
  /** Category design token color key (joined) */
  category_color: string
  /** Maximum spending limit */
  maximum: number
  /** ISO month string (YYYY-MM) */
  month: string
  /** Computed spent amount for the budget's category in the given month */
  spent: number
}

/** Payload for creating a new budget. */
interface ICreateBudgetPayload {
  /** Category UUID */
  category_id: string
  /** Maximum spending limit */
  maximum: number
  /** ISO month string (YYYY-MM) */
  month: string
}

/** Payload for updating an existing budget (all fields optional). */
interface IUpdateBudgetPayload {
  /** Category UUID */
  category_id?: string
  /** Maximum spending limit */
  maximum?: number
}

/**
 * Fetches all budgets for a user in a given month with spent amounts via RPC.
 * The RPC JOINs on the categories table and returns category fields.
 * @param userId - Authenticated user UUID
 * @param month - ISO month string (YYYY-MM)
 * @returns Array of budget rows with computed `spent` field and category info
 */
export async function getBudgetsWithSpent(
  userId: string,
  month: string
): Promise<SupabaseResult<IBudgetWithSpentRow[]>> {
  const result = await supabase.rpc('get_budgets_with_spent', {
    p_user_id: userId,
    p_month: month,
  })

  if (result.error) return { data: null, error: result.error }
  return { data: (result.data ?? []) as IBudgetWithSpentRow[], error: null }
}

/**
 * Creates a new budget for a user.
 * @param userId - Authenticated user UUID
 * @param body - Budget creation payload (category_id, maximum, month)
 * @returns The created budget row
 */
export async function createBudget(
  userId: string,
  body: ICreateBudgetPayload
): Promise<SupabaseResult<BudgetRow>> {
  const result = await supabase
    .from('budgets')
    .insert({ ...body, user_id: userId })
    .select()
    .single()

  if (result.error) return { data: null, error: result.error }
  return { data: result.data as BudgetRow, error: null }
}

/**
 * Updates an existing budget owned by the user.
 * @param id - Budget UUID
 * @param userId - Authenticated user UUID
 * @param body - Partial budget fields to update (category_id, maximum)
 * @returns The updated budget row
 */
export async function updateBudget(
  id: string,
  userId: string,
  body: IUpdateBudgetPayload
): Promise<SupabaseResult<BudgetRow>> {
  const result = await supabase
    .from('budgets')
    .update(body)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (result.error) return { data: null, error: result.error }
  return { data: result.data as BudgetRow, error: null }
}

/**
 * Deletes a budget owned by the user.
 * @param id - Budget UUID
 * @param userId - Authenticated user UUID
 * @returns Delete result with count of affected rows
 */
export async function deleteBudget(
  id: string,
  userId: string
): Promise<SupabaseDeleteResult> {
  const result = await supabase
    .from('budgets')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('user_id', userId)

  if (result.error) return { data: null, error: result.error }
  return { count: result.count ?? 0, error: null }
}
