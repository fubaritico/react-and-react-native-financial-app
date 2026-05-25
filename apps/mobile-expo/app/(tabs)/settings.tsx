import { SettingsScreenView } from '@financial-app/features'
import {
  deleteUsersMeMutation,
  getBalanceOptions,
  getUsersMePreferencesOptions,
  getUsersMePreferencesQueryKey,
  putUsersMePreferencesMutation,
} from '@financial-app/http-client'
import { useCurrency } from '@financial-app/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { ISettingsFormValues } from '@financial-app/features'

import { authClient } from '../../src/lib/supabase'

import { lastContentTab } from './_layout'

/**
 * Settings tab route — language, currency, reference balance, delete account, disconnect.
 * Navigates back to the previous tab after submit or cancel.
 * @returns The settings screen wired to auth and API
 */
export default function SettingsScreen() {
  const { i18n } = useTranslation()
  const { currency } = useCurrency()
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: preferencesData } = useQuery(getUsersMePreferencesOptions())

  const updatePreferences = useMutation(putUsersMePreferencesMutation())

  const deleteAccount = useMutation({
    ...deleteUsersMeMutation(),
    onSuccess: () => {
      queryClient.clear()
      void authClient.signOut()
    },
  })

  /**
   * Persists language, currency, and reference balance.
   * Awaits both mutations + cache invalidations before navigating back.
   * @param values - Form values from SettingsScreenView
   */
  const handleSubmit = useCallback(
    async (values: ISettingsFormValues) => {
      void i18n.changeLanguage(values.language)

      await updatePreferences.mutateAsync({
        body: {
          currency: values.currency,
          reference_balance: values.balance,
        },
      })

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getUsersMePreferencesQueryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: getBalanceOptions().queryKey,
        }),
      ])

      const target =
        lastContentTab === 'index' ? '/(tabs)' : `/(tabs)/${lastContentTab}`
      router.navigate(target)
    },
    [i18n, updatePreferences, queryClient, router]
  )

  const handleDeleteAccount = useCallback(() => {
    deleteAccount.mutate({})
  }, [deleteAccount])

  const handleDisconnect = useCallback(() => {
    void authClient.signOut()
  }, [])

  /** Navigates back to the last visited content tab */
  const handleGoBack = useCallback(() => {
    const target =
      lastContentTab === 'index' ? '/(tabs)' : `/(tabs)/${lastContentTab}`
    router.navigate(target)
  }, [router])

  /** Navigates to the categories management screen */
  const handleGoToCategories = useCallback(() => {
    router.navigate('/(tabs)/categories')
  }, [router])

  return (
    <SettingsScreenView
      initialBalance={preferencesData?.reference_balance ?? 0}
      currentLanguage={i18n.language}
      currentCurrency={currency}
      onSubmit={handleSubmit}
      isSubmitting={updatePreferences.isPending}
      onDeleteAccount={handleDeleteAccount}
      isDeleting={deleteAccount.isPending}
      onDisconnect={handleDisconnect}
      onGoBack={handleGoBack}
      onGoToCategories={handleGoToCategories}
    />
  )
}
