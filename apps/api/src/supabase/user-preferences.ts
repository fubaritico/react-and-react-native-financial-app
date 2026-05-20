import type { user_preferencesModel } from '@financial-app/prisma'

import { supabase } from '../lib/supabase.js'

import type { ISupabaseErrorOnly, SupabaseResult } from './types.js'
import type { AuthError } from '@supabase/supabase-js'

/** Result type for auth admin operations (deleteUser returns AuthError, not PostgrestError). */
export interface IAuthErrorOnly {
  /** Auth error if the operation failed, null on success */
  error: AuthError | null
}

/** Full user preferences row as returned by Supabase (mirrors Prisma model). */
export type UserPreferencesRow = user_preferencesModel

/** Partial payload for updating user preferences (mode, onboarding, balance flags). */
type UpdatePayload = Partial<
  Pick<
    UserPreferencesRow,
    'mode' | 'has_seen_onboarding' | 'initial_balance_set'
  >
>

/**
 * Fetches user preferences by user ID.
 * @param userId - Authenticated user UUID
 * @returns The user preferences row
 */
export async function getUserPreferences(
  userId: string
): Promise<SupabaseResult<UserPreferencesRow>> {
  const result = await supabase
    .from('user_preferences')
    .select()
    .eq('user_id', userId)
    .single()

  if (result.error) return { data: null, error: result.error }
  return { data: result.data as UserPreferencesRow, error: null }
}

/**
 * Updates user preferences for a given user.
 * @param userId - Authenticated user UUID
 * @param body - Partial preferences fields to update
 * @returns The updated preferences row
 */
export async function updateUserPreferences(
  userId: string,
  body: UpdatePayload
): Promise<SupabaseResult<UserPreferencesRow>> {
  const result = await supabase
    .from('user_preferences')
    .update(body)
    .eq('user_id', userId)
    .select()
    .single()

  if (result.error) return { data: null, error: result.error }
  return { data: result.data as UserPreferencesRow, error: null }
}

/**
 * Ensures a preferences row exists for the user (idempotent upsert with ignoreDuplicates).
 * @param userId - Authenticated user UUID
 * @returns Error-only result (null on success)
 */
export async function ensurePreferencesRow(
  userId: string
): Promise<ISupabaseErrorOnly> {
  const { error } = await supabase
    .from('user_preferences')
    .upsert(
      { user_id: userId },
      { onConflict: 'user_id', ignoreDuplicates: true }
    )
  return { error }
}

/**
 * Gets or creates user preferences (ensures row exists, then fetches).
 * @param userId - Authenticated user UUID
 * @returns The user preferences row (created with defaults if not existing)
 */
export async function getOrCreatePreferences(
  userId: string
): Promise<SupabaseResult<UserPreferencesRow>> {
  const { error: ensureError } = await ensurePreferencesRow(userId)
  if (ensureError) return { data: null, error: ensureError }
  return getUserPreferences(userId)
}

/**
 * Ensures preferences row exists, then updates with the given payload.
 * @param userId - Authenticated user UUID
 * @param body - Partial preferences fields to update
 * @returns The updated preferences row
 */
export async function upsertPreferences(
  userId: string,
  body: UpdatePayload
): Promise<SupabaseResult<UserPreferencesRow>> {
  const { error: ensureError } = await ensurePreferencesRow(userId)
  if (ensureError) return { data: null, error: ensureError }
  return updateUserPreferences(userId, body)
}

/**
 * Fetches only the `initial_balance_set` flag for a user.
 * @param userId - Authenticated user UUID
 * @returns Object with `initial_balance_set` boolean
 */
export async function getInitialBalanceSet(
  userId: string
): Promise<SupabaseResult<Pick<UserPreferencesRow, 'initial_balance_set'>>> {
  const result = await supabase
    .from('user_preferences')
    .select('initial_balance_set')
    .eq('user_id', userId)
    .single()

  if (result.error) return { data: null, error: result.error }
  return {
    data: result.data as Pick<UserPreferencesRow, 'initial_balance_set'>,
    error: null,
  }
}

/**
 * Checks whether the user can still set their initial balance (idempotency guard).
 * @param userId - Authenticated user UUID
 * @returns Object with `canSet` boolean (true if initial balance not yet set)
 */
export async function checkInitialBalanceNotSet(
  userId: string
): Promise<SupabaseResult<{ canSet: boolean }>> {
  const { error: ensureError } = await ensurePreferencesRow(userId)
  if (ensureError) return { data: null, error: ensureError }

  const result = await getInitialBalanceSet(userId)
  if (result.error) return { data: null, error: result.error }

  return { data: { canSet: !result.data.initial_balance_set }, error: null }
}

/**
 * Sets the initial balance for a user: upserts the balance row and flips the preference flag.
 *
 * **Non-atomic**: three sequential writes (balance upsert → ensure preferences → update flag).
 * A failure after the balance upsert can leave the user with a balance but `initial_balance_set = false`.
 * The idempotency guard in the route handler (`checkInitialBalanceNotSet`) allows safe retries.
 * TODO: migrate to a single Postgres RPC (`set_initial_balance`) for atomicity.
 *
 * @param userId - Authenticated user UUID
 * @param amount - Initial balance amount
 * @returns Error-only result (null on success)
 */
export async function setInitialBalance(
  userId: string,
  amount: number
): Promise<ISupabaseErrorOnly> {
  const { error: balanceError } = await supabase
    .from('balances')
    .upsert({ user_id: userId, reference: amount }, { onConflict: 'user_id' })

  if (balanceError) return { error: balanceError }

  const { error: ensureError } = await ensurePreferencesRow(userId)
  if (ensureError) return { error: ensureError }

  const { error: prefError } = await supabase
    .from('user_preferences')
    .update({ initial_balance_set: true })
    .eq('user_id', userId)

  if (prefError) return { error: prefError }
  return { error: null }
}

/**
 * Permanently deletes a user account via Supabase Auth Admin.
 * All related data (transactions, budgets, pots, preferences, balances) is removed
 * automatically by `ON DELETE CASCADE` foreign keys in the database.
 * @param userId - Authenticated user UUID to delete
 * @returns Auth error if the operation failed, null on success
 */
export async function deleteUserAccount(
  userId: string
): Promise<IAuthErrorOnly> {
  const { error } = await supabase.auth.admin.deleteUser(userId)
  return { error }
}
