import { z } from '../lib/zod.js'

import {
  MAX_AMOUNT,
  MAX_PAGE_SIZE,
  MAX_SEARCH_LENGTH,
  MIN_AMOUNT,
} from './constants.js'

/** Supabase/Postgres timestamptz format: `YYYY-MM-DD HH:mm:ss+00` */
const TIMESTAMPTZ_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\+00$/
const TIMESTAMPTZ_EXAMPLE = '2024-08-19 14:23:11+00'

const timestamptz = z
  .string()
  .regex(TIMESTAMPTZ_REGEX, 'Expected format: YYYY-MM-DD HH:mm:ss+00')

export const TransactionSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
    avatar: z
      .string()
      .openapi({ example: './assets/images/avatars/emma-richardson.jpg' }),
    name: z.string().openapi({ example: 'Emma Richardson' }),
    category: z.string().openapi({ example: 'General' }),
    date: timestamptz.openapi({ example: TIMESTAMPTZ_EXAMPLE }),
    amount: z.number().openapi({ example: 75.5 }),
    recurring: z.boolean().openapi({ example: false }),
  })
  .openapi('Transaction')

export const TransactionListSchema = z
  .object({
    data: z.array(TransactionSchema),
    page: z.number().int().openapi({ example: 1 }),
    totalPages: z.number().int().openapi({ example: 5 }),
    total: z.number().int().openapi({ example: 47 }),
  })
  .openapi('TransactionList')

export const CreateTransactionSchema = z
  .object({
    name: z.string().min(1).openapi({ example: 'Urban Sports Club' }),
    category: z.string().min(1).openapi({ example: 'Lifestyle' }),
    date: timestamptz.openapi({ example: TIMESTAMPTZ_EXAMPLE }),
    amount: z
      .number()
      .min(MIN_AMOUNT, { message: `validation.amount.min` })
      .max(MAX_AMOUNT, { message: `validation.amount.max` })
      .refine((v) => v !== 0, { message: 'validation.amount.nonZero' })
      .openapi({
        example: -45.0,
        description: 'Negative = expense, positive = income',
      }),
    recurring: z.boolean().openapi({ example: false }),
  })
  .openapi('CreateTransaction')

export const UpdateTransactionSchema = z
  .object({
    name: z
      .string()
      .min(1)
      .optional()
      .openapi({ example: 'Urban Sports Club' }),
    category: z.string().min(1).optional().openapi({ example: 'Lifestyle' }),
    date: timestamptz.optional().openapi({ example: TIMESTAMPTZ_EXAMPLE }),
    amount: z
      .number()
      .min(MIN_AMOUNT, { message: `validation.amount.min` })
      .max(MAX_AMOUNT, { message: `validation.amount.max` })
      .refine((v) => v !== 0, { message: 'validation.amount.nonZero' })
      .optional()
      .openapi({
        example: -45.0,
        description: 'Negative = expense, positive = income',
      }),
    recurring: z.boolean().optional().openapi({ example: false }),
  })
  .openapi('UpdateTransaction')

export const TransactionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(10),
  category: z.string().optional(),
  search: z.string().max(MAX_SEARCH_LENGTH).optional(),
  sort: z
    .enum(['latest', 'oldest', 'a-z', 'z-a', 'highest', 'lowest'])
    .default('latest'),
})
