import {
  TransactionFormContent,
  TransactionsDataTable,
  useTransactionCrud,
} from '@financial-app/features'
import { getTransactionsOptions } from '@financial-app/http-client'
import { getErrorMessage, useModal } from '@financial-app/shared'
import {
  Alert,
  Button,
  Spinner,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import type {
  ITransactionFormRef,
  TransactionFormData,
} from '@financial-app/features'

/** Fetch all transactions for client-side filtering by DataTable */
const TRANSACTIONS_LIMIT = 1000

/**
 * Transactions tab — displays the full transactions list with search, sort, and category filter.
 * Fetches all transactions from the API (high limit for client-side filtering by DataTable).
 */
export default function TransactionsScreen() {
  const { t, i18n } = useTranslation()
  const modal = useModal()
  const formRef = useRef<ITransactionFormRef>(null)

  // ── Form bridge (native imperative ref pattern) ────────────────

  /** Reads form data from the imperative ref */
  const getFormData = useCallback((): TransactionFormData | null => {
    return formRef.current?.getValues() ?? null
  }, [])

  /** Whether the form currently has validation errors */
  const hasFormErrors = useCallback(
    () => formRef.current?.hasErrors ?? false,
    []
  )

  /** Triggers full form validation to display all field errors */
  const triggerValidation = useCallback(() => {
    formRef.current?.validate()
  }, [])

  // ── Feedback modals ────────────────────────────────────────────

  /** Opens a brief confirmation modal after a successful mutation */
  const showSuccess = useCallback(
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
  const showError = useCallback(
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

  // ── Render callbacks ───────────────────────────────────────────

  /** Renders the transaction form inside the modal body */
  const renderForm = useCallback(
    (props?: { initialValues?: TransactionFormData; description?: string }) => (
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
        {...props}
      />
    ),
    [t]
  )

  /** Renders the delete modal body */
  const renderDeleteBody = useCallback(
    (description: string) => (
      <Typography variant="body" color="muted">
        {description}
      </Typography>
    ),
    []
  )

  // ── Shared CRUD hook ───────────────────────────────────────────

  const { handleAdd, handleEdit, handleDelete } = useTransactionCrud({
    modal,
    formBridge: { getFormData, hasErrors: hasFormErrors, triggerValidation },
    showSuccess,
    showError,
    renderForm,
    renderDeleteBody,
  })

  // ── Data ───────────────────────────────────────────────────────

  const txnOpts = getTransactionsOptions({
    query: { limit: TRANSACTIONS_LIMIT, sort: 'latest' },
  })
  const { data, isLoading, error } = useQuery(txnOpts)

  // ── Render ─────────────────────────────────────────────────────

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
          onPress={handleAdd}
          variant="primary"
        />
      </View>
      <View>
        <TransactionsDataTable
          data={data?.data ?? []}
          locale={i18n.language}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </View>
    </ScrollView>
  )
}
