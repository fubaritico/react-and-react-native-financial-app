import type { Ref } from 'react'

/** Ref handle exposed by PotAmountFormContent */
export interface IPotAmountFormRef {
  /** Returns the entered amount as a number (0 if invalid) */
  getAmount: () => number
}

/** Props for the PotAmountFormContent component */
export interface IPotAmountFormContentProps {
  /** Current total saved in the pot */
  currentTotal: number
  /** Target savings amount for the pot */
  target: number
  /** Mode determines buffer color and new amount calculation */
  mode: 'add' | 'withdraw'
  /** Ref to access the entered amount from the parent */
  ref?: Ref<IPotAmountFormRef>
  /** Label for the "New Amount" row (e.g. "New Amount") */
  newAmountLabel?: string
  /** Label prefix for the target line (e.g. "Target of") */
  targetOfLabel?: string
  /** Label for the amount input (e.g. "Amount to Add") */
  amountLabel?: string
  /** Placeholder for the amount input */
  amountPlaceholder?: string
  /** Locale for currency formatting (e.g. "en-US") */
  locale?: string
  /** Currency code for formatting (e.g. "USD") */
  currency?: string
}
