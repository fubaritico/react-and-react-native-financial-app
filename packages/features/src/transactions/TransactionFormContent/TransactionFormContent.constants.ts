import { z } from 'zod'

import { getTodayISO } from './TransactionFormContent.utils'

/**
 * Creates a Zod schema for transaction form validation with i18n messages.
 * @param t - Translation function
 * @returns Zod schema for TransactionFormData
 */
export const createTransactionFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    category_id: z.string().min(1, t('validation.categoryRequired')),
    amount: z
      .string()
      .min(1, t('validation.amountRequired'))
      .refine(
        (v) =>
          v.length === 0 ||
          (v !== '-' && v !== '.' && !Number.isNaN(Number(v))),
        t('validation.amountInvalid')
      ),
    date: z.string().min(1, t('validation.dateRequired')),
    recurring: z.boolean(),
  })

/** Default form values for the Add Transaction form */
export const DEFAULT_TRANSACTION_FORM = {
  name: '',
  category_id: '',
  amount: '',
  date: getTodayISO(),
  recurring: false,
} as const
