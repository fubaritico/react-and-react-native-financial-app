import type { IModalConfig } from '@financial-app/shared'

import type { ReactNode } from 'react'

/** Labels for the Add Pot modal (i18n — pass translated strings) */
export interface IAddPotModalLabels {
  /** Modal title, e.g. "Add New Pot" */
  title: string
  /** Primary action button label, e.g. "Add Pot" */
  submitLabel: string
}

/** Labels for the Edit Pot modal (i18n — pass translated strings) */
export interface IEditPotModalLabels {
  /** Modal title, e.g. "Edit Pot" */
  title: string
  /** Primary action button label, e.g. "Save Changes" */
  submitLabel: string
}

/** Labels for the Delete Pot modal (i18n — pass translated strings) */
export interface IDeletePotModalLabels {
  /** Title builder — receives pot name, e.g. "Delete 'Savings'?" */
  title: (potName: string) => string
  /** Destructive action button label, e.g. "Yes, Confirm Deletion" */
  confirmLabel: string
  /** Cancel button label, e.g. "No, Go Back" */
  cancelLabel: string
}

/** Creates an IModalConfig for the Add Pot modal */
export function createAddPotModalConfig(
  body: ReactNode,
  onSubmit: () => void,
  labels: IAddPotModalLabels
): IModalConfig {
  return {
    title: labels.title,
    body,
    actions: [
      { label: labels.submitLabel, variant: 'primary', onPress: onSubmit },
    ],
  }
}

/** Creates an IModalConfig for the Edit Pot modal */
export function createEditPotModalConfig(
  body: ReactNode,
  onSubmit: () => void,
  labels: IEditPotModalLabels
): IModalConfig {
  return {
    title: labels.title,
    body,
    actions: [
      { label: labels.submitLabel, variant: 'primary', onPress: onSubmit },
    ],
  }
}

/** Creates an IModalConfig for the Delete Pot modal */
export function createDeletePotModalConfig(
  potName: string,
  body: ReactNode,
  onConfirm: () => void,
  labels: IDeletePotModalLabels
): IModalConfig {
  return {
    title: labels.title(potName),
    body,
    actions: [
      { label: labels.confirmLabel, variant: 'destroy', onPress: onConfirm },
    ],
    cancelLabel: labels.cancelLabel,
  }
}
