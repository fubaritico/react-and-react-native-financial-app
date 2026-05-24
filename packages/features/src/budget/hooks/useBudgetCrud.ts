import {
  deleteBudgetsByIdMutation,
  getBudgetsOptions,
  postBudgetsMutation,
  putBudgetsByIdMutation,
} from '@financial-app/http-client'
import { getCurrentBudgetMonth } from '@financial-app/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { IBudgetCategoryCard } from '@financial-app/shared'

import {
  createAddBudgetModalConfig,
  createDeleteBudgetModalConfig,
  createEditBudgetModalConfig,
} from '../createBudgetModalConfigs'

import type { IModalHandle } from '../../shared/hooks/useFeedbackModals'
import type { BudgetFormValues } from '../BudgetFormContent/BudgetFormContent'
import type { ReactNode } from 'react'

/** Platform-specific form access — reads data from web dataset or native imperative ref */
export interface IBudgetFormBridge {
  /** Returns form values or null if unavailable */
  getFormData: () => BudgetFormValues | null
  /** Whether the form currently has validation errors */
  hasErrors: () => boolean
  /** Triggers visible validation (web: requestSubmit, native: no-op) */
  triggerValidation: () => void
}

/** Params for useBudgetCrud */
export interface IUseBudgetCrudParams {
  /** Modal controls from useModal() */
  modal: IModalHandle
  /** Platform-specific form access callbacks */
  formBridge: IBudgetFormBridge
  /** Called after a successful mutation with the i18n message */
  showSuccess: (message: string) => void
  /** Called after a failed mutation with the error */
  showError: (err: unknown) => void
  /** Renders the form component with platform-specific ref and labels */
  renderForm: (props?: {
    initialValues?: BudgetFormValues
    description?: string
  }) => ReactNode
  /** Renders the delete modal body */
  renderDeleteBody: (description: string) => ReactNode
}

/**
 * Shared CRUD hook for budgets — mutations, submit handlers, modal config builders.
 * Platform-agnostic: receives callbacks for form access and JSX rendering.
 *
 * @param params - Modal handle, form bridge, feedback callbacks, render callbacks
 * @returns handleAdd, handleEdit, handleDelete callbacks
 */
export function useBudgetCrud({
  modal,
  formBridge,
  showSuccess,
  showError,
  renderForm,
  renderDeleteBody,
}: IUseBudgetCrudParams) {
  const { t } = useTranslation()
  const qc = useQueryClient()

  /** Query options used for invalidation */
  const budgetsOpts = getBudgetsOptions({
    query: { month: getCurrentBudgetMonth() },
  })

  /** ID of the budget currently being edited (stable ref to avoid stale closures) */
  const editingIdRef = useRef<string | null>(null)

  /** Invalidates budget queries after mutation */
  const invalidate = useCallback(() => {
    void qc.invalidateQueries({ queryKey: budgetsOpts.queryKey })
  }, [qc, budgetsOpts.queryKey])

  const { mutate: createBudget } = useMutation({
    ...postBudgetsMutation(),
    onSuccess: () => {
      invalidate()
      modal.close()
      showSuccess(t('common.budgetAdded'))
    },
    onError: (err) => {
      modal.close()
      showError(err)
    },
  })

  const { mutate: updateBudget } = useMutation({
    ...putBudgetsByIdMutation(),
    onSuccess: () => {
      invalidate()
      modal.close()
      showSuccess(t('common.budgetUpdated'))
    },
    onError: (err) => {
      modal.close()
      showError(err)
    },
  })

  const { mutate: deleteBudget } = useMutation({
    ...deleteBudgetsByIdMutation(),
    onSuccess: () => {
      invalidate()
      modal.close()
      showSuccess(t('common.budgetDeleted'))
    },
    onError: (err) => {
      modal.close()
      showError(err)
    },
  })

  /**
   * Reads form data via the bridge, validates, parses maximum, and calls create mutation.
   */
  const handleSubmit = useCallback(() => {
    if (formBridge.hasErrors()) {
      formBridge.triggerValidation()
      return
    }
    const values = formBridge.getFormData()
    if (!values) return
    const maximum = Number(values.maximum)
    if (!Number.isFinite(maximum) || maximum <= 0) return
    modal.setSubmitting(true)
    createBudget({
      body: {
        category_id: values.category_id,
        maximum,
        month: getCurrentBudgetMonth(),
      },
    })
  }, [formBridge, modal, createBudget])

  /**
   * Reads form data via the bridge, validates, parses maximum, and calls update mutation.
   */
  const handleSubmitEdit = useCallback(() => {
    const budgetId = editingIdRef.current
    if (!budgetId) return
    if (formBridge.hasErrors()) {
      formBridge.triggerValidation()
      return
    }
    const values = formBridge.getFormData()
    if (!values) return
    const maximum = Number(values.maximum)
    if (!Number.isFinite(maximum) || maximum <= 0) return
    modal.setSubmitting(true)
    updateBudget({
      path: { id: budgetId },
      body: {
        category_id: values.category_id,
        maximum,
      },
    })
  }, [formBridge, modal, updateBudget])

  /** Opens the Add Budget modal */
  const handleAdd = useCallback(() => {
    const config = createAddBudgetModalConfig(
      renderForm({ description: t('budgets.addModal.description') }),
      handleSubmit,
      {
        title: t('budgets.addModal.title'),
        submitLabel: t('budgets.addModal.submitLabel'),
      }
    )
    modal.open(config)
  }, [t, modal, handleSubmit, renderForm])

  /**
   * Opens the Edit Budget modal for the given card.
   * @param card - The budget category card to edit
   */
  const handleEdit = useCallback(
    (card: IBudgetCategoryCard) => {
      editingIdRef.current = card.id
      const config = createEditBudgetModalConfig(
        renderForm({
          initialValues: {
            category_id: card.category_id,
            maximum: String(card.maximum),
          },
          description: t('budgets.editModal.description'),
        }),
        handleSubmitEdit,
        {
          title: t('budgets.editModal.title'),
          submitLabel: t('budgets.editModal.submitLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, handleSubmitEdit, renderForm]
  )

  /**
   * Opens the Delete Budget confirmation modal.
   * @param card - The budget category card to delete
   */
  const handleDelete = useCallback(
    (card: IBudgetCategoryCard) => {
      const config = createDeleteBudgetModalConfig(
        card.category,
        renderDeleteBody(t('budgets.deleteModal.description')),
        () => {
          modal.setSubmitting(true)
          deleteBudget({ path: { id: card.id } })
        },
        {
          title: (name: string) => t('budgets.deleteModal.title', { name }),
          confirmLabel: t('budgets.deleteModal.confirmLabel'),
          cancelLabel: t('budgets.deleteModal.cancelLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, deleteBudget, renderDeleteBody]
  )

  return {
    /** Opens the Add Budget modal */
    handleAdd,
    /** Opens the Edit Budget modal for a given card */
    handleEdit,
    /** Opens the Delete Budget confirmation modal */
    handleDelete,
  }
}
