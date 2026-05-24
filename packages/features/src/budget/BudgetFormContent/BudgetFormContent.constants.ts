import { z } from 'zod'

/**
 * Creates a Zod schema for budget form validation with i18n messages.
 * @param t - Translation function
 * @returns Zod schema for BudgetFormValues
 */
export const createBudgetFormSchema = (t: (key: string) => string) =>
  z.object({
    category_id: z.string().min(1, t('validation.categoryRequired')),
    maximum: z
      .string()
      .min(1, t('validation.maximumRequired'))
      .refine(
        (v) =>
          v.length === 0 ||
          (v !== '.' && !Number.isNaN(Number(v)) && Number(v) > 0),
        t('validation.maximumInvalid')
      ),
  })

/** Default form values for the Add Budget form */
export const DEFAULT_BUDGET_FORM = {
  category_id: '',
  maximum: '',
} as const
