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
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import type { ISettingsFormValues } from '@financial-app/features'

import { getLastContentRoute } from '../lib/last-content-route'
import { authClient } from '../lib/supabase'

/**
 * Settings route — language, currency, reference balance, delete account, disconnect.
 * Navigates back to the previous route after submit or cancel.
 * @returns The settings screen wired to auth and API
 */
export default function SettingsScreen() {
  const { i18n } = useTranslation()
  const { currency } = useCurrency()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: preferencesData } = useQuery(getUsersMePreferencesOptions())

  const updatePreferences = useMutation(putUsersMePreferencesMutation())

  const deleteAccount = useMutation({
    ...deleteUsersMeMutation(),
    onSuccess: () => {
      queryClient.clear()
      void authClient.signOut().then(() => {
        void navigate('/login', { replace: true })
      })
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

      void navigate(getLastContentRoute())
    },
    [i18n, updatePreferences, queryClient, navigate]
  )

  const handleDeleteAccount = useCallback(() => {
    deleteAccount.mutate({})
  }, [deleteAccount])

  const handleDisconnect = useCallback(() => {
    void authClient.signOut().then(() => {
      void navigate('/login', { replace: true })
    })
  }, [navigate])

  /** Navigates back to the last content route (the screen before Settings) */
  const handleGoBack = useCallback(() => {
    void navigate(getLastContentRoute())
  }, [navigate])

  /** Navigates to the categories management screen */
  const handleGoToCategories = useCallback(() => {
    void navigate('/settings/categories')
  }, [navigate])

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
