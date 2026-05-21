import { z } from 'zod'

import type { IDropdownOption } from '@financial-app/ui'

import { getTodayISO } from './TransactionFormContent.utils'

/**
 * Creates a Zod schema for transaction form validation with i18n messages.
 * @param t - Translation function
 * @returns Zod schema for TransactionFormData
 */
export const createTransactionFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    category: z.string().min(1, t('validation.categoryRequired')),
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

/** All available transaction categories */
export const TRANSACTION_CATEGORIES: IDropdownOption[] = [
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

/** Default form values for the Add Transaction form */
export const DEFAULT_TRANSACTION_FORM = {
  name: '',
  category: TRANSACTION_CATEGORIES[0].value,
  amount: '',
  date: getTodayISO(),
  recurring: false,
} as const
