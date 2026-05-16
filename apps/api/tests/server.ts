import { setupServer } from 'msw/node'

import { authHandlers } from './handlers/authHandlers.js'
import { balanceHandlers } from './handlers/balanceHandlers.js'
import { userPreferencesHandlers } from './handlers/userPreferencesHandlers.js'

/** MSW server with default handlers (happy path). */
export const server = setupServer(
  authHandlers.authenticated,
  userPreferencesHandlers.selectOne,
  userPreferencesHandlers.upsert,
  userPreferencesHandlers.update,
  balanceHandlers.upsert
)
