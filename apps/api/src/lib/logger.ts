import pino from 'pino'

/** Structured JSON logger (pino) — uses pino-pretty in development */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  ...(process.env.NODE_ENV !== 'production' && {
    transport: { target: 'pino-pretty' },
  }),
})
