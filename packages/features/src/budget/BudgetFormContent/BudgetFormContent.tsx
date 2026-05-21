/** Form values for budget — all strings (parsed to number on submit) */
export interface BudgetFormValues {
  /** Selected category */
  category: string
  /** Maximum spend amount as string — parsed to number on submit */
  maximum: string
  /** Selected theme color token name */
  theme: string
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
  /** Categories already used by existing budgets (filtered out in Add mode) */
  existingCategories?: readonly string[]
  /** Theme colors already used by existing budgets (shown as "already used") */
  existingThemes?: readonly string[]
  /** Label for the category field */
  categoryLabel: string
  /** Label for the maximum spend field */
  maximumLabel: string
  /** Label for the theme field */
  themeLabel: string
  /** Placeholder for the maximum spend field */
  maximumPlaceholder: string
  /** Label for already-used themes (default: "Already used") */
  alreadyUsedLabel: string
  /** Description text displayed above the form fields */
  description?: string
}
