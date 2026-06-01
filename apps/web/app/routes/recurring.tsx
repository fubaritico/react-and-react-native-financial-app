import { BillsSummary, RecurringBillsDataTable } from '@financial-app/features'
import { getRecurringBillsOptions } from '@financial-app/http-client'
import {
  buildRecurringBillsPageData,
  getErrorMessage,
} from '@financial-app/shared'
import { Alert, BalanceCard, Spinner, Typography } from '@financial-app/ui'
import { HydrationBoundary, dehydrate, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { IBillsSummaryRow } from '@financial-app/features'
import type { ITransaction } from '@financial-app/shared'

import { createServerQueryClient } from '../lib/query-client.server'
import { skipServerHop } from '../lib/skip-server-hop'
import { recurringBillsQuery } from '../queries'

import type { Route } from './+types/recurring'

/** @returns Prefetched recurring bills data via server-side dehydration. */
export async function loader() {
  const queryClient = createServerQueryClient()

  await recurringBillsQuery(queryClient)

  return { dehydratedState: dehydrate(queryClient) }
}

/** Client-navigation loader — skips the server hop; useQuery drives data client-side. */
export const clientLoader = skipServerHop

/**
 * @param props - Route component props including the dehydrated query state
 * @returns Recurring bills page with summary cards and data table
 */
export default function RecurringBills({ loaderData }: Route.ComponentProps) {
  const { t, i18n } = useTranslation()

  const {
    data: recurringBills,
    error,
    isLoading,
  } = useQuery(getRecurringBillsOptions())

  const pageData = useMemo(
    () =>
      recurringBills
        ? buildRecurringBillsPageData(recurringBills as ITransaction[])
        : null,
    [recurringBills]
  )

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center min-h-screen justify-center p-4 md:p-6  lg:p-10">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-6  lg:p-10">
        <Typography variant="page-title" as="h1" className="mb-4">
          {t('recurring.title')}
        </Typography>
        <Alert
          severity="error"
          message={t('common.errorLoading')}
          description={import.meta.env.DEV ? getErrorMessage(error) : undefined}
        />
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
    {
      label: t('recurring.paidBills'),
      count: paidCount,
      total: paidTotal,
    },
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
    <HydrationBoundary state={loaderData.dehydratedState}>
      <div className="p-4 md:p-6  lg:p-10">
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
    </HydrationBoundary>
  )
}
