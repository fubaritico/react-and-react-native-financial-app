import { z } from '../lib/zod.js'

import {
  MAX_AMOUNT,
  MAX_NAME_LENGTH,
  MAX_THEME_LENGTH,
} from './constants.js'

export const PotSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
    name: z.string().openapi({ example: 'Holiday' }),
    target: z.number().openapi({ example: 2000.0 }),
    total: z.number().openapi({ example: 850.0 }),
    theme: z.string().openapi({ example: 'green' }),
  })
  .openapi('Pot')

export const CreatePotSchema = z
  .object({
    name: z.string().min(1).max(MAX_NAME_LENGTH).openapi({ example: 'Holiday' }),
    target: z
      .number()
      .positive({ message: 'validation.amount.positive' })
      .max(MAX_AMOUNT, { message: 'validation.amount.max' })
      .openapi({ example: 2000.0 }),
    theme: z.string().min(1).max(MAX_THEME_LENGTH).openapi({ example: 'green' }),
  })
  .openapi('CreatePotRequest')

export const UpdatePotSchema = z
  .object({
    name: z.string().min(1).max(MAX_NAME_LENGTH).optional().openapi({ example: 'New Laptop' }),
    target: z
      .number()
      .positive({ message: 'validation.amount.positive' })
      .max(MAX_AMOUNT, { message: 'validation.amount.max' })
      .optional()
      .openapi({ example: 1500.0 }),
    theme: z.string().min(1).max(MAX_THEME_LENGTH).optional().openapi({ example: 'navy' }),
  })
  .openapi('UpdatePotRequest')

export const PotAmountSchema = z
  .object({
    amount: z
      .number()
      .positive({ message: 'validation.amount.positive' })
      .max(MAX_AMOUNT, { message: 'validation.amount.max' })
      .openapi({ example: 50.0 }),
  })
  .openapi('PotAmountRequest')
