import { z } from '../lib/zod.js'

import {
  MAX_AMOUNT,
  MAX_CATEGORY_LENGTH,
  MAX_THEME_LENGTH,
} from './constants.js'

export const BudgetSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
    category: z.string().openapi({ example: 'Dining Out' }),
    maximum: z.number().openapi({ example: 75.0 }),
    theme: z.string().openapi({ example: 'yellow' }),
    month: z
      .string()
      .regex(/^\d{4}-\d{2}$/, 'Must be YYYY-MM format')
      .openapi({ example: '2024-08' }),
    spent: z.number().openapi({ example: 42.5 }),
  })
  .openapi('Budget')

export const CreateBudgetSchema = z
  .object({
    category: z.string().min(1).max(MAX_CATEGORY_LENGTH).openapi({ example: 'Dining Out' }),
    maximum: z
      .number()
      .positive({ message: 'validation.amount.positive' })
      .max(MAX_AMOUNT, { message: 'validation.amount.max' })
      .openapi({ example: 75.0 }),
    theme: z.string().min(1).max(MAX_THEME_LENGTH).openapi({ example: 'yellow' }),
    month: z
      .string()
      .regex(/^\d{4}-\d{2}$/, 'Must be YYYY-MM format')
      .openapi({ example: '2024-08' }),
  })
  .openapi('CreateBudgetRequest')

export const UpdateBudgetSchema = z
  .object({
    category: z
      .string()
      .min(1)
      .max(MAX_CATEGORY_LENGTH)
      .optional()
      .openapi({ example: 'Entertainment' }),
    maximum: z
      .number()
      .positive({ message: 'validation.amount.positive' })
      .max(MAX_AMOUNT, { message: 'validation.amount.max' })
      .optional()
      .openapi({ example: 100.0 }),
    theme: z.string().min(1).max(MAX_THEME_LENGTH).optional().openapi({ example: 'green' }),
  })
  .openapi('UpdateBudgetRequest')
