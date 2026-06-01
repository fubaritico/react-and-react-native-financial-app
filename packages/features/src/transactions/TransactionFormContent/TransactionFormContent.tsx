import type { ICategory } from '@financial-app/shared'

/**
 * Transaction direction toggled by the SegmentedControl.
 * Maps to the signed `amount` convention in the DB/API: `expense` → negative, `income` → positive.
 */
export type TransactionType = 'expense' | 'income'

/** Ref handle exposed by TransactionFormContent (native) */
export interface ITransactionFormRef {
  /** Returns the current form values */
  getValues: () => TransactionFormData
  /** Whether the form currently has validation errors */
  hasErrors: boolean
  /** Triggers full form validation — shows all field errors */
  validate: () => boolean
}

/** Form values — all strings (parsed to number on submit) */
export interface TransactionFormData {
  /** Transaction counterparty name */
  name: string
  /** Selected category UUID */
  category_id: string
  /** ISO datetime string */
  date: string
  /** Absolute amount as a string (no sign) — the sign is derived from `transactionType` on submit */
  amount: string
  /** Expense or income — drives the sign applied to `amount` when persisting */
  transactionType: TransactionType
  /** Whether the transaction recurs */
  recurring: boolean
}

/**
 * Shared props for TransactionFormContent (no ref — each platform adds its own).
 * Native adds `ref?: Ref<ITransactionFormRef>`, web adds `ref?: Ref<HTMLFormElement>`.
 */
export interface ITransactionFormContentProps {
  /** Initial form values (for edit mode) */
  initialValues?: TransactionFormData
  /** Available options from the API */
  categories: readonly ICategory[]
  /** Label for the name field */
  nameLabel: string
  /** Placeholder for the name field */
  namePlaceholder: string
  /** Label for the amount field */
  amountLabel: string
  /** Placeholder for the amount field */
  amountPlaceholder: string
  /** Heading rendered above the expense/income segmented control */
  typeLabel: string
  /** Label for the expense segment */
  expenseLabel: string
  /** Label for the income segment */
  incomeLabel: string
  /** Label for the category field */
  categoryLabel: string
  /** Label for the recurring checkbox */
  recurringLabel: string
  /** Label for the date field */
  dateLabel: string
  /** Placeholder for the date field */
  datePlaceholder: string
  /** Description text displayed above the form fields */
  description?: string
}
