import { z } from '../lib/zod.js'

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
    date: z.string().datetime().openapi({ example: '2024-08-19T14:23:11Z' }),
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
    date: z.string().datetime().openapi({ example: '2024-07-29T00:00:00Z' }),
    amount: z.number().openapi({
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
    date: z
      .string()
      .datetime()
      .optional()
      .openapi({ example: '2024-07-29T00:00:00Z' }),
    amount: z.number().optional().openapi({
      example: -45.0,
      description: 'Negative = expense, positive = income',
    }),
    recurring: z.boolean().optional().openapi({ example: false }),
  })
  .openapi('UpdateTransaction')

export const TransactionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z
    .enum(['latest', 'oldest', 'a-z', 'z-a', 'highest', 'lowest'])
    .default('latest'),
})
