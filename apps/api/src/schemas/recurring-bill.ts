import { z } from '../lib/zod.js'

export const RecurringBillSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
    name: z.string().openapi({ example: 'Spark Electric Solutions' }),
    date: z.string().datetime().openapi({ example: '2024-08-02T09:25:11Z' }),
    amount: z.number().openapi({ example: -100.0 }),
    recurring: z.boolean().openapi({ example: true }),
    category_id: z
      .string()
      .uuid()
      .openapi({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }),
    category_name: z.string().openapi({ example: 'Bills' }),
    category_icon: z.string().openapi({ example: 'categoryBills' }),
    category_color: z.string().openapi({ example: 'blue' }),
  })
  .openapi('RecurringBill')
