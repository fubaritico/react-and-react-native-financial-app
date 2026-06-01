import {
  deleteTransactionsByIdMutation,
  getRecurringBillsQueryKey,
  getTransactionsOptions,
  postTransactionsMutation,
  putTransactionsByIdMutation,
} from '@financial-app/http-client'
import { toTimestamptz } from '@financial-app/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { ITransaction } from '@financial-app/shared'

import {
  createAddTransactionModalConfig,
  createDeleteTransactionModalConfig,
  createEditTransactionModalConfig,
} from '../createTransactionModalConfigs'
import { toSignedAmount } from '../TransactionFormContent/TransactionFormContent.utils'

import type { IModalHandle } from '../../shared/hooks/useFeedbackModals'
import type { TransactionFormData } from '../TransactionFormContent/TransactionFormContent'
import type { ReactNode } from 'react'

/** Fetch all transactions for client-side filtering by DataTable */
const TRANSACTIONS_LIMIT = 1000

/** Platform-specific form access — reads data from web dataset or native imperative ref */
export interface ITransactionFormAccessor {
  /** Returns form values or null if unavailable */
  getFormData: () => TransactionFormData | null
  /** Whether the form currently has validation errors */
  hasErrors: () => boolean
  /** Triggers visible validation (web: requestSubmit, native: no-op) */
  triggerValidation: () => void
}

/** Params for useTransactionCrud */
export interface IUseTransactionCrudParams {
  /** Modal controls from useModal() */
  modal: IModalHandle
  /** Platform-specific form access callbacks */
  formAccessor: ITransactionFormAccessor
  /** Called after a successful mutation with the i18n message */
  showSuccess: (message: string) => void
  /** Called after a failed mutation with the error */
  showError: (err: unknown) => void
  /** Renders the form component with platform-specific ref and labels */
  renderForm: (props?: {
    initialValues?: TransactionFormData
    description?: string
  }) => ReactNode
  /** Renders the delete modal body */
  renderDeleteBody: (description: string) => ReactNode
}

/**
 * Shared CRUD hook for transactions — mutations, submit handlers, modal config builders.
 * Platform-agnostic: receives callbacks for form access and JSX rendering.
 *
 * @param params - Modal handle, form accessor, feedback callbacks, render callbacks
 * @returns handleAdd, handleEdit, handleDelete callbacks + query options
 */
