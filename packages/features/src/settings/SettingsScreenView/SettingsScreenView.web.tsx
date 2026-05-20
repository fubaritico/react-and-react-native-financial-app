import { useModal } from '@financial-app/shared'
import { Button, Card, TextInput, Typography } from '@financial-app/ui'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageDropdown } from '../LanguageDropdown/LanguageDropdown.web'

import { web } from './SettingsScreenView.styles'

import type { ISettingsScreenViewProps } from './SettingsScreenView'

/**
 * Web implementation of the Settings screen — form with reference balance,
 * language dropdown, delete account, disconnect, cancel and save.
 * @param props - Settings screen props
 * @returns The settings screen as a form
 */
export function SettingsScreenView({
  initialBalance,
  currentLanguage,
  onSubmit,
  isSubmitting,
  onDeleteAccount,
  isDeleting,
  onDisconnect,
  onGoBack,
}: Readonly<ISettingsScreenViewProps>) {
  const { t } = useTranslation()
  const modal = useModal()

  const [balance, setBalance] = useState(String(initialBalance))
  const [language, setLanguage] = useState(currentLanguage)

  /** Syncs balance state when the prop changes (e.g. after query resolves) */
  useEffect(() => {
    setBalance(String(initialBalance))
  }, [initialBalance])

  /** Syncs language state when the prop changes (e.g. external language switch) */
  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  /**
   * Resets form state and navigates back to the previous screen.
   * @returns void
   */
  const handleCancel = useCallback(() => {
    setBalance(String(initialBalance))
    setLanguage(currentLanguage)
    onGoBack()
  }, [initialBalance, currentLanguage, onGoBack])

  /**
   * Submits the form with validated balance and language.
   * Navigation is handled by the Screen's onSuccess callback.
   * @returns void
   */
  const handleSubmit = useCallback(() => {
    const numericBalance = Number(balance)
    if (Number.isNaN(numericBalance) || numericBalance < 0) return
    onSubmit({ balance: numericBalance, language })
  }, [balance, language, onSubmit])

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
          onPress: () => {
            onDeleteAccount()
          },
        },
      ],
      cancelLabel: t('settings.deleteAccountCancel'),
      isSubmitting: isDeleting,
    })
  }, [modal, t, onDeleteAccount, isDeleting])

  return (
    <div className={web.root}>
      <div className={web.container}>
        <Card>
          <div className={web.content}>
            <Typography variant="heading-lg" as="h1">
              {t('settings.title')}
            </Typography>

            {/* Reference balance */}
            <TextInput
              label={t('settings.referenceBalance')}
              value={balance}
              prefix="$"
              onChangeText={setBalance}
              keyboardType="numeric"
            />

            {/* Language dropdown */}
            <div className={web.languageSection}>
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

            {/* Buttons */}
            <div className={web.buttonGroup}>
              {/* Delete account */}
              <Button
                variant="destroy"
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

              {/* Disconnect */}
              <Button
                variant="secondary"
                title={t('settings.disconnect')}
                onPress={onDisconnect}
                fullWidth
                centered
              />

              {/* Cancel */}
              <Button
                variant="secondary"
                title={t('settings.cancel')}
                onPress={handleCancel}
                fullWidth
                centered
              />

              {/* Submit */}
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
        </Card>
      </div>
    </div>
  )
}
