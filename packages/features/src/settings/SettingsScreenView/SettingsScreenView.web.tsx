import { useModal } from '@financial-app/shared'
import { Button, Card, Divider, TextInput, Typography } from '@financial-app/ui'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CurrencyDropdown } from '../CurrencyDropdown/CurrencyDropdown.web'
import { LanguageDropdown } from '../LanguageDropdown/LanguageDropdown.web'

import { web } from './SettingsScreenView.styles'

import type { ISettingsScreenViewProps } from './SettingsScreenView'

/**
 * Web implementation of the Settings screen — sectioned form with preferences,
 * account actions, and form controls arranged in compact rows.
 * @param props - Settings screen props
 * @returns The settings screen as a sectioned form
 */
export function SettingsScreenView({
  initialBalance,
  currentLanguage,
  currentCurrency,
  onSubmit,
  isSubmitting,
  onDeleteAccount,
  isDeleting,
  onDisconnect,
  onGoBack,
  onGoToCategories,
}: Readonly<ISettingsScreenViewProps>) {
  const { t } = useTranslation()
  const modal = useModal()

  const [balance, setBalance] = useState(String(initialBalance))
  const [language, setLanguage] = useState(currentLanguage)
  const [currency, setCurrency] = useState(currentCurrency)

  /** Syncs balance state when the prop changes (e.g. after query resolves) */
  useEffect(() => {
    setBalance(String(initialBalance))
  }, [initialBalance])

  /** Syncs language state when the prop changes (e.g. external language switch) */
  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  /** Syncs currency state when the prop changes (e.g. external currency switch) */
  useEffect(() => {
    setCurrency(currentCurrency)
  }, [currentCurrency])

  /**
   * Resets form state and navigates back to the previous screen.
   * @returns void
   */
  const handleCancel = useCallback(() => {
    setBalance(String(initialBalance))
    setLanguage(currentLanguage)
    setCurrency(currentCurrency)
    onGoBack()
  }, [initialBalance, currentLanguage, currentCurrency, onGoBack])

  /**
   * Submits the form with validated balance and language.
   * Navigation is handled by the Screen's onSuccess callback.
   * @returns void
   */
  const handleSubmit = useCallback(() => {
    const numericBalance = Number(balance)
    if (
      Number.isNaN(numericBalance) ||
      !Number.isFinite(numericBalance) ||
      numericBalance < 0
    )
      return
    void onSubmit({ balance: numericBalance, language, currency })
  }, [balance, language, currency, onSubmit])

  /**
   * Opens the delete account confirmation modal with destroy action.
   * @returns void
   */
  const handleDeleteAccount = useCallback(() => {
    modal.open({
      title: t('settings.deleteAccountConfirmTitle'),
      body: (
        <Typography variant="body" align="center">
          {t('settings.deleteAccountConfirmMessage')}
        </Typography>
      ),
      actions: [
        {
          label: t('settings.deleteAccountConfirm'),
          variant: 'destroy',
          onPress: onDeleteAccount,
        },
      ],
      cancelLabel: t('settings.deleteAccountCancel'),
      isSubmitting: isDeleting,
    })
  }, [modal, t, onDeleteAccount, isDeleting])

  return (
    <div className={web.root}>
      <div className={web.container}>
        <Card shadow>
          <div className={web.content}>
            <Typography variant="heading-lg" as="h1">
              {t('settings.title')}
            </Typography>

            {/* Section: Preferences */}
            <div className={web.section}>
              <Typography variant="body-bold" as="h2">
                {t('settings.sectionPreferences')}
              </Typography>

              <TextInput
                label={t('settings.referenceBalance')}
                value={balance}
                prefix="$"
                onChangeText={setBalance}
                keyboardType="numeric"
              />

              <div className={web.row}>
                <div className={web.rowItem}>
                  <div className={web.fieldWrapper}>
                    <Typography variant="label" color="muted">
                      {t('settings.language')}
                    </Typography>
                    <LanguageDropdown
                      selectedValue={language}
                      onSelect={setLanguage}
                      accessibilityLabel={t('settings.language')}
                      bottomSheetTitle={t('settings.language')}
                    />
                  </div>
                </div>
                <div className={web.rowItem}>
                  <div className={web.fieldWrapper}>
                    <Typography variant="label" color="muted">
                      {t('settings.currency')}
                    </Typography>
                    <CurrencyDropdown
                      selectedValue={currency}
                      onSelect={setCurrency}
                      accessibilityLabel={t('settings.currency')}
                      bottomSheetTitle={t('settings.currency')}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              icon="arrowRight"
              iconPosition="right"
              title={t('settings.categories')}
              onPress={onGoToCategories}
            />

            <Divider />

            {/* Section: Account */}
            <div className={web.section}>
              <Typography variant="body-bold" as="h2">
                {t('settings.sectionAccount')}
              </Typography>

              <div className={web.buttonRow}>
                <div className={web.buttonItem}>
                  <Button
                    variant="destroy"
                    icon="bin"
                    iconPosition="left"
                    title={
                      isDeleting
                        ? t('settings.deleteAccountDeleting')
                        : t('settings.deleteAccount')
                    }
                    onPress={handleDeleteAccount}
                    loading={isDeleting}
                    fullWidth
                    centered
                  />
                </div>
                <div className={web.buttonItem}>
                  <Button
                    variant="secondary"
                    icon="disconnect"
                    iconPosition="left"
                    title={t('settings.disconnect')}
                    onPress={onDisconnect}
                    fullWidth
                    centered
                  />
                </div>
              </div>
            </div>

            <Divider />

            {/* Form actions */}
            <div className={web.buttonRow}>
              <div className={web.buttonItem}>
                <Button
                  variant="secondary"
                  title={t('settings.cancel')}
                  onPress={handleCancel}
                  fullWidth
                  centered
                />
              </div>
              <div className={web.buttonItem}>
                <Button
                  variant="primary"
                  title={
                    isSubmitting
                      ? t('settings.saving')
                      : t('settings.saveChanges')
                  }
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  fullWidth
                  centered
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
