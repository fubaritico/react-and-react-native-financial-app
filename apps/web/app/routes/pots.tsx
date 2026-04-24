import { useTranslation } from 'react-i18next'

/**
 * Pots page — protected route (auth guard commented out during Phase 7).
 * Placeholder until the pot cards with progress bars + add/withdraw modals are built.
 */
export default function Pots() {
  const { t } = useTranslation()

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-preset-1 text-foreground mb-6">{t('pots.title')}</h1>
      <div className="bg-card rounded-xl p-6">
        <p className="text-preset-4 text-foreground-muted">
          {t('common.placeholder')}
        </p>
      </div>
    </div>
  )
}
