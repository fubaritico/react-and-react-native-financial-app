import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import {
  InitialBalanceSchema,
  SetInitialBalanceResponseSchema,
  UpdateUserPreferencesSchema,
  UserPreferencesSchema,
} from '../schemas/user-preferences.js'

export const userPreferencesRouter = Router()
userPreferencesRouter.use(requireAuth)

// --- OpenAPI registration ---

registry.registerPath({
  method: 'get',
  path: '/users/me/preferences',
  tags: ['User Preferences'],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'User preferences (auto-created if not existing)',
      content: { 'application/json': { schema: UserPreferencesSchema } },
    },
  },
})

registry.registerPath({
  method: 'put',
  path: '/users/me/preferences',
  tags: ['User Preferences'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: UpdateUserPreferencesSchema } },
    },
  },
  responses: {
    200: {
      description: 'Updated preferences',
      content: { 'application/json': { schema: UserPreferencesSchema } },
    },
  },
})

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
  },
})

// --- Helpers ---

/**
 * Ensures a user_preferences row exists (creates with defaults if missing).
 * Note: upsert uses { user_id } in payload + onConflict constraint — explicit .eq()
 * is unnecessary because the upsert target IS the user_id column itself.
 */
async function ensurePreferencesRow(userId: string) {
  const { error } = await supabase
    .from('user_preferences')
    .upsert(
      { user_id: userId },
      { onConflict: 'user_id', ignoreDuplicates: true }
    )
  return { error }
}

/**
 * Sets the initial balance reference and flips `initial_balance_set` in preferences.
 * @param userId - Authenticated user ID
 * @param amount - Starting balance amount
 */
async function setInitialBalance(userId: string, amount: number) {
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

// --- Express handlers ---

userPreferencesRouter.get('/', async (_req, res) => {
  const userId = res.locals.userId as string

  const { error: ensureError } = await ensurePreferencesRow(userId)
  if (ensureError) {
    res.status(500).json({ error: ensureError.message })
    return
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select()
    .eq('user_id', userId)
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data)
})

userPreferencesRouter.put(
  '/',
  validateBody(UpdateUserPreferencesSchema),
  async (req, res) => {
    const userId = res.locals.userId as string
    const body = req.body as {
      mode?: string | null
      has_seen_onboarding?: boolean
    }

    const { error: ensureError } = await ensurePreferencesRow(userId)
    if (ensureError) {
      res.status(500).json({ error: ensureError.message })
      return
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .update(body)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }

    res.json(data)
  }
)

// --- Initial balance (mounted separately at /users/me/initial-balance) ---

export const initialBalanceRouter = Router()
initialBalanceRouter.use(requireAuth)

initialBalanceRouter.post(
  '/',
  validateBody(InitialBalanceSchema),
  async (req, res) => {
    const userId = res.locals.userId as string
    const { amount } = req.body as { amount: number }

    const { error } = await setInitialBalance(userId, amount)
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }

    logger.info(
      { event: 'initial_balance_set', userId, amount },
      'Initial balance configured'
    )
    res.json({ reference: amount, initial_balance_set: true })
  }
)
