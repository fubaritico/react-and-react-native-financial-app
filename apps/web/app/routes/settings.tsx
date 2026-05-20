import { SettingsScreenView } from '@financial-app/features'
import {
  deleteUsersMeMutation,
  getBalanceOptions,
  getBalanceReferenceOptions,
  getBalanceReferenceQueryKey,
  putBalanceReferenceMutation,
} from '@financial-app/http-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import type { ISettingsFormValues } from '@financial-app/features'

import { authClient } from '../lib/supabase'

/**
 * Settings route — language, reference balance, delete account, disconnect.
 * Navigates back to the previous route after submit or cancel.
 * @returns The settings screen wired to auth and API
 */
export default function SettingsScreen() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
      void navigate(-1)
    },
  })

  const deleteAccount = useMutation({
    ...deleteUsersMeMutation(),
    onSuccess: () => {
      queryClient.clear()
      void authClient.signOut().then(() => {
        void navigate('/login', { replace: true })
      })
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
    void authClient.signOut().then(() => {
      void navigate('/login', { replace: true })
    })
  }, [navigate])

  /** Navigates back to the previous route */
  const handleGoBack = useCallback(() => {
    void navigate(-1)
  }, [navigate])

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
