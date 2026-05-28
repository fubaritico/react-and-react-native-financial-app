import {
  TransactionFormContent,
  TransactionsDataTable,
  useDeleteBodyRenderer,
  useFeedbackModals,
  useTransactionCrud,
} from '@financial-app/features'
import {
  getCategoriesOptions,
  getTransactions,
  getTransactionsOptions,
} from '@financial-app/http-client'
import { getErrorMessage, useModal } from '@financial-app/shared'
import { Alert, Button, Skeleton, Spinner, Typography } from '@financial-app/ui'
import { HydrationBoundary, dehydrate, useQuery } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { TransactionFormData } from '@financial-app/features'
import type { ICategory, ITransaction } from '@financial-app/shared'

import { createServerHttpClient } from '../lib/http-client.server'
import { createServerQueryClient } from '../lib/query-client.server'
import { accessTokenContext } from '../lib/route-context'

import type { Route } from './+types/transactions'

/** @returns Pre-fetched transaction data via server-side dehydration. */
export async function loader({ context }: Route.LoaderArgs) {
  const accessToken = context.get(accessTokenContext)
  const httpClient = createServerHttpClient(accessToken)
  const queryClient = createServerQueryClient()

  await queryClient.prefetchQuery({
    ...getTransactionsOptions({ query: { limit: 1000, sort: 'latest' } }),
    queryFn: async () => {
      const { data } = await getTransactions({
        client: httpClient,
        query: { limit: 1000, sort: 'latest' },
        throwOnError: true,
      })
      return data
    },
  })

  return { dehydratedState: dehydrate(queryClient) }
}

/** Skeleton placeholder while the loader resolves */
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

  const txnOpts = getTransactionsOptions({
    query: { limit: 1000, sort: 'latest' },
  })
  const { data, error, isLoading } = useQuery(txnOpts)

  // ── Render ─────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <HydrationBoundary state={loaderData.dehydratedState}>
        <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
          <Spinner />
        </div>
      </HydrationBoundary>
    )
  }

  if (error) {
    return (
      <HydrationBoundary state={loaderData.dehydratedState}>
        <div className="p-6 lg:p-10">
          <Typography variant="page-title" as="h1" className="mb-4">
            {t('transactions.title')}
          </Typography>
          <Alert
            severity="error"
            message={t('common.errorLoading')}
            description={
              import.meta.env.DEV ? getErrorMessage(error) : undefined
            }
          />
        </div>
      </HydrationBoundary>
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
