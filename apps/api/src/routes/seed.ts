/**
 * Seed route — dev-only endpoint for populating test data.
 *
 * `POST /dev/seed` creates (or resets) a user with the given email/password,
 * then inserts the full mock dataset from `packages/shared/src/mocks/data/data.json`
 * (transactions, budgets, pots, categories, preferences).
 *
 * Only mounted when `NODE_ENV !== 'production'` (see app.ts).
 * No authentication required — this is a dev utility.
 * Not registered in the OpenAPI spec (no Swagger UI entry).
 *
 * @module
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { validateBody } from '../middleware/validate.js'
import { SeedBodySchema } from '../schemas/seed.js'
import { insertSeedData, resetAndCreateUser } from '../supabase/index.js'

import type { ISeedData } from '../supabase/index.js'

export const seedRouter = Router()

/**
 * Loads seed data from the shared package's data.json file.
 * @returns Parsed seed data
 */
function loadSeedData(): ISeedData {
  const dataPath = resolve(
    process.cwd(),
    '../../packages/shared/src/mocks/data/data.json'
  )
  return JSON.parse(readFileSync(dataPath, 'utf-8')) as ISeedData
}

/**
 * POST /dev/seed
 * Creates a test user (or resets existing) and seeds all mock data.
 * Dev-only — returns 404 in production.
 *
 * @param req - Express request with validated { email, password } body
 * @param res - Express response
 */
seedRouter.post('/', validateBody(SeedBodySchema), async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const { email, password } = req.body as { email: string; password: string }

  // 1. Reset (if exists) + create fresh user
  const {
    userId,
    error: userError,
    wasReset,
  } = await resetAndCreateUser(email, password)
  if (!userId) {
    logger.error({ err: userError }, 'Seed: failed to create user')
    res.status(500).json({ error: 'Failed to create user' })
    return
  }

  logger.info(
    { userId, wasReset },
    wasReset
      ? 'Seed: reset existing user and created fresh'
      : 'Seed: created new user'
  )

  // 2. Load and insert seed data
  const seedData = loadSeedData()
  const insertResult = await insertSeedData(userId, seedData)
  if (insertResult.error) {
    logger.error(
      { userId, err: insertResult.error.message },
      'Seed: failed to insert data'
    )
    res.status(500).json({ error: 'Failed to insert seed data' })
    return
  }

  logger.info({ userId }, 'Seed: data inserted successfully')
  res.json({ userId, email, wasReset })
})
