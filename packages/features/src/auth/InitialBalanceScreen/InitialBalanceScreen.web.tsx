import {
  Alert,
  AuthCard,
  AuthLayout,
  Button,
  LinkText,
  TextInput,
  Typography,
} from '@financial-app/ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { IInitialBalanceScreenProps } from './InitialBalanceScreen'

/**
 * Web implementation of the initial balance screen.
 * Prompts the user to enter a starting balance for manual mode.
 * @param props - Screen props with submit/back callbacks and loading/error state
 * @returns The initial balance screen
 */
export function InitialBalanceScreen({
  onSubmit,
  onBack,
  isSubmitting,
  error,
}: Readonly<IInitialBalanceScreenProps>) {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = useCallback(() => {
    setValidationError('')
    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed < 0) {
      setValidationError(t('onboarding.initialBalance.validationError'))
      return
    }
    onSubmit(parsed)
  }, [amount, onSubmit, t])

  return (
    <AuthLayout
      appName={t('app.name')}
      tagline={t('app.tagline')}
      description={t('app.description')}
    >
      <AuthCard
        title={t('onboarding.initialBalance.title')}
        footer={
          <LinkText
            text=""
            linkLabel={t('onboarding.initialBalance.backToChoice')}
            onLinkPress={onBack}
          />
        }
      >
        <Typography variant="body" color="muted">
          {t('onboarding.initialBalance.description')}
        </Typography>
        {error ? <Alert severity="error" message={error} /> : null}
        <TextInput
          label={t('onboarding.initialBalance.label')}
          value={amount}
          onChangeText={setAmount}
          placeholder={t('onboarding.initialBalance.placeholder')}
          keyboardType="numeric"
          error={!!validationError}
          helperText={validationError}
        />
        <Button
          title={
            isSubmitting
              ? t('onboarding.initialBalance.submitting')
              : t('onboarding.initialBalance.submit')
          }
          onPress={handleSubmit}
          fullWidth
          disabled={isSubmitting}
          centered
        />
      </AuthCard>
    </AuthLayout>
  )
}
