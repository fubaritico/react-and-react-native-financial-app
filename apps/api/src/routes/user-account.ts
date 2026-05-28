/**
 * User account route — account deletion.
 *
 * Single endpoint: `DELETE /users/me` permanently removes the authenticated
 * user via Supabase Auth Admin. All associated data (transactions, budgets,
 * pots, preferences, categories) is cascade-deleted by the database.
 *
 * This is irreversible. The client signs out after a successful deletion.
 *
 * @module
 */
import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { z } from '../lib/zod.js'
import { requireAuth } from '../middleware/auth.js'
import { deleteUserAccount } from '../supabase/index.js'

export const userAccountRouter = Router()
userAccountRouter.use(requireAuth)

// --- OpenAPI registration ---

registry.registerPath({
  method: 'delete',
  path: '/users/me',
  tags: ['User Account'],
  summary: 'Delete current user account and all associated data',
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'Account deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Account deleted' }),
          }),
        },
      },
    },
    500: {
      description: 'Failed to delete account',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().openapi({ example: 'Failed to delete account' }),
          }),
        },
      },
    },
  },
})

// --- Express handlers ---

/**
 * DELETE / — permanently deletes the authenticated user and all associated data.
 * Supabase Auth Admin removes the auth.users row; ON DELETE CASCADE handles public tables.
 */
userAccountRouter.delete('/', async (req, res) => {
  const userId = res.locals.userId as string
  const result = await deleteUserAccount(userId)

  if (result.error) {
    logger.error(
      { err: result.error, path: req.path, userId },
      'Failed to delete user account'
    )
    res.status(500).json({ error: 'Failed to delete account' })
    return
  }

  logger.info(
    { event: 'account_deleted', userId },
    'User account permanently deleted'
  )
  res.json({ message: 'Account deleted' })
})
