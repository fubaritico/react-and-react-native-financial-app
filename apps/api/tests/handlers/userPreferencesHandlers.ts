import { HttpResponse, http } from 'msw'

import { SUPABASE_URL } from '../helpers.js'
import { mockUserPreferences, mockUserPreferencesManual } from '../data/index.js'

const REST = `${SUPABASE_URL}/rest/v1/user_preferences`

/**
 * MSW handlers for the user_preferences Supabase REST table.
 *
 * Supabase JS client translates:
 *   .from('user_preferences').select()  → GET  /rest/v1/user_preferences?select=*&...
 *   .from('user_preferences').upsert()  → POST /rest/v1/user_preferences (with Prefer: resolution=merge-duplicates)
 *   .from('user_preferences').update()  → PATCH /rest/v1/user_preferences?user_id=eq.xxx
 */
export const userPreferencesHandlers = {
  /** GET — returns preferences array (Supabase always returns arrays for select). */
  selectOne: http.get(REST, ({ request }) => {
    const url = new URL(request.url)
    const accept = request.headers.get('accept') ?? ''
    // .single() sends Accept: application/vnd.pgrst.object+json
    if (accept.includes('vnd.pgrst.object')) {
      return HttpResponse.json(mockUserPreferences, {
        headers: { 'content-range': '0-0/1' },
      })
    }
    // Default array response
    return HttpResponse.json(
      url.searchParams.has('limit') ? [mockUserPreferences] : [mockUserPreferences]
    )
  }),

  /** POST — upsert (create or ignore). Returns the row. */
  upsert: http.post(REST, ({ request }) => {
    const accept = request.headers.get('accept') ?? ''
    if (accept.includes('vnd.pgrst.object')) {
      return HttpResponse.json(mockUserPreferences, {
        headers: { 'content-range': '0-0/1' },
      })
    }
    return HttpResponse.json([mockUserPreferences], {
      headers: { 'content-range': '0-0/1' },
    })
  }),

  /** PATCH — update fields. Returns updated row. */
  update: http.patch(REST, ({ request }) => {
    const accept = request.headers.get('accept') ?? ''
    if (accept.includes('vnd.pgrst.object')) {
      return HttpResponse.json(mockUserPreferencesManual, {
        headers: { 'content-range': '0-0/1' },
      })
    }
    return HttpResponse.json([mockUserPreferencesManual])
  }),

  /** GET — empty result (no preferences row). */
  empty: http.get(REST, () => {
    return HttpResponse.json([])
  }),

  /** GET — Supabase DB error. */
  dbErrorGet: http.get(REST, () => {
    return HttpResponse.json(
      { message: 'Database connection failed', code: 'PGRST301' },
      { status: 500 }
    )
  }),

  /** POST — Supabase DB error. */
  dbErrorPost: http.post(REST, () => {
    return HttpResponse.json(
      { message: 'Database connection failed', code: 'PGRST301' },
      { status: 500 }
    )
  }),

  /** PATCH — Supabase DB error. */
  dbErrorPatch: http.patch(REST, () => {
    return HttpResponse.json(
      { message: 'Database connection failed', code: 'PGRST301' },
      { status: 500 }
    )
  }),
}
