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
  /** Transaction category */
  category: string
  /** ISO datetime string */
  date: string
  /** Amount as string — parsed to number on submit */
  amount: string
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
  /** Label for the name field */
  nameLabel: string
  /** Placeholder for the name field */
  namePlaceholder: string
  /** Label for the amount field */
  amountLabel: string
  /** Placeholder for the amount field */
  amountPlaceholder: string
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
