import { z } from 'zod'

import type { IDropdownOption } from '@financial-app/ui'

/** All available budget categories */
export const BUDGET_CATEGORIES: IDropdownOption[] = [
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Bills', label: 'Bills' },
  { value: 'Groceries', label: 'Groceries' },
  { value: 'Dining Out', label: 'Dining Out' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Personal Care', label: 'Personal Care' },
  { value: 'Education', label: 'Education' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'General', label: 'General' },
]

/** All available theme colors (token names matching design system) */
export const THEME_COLORS: IDropdownOption[] = [
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'navy', label: 'Navy' },
  { value: 'red', label: 'Red' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'turquoise', label: 'Turquoise' },
  { value: 'brown', label: 'Brown' },
  { value: 'magenta', label: 'Magenta' },
  { value: 'blue', label: 'Blue' },
  { value: 'navy-grey', label: 'Navy Grey' },
  { value: 'army-green', label: 'Army Green' },
  { value: 'gold', label: 'Gold' },
  { value: 'orange', label: 'Orange' },
]

/**
 * Creates a Zod schema for budget form validation with i18n messages.
 * @param t - Translation function
 * @returns Zod schema for BudgetFormValues
 */
export const createBudgetFormSchema = (t: (key: string) => string) =>
  z.object({
    category: z.string().min(1, t('validation.categoryRequired')),
    maximum: z
      .string()
      .min(1, t('validation.maximumRequired'))
      .refine(
        (v) =>
          v.length === 0 ||
          (v !== '.' && !Number.isNaN(Number(v)) && Number(v) > 0),
        t('validation.maximumInvalid')
      ),
    theme: z.string().min(1, t('validation.themeRequired')),
  })

/** Default form values for the Add Budget form */
export const DEFAULT_BUDGET_FORM = {
  category: BUDGET_CATEGORIES[0].value,
  maximum: '',
  theme: THEME_COLORS[0].value,
} as const
