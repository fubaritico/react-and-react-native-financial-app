/**
 * User preferences routes — read and update user settings.
 *
 * Preferences include: `mode` (manual/bank), `has_seen_onboarding`,
 * `currency` (ISO 4217), and `reference_balance` (starting balance).
 *
 * The GET endpoint auto-creates a preferences row if none exists (upsert
 * with defaults), so it never returns 404. The PUT uses a Supabase upsert
 * so it works whether a row exists or not.
 *
 * @module
 */
import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import {
  UpdateUserPreferencesSchema,
  UserPreferencesSchema,
} from '../schemas/user-preferences.js'
import { getOrCreatePreferences, upsertPreferences } from '../supabase/index.js'

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

// --- Express handlers ---

/** GET /users/me/preferences — returns preferences, auto-creating a row if none exists. */
userPreferencesRouter.get('/', async (req, res) => {
  const result = await getOrCreatePreferences(res.locals.userId as string)

  if (result.error) {
    logger.error({ err: result.error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  res.json(result.data)
})

/** PUT /users/me/preferences — updates one or more preference fields (mode, currency, etc.). */
userPreferencesRouter.put(
  '/',
  validateBody(UpdateUserPreferencesSchema),
  async (req, res) => {
    const userId = res.locals.userId as string
    const body = req.body as {
      mode?: string | null
      has_seen_onboarding?: boolean
      currency?: string
      reference_balance?: number
    }

    const result = await upsertPreferences(userId, body)

    if (result.error) {
      logger.error({ err: result.error, path: req.path }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
      return
    }

    logger.info(
      { event: 'preferences_updated', userId, fields: Object.keys(body) },
      'User preferences updated'
    )
    res.json(result.data)
  }
)
