import { z } from '../lib/zod.js'

export const RecurringBillSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
    avatar: z.string().openapi({
      example: './assets/images/avatars/spark-electric-solutions.jpg',
    }),
    name: z.string().openapi({ example: 'Spark Electric Solutions' }),
    category: z.string().openapi({ example: 'Bills' }),
    date: z.string().datetime().openapi({ example: '2024-08-02T09:25:11Z' }),
    amount: z.number().openapi({ example: -100.0 }),
    recurring: z.boolean().openapi({ example: true }),
  })
  .openapi('RecurringBill')
