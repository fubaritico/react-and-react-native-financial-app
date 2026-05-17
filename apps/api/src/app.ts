import cors from 'cors'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import { pinoHttp } from 'pino-http'
import swaggerUi from 'swagger-ui-express'

import { logger } from './lib/logger.js'
import { generateDocument } from './lib/openapi.js'
import { balanceRouter } from './routes/balance.js'
import { budgetsRouter } from './routes/budgets.js'
import { potsRouter } from './routes/pots.js'
import { recurringBillsRouter } from './routes/recurring-bills.js'
import { transactionsRouter } from './routes/transactions.js'
import {
  initialBalanceRouter,
  userPreferencesRouter,
} from './routes/user-preferences.js'

/** Creates and configures the Express app (without listening). */
export function createApp() {
  const app = express()

  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => (req as express.Request).path === '/health',
      },
    })
  )
  app.use(helmet())
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')
  if (!allowedOrigins && process.env.NODE_ENV === 'production') {
    throw new Error('ALLOWED_ORIGINS must be set in production')
  }
  app.use(cors({ origin: allowedOrigins ?? 'http://localhost:5173' }))
  app.use(express.json())

  // Rate limiting — global: 100 req/15min/IP
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  })
  app.use(globalLimiter)

  // Stricter limiter for financial mutations: 20 req/15min/IP
  const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many write requests, please try again later.' },
  })

  // Swagger UI — dev only, never exposed in production (A01-005)
  if (process.env.NODE_ENV !== 'production') {
    const spec = generateDocument()
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec))
    app.get('/openapi.json', (_req, res) => res.json(spec))
  }

  // Health check
  app.get('/health', (_req, res) => res.json({ status: 'ok' }))

  // Routes — read-only (global limiter only)
  app.use('/balance', balanceRouter)
  app.use('/recurring-bills', recurringBillsRouter)

  // Routes — with mutations (global + write limiter)
  app.use('/transactions', writeLimiter, transactionsRouter)
  app.use('/budgets', writeLimiter, budgetsRouter)
  app.use('/pots', writeLimiter, potsRouter)
  app.use('/users/me/preferences', writeLimiter, userPreferencesRouter)
  app.use('/users/me/initial-balance', writeLimiter, initialBalanceRouter)

  return app
}
