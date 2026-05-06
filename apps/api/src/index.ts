import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'

import { generateDocument } from './lib/openapi.js'
import { balanceRouter } from './routes/balance.js'
import { budgetsRouter } from './routes/budgets.js'
import { potsRouter } from './routes/pots.js'
import { recurringBillsRouter } from './routes/recurring-bills.js'
import { transactionsRouter } from './routes/transactions.js'

const app = express()
const PORT = Number(process.env.PORT ?? 3001)

app.use(helmet())
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:5173',
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

app.listen(PORT, () => {
  console.error(`API server running on http://localhost:${String(PORT)}`)
  console.error(`Swagger UI: http://localhost:${String(PORT)}/docs`)
})
