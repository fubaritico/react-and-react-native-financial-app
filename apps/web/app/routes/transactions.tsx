import {
  TransactionFormContent,
  TransactionsDataTable,
  useTransactionCrud,
} from '@financial-app/features'
import { getTransactionsOptions } from '@financial-app/http-client'
import { getErrorMessage, useModal } from '@financial-app/shared'
import { Alert, Button, Skeleton, Spinner, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { TransactionFormData } from '@financial-app/features'

import { queryClient } from '../lib/query-client'

import type { Route } from './+types/transactions'

/** @returns Pre-fetched transaction data for instant display */
export async function clientLoader() {
  const txnOpts = getTransactionsOptions({
    query: { limit: 1000, sort: 'latest' },
  })
  return queryClient.ensureQueryData(txnOpts).catch(() => undefined)
}

/** Skeleton placeholder while the client loader resolves */
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

export default function TransactionsScreen({
  loaderData: initialData,
}: Route.ComponentProps) {
  const { t, i18n } = useTranslation()
  const modal = useModal()
  const formRef = useRef<HTMLFormElement>(null)

  // ── Form bridge (web dataset pattern) ──────────────────────────

  /** Reads form data from the DOM dataset */
  const getFormData = useCallback((): TransactionFormData | null => {
    const ref = formRef.current
    if (!ref?.dataset.formData) return null
    const data = structuredClone(
      JSON.parse(ref.dataset.formData) as TransactionFormData
    )
    delete ref.dataset.formData
    return data
  }, [])

  /** Whether the form currently has validation errors */
  const hasFormErrors = useCallback(
    () => formRef.current?.dataset.error === 'true',
    []
  )

  /** Triggers browser validation display */
  const triggerValidation = useCallback(
    () => formRef.current?.requestSubmit(),
    []
  )

  // ── Feedback modals ────────────────────────────────────────────

  /** Opens a brief confirmation modal after a successful mutation */
  const showSuccess = useCallback(
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
  const showError = useCallback(
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

  // Query options created locally for proper generic inference with initialData
  const txnOpts = getTransactionsOptions({
    query: { limit: 1000, sort: 'latest' },
  })
  const { data, error, isLoading } = useQuery({ ...txnOpts, initialData })

  // ── Render ─────────────────────────────────────────────────────

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
          onPress={handleAdd}
          size="lg"
          variant="primary"
        />
      </div>
      <TransactionsDataTable
        data={data?.data ?? []}
        locale={i18n.language}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
