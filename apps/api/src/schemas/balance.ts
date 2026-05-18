import { z } from '../lib/zod.js'

export const BalanceSchema = z
  .object({
    current: z.number().openapi({ example: 4836.0 }),
    income: z.number().openapi({ example: 3814.25 }),
    expenses: z.number().openapi({ example: 1700.5 }),
  })
  .openapi('Balance')

/** Query params for GET /balance — optional month filter. */
export const BalanceQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional()
    .openapi({
      example: '2025-08',
      description: 'Filter by month (YYYY-MM). Omit for all-time.',
    }),
})
