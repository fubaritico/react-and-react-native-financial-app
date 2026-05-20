import { z } from '../lib/zod.js'

import { MAX_AMOUNT } from './constants.js'

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

/** Response for GET /balance/reference. */
export const ReferenceBalanceSchema = z
  .object({
    reference: z.number().openapi({ example: 40000 }),
  })
  .openapi('ReferenceBalance')

/** Body for PUT /balance/reference. */
export const UpdateReferenceBalanceSchema = z
  .object({
    reference: z
      .number()
      .min(0, { message: 'validation.amount.min' })
      .max(MAX_AMOUNT, { message: 'validation.amount.max' })
      .openapi({ example: 40000, description: 'New reference balance amount' }),
  })
  .openapi('UpdateReferenceBalance')
