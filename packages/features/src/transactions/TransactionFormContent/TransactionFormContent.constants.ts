import { z } from 'zod'

import { getTodayISO } from './TransactionFormContent.utils'

import type { TransactionFormData } from './TransactionFormContent'

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
        (v) => v !== '.' && !Number.isNaN(Number(v)),
        t('validation.amountInvalid')
      )
      .refine((v) => Number(v) !== 0, t('validation.amountZero')),
    transactionType: z.enum(['expense', 'income']),
    date: z.string().min(1, t('validation.dateRequired')),
    recurring: z.boolean(),
  })

/**
 * Builds the default values for the Add Transaction form.
 * A factory (not a module-level constant) so `date` is resolved when the form opens,
 * never frozen at module-load time (which would go stale past midnight).
 * @returns Fresh default TransactionFormData with today's date
 */
export function createDefaultTransactionForm(): TransactionFormData {
  return {
    name: '',
    category_id: '',
    amount: '',
    transactionType: 'expense',
    date: getTodayISO(),
    recurring: false,
  }
}
