import { createApp } from './app.js'
import { logger } from './lib/logger.js'

const app = createApp()
const PORT = Number(process.env.PORT ?? 3001)

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`API server running on http://0.0.0.0:${String(PORT)}`)
  logger.info(`Swagger UI: http://localhost:${String(PORT)}/docs`)
})
