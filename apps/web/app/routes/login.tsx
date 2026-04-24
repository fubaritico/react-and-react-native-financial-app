import { useTranslation } from 'react-i18next'

/**
 * Login page — public route, no sidebar.
 * Placeholder until auth UI components are wired (Phase 8).
 */
export default function Login() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-100">
      <div className="bg-card rounded-xl p-8 shadow-sm max-w-md w-full mx-4">
        <h1 className="text-preset-1 text-foreground mb-2">
          {t('auth.login')}
        </h1>
        <p className="text-preset-4 text-foreground-muted">
          {t('common.placeholder')}
        </p>
      </div>
    </div>
  )
}