export function useTransactionCrud({
  modal,
  formAccessor,
  showSuccess,
  showError,
  renderForm,
  renderDeleteBody,
}: IUseTransactionCrudParams) {
  const { t } = useTranslation()
  const qc = useQueryClient()

  /** Query options used for invalidation — memoized so `queryKey` stays referentially stable */
  const txnOpts = useMemo(
    () =>
      getTransactionsOptions({
        query: { limit: TRANSACTIONS_LIMIT, sort: 'latest' },
      }),
    []
  )

  /** ID of the transaction currently being edited (stable ref to avoid stale closures) */
  const editingIdRef = useRef<string | null>(null)

  /** Invalidates transaction + recurring bills queries after mutation */
  const invalidate = useCallback(() => {
    void qc.invalidateQueries({ queryKey: txnOpts.queryKey })
    void qc.invalidateQueries({ queryKey: getRecurringBillsQueryKey() })
  }, [qc, txnOpts.queryKey])

  const { mutate: createTransaction } = useMutation({
    ...postTransactionsMutation(),
    onSuccess: () => {
      invalidate()
      modal.close()
      showSuccess(t('common.transactionAdded'))
    },
    onError: (err) => {
      modal.close()
      showError(err)
    },
  })

  const { mutate: updateTransaction } = useMutation({
    ...putTransactionsByIdMutation(),
    onSuccess: () => {
      invalidate()
      modal.close()
      showSuccess(t('common.transactionUpdated'))
    },
    onError: (err) => {
      modal.close()
      showError(err)
    },
  })

  const { mutate: deleteTransaction } = useMutation({
    ...deleteTransactionsByIdMutation(),
    onSuccess: () => {
      invalidate()
      modal.close()
      showSuccess(t('common.transactionDeleted'))
    },
    onError: (err) => {
      modal.close()
      showError(err)
    },
  })

  /**
   * Reads form data via the accessor, validates, parses amount, and calls create mutation.
   */
  const handleSubmit = useCallback(() => {
    if (formAccessor.hasErrors()) {
      formAccessor.triggerValidation()
      return
    }
    const values = formAccessor.getFormData()
    if (!values) return
    const amount = toSignedAmount(values.amount, values.transactionType)
    if (amount === null) return
    modal.setSubmitting(true)
    createTransaction({
      body: {
        name: values.name,
        category_id: values.category_id,
        date: toTimestamptz(values.date),
        amount,
        recurring: values.recurring,
      },
    })
  }, [formAccessor, modal, createTransaction])

  /**
   * Reads form data via the accessor, validates, parses amount, and calls update mutation.
   */
  const handleSubmitEdit = useCallback(() => {
    const transactionId = editingIdRef.current
    if (!transactionId) return
    if (formAccessor.hasErrors()) {
      formAccessor.triggerValidation()
      return
    }
    const values = formAccessor.getFormData()
    if (!values) return
    const amount = toSignedAmount(values.amount, values.transactionType)
    if (amount === null) return
    modal.setSubmitting(true)
    updateTransaction({
      path: { id: transactionId },
      body: {
        name: values.name,
        category_id: values.category_id,
        date: toTimestamptz(values.date),
        amount,
        recurring: values.recurring,
      },
    })
  }, [formAccessor, modal, updateTransaction])

  /** Opens the Add Transaction modal */
  const handleAdd = useCallback(() => {
    const config = createAddTransactionModalConfig(
      renderForm({ description: t('transactions.addModal.description') }),
      handleSubmit,
      {
        title: t('transactions.addModal.title'),
        submitLabel: t('transactions.addModal.submitLabel'),
      }
    )
    modal.open(config)
  }, [t, modal, handleSubmit, renderForm])

  /**
   * Opens the Edit Transaction modal for the given transaction.
   * @param transaction - The transaction to edit
   */
  const handleEdit = useCallback(
    (transaction: ITransaction) => {
      editingIdRef.current = transaction.id
      const config = createEditTransactionModalConfig(
        renderForm({
          initialValues: {
            name: transaction.name,
            category_id: transaction.category_id,
            date: transaction.date,
            amount: String(Math.abs(transaction.amount)),
            transactionType: transaction.amount < 0 ? 'expense' : 'income',
            recurring: transaction.recurring,
          },
          description: t('transactions.editModal.description'),
        }),
        handleSubmitEdit,
        {
          title: t('transactions.editModal.title'),
          submitLabel: t('transactions.editModal.submitLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, handleSubmitEdit, renderForm]
  )

  /**
   * Opens the Delete Transaction confirmation modal.
   * @param transaction - The transaction to delete
   */
  const handleDelete = useCallback(
    (transaction: ITransaction) => {
      const config = createDeleteTransactionModalConfig(
        transaction.name,
        renderDeleteBody(t('transactions.deleteModal.description')),
        () => {
          modal.setSubmitting(true)
          deleteTransaction({ path: { id: transaction.id } })
        },
        {
          title: (name: string) =>
            t('transactions.deleteModal.title', { name }),
          confirmLabel: t('transactions.deleteModal.confirmLabel'),
          cancelLabel: t('transactions.deleteModal.cancelLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, deleteTransaction, renderDeleteBody]
  )

  return {
    /** Opens the Add Transaction modal */
    handleAdd,
    /** Opens the Edit Transaction modal for a given transaction */
    handleEdit,
    /** Opens the Delete Transaction confirmation modal */
    handleDelete,
  }
}
