/**
 * Initial balance route — one-time setup during onboarding.
 *
 * `POST /users/me/initial-balance` sets the user's starting balance
 * (stored as `reference_balance` in `user_preferences`) and flips
 * `initial_balance_set` to `true`.
 *
 * Idempotency guard: if the balance was already set, returns 409.
 * This prevents accidental overwrites if the user replays the onboarding.
 *
 * @module
 */
import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import {
  InitialBalanceSchema,
  SetInitialBalanceResponseSchema,
} from '../schemas/user-preferences.js'
import {
  checkInitialBalanceNotSet,
  setInitialBalance,
} from '../supabase/index.js'

// --- OpenAPI registration ---

registry.registerPath({
  method: 'post',
  path: '/users/me/initial-balance',
  tags: ['User Preferences'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: InitialBalanceSchema } },
    },
  },
  responses: {
    200: {
      description: 'Balance set and initial_balance_set flipped to true',
      content: {
        'application/json': {
          schema: SetInitialBalanceResponseSchema,
        },
      },
    },
    409: { description: 'Initial balance already set' },
  },
})

// --- Express handler ---

export const initialBalanceRouter = Router()
initialBalanceRouter.use(requireAuth)

/** POST /users/me/initial-balance — sets starting balance (one-time, returns 409 if already set). */
initialBalanceRouter.post(
  '/',
  validateBody(InitialBalanceSchema),
  async (req, res) => {
    const userId = res.locals.userId as string
    const { amount } = req.body as { amount: number }

    // Idempotency guard — prevent overwriting a previously set balance (A04-007)
    const checkResult = await checkInitialBalanceNotSet(userId)
    if (checkResult.error) {
      logger.error({ err: checkResult.error }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
      return
    }
    if (!checkResult.data.canSet) {
      res.status(409).json({ error: 'Initial balance already set' })
      return
    }

    const { error } = await setInitialBalance(userId, amount)
    if (error) {
      logger.error({ err: error, path: req.path }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
      return
    }

    logger.info(
      { event: 'initial_balance_set', userId },
      'Initial balance configured'
    )
    res.json({ reference: amount, initial_balance_set: true })
  }
)
