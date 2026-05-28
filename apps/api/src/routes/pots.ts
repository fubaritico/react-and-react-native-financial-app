/**
 * Pot routes — CRUD + money movement on savings pots.
 *
 * A pot is a named savings goal with a `target` amount and a running `total`.
 * Beyond standard CRUD, two extra endpoints handle atomic money movements:
 * - `POST /:id/add` — adds money to the pot
 * - `POST /:id/withdraw` — withdraws money (rejects if insufficient funds)
 *
 * Money movements use a Supabase RPC (`update_pot_total`) that performs
 * the check-and-update in a single SQL statement — no TOCTOU race condition.
 *
 * All routes require authentication. Write operations are rate-limited.
 *
 * @module
 */
import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { z } from '../lib/zod.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody, validateParams } from '../middleware/validate.js'
import { IdParamSchema, PGRST_NOT_FOUND } from '../schemas/constants.js'
import {
  CreatePotSchema,
  PotAmountSchema,
  PotSchema,
  UpdatePotSchema,
} from '../schemas/pot.js'
import {
  createPot,
  deletePot,
  getPots,
  rpcUpdatePotTotal,
  updatePot,
} from '../supabase/index.js'

export const potsRouter = Router()
potsRouter.use(requireAuth)

// --- OpenAPI registration ---

registry.registerPath({
  method: 'get',
  path: '/pots',
  tags: ['Pots'],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'All pots for the authenticated user',
      content: { 'application/json': { schema: z.array(PotSchema) } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/pots',
  tags: ['Pots'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: CreatePotSchema } },
    },
  },
  responses: {
    201: {
      description: 'Pot created',
      content: { 'application/json': { schema: PotSchema } },
    },
  },
})

registry.registerPath({
  method: 'put',
  path: '/pots/{id}',
  tags: ['Pots'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: UpdatePotSchema } },
    },
  },
  responses: {
    200: {
      description: 'Pot updated',
      content: { 'application/json': { schema: PotSchema } },
    },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/pots/{id}',
  tags: ['Pots'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    204: { description: 'Pot deleted' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/pots/{id}/add',
  tags: ['Pots'],
  summary: 'Add money to a pot',
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: PotAmountSchema } },
    },
  },
  responses: {
    200: {
      description: 'Pot after adding money',
      content: { 'application/json': { schema: PotSchema } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/pots/{id}/withdraw',
  tags: ['Pots'],
  summary: 'Withdraw money from a pot',
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: PotAmountSchema } },
    },
  },
  responses: {
    200: {
      description: 'Pot after withdrawal',
      content: { 'application/json': { schema: PotSchema } },
    },
  },
})

// --- Express handlers ---

/** GET /pots — lists all savings pots for the authenticated user. */
potsRouter.get('/', async (req, res) => {
  const result = await getPots(res.locals.userId as string)

  if (result.error) {
    logger.error({ err: result.error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  res.json(result.data)
})

/** POST /pots — creates a new savings pot with a name, target, and theme. */
potsRouter.post('/', validateBody(CreatePotSchema), async (req, res) => {
  const body = req.body as { name: string; target: number; theme: string }

  const result = await createPot(res.locals.userId as string, body)

  if (result.error) {
    logger.error({ err: result.error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  logger.info(
    {
      event: 'pot_created',
      potId: result.data.id,
      userId: res.locals.userId,
    },
    'Pot created'
  )
  res.status(201).json(result.data)
})

/** PUT /pots/:id — updates a pot's name, target, or theme. Returns 404 if not found. */
potsRouter.put(
  '/:id',
  validateParams(IdParamSchema),
  validateBody(UpdatePotSchema),
  async (req, res) => {
    const body = req.body as {
      name?: string
      target?: number
      theme?: string
    }

    const result = await updatePot(
      req.params.id as string,
      res.locals.userId as string,
      body
    )

    if (result.error) {
      if (result.error.code === PGRST_NOT_FOUND) {
        res.status(404).json({ error: '[DATABASE] Not found' })
        return
      }
      logger.error({ err: result.error, path: req.path }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
      return
    }

    logger.info(
      { event: 'pot_updated', potId: req.params.id, userId: res.locals.userId },
      'Pot updated'
    )
    res.json(result.data)
  }
)

/** DELETE /pots/:id — removes a pot. Returns 404 if not found, 204 on success. */
potsRouter.delete('/:id', validateParams(IdParamSchema), async (req, res) => {
  const result = await deletePot(
    req.params.id as string,
    res.locals.userId as string
  )

  if (result.error) {
    logger.error({ err: result.error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  if (result.count === 0) {
    res.status(404).json({ error: '[DATABASE] Not found' })
    return
  }

  logger.info(
    { event: 'pot_deleted', potId: req.params.id, userId: res.locals.userId },
    'Pot deleted'
  )
  res.status(204).send()
})

/**
 * Atomically update pot total by a delta (positive = add, negative = withdraw).
 * Uses a single UPDATE ... WHERE total + delta >= 0 — no TOCTOU race condition.
 * CWE-362 fix: the check and write happen in one atomic SQL statement.
 * @param potId - Pot UUID
 * @param userId - Authenticated user UUID
 * @param delta - Amount to add (positive) or withdraw (negative)
 * @param res - Express Response object used to send the HTTP response
 * @returns Sends HTTP response directly — no return value
 */
async function handlePotTotal(
  potId: string,
  userId: string,
  delta: number,
  res: import('express').Response
) {
  const result = await rpcUpdatePotTotal(potId, userId, delta)

  if (result.error) {
    logger.error({ err: result.error, potId, userId }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  if (result.data.length === 0) {
    logger.warn(
      { event: 'pot_money_rejected', potId, userId },
      'Pot not found or insufficient funds'
    )
    res
      .status(400)
      .json({ error: '[BUSINESS] Pot not found or insufficient funds' })
    return
  }

  const pot = result.data[0]
  logger.info(
    { event: 'pot_money_movement', potId, userId },
    'Pot balance updated'
  )
  res.json(pot)
}

/** POST /pots/:id/add — atomically adds money to a pot. Returns 400 if pot not found. */
potsRouter.post(
  '/:id/add',
  validateParams(IdParamSchema),
  validateBody(PotAmountSchema),
  async (req, res) => {
    const id = req.params.id as string
    const userId = res.locals.userId as string
    const { amount } = req.body as { amount: number }
    await handlePotTotal(id, userId, amount, res)
  }
)

/** POST /pots/:id/withdraw — atomically withdraws money. Returns 400 if insufficient funds. */
potsRouter.post(
  '/:id/withdraw',
  validateParams(IdParamSchema),
  validateBody(PotAmountSchema),
  async (req, res) => {
    const id = req.params.id as string
    const userId = res.locals.userId as string
    const { amount } = req.body as { amount: number }
    await handlePotTotal(id, userId, -amount, res)
  }
)
