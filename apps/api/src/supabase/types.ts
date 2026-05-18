import type { PostgrestError } from '@supabase/supabase-js'

/** Success branch of a Supabase single-record query. */
interface ISupabaseSuccess<T> {
  /** The returned record */
  data: T
  /** Always null on success */
  error: null
}

/** Failure branch of any Supabase query. */
interface ISupabaseFailure {
  /** Always null on failure */
  data: null
  /** PostgREST error details */
  error: PostgrestError
}

/** Discriminated union for single-record Supabase queries (insert, update, select…single). */
export type SupabaseResult<T> = ISupabaseSuccess<T> | ISupabaseFailure

/** Success branch of a Supabase delete query (no data, only count). */
interface ISupabaseDeleteSuccess {
  /** Number of rows deleted */
  count: number
  /** Always null on success */
  error: null
}

/** Discriminated union for Supabase delete queries. */
export type SupabaseDeleteResult = ISupabaseDeleteSuccess | ISupabaseFailure

/** Success branch of a Supabase list query (array + count). */
interface ISupabaseListSuccess<T> {
  /** Array of returned records */
  data: T[]
  /** Total count of matching rows (for pagination) */
  count: number
  /** Always null on success */
  error: null
}

/** Discriminated union for Supabase list queries with pagination count. */
export type SupabaseListResult<T> = ISupabaseListSuccess<T> | ISupabaseFailure

/** Result type for operations that only report success/failure (no data returned). */
export interface ISupabaseErrorOnly {
  /** PostgREST error if the operation failed, null on success */
  error: PostgrestError | null
}
