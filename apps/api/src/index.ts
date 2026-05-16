import { createApp } from './app.js'

const app = createApp()
const PORT = Number(process.env.PORT ?? 3001)

app.listen(PORT, '0.0.0.0', () => {
  console.error(`API server running on http://0.0.0.0:${String(PORT)}`)
  console.error(`Swagger UI: http://localhost:${String(PORT)}/docs`)
})
