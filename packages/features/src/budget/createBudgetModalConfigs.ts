import type { IModalConfig } from '@financial-app/shared'

import type { ReactNode } from 'react'

/** Labels for the Add Budget modal (i18n — pass translated strings) */
export interface IAddBudgetModalLabels {
  /** Modal title, e.g. "Add New Budget" */
  title: string
  /** Descriptive text below the title */
  description: string
  /** Primary action button label, e.g. "Add Budget" */
  submitLabel: string
}

/** Labels for the Edit Budget modal (i18n — pass translated strings) */
export interface IEditBudgetModalLabels {
  /** Modal title, e.g. "Edit Budget" */
  title: string
  /** Descriptive text below the title */
  description: string
  /** Primary action button label, e.g. "Save Changes" */
  submitLabel: string
}

/** Labels for the Delete Budget modal (i18n — pass translated strings) */
export interface IDeleteBudgetModalLabels {
  /** Title builder — receives category name, e.g. "Delete 'Entertainment'?" */
  title: (categoryName: string) => string
  /** Warning text explaining the destructive action */
  description: string
  /** Destructive action button label, e.g. "Yes, Confirm Deletion" */
  confirmLabel: string
  /** Cancel button label, e.g. "No, Go Back" */
  cancelLabel: string
}

/** Creates an IModalConfig for the Add Budget modal */
export function createAddBudgetModalConfig(
  body: ReactNode,
  onSubmit: () => void,
  labels: IAddBudgetModalLabels
): IModalConfig {
  return {
    title: labels.title,
    description: labels.description,
    body,
    actions: [
      { label: labels.submitLabel, variant: 'primary', onPress: onSubmit },
    ],
  }
}

/** Creates an IModalConfig for the Edit Budget modal */
export function createEditBudgetModalConfig(
  body: ReactNode,
  onSubmit: () => void,
  labels: IEditBudgetModalLabels
): IModalConfig {
  return {
    title: labels.title,
    description: labels.description,
    body,
    actions: [
      { label: labels.submitLabel, variant: 'primary', onPress: onSubmit },
    ],
  }
}

/** Creates an IModalConfig for the Delete Budget modal */
export function createDeleteBudgetModalConfig(
  categoryName: string,
  onConfirm: () => void,
  labels: IDeleteBudgetModalLabels
): IModalConfig {
  return {
    title: labels.title(categoryName),
    description: labels.description,
    actions: [
      { label: labels.confirmLabel, variant: 'destroy', onPress: onConfirm },
    ],
    cancelLabel: labels.cancelLabel,
  }
}
