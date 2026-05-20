import { SettingsScreenView } from '@financial-app/features'
import {
  deleteUsersMeMutation,
  getBalanceOptions,
  getBalanceReferenceOptions,
  getBalanceReferenceQueryKey,
  putBalanceReferenceMutation,
} from '@financial-app/http-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { ISettingsFormValues } from '@financial-app/features'

import { authClient } from '../../src/lib/supabase'

import { lastContentTab } from './_layout'

/**
 * Settings tab route — language, reference balance, delete account, disconnect.
 * Navigates back to the previous tab after submit or cancel.
 * @returns The settings screen wired to auth and API
 */
export default function SettingsScreen() {
  const { i18n } = useTranslation()
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: balanceData } = useQuery({
    ...getBalanceReferenceOptions(),
  })

  const updateBalance = useMutation({
    ...putBalanceReferenceMutation(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getBalanceReferenceQueryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: getBalanceOptions().queryKey,
        }),
      ])
      const target =
        lastContentTab === 'index' ? '/(tabs)' : `/(tabs)/${lastContentTab}`
      router.navigate(target)
    },
  })

  const deleteAccount = useMutation({
    ...deleteUsersMeMutation(),
    onSuccess: () => {
      queryClient.clear()
      void authClient.signOut()
    },
  })

  const handleSubmit = useCallback(
    (values: ISettingsFormValues) => {
      void i18n.changeLanguage(values.language)
      updateBalance.mutate({
        body: { reference: values.balance },
      })
    },
    [i18n, updateBalance]
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

  return (
    <SettingsScreenView
      initialBalance={balanceData?.reference ?? 0}
      currentLanguage={i18n.language}
      onSubmit={handleSubmit}
      isSubmitting={updateBalance.isPending}
      onDeleteAccount={handleDeleteAccount}
      isDeleting={deleteAccount.isPending}
      onDisconnect={handleDisconnect}
      onGoBack={handleGoBack}
    />
  )
}
