import { useModal } from '@financial-app/shared'
import {
  Button,
  Card,
  TextInput,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import { LanguageDropdown } from '../LanguageDropdown/LanguageDropdown.native'

import { native } from './SettingsScreenView.styles'

import type { ISettingsScreenViewProps } from './SettingsScreenView'

/**
 * Native implementation of the Settings screen — form with reference balance,
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
    <ScrollView contentContainerStyle={tw`${native.scrollContent}`}>
      <Card>
        <View style={tw`${native.cardContent}`}>
          <Typography variant="heading-lg" accessibilityRole="header">
            {t('settings.title')}
          </Typography>

          {/* Reference balance */}
          <TextInput
            label={t('settings.referenceBalance')}
            value={balance}
            onChangeText={setBalance}
            keyboardType="numeric"
          />

          {/* Language dropdown */}
          <View style={tw`${native.languageSection}`}>
            <Typography variant="label" color="muted">
              {t('settings.language')}
            </Typography>
            <LanguageDropdown
              selectedValue={language}
              onSelect={setLanguage}
              accessibilityLabel={t('settings.language')}
              bottomSheetTitle={t('settings.language')}
            />
          </View>

          {/* Buttons */}
          <View style={tw`${native.buttonGroup}`}>
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
                isSubmitting ? t('settings.saving') : t('settings.saveChanges')
              }
              onPress={handleSubmit}
              loading={isSubmitting}
              fullWidth
              centered
            />
          </View>
        </View>
      </Card>
    </ScrollView>
  )
}
