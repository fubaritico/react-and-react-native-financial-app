import { BillsSummary, RecurringBillsDataTable } from '@financial-app/features'
import { getRecurringBillsOptions } from '@financial-app/http-client'
import { buildRecurringBillsPageData } from '@financial-app/shared'
import { Alert, BalanceCard, Skeleton, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { IBillsSummaryRow } from '@financial-app/features'

import { queryClient } from '../lib/query-client'

const recurringOpts = getRecurringBillsOptions()

export async function clientLoader() {
  await queryClient.ensureQueryData(recurringOpts)
  return null
}

export function HydrateFallback() {
  return (
    <div className="p-6 lg:p-10">
      <Skeleton variant="line" width="w-52" height="h-8" className="mb-8" />
      <div className="grid grid-cols-1 gap-6 @[1100px]:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-6">
          <Skeleton variant="rectangle" height="h-24" />
          <Skeleton variant="rectangle" height="h-40" />
        </div>
        <Skeleton variant="rectangle" height="h-96" />
      </div>
    </div>
  )
}

export default function RecurringBills() {
  const { t, i18n } = useTranslation()

  const { data: recurringBills, error } = useQuery(recurringOpts)

  const pageData = useMemo(
    () => (recurringBills ? buildRecurringBillsPageData(recurringBills) : null),
    [recurringBills]
  )

  if (error) {
    return (
      <div className="p-6 lg:p-10">
        <Typography variant="page-title" as="h1" className="mb-4">
          {t('recurring.title')}
        </Typography>
        <Alert severity="error" message={t('common.errorLoading')} />
      </div>
    )
  }

  if (!pageData) return null

  const {
    totalBills,
    paidCount,
    paidTotal,
    upcomingCount,
    upcomingTotal,
    dueSoonCount,
    dueSoonTotal,
    bills,
  } = pageData

  const summaryRows: IBillsSummaryRow[] = [
    { label: t('recurring.paidBills'), count: paidCount, total: paidTotal },
    {
      label: t('recurring.totalUpcoming'),
      count: upcomingCount,
      total: upcomingTotal,
    },
    {
      label: t('recurring.dueSoon'),
      count: dueSoonCount,
      total: dueSoonTotal,
      color: 'destructive' as const,
    },
  ]

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <Typography variant="page-title" as="h1" className="mb-8">
        {t('recurring.title')}
      </Typography>

      {/* 2-col layout when content area >= 1100px */}
      <div className="grid grid-cols-1 gap-6 @[1100px]:grid-cols-[1fr_2fr]">
        {/* Left — Total + Summary */}
        <div className="flex flex-col gap-6 @[1100px]:self-start">
          <BalanceCard
            label={t('recurring.totalBills')}
            amount={totalBills}
            tone="dark"
          />
          <BillsSummary title={t('recurring.summary')} rows={summaryRows} />
        </div>

        {/* Right — DataTable */}
        <RecurringBillsDataTable data={bills} locale={i18n.language} />
      </div>
    </div>
  )
}
