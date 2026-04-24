import { useTranslation } from 'react-i18next'

/**
 * Recurring Bills page — protected route (auth guard commented out during Phase 7).
 * Placeholder until the bills list with status indicators + search/sort is built.
 */
export default function RecurringBills() {
  const { t } = useTranslation()

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-preset-1 text-foreground mb-6">
        {t('recurring.title')}
      </h1>
      <div className="bg-card rounded-xl p-6">
        <p className="text-preset-4 text-foreground-muted">
          {t('common.placeholder')}
        </p>
      </div>
    </div>
  )
}
