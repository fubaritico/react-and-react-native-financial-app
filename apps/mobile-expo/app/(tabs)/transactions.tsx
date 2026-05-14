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
import { Alert, Button, Spinner, Typography } from '@financial-app/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import type { ITransactionFormRef } from '@financial-app/features'

import tw from '../../src/lib/tw'

/**
 * Transactions tab — displays the full transactions list with search, sort, and category filter.
 * Fetches all transactions from the API (high limit for client-side filtering by DataTable).
 */
export default function TransactionsScreen() {
  const { t, i18n } = useTranslation()
  const modal = useModal()
  const qc = useQueryClient()
  const formRef = useRef<ITransactionFormRef>(null)

  const txnOpts = getTransactionsOptions({
    query: { limit: 1000, sort: 'latest' },
  })
  const { data, isLoading, error } = useQuery(txnOpts)

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
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-6 mt-10`}>
        <Typography variant="page-title">{t('transactions.title')}</Typography>
        <Button
          title={t('transactions.addNewTransaction')}
          onPress={handleAddTransaction}
          variant="primary"
        />
      </View>
      <View>
        <TransactionsDataTable data={data?.data ?? []} locale={i18n.language} />
      </View>
    </ScrollView>
  )
}
