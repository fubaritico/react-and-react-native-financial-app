import {
  TransactionFormContent,
  TransactionsDataTable,
  createAddTransactionModalConfig,
} from '@financial-app/features'
import {
  getTransactionsOptions,
  postTransactionsMutation,
} from '@financial-app/http-client'
import { getErrorMessage, useModal } from '@financial-app/shared'
import { Alert, Button, Skeleton, Spinner, Typography } from '@financial-app/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { ITransactionFormRef } from '@financial-app/features'

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

  const { mutate: createTransaction } = useMutation({
    ...postTransactionsMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: txnOpts.queryKey })
      modal.close()
    },
  })

  const handleSubmitTransaction = useCallback(() => {
    const ref = formRef.current
    if (!ref || ref.hasErrors) return
    const values = ref.getValues()
    if (!Number.isFinite(values.amount) || values.amount === 0) return
    createTransaction({
      body: {
        name: values.name,
        category: values.category,
        date: values.date,
        amount: values.amount,
        recurring: values.recurring,
      },
    })
  }, [createTransaction])

  const handleAddTransaction = useCallback(() => {
    const config = createAddTransactionModalConfig(
      <TransactionFormContent
        ref={formRef}
        nameLabel={t('transactions.form.nameLabel')}
        namePlaceholder={t('transactions.form.namePlaceholder')}
        amountLabel={t('transactions.form.amountLabel')}
        amountPlaceholder={t('transactions.form.amountPlaceholder')}
        categoryLabel={t('transactions.form.categoryLabel')}
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
      <TransactionsDataTable data={data?.data ?? []} locale={i18n.language} />
    </div>
  )
}
