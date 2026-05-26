import type { ICategory } from '@financial-app/shared'

/** Form values for budget — all strings (parsed to number on submit) */
export interface BudgetFormValues {
  /** Selected category UUID */
  category_id: string
  /** Maximum spend amount as string — parsed to number on submit */
  maximum: string
}

/** Ref handle exposed by BudgetFormContent (native) */
export interface IBudgetFormRef {
  /** Returns the current form values */
  getValues: () => BudgetFormValues
  /** Whether the form currently has validation errors */
  hasErrors: boolean
  /** Triggers full form validation — shows all field errors */
  validate: () => boolean
}

/**
 * Shared props for BudgetFormContent (no ref — each platform adds its own).
 * Native adds `ref?: Ref<IBudgetFormRef>`, web adds `ref?: Ref<HTMLFormElement>`.
 */
export interface IBudgetFormContentProps {
  /** Initial form values (for edit mode) */
  initialValues?: BudgetFormValues
  /** Available options from the API */
  categories: readonly ICategory[]
  /** Category IDs already used by existing budgets (disabled in Add mode) */
  existingCategoryIds?: readonly string[]
  /** Label for the category field */
  categoryLabel: string
  /** Label for the maximum spend field */
  maximumLabel: string
  /** Placeholder for the maximum spend field */
  maximumPlaceholder: string
  /** Description text displayed above the form fields */
  description?: string
}
