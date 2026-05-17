import {
  TransactionFormContent,
  TransactionsDataTable,
  createAddTransactionModalConfig,
  createDeleteTransactionModalConfig,
  createEditTransactionModalConfig,
} from '@financial-app/features'
import {
  deleteTransactionsByIdMutation,
  getRecurringBillsQueryKey,
  getTransactionsOptions,
  postTransactionsMutation,
  putTransactionsByIdMutation,
} from '@financial-app/http-client'
import { getErrorMessage, toTimestamptz, useModal } from '@financial-app/shared'
import { Alert, Button, Spinner, Typography } from '@financial-app/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import type { ITransactionFormRef } from '@financial-app/features'
import type { ITransaction } from '@financial-app/shared'

import tw from '../../src/lib/tw'

/** Fetch all transactions for client-side filtering by DataTable */
const TRANSACTIONS_LIMIT = 1000

/**
 * Transactions tab — displays the full transactions list with search, sort, and category filter.
 * Fetches all transactions from the API (high limit for client-side filtering by DataTable).
 */
export default function TransactionsScreen() {
  const { t, i18n } = useTranslation()

  const modal = useModal()
  const qc = useQueryClient()
  const formRef = useRef<ITransactionFormRef>(null)

  const txnOpts = getTransactionsOptions({
    query: { limit: TRANSACTIONS_LIMIT, sort: 'latest' },
  })
  const { data, isLoading, error } = useQuery(txnOpts)

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
            style={tw`text-center`}
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
            style={tw`text-center`}
          >
            {__DEV__ ? getErrorMessage(err) : t('common.somethingWentWrong')}
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
      void qc.invalidateQueries({ queryKey: getRecurringBillsQueryKey() })
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
      void qc.invalidateQueries({ queryKey: getRecurringBillsQueryKey() })
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
      void qc.invalidateQueries({ queryKey: getRecurringBillsQueryKey() })
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
      <View style={tw`flex-1 bg-beige-100`}>
        <Spinner />
      </View>
    )
  }

  if (error) {
    return (
      <View style={tw`flex-1 bg-beige-100 px-6 justify-center`}>
        <Alert
          severity="error"
          message={t('common.errorLoading')}
          description={__DEV__ ? getErrorMessage(error) : undefined}
        />
      </View>
    )
  }

  return (
    <ScrollView
      style={tw`flex-1 bg-beige-100`}
      contentContainerStyle={tw`p-4 pb-8`}
    >
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-6 mt-10`}>
        <Typography variant="page-title">{t('transactions.title')}</Typography>
        <Button
          title={t('transactions.addNewTransaction')}
          onPress={handleAddTransaction}
          variant="primary"
        />
      </View>
      <View>
        <TransactionsDataTable
          data={data?.data ?? []}
          locale={i18n.language}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </View>
    </ScrollView>
  )
}
