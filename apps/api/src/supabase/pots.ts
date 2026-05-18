import type { potsModel } from '@financial-app/prisma'

import { supabase } from '../lib/supabase.js'

import type { SupabaseDeleteResult, SupabaseResult } from './types.js'

/** Pot row projected to consumer-facing columns only. */
export type PotRow = Pick<
  potsModel,
  'id' | 'name' | 'target' | 'total' | 'theme'
>

/** Supabase select column list for pots. */
const POT_COLUMNS = 'id, name, target, total, theme'

/** Payload for creating a new savings pot. */
interface ICreatePotPayload {
  /** Pot display name */
  name: string
  /** Target savings amount */
  target: number
  /** Color theme identifier */
  theme: string
}

/** Payload for updating an existing pot (all fields optional). */
interface IUpdatePotPayload {
  /** Pot display name */
  name?: string
  /** Target savings amount */
  target?: number
  /** Color theme identifier */
  theme?: string
}

/**
 * Fetches all pots for a user.
 * @param userId - Authenticated user UUID
 * @returns Array of pot rows
 */
export async function getPots(
  userId: string
): Promise<SupabaseResult<PotRow[]>> {
  const result = await supabase
    .from('pots')
    .select(POT_COLUMNS)
    .eq('user_id', userId)

  if (result.error) return { data: null, error: result.error }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- data can be null at runtime
  return { data: (result.data ?? []) as PotRow[], error: null }
}

/**
 * Creates a new savings pot for a user.
 * @param userId - Authenticated user UUID
 * @param body - Pot creation payload
 * @returns The created pot row
 */
export async function createPot(
  userId: string,
  body: ICreatePotPayload
): Promise<SupabaseResult<PotRow>> {
  const result = await supabase
    .from('pots')
    .insert({ ...body, user_id: userId })
    .select(POT_COLUMNS)
    .single()

  if (result.error) return { data: null, error: result.error }
  return { data: result.data as PotRow, error: null }
}

/**
 * Updates an existing pot owned by the user.
 * @param id - Pot UUID
 * @param userId - Authenticated user UUID
 * @param body - Partial pot fields to update
 * @returns The updated pot row
 */
export async function updatePot(
  id: string,
  userId: string,
  body: IUpdatePotPayload
): Promise<SupabaseResult<PotRow>> {
  const result = await supabase
    .from('pots')
    .update(body)
    .eq('id', id)
    .eq('user_id', userId)
    .select(POT_COLUMNS)
    .single()

  if (result.error) return { data: null, error: result.error }
  return { data: result.data as PotRow, error: null }
}

/**
 * Deletes a pot owned by the user.
 * @param id - Pot UUID
 * @param userId - Authenticated user UUID
 * @returns Delete result with count of affected rows
 */
export async function deletePot(
  id: string,
  userId: string
): Promise<SupabaseDeleteResult> {
  const result = await supabase
    .from('pots')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('user_id', userId)

  if (result.error) return { data: null, error: result.error }
  return { count: result.count ?? 0, error: null }
}

/**
 * Atomically updates a pot's total via the `update_pot_total` RPC.
 * @param potId - Pot UUID
 * @param userId - Authenticated user UUID
 * @param delta - Amount to add (positive) or withdraw (negative)
 * @returns The updated pot row(s)
 */
export async function rpcUpdatePotTotal(
  potId: string,
  userId: string,
  delta: number
): Promise<SupabaseResult<PotRow[]>> {
  const result = await supabase.rpc('update_pot_total', {
    p_pot_id: potId,
    p_user_id: userId,
    p_delta: delta,
  })

  if (result.error) return { data: null, error: result.error }
  return { data: (result.data ?? []) as PotRow[], error: null }
}
