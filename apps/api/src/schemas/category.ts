import { z } from '../lib/zod.js'

import { MAX_CATEGORY_LENGTH } from './constants.js'

/** Allowed token color keys for categories (from design tokens palette). */
const CATEGORY_COLORS = [
  'blue',
  'brown',
  'army-green',
  'red',
  'navy-grey',
  'navy',
  'yellow',
  'cyan',
  'magenta',
  'green',
  'purple',
  'turquoise',
  'orange',
  'gold',
  'pink',
  'grey-500',
  'grey-900',
  'grey-300',
  'grey-100',
] as const

/** Maximum characters for icon name fields. */
const MAX_ICON_LENGTH = 50

export const CategorySchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
    name: z.string().openapi({ example: 'Groceries' }),
    icon: z.string().openapi({ example: 'categoryGroceries' }),
    color: z.string().openapi({ example: 'army-green' }),
    is_system: z.boolean().openapi({ example: true }),
  })
  .openapi('Category')

export const CreateCategorySchema = z
  .object({
    name: z
      .string()
      .min(1)
      .max(MAX_CATEGORY_LENGTH)
      .openapi({ example: 'Subscriptions' }),
    icon: z
      .string()
      .min(1)
      .max(MAX_ICON_LENGTH)
      .openapi({ example: 'categoryBills' }),
    color: z.enum(CATEGORY_COLORS).openapi({ example: 'purple' }),
  })
  .openapi('CreateCategory')
