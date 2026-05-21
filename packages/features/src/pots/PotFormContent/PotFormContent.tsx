/** Form values for pot create/edit — all strings (parsed to number on submit) */
export interface PotFormValues {
  /** User-defined pot name */
  name: string
  /** Target savings amount as string — parsed to number on submit */
  target: string
  /** Selected theme color token name */
  theme: string
}

/** Ref handle exposed by PotFormContent (native) */
export interface IPotFormRef {
  /** Returns the current form values */
  getValues: () => PotFormValues
  /** Whether the form currently has validation errors */
  hasErrors: boolean
  /** Triggers full form validation — shows all field errors */
  validate: () => boolean
}

/**
 * Shared props for PotFormContent (no ref — each platform adds its own).
 * Native adds `ref?: Ref<IPotFormRef>`, web adds `ref?: Ref<HTMLFormElement>`.
 */
export interface IPotFormContentProps {
  /** Initial form values (for edit mode) */
  initialValues?: PotFormValues
  /** Label for the pot name field */
  nameLabel: string
  /** Placeholder for the pot name field */
  namePlaceholder: string
  /** Label for the target field */
  targetLabel: string
  /** Placeholder for the target field */
  targetPlaceholder: string
  /** Label for the theme field */
  themeLabel: string
  /** Template for the characters-left counter (receives count) */
  charactersLeftLabel: (count: number) => string
  /** Label shown on disabled theme options (already assigned to another pot/budget) */
  alreadyUsedLabel: string
  /** Description text displayed above the form fields */
  description?: string
}
