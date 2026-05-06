import { TransactionsDataTable } from '@financial-app/features'
import { getTransactionsOptions } from '@financial-app/http-client'
import { Alert, Skeleton, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { queryClient } from '../lib/query-client'

const txnOpts = getTransactionsOptions({
  query: { limit: 1000, sort: 'latest' },
})

export async function clientLoader() {
  await queryClient.ensureQueryData(txnOpts)
  return null
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

export default function Transactions() {
  const { t, i18n } = useTranslation()

  const { data, error } = useQuery(txnOpts)

  if (error) {
    return (
      <div className="p-6 lg:p-10">
        <Typography variant="page-title" as="h1" className="mb-4">
          {t('transactions.title')}
        </Typography>
        <Alert severity="error" message={t('common.errorLoading')} />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10">
      <Typography variant="page-title" as="h1" className="mb-6">
        {t('transactions.title')}
      </Typography>
      <TransactionsDataTable data={data?.data ?? []} locale={i18n.language} />
    </div>
  )
}
