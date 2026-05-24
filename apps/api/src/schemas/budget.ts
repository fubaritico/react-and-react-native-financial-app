import { z } from '../lib/zod.js'

import { MAX_AMOUNT } from './constants.js'

export const BudgetSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
    category_id: z
      .string()
      .uuid()
      .openapi({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }),
    category_name: z.string().openapi({ example: 'Dining Out' }),
    category_icon: z.string().openapi({ example: 'categoryDiningOut' }),
    category_color: z.string().openapi({ example: 'brown' }),
    maximum: z.number().openapi({ example: 75.0 }),
    month: z
      .string()
      .regex(/^\d{4}-\d{2}$/, 'Must be YYYY-MM format')
      .openapi({ example: '2024-08' }),
    spent: z.number().openapi({ example: 42.5 }),
  })
  .openapi('Budget')

export const CreateBudgetSchema = z
  .object({
    category_id: z
      .string()
      .uuid()
      .openapi({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }),
    maximum: z
      .number()
      .positive({ message: 'validation.amount.positive' })
      .max(MAX_AMOUNT, { message: 'validation.amount.max' })
      .openapi({ example: 75.0 }),
    month: z
      .string()
      .regex(/^\d{4}-\d{2}$/, 'Must be YYYY-MM format')
      .openapi({ example: '2024-08' }),
  })
  .openapi('CreateBudgetRequest')

export const UpdateBudgetSchema = z
  .object({
    category_id: z
      .string()
      .uuid()
      .optional()
      .openapi({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }),
    maximum: z
      .number()
      .positive({ message: 'validation.amount.positive' })
      .max(MAX_AMOUNT, { message: 'validation.amount.max' })
      .optional()
      .openapi({ example: 100.0 }),
  })
  .openapi('UpdateBudgetRequest')
