import type { Ref } from 'react'

/** Form values returned by TransactionFormContent */
export interface ITransactionFormValues {
  /** Transaction counterparty name */
  name: string
  /** Transaction category */
  category: string
  /** ISO datetime string */
  date: string
  /** Amount — negative = expense, positive = income */
  amount: number
  /** Whether the transaction recurs */
  recurring: boolean
}

/** Ref handle exposed by TransactionFormContent */
export interface ITransactionFormRef {
  /** Returns the current form values */
  getValues: () => ITransactionFormValues
  /** Whether the form currently has validation errors */
  hasErrors: boolean
}

/** Props for the TransactionFormContent component */
export interface ITransactionFormContentProps {
  /** Initial form values (for edit mode) */
  initialValues?: Partial<ITransactionFormValues>
  /** Ref to access form values from the parent */
  ref?: Ref<ITransactionFormRef>
  /** Label for the name field */
  nameLabel?: string
  /** Placeholder for the name field */
  namePlaceholder?: string
  /** Label for the amount field */
  amountLabel?: string
  /** Placeholder for the amount field */
  amountPlaceholder?: string
  /** Label for the category field */
  categoryLabel?: string
  /** Description text displayed above the form fields */
  description?: string
}
