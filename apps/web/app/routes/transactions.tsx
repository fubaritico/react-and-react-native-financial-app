import {
  TransactionFormContent,
  TransactionsDataTable,
  createAddTransactionModalConfig,
  createDeleteTransactionModalConfig,
  createEditTransactionModalConfig,
} from '@financial-app/features'
import {
  deleteTransactionsByIdMutation,
  getTransactionsOptions,
  postTransactionsMutation,
  putTransactionsByIdMutation,
} from '@financial-app/http-client'
import { getErrorMessage, toTimestamptz, useModal } from '@financial-app/shared'
import { Alert, Button, Skeleton, Spinner, Typography } from '@financial-app/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { ITransactionFormRef } from '@financial-app/features'
import type { ITransaction } from '@financial-app/shared'

import { queryClient } from '../lib/query-client'

import type { Route } from './+types/transactions'

const txnOpts = getTransactionsOptions({
  query: { limit: 1000, sort: 'latest' },
})

export async function clientLoader() {
  return queryClient.ensureQueryData(txnOpts).catch(() => undefined)
}

export function HydrateFallback() {
  return (
    <div className="p-6 lg:p-10">
      <Skeleton variant="line" width="w-56" height="h-8" className="mb-6" />
      <Skeleton variant="rectangle" height="h-12" className="mb-4" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <Skeleton variant="circle" width="w-10" height="h-10" />
          <Skeleton variant="line" height="h-4" className="flex-1" />
          <Skeleton variant="line" width="w-20" height="h-4" />
        </div>
      ))}
    </div>
  )
}

