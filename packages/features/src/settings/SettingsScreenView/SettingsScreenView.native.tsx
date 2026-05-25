import { useModal } from '@financial-app/shared'
import {
  Button,
  Card,
  Divider,
  SectionLink,
  TextInput,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import { CurrencyDropdown } from '../CurrencyDropdown/CurrencyDropdown.native'
import { LanguageDropdown } from '../LanguageDropdown/LanguageDropdown.native'

import { native } from './SettingsScreenView.styles'

import type { ISettingsScreenViewProps } from './SettingsScreenView'

/**
 * Native implementation of the Settings screen — sectioned form with preferences,
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
    <ScrollView contentContainerStyle={tw`${native.scrollContent}`}>
      <Card>
        <View style={tw`${native.cardContent}`}>
          <Typography variant="heading-lg" accessibilityRole="header">
            {t('settings.title')}
          </Typography>

          <Typography variant="body-bold" accessibilityRole="header">
            {t('settings.sectionPreferences')}
          </Typography>

          {/* Section: Preferences */}
          <View style={tw`${native.section}`}>
            <TextInput
              label={t('settings.referenceBalance')}
              value={balance}
              onChangeText={setBalance}
              keyboardType="numeric"
            />

            <View style={tw`${native.row}`}>
              <View style={tw`${native.rowItem}`}>
                <View style={tw`${native.fieldWrapper}`}>
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
              </View>
              <View style={tw`${native.rowItem}`}>
                <View style={tw`${native.fieldWrapper}`}>
                  <Typography variant="label" color="muted">
                    {t('settings.currency')}
                  </Typography>
                  <CurrencyDropdown
                    selectedValue={currency}
                    onSelect={setCurrency}
                    accessibilityLabel={t('settings.currency')}
                    bottomSheetTitle={t('settings.currency')}
                  />
                </View>
              </View>
            </View>
          </View>

          <SectionLink
            label={t('settings.categories')}
            onPress={onGoToCategories}
          />

          <Divider />

          {/* Section: Account */}
          <View style={tw`${native.section}`}>
            <Typography variant="body-bold" accessibilityRole="header">
              {t('settings.sectionAccount')}
            </Typography>

            <View style={tw`${native.buttonRow}`}>
              <View style={tw`${native.buttonItem}`}>
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
              </View>
              <View style={tw`${native.buttonItem}`}>
                <Button
                  variant="secondary"
                  icon="disconnect"
                  iconPosition="left"
                  title={t('settings.disconnect')}
                  onPress={onDisconnect}
                  fullWidth
                  centered
                />
              </View>
            </View>
          </View>

          <Divider />

          {/* Form actions */}
          <View style={tw`${native.buttonRow}`}>
            <View style={tw`${native.buttonItem}`}>
              <Button
                variant="secondary"
                title={t('settings.cancel')}
                onPress={handleCancel}
                fullWidth
                centered
              />
            </View>
            <View style={tw`${native.buttonItem}`}>
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
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>
  )
}
