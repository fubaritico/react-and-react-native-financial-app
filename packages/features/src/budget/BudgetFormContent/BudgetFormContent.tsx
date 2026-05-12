import type { Ref } from 'react'

/** Form values for budget create/edit */
export interface IBudgetFormValues {
  /** Selected category */
  category: string
  /** Maximum spend amount as string (TextInput value) */
  maximum: string
  /** Selected theme color token name */
  theme: string
}

/** Ref handle exposed by BudgetFormContent */
export interface IBudgetFormRef {
  /** Returns the current form values */
  getValues: () => IBudgetFormValues
}

/** Props for the BudgetFormContent component */
export interface IBudgetFormContentProps {
  /** Initial form values (for edit mode) */
  initialValues?: Partial<IBudgetFormValues>
  /** Categories already used by existing budgets (filtered out in Add mode) */
  existingCategories?: readonly string[]
  /** Theme colors already used by existing budgets (shown as "already used") */
  existingThemes?: readonly string[]
  /** Ref to access form values from the parent */
  ref?: Ref<IBudgetFormRef>
  /** Label for the category field */
  categoryLabel?: string
  /** Label for the maximum spend field */
  maximumLabel?: string
  /** Label for the theme field */
  themeLabel?: string
  /** Placeholder for the maximum spend field */
  maximumPlaceholder?: string
}
