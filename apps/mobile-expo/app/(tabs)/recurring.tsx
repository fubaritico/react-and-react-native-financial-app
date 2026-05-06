import { BillsSummary, RecurringBillsDataTable } from '@financial-app/features'
import { getRecurringBillsOptions } from '@financial-app/http-client'
import { buildRecurringBillsPageData } from '@financial-app/shared'
import { Alert, BalanceCard, Spinner, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import type { IBillsSummaryRow } from '@financial-app/features'

import tw from '../../src/lib/tw'

export default function RecurringBillsScreen() {
  const { t, i18n } = useTranslation()

  const {
    data: recurringBills,
    isLoading,
    error,
  } = useQuery(getRecurringBillsOptions())

  const pageData = useMemo(
    () => (recurringBills ? buildRecurringBillsPageData(recurringBills) : null),
    [recurringBills]
  )

  const summaryRows: IBillsSummaryRow[] = useMemo(
    () =>
      pageData
        ? [
            {
              label: t('recurring.paidBills'),
              count: pageData.paidCount,
              total: pageData.paidTotal,
            },
            {
              label: t('recurring.totalUpcoming'),
              count: pageData.upcomingCount,
              total: pageData.upcomingTotal,
            },
            {
              label: t('recurring.dueSoon'),
              count: pageData.dueSoonCount,
              total: pageData.dueSoonTotal,
              color: 'destructive' as const,
            },
          ]
        : [],
    [pageData, t]
  )

  if (isLoading || !pageData) {
    return (
      <View style={tw`flex-1 bg-beige-100`}>
        <Spinner />
      </View>
    )
  }

  if (error) {
    return (
      <View style={tw`flex-1 bg-beige-100 p-6`}>
        <Alert severity="error" message={t('common.errorLoading')} />
      </View>
    )
  }

  return (
    <ScrollView
      style={tw`flex-1 bg-beige-100`}
      contentContainerStyle={tw`p-4 pb-8`}
    >
      {/* Header */}
      <View style={tw`mb-6 mt-10`}>
        <Typography variant="page-title">{t('recurring.title')}</Typography>
      </View>

      {/* Total Bills */}
      <BalanceCard
        label={t('recurring.totalBills')}
        amount={pageData.totalBills}
        tone="dark"
      />

      {/* Summary */}
      <View style={tw`mt-4`}>
        <BillsSummary title={t('recurring.summary')} rows={summaryRows} />
      </View>

      {/* DataTable */}
      <View style={tw`mt-4`}>
        <RecurringBillsDataTable data={pageData.bills} locale={i18n.language} />
      </View>
    </ScrollView>
  )
}
