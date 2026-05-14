import type { IModalConfig } from '@financial-app/shared'

import type { ReactNode } from 'react'

/** Labels for the Add Transaction modal (i18n — pass translated strings) */
export interface IAddTransactionModalLabels {
  /** Modal title, e.g. "Add New Transaction" */
  title: string
  /** Primary action button label, e.g. "Add Transaction" */
  submitLabel: string
}

/** Labels for the Edit Transaction modal (i18n — pass translated strings) */
export interface IEditTransactionModalLabels {
  /** Modal title, e.g. "Edit Transaction" */
  title: string
  /** Primary action button label, e.g. "Save Changes" */
  submitLabel: string
}

/** Labels for the Delete Transaction modal (i18n — pass translated strings) */
export interface IDeleteTransactionModalLabels {
  /** Title builder — receives transaction name, e.g. "Delete 'Urban Sports Club'?" */
  title: (name: string) => string
  /** Destructive action button label, e.g. "Yes, Confirm Deletion" */
  confirmLabel: string
  /** Cancel button label, e.g. "No, Go Back" */
  cancelLabel: string
}

/** Creates an IModalConfig for the Add Transaction modal */
export function createAddTransactionModalConfig(
  body: ReactNode,
  onSubmit: () => void,
  labels: IAddTransactionModalLabels
): IModalConfig {
  return {
    title: labels.title,
    body,
    actions: [
      { label: labels.submitLabel, variant: 'primary', onPress: onSubmit },
    ],
  }
}

/** Creates an IModalConfig for the Edit Transaction modal */
export function createEditTransactionModalConfig(
  body: ReactNode,
  onSubmit: () => void,
  labels: IEditTransactionModalLabels
): IModalConfig {
  return {
    title: labels.title,
    body,
    actions: [
      { label: labels.submitLabel, variant: 'primary', onPress: onSubmit },
    ],
  }
}

/** Creates an IModalConfig for the Delete Transaction modal */
export function createDeleteTransactionModalConfig(
  transactionName: string,
  body: ReactNode,
  onConfirm: () => void,
  labels: IDeleteTransactionModalLabels
): IModalConfig {
  return {
    title: labels.title(transactionName),
    body,
    actions: [
      { label: labels.confirmLabel, variant: 'destroy', onPress: onConfirm },
    ],
    cancelLabel: labels.cancelLabel,
  }
}
