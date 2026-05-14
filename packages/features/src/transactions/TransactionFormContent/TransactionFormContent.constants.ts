import { z } from 'zod'

import type { IDropdownOption } from '@financial-app/ui'

/** Zod schema for transaction form validation */
export const transactionFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  amount: z.string().min(1, 'Amount is required'),
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
} as const
