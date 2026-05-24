import type { categoriesModel } from '@financial-app/prisma'

import { supabase } from '../lib/supabase.js'

import type { SupabaseDeleteResult, SupabaseResult } from './types.js'

/** Full category row as returned by Supabase (mirrors Prisma model). */
export type CategoryRow = categoriesModel

/** Payload for creating a new custom category. */
interface ICreateCategoryPayload {
  /** Category display name */
  name: string
  /** Icon identifier (e.g. "categoryBills") */
  icon: string
  /** Design token color key (e.g. "blue", "army-green") */
  color: string
}

/** Result of a reference check before category deletion. */
interface ICategoryRefCount {
  /** Number of transactions referencing this category */
  transactions: number
  /** Number of budgets referencing this category */
  budgets: number
}

/**
 * Lists all categories for a user, ordered by system categories first, then alphabetically.
 * @param userId - Authenticated user UUID
 * @returns Array of category rows
 */
export async function listCategories(
  userId: string
): Promise<SupabaseResult<CategoryRow[]>> {
  const result = await supabase
    .from('categories')
    .select()
    .eq('user_id', userId)
    .order('is_system', { ascending: false })
    .order('name', { ascending: true })

  if (result.error) return { data: null, error: result.error }
  /* eslint-disable @typescript-eslint/no-unnecessary-condition -- data can be null at runtime */
  return { data: (result.data ?? []) as CategoryRow[], error: null }
  /* eslint-enable @typescript-eslint/no-unnecessary-condition */
}

/**
 * Creates a new custom category for a user.
 * @param userId - Authenticated user UUID
 * @param body - Category creation payload (name, icon, color)
 * @returns The created category row
 */
export async function createCategory(
  userId: string,
  body: ICreateCategoryPayload
): Promise<SupabaseResult<CategoryRow>> {
  const result = await supabase
    .from('categories')
    .insert({ user_id: userId, ...body, is_system: false })
    .select()
    .single()

  if (result.error) return { data: null, error: result.error }
  return { data: result.data as CategoryRow, error: null }
}

/**
 * Checks how many transactions and budgets reference a category.
 * Used as a guard before deletion.
 * @param categoryId - Category UUID
 * @param userId - Authenticated user UUID
 * @returns Reference counts for transactions and budgets
 */
export async function getCategoryRefCount(
  categoryId: string,
  userId: string
): Promise<SupabaseResult<ICategoryRefCount>> {
  const [txnResult, budgetResult] = await Promise.all([
    supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', categoryId)
      .eq('user_id', userId),
    supabase
      .from('budgets')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', categoryId)
      .eq('user_id', userId),
  ])

  if (txnResult.error) return { data: null, error: txnResult.error }
  if (budgetResult.error) return { data: null, error: budgetResult.error }

  return {
    data: {
      transactions: txnResult.count ?? 0,
      budgets: budgetResult.count ?? 0,
    },
    error: null,
  }
}

/**
 * Deletes a category owned by the user.
 * Caller must check references first via `getCategoryRefCount`.
 * @param categoryId - Category UUID
 * @param userId - Authenticated user UUID
 * @returns Delete result with count of affected rows
 */
export async function deleteCategory(
  categoryId: string,
  userId: string
): Promise<SupabaseDeleteResult> {
  const result = await supabase
    .from('categories')
    .delete({ count: 'exact' })
    .eq('id', categoryId)
    .eq('user_id', userId)
    .eq('is_system', false)

  if (result.error) return { data: null, error: result.error }
  return { count: result.count ?? 0, error: null }
}

/**
 * The 10 default system categories seeded for every new user.
 * Used by `ensureDefaultCategories` and the seed endpoint.
 */
export const DEFAULT_CATEGORIES: readonly {
  /** Category display name */
  name: string
  /** Icon identifier */
  icon: string
  /** Design token color key */
  color: string
}[] = [
  { name: 'General', icon: 'categoryGeneral', color: 'blue' },
  { name: 'Dining Out', icon: 'categoryDiningOut', color: 'brown' },
  { name: 'Groceries', icon: 'categoryGroceries', color: 'army-green' },
  { name: 'Entertainment', icon: 'categoryEntertainment', color: 'red' },
  {
    name: 'Transportation',
    icon: 'categoryTransportation',
    color: 'navy-grey',
  },
  { name: 'Lifestyle', icon: 'categoryLifeStyle', color: 'navy' },
  { name: 'Personal Care', icon: 'categoryPersonalCare', color: 'yellow' },
  { name: 'Education', icon: 'categoryEducation', color: 'cyan' },
  { name: 'Bills', icon: 'categoryBills', color: 'blue' },
  { name: 'Shopping', icon: 'categoryShopping', color: 'magenta' },
]

/**
 * Ensures the 10 default system categories exist for a user (idempotent).
 * Uses upsert with `ignoreDuplicates` so it's safe to call multiple times.
 * @param userId - Authenticated user UUID
 * @returns Error if the upsert failed, null on success
 */
export async function ensureDefaultCategories(
  userId: string
): Promise<{ error: import('@supabase/supabase-js').PostgrestError | null }> {
  const rows = DEFAULT_CATEGORIES.map((c) => ({
    user_id: userId,
    ...c,
    is_system: true,
  }))

  const { error } = await supabase
    .from('categories')
    .upsert(rows, { onConflict: 'user_id,name', ignoreDuplicates: true })

  return { error }
}
