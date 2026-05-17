import cors from 'cors'
import express from 'express'
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
  app.use(
    cors({
      origin:
        process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:5173',
    })
  )
  app.use(express.json())

  // Swagger UI — live spec from registry (always in sync)
  const spec = generateDocument()
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec))
  app.get('/openapi.json', (_req, res) => res.json(spec))

  // Health check
  app.get('/health', (_req, res) => res.json({ status: 'ok' }))

  // Routes
  app.use('/balance', balanceRouter)
  app.use('/transactions', transactionsRouter)
  app.use('/budgets', budgetsRouter)
  app.use('/pots', potsRouter)
  app.use('/recurring-bills', recurringBillsRouter)
  app.use('/users/me/preferences', userPreferencesRouter)
  app.use('/users/me/initial-balance', initialBalanceRouter)

  return app
}
