import { BillsSummary, RecurringBillsDataTable } from '@financial-app/features'
import {
  buildRecurringBillsPageData,
  mockTransactions,
} from '@financial-app/shared'
import { BalanceCard, Typography } from '@financial-app/ui'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import type { IBillsSummaryRow } from '@financial-app/features'

import tw from '../lib/tw'

export function RecurringScreen() {
  const { t, i18n } = useTranslation()

  const pageData = useMemo(
    () => buildRecurringBillsPageData(mockTransactions),
    []
  )

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
        amount={totalBills}
        tone="dark"
      />

      {/* Summary */}
      <View style={tw`mt-4`}>
        <BillsSummary title={t('recurring.summary')} rows={summaryRows} />
      </View>

      {/* DataTable */}
      <View style={tw`mt-4`}>
        <RecurringBillsDataTable data={bills} locale={i18n.language} />
      </View>
    </ScrollView>
  )
}
