import { z } from '../lib/zod.js'

import { MAX_AMOUNT } from './constants.js'

export const UserPreferencesSchema = z
  .object({
    user_id: z
      .string()
      .uuid()
      .openapi({ example: 'd8e4f26e-dc4f-41a7-8e66-1b1805a00b41' }),
    mode: z.union([z.literal('manual'), z.literal('bank'), z.null()]).openapi({
      type: ['string', 'null'],
      enum: ['manual', 'bank', null],
      example: 'manual',
    }),
    has_seen_onboarding: z.boolean().openapi({ example: false }),
    initial_balance_set: z.boolean().openapi({ example: false }),
    created_at: z.string().openapi({ example: '2026-05-17T10:00:00.000Z' }),
    updated_at: z.string().openapi({ example: '2026-05-17T10:00:00.000Z' }),
  })
  .openapi('UserPreferences')

export const UpdateUserPreferencesSchema = z
  .object({
    mode: z
      .union([z.literal('manual'), z.literal('bank'), z.null()])
      .optional()
      .openapi({
        type: ['string', 'null'],
        enum: ['manual', 'bank', null],
        example: 'manual',
      }),

    has_seen_onboarding: z.boolean().optional().openapi({ example: true }),
  })
  .openapi('UpdateUserPreferences')

export const InitialBalanceSchema = z
  .object({
    amount: z
      .number()
      .min(0, { message: 'validation.amount.minZero' })
      .max(MAX_AMOUNT, { message: 'validation.amount.max' })
      .openapi({ example: 1500.0, description: 'Starting balance amount' }),
  })
  .openapi('InitialBalance')

export const SetInitialBalanceResponseSchema = z
  .object({
    reference: z.number().openapi({ example: 1500.0 }),
    initial_balance_set: z.boolean().openapi({ example: true }),
  })
  .openapi('SetInitialBalanceResponse')
