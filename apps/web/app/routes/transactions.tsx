import { TransactionsDataTable } from '@financial-app/features'
import { mockTransactions } from '@financial-app/shared'
import { Typography } from '@financial-app/ui'
import { useTranslation } from 'react-i18next'

/**
 * Transactions page — displays the full transactions list with search, sort, and category filter.
 * TODO (Phase 8): replace mockTransactions with real API data.
 */
export default function Transactions() {
  const { t, i18n } = useTranslation()

  return (
    <div className="p-6 lg:p-10">
      <Typography variant="page-title" as="h1" className="mb-6">
        {t('transactions.title')}
      </Typography>
      <TransactionsDataTable data={mockTransactions} locale={i18n.language} />
    </div>
  )
}
