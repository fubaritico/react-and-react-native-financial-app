import {
  TransactionFormContent,
  TransactionsDataTable,
  useDeleteBodyRenderer,
  useFeedbackModals,
  useTransactionCrud,
} from '@financial-app/features'
import {
  getCategoriesOptions,
  getTransactionsOptions,
} from '@financial-app/http-client'
import { getErrorMessage, useModal } from '@financial-app/shared'
import { Alert, Button, Spinner, Typography } from '@financial-app/ui'
import { HydrationBoundary, dehydrate, useQuery } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { TransactionFormData } from '@financial-app/features'
import type { ICategory, ITransaction } from '@financial-app/shared'

import { createServerQueryClient } from '../lib/query-client.server'
import { skipServerHop } from '../lib/skip-server-hop'
import { balanceQuery } from '../queries'

import type { Route } from './+types/transactions'

/** @returns Pre-fetched transaction data via server-side dehydration. */
export async function loader() {
  const t0 = performance.now()
  const queryClient = createServerQueryClient()

  await balanceQuery(queryClient)

  console.warn(
    `[SSR] [TRANSACTIONS] loader TOTAL=${(performance.now() - t0).toFixed(0)}ms`
  )
  return { dehydratedState: dehydrate(queryClient) }
}

/** Client-navigation loader — skips the server hop; useQuery drives data client-side. */
export const clientLoader = skipServerHop

export default function TransactionsScreen({
  loaderData,
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

  // ── Categories ───────────────────────────────────────────────
  const { data: categoriesData } = useQuery(getCategoriesOptions())

  const { showSuccess, showError } = useFeedbackModals(modal)
  const { renderDeleteBody } = useDeleteBodyRenderer()

  /** Renders the transaction form inside the modal body */
  const renderForm = useCallback(
    (props?: { initialValues?: TransactionFormData; description?: string }) => (
      <TransactionFormContent
        ref={formRef}
        categories={(categoriesData ?? []) as ICategory[]}
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
    [categoriesData, t]
  )

  const { handleAdd, handleEdit, handleDelete } = useTransactionCrud({
    modal,
    formBridge: { getFormData, hasErrors: hasFormErrors, triggerValidation },
    showSuccess,
    showError,
    renderForm,
    renderDeleteBody,
  })

  const { data, error, isLoading } = useQuery(
    getTransactionsOptions({ query: { limit: 1000, sort: 'latest' } })
  )

  // ── Render ─────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center min-h-screen justify-center p-6 lg:p-10">
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
    <HydrationBoundary state={loaderData.dehydratedState}>
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
          data={(data?.data ?? []) as ITransaction[]}
          locale={i18n.language}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </HydrationBoundary>
  )
}