export default function Transactions({
  loaderData: initialData,
}: Route.ComponentProps) {
  const { t, i18n } = useTranslation()
  const modal = useModal()
  const qc = useQueryClient()
  const formRef = useRef<ITransactionFormRef>(null)

  const { data, error, isLoading } = useQuery({ ...txnOpts, initialData })

  /** ID of the transaction currently being edited (stable ref to avoid stale closures) */
  const editingTransactionIdRef = useRef<string | null>(null)

  /** Opens a brief confirmation modal after a successful mutation */
  const showSuccessModal = useCallback(
    (message: string) => {
      modal.open({
        body: (
          <Typography
            variant="subsection-title"
            color="foreground"
            className="text-center"
          >
            {message}
          </Typography>
        ),
        actions: [
          {
            label: t('common.ok'),
            variant: 'primary',
            onPress: () => {
              modal.close()
            },
          },
        ],
        dismissable: false,
      })
    },
    [modal, t]
  )

  /** Opens an error modal after a failed mutation */
  const showErrorModal = useCallback(
    (err: unknown) => {
      modal.open({
        body: (
          <Typography
            variant="subsection-title"
            color="foreground"
            className="text-center"
          >
            {import.meta.env.DEV
              ? getErrorMessage(err)
              : t('common.somethingWentWrong')}
          </Typography>
        ),
        actions: [
          {
            label: t('common.ok'),
            variant: 'destroy',
            onPress: () => {
              modal.close()
            },
          },
        ],
        dismissable: false,
      })
    },
    [modal, t]
  )

  const { mutate: createTransaction } = useMutation({
    ...postTransactionsMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: txnOpts.queryKey })
      modal.close()
      showSuccessModal(t('common.transactionAdded'))
    },
    onError: (err) => {
      modal.close()
      showErrorModal(err)
    },
  })

  const { mutate: updateTransaction } = useMutation({
    ...putTransactionsByIdMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: txnOpts.queryKey })
      modal.close()
      showSuccessModal(t('common.transactionUpdated'))
    },
    onError: (err) => {
      modal.close()
      showErrorModal(err)
    },
  })

  const { mutate: deleteTransaction } = useMutation({
    ...deleteTransactionsByIdMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: txnOpts.queryKey })
      modal.close()
      showSuccessModal(t('common.transactionDeleted'))
    },
    onError: (err) => {
      modal.close()
      showErrorModal(err)
    },
  })

  const handleSubmitTransaction = useCallback(() => {
    const ref = formRef.current
    if (!ref || ref.hasErrors) return
    const values = ref.getValues()
    if (!Number.isFinite(values.amount) || values.amount === 0) return
    modal.setSubmitting(true)
    createTransaction({
      body: {
        name: values.name,
        category: values.category,
        date: toTimestamptz(values.date),
        amount: values.amount,
        recurring: values.recurring,
      },
    })
  }, [createTransaction, modal])

  const handleSubmitEditTransaction = useCallback(() => {
    const ref = formRef.current
    const transactionId = editingTransactionIdRef.current
    if (!ref || ref.hasErrors || !transactionId) return
    const values = ref.getValues()
    if (!Number.isFinite(values.amount) || values.amount === 0) return
    modal.setSubmitting(true)
    updateTransaction({
      path: { id: transactionId },
      body: {
        name: values.name,
        category: values.category,
        date: toTimestamptz(values.date),
        amount: values.amount,
        recurring: values.recurring,
      },
    })
  }, [updateTransaction, modal])

  const handleAddTransaction = useCallback(() => {
    const config = createAddTransactionModalConfig(
      <TransactionFormContent
        ref={formRef}
        nameLabel={t('transactions.form.nameLabel')}
        namePlaceholder={t('transactions.form.namePlaceholder')}
        amountLabel={t('transactions.form.amountLabel')}
        amountPlaceholder={t('transactions.form.amountPlaceholder')}
        categoryLabel={t('transactions.form.categoryLabel')}
        dateLabel={t('transactions.form.dateLabel')}
        datePlaceholder={t('datePicker.placeholder')}
        recurringLabel={t('transactions.form.recurringLabel')}
        description={t('transactions.addModal.description')}
      />,
      handleSubmitTransaction,
      {
        title: t('transactions.addModal.title'),
        submitLabel: t('transactions.addModal.submitLabel'),
      }
    )
    modal.open(config)
  }, [t, modal, handleSubmitTransaction])

  /** Opens the Edit Transaction modal for the given transaction */
  const handleEditTransaction = useCallback(
    (transaction: ITransaction) => {
      editingTransactionIdRef.current = transaction.id
      const config = createEditTransactionModalConfig(
        <TransactionFormContent
          ref={formRef}
          initialValues={{
            name: transaction.name,
            category: transaction.category,
            date: transaction.date,
            amount: transaction.amount,
            recurring: transaction.recurring,
          }}
          nameLabel={t('transactions.form.nameLabel')}
          namePlaceholder={t('transactions.form.namePlaceholder')}
          amountLabel={t('transactions.form.amountLabel')}
          amountPlaceholder={t('transactions.form.amountPlaceholder')}
          categoryLabel={t('transactions.form.categoryLabel')}
          dateLabel={t('transactions.form.dateLabel')}
          datePlaceholder={t('datePicker.placeholder')}
          recurringLabel={t('transactions.form.recurringLabel')}
          description={t('transactions.editModal.description')}
        />,
        handleSubmitEditTransaction,
        {
          title: t('transactions.editModal.title'),
          submitLabel: t('transactions.editModal.submitLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, handleSubmitEditTransaction]
  )

  /** Opens the Delete Transaction confirmation modal */
  const handleDeleteTransaction = useCallback(
    (transaction: ITransaction) => {
      const config = createDeleteTransactionModalConfig(
        transaction.name,
        <Typography variant="body" color="muted">
          {t('transactions.deleteModal.description')}
        </Typography>,
        () => {
          modal.setSubmitting(true)
          deleteTransaction({ path: { id: transaction.id } })
        },
        {
          title: (name) => t('transactions.deleteModal.title', { name }),
          confirmLabel: t('transactions.deleteModal.confirmLabel'),
          cancelLabel: t('transactions.deleteModal.cancelLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, deleteTransaction]
  )

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 lg:p-10">
        <Typography variant="page-title" as="h1" className="mb-4">
          {t('transactions.title')}
        </Typography>
        <Alert
          severity="error"
          message={t('common.errorLoading')}
          description={import.meta.env.DEV ? getErrorMessage(error) : undefined}
        />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-center justify-between">
        <Typography variant="page-title" as="h1">
          {t('transactions.title')}
        </Typography>
        <Button
          title={t('transactions.addNewTransaction')}
          onPress={handleAddTransaction}
          size="lg"
          variant="primary"
        />
      </div>
      <TransactionsDataTable
        data={data?.data ?? []}
        locale={i18n.language}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  )
}
