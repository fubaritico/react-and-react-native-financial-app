import { TransactionsDataTable } from '@financial-app/features'
import { getTransactionsOptions } from '@financial-app/http-client'
import { getErrorMessage } from '@financial-app/shared'
import { Alert, Spinner, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import tw from '../../src/lib/tw'

/**
 * Transactions tab — displays the full transactions list with search, sort, and category filter.
 * Fetches all transactions from the API (high limit for client-side filtering by DataTable).
 */
export default function TransactionsScreen() {
  const { t, i18n } = useTranslation()

  const { data, isLoading, error } = useQuery(
    getTransactionsOptions({ query: { limit: 1000, sort: 'latest' } })
  )

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-beige-100`}>
        <Spinner />
      </View>
    )
  }

  if (error) {
    return (
      <View style={tw`flex-1 bg-beige-100 px-6 justify-center`}>
        <Alert
          severity="error"
          message={t('common.errorLoading')}
          description={__DEV__ ? getErrorMessage(error) : undefined}
        />
      </View>
    )
  }

  return (
    <ScrollView
      style={tw`flex-1 bg-beige-100`}
      contentContainerStyle={tw`p-4 pb-8`}
    >
      <Typography variant="page-title" style={tw`mb-4 mt-10`}>
        {t('transactions.title')}
      </Typography>
      <View>
        <TransactionsDataTable data={data?.data ?? []} locale={i18n.language} />
      </View>
    </ScrollView>
  )
}
