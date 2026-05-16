import { HttpResponse, http } from 'msw'

import { SUPABASE_URL, TEST_USER_ID } from '../helpers.js'

const REST = `${SUPABASE_URL}/rest/v1/balances`

/** MSW handlers for the balances Supabase REST table. */
export const balanceHandlers = {
  /** POST — upsert balance reference. */
  upsert: http.post(REST, () => {
    return HttpResponse.json([{ user_id: TEST_USER_ID, reference: 1500 }])
  }),

  /** Any method — DB error. */
  dbError: http.all(REST, () => {
    return HttpResponse.json(
      { message: 'Database error', code: 'PGRST301' },
      { status: 500 }
    )
  }),
}
