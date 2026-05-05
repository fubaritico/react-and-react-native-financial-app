import { BillsSummary, RecurringBillsDataTable } from '@financial-app/features'
import {
  buildRecurringBillsPageData,
  mockTransactions,
} from '@financial-app/shared'
import { BalanceCard, Typography } from '@financial-app/ui'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { IBillsSummaryRow } from '@financial-app/features'

import type { Route } from './+types/recurring'

// TODO (Phase 8): replace mock data with real API call via requireAuth + HTTP client
export function loader() {
  return buildRecurringBillsPageData(mockTransactions)
}

export default function RecurringBills({ loaderData }: Route.ComponentProps) {
  const { t, i18n } = useTranslation()
  const {
    totalBills,
    paidCount,
    paidTotal,
    upcomingCount,
    upcomingTotal,
    dueSoonCount,
    dueSoonTotal,
    bills,
  } = loaderData

  const summaryRows: IBillsSummaryRow[] = useMemo(
    () => [
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
    ],
    [
      t,
      paidCount,
      paidTotal,
      upcomingCount,
      upcomingTotal,
      dueSoonCount,
      dueSoonTotal,
    ]
  )

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
