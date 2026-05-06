import { z } from '../lib/zod.js'

export const BalanceSchema = z
  .object({
    current: z.number().openapi({ example: 4836.0 }),
    income: z.number().openapi({ example: 3814.25 }),
    expenses: z.number().openapi({ example: 1700.5 }),
  })
  .openapi('Balance')
