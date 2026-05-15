import type { Ref } from 'react'

/** Form values for pot create/edit */
export interface IPotFormValues {
  /** User-defined pot name */
  name: string
  /** Target savings amount as string (TextInput value) */
  target: string
  /** Selected theme color token name */
  theme: string
}

/** Ref handle exposed by PotFormContent */
export interface IPotFormRef {
  /** Returns the current form values */
  getValues: () => IPotFormValues
}

/** Props for the PotFormContent component */
export interface IPotFormContentProps {
  /** Initial form values (for edit mode) */
  initialValues?: Partial<IPotFormValues>
  /** Ref to access form values from the parent */
  ref?: Ref<IPotFormRef>
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
  /** Template for the characters-left counter (receives {{count}}) */
  charactersLeftLabel: (count: number) => string
  /** Label shown on disabled theme options (already assigned to another pot/budget) */
  alreadyUsedLabel: string
  /** Description text displayed above the form fields */
  description?: string
}
