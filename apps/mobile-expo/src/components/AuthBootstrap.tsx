import { client } from '@financial-app/http-client/client'
import {
  isAuthenticatedAtom,
  useAuthListener,
  useConfigureHttpClient,
  useInactivityTimeout,
  useModal,
  useSessionExpiredHandler,
} from '@financial-app/shared'
import { Typography } from '@financial-app/ui/native'
import { useAtomValue } from 'jotai'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { authClient } from '../lib/supabase'

import type { ReactNode } from 'react'

const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'

if (!__DEV__ && !RAW_API_URL.startsWith('https://')) {
  throw new Error('EXPO_PUBLIC_API_URL must be an HTTPS URL in production')
}

/** Android emulator can't reach host's localhost — remap to 10.0.2.2 */
const API_URL =
  Platform.OS === 'android'
    ? RAW_API_URL.replace('localhost', '10.0.2.2')
    : RAW_API_URL

/** Inactivity threshold before auto sign-out (30 seconds) */
const INACTIVITY_DELAY_MS = 30_000

/** Bootstraps auth listener, HTTP client, inactivity timeout, and session expired modal */
export function AuthBootstrap({ children }: Readonly<{ children: ReactNode }>) {
  const { t } = useTranslation()
  const { open: openModal, close: closeModal } = useModal()
  const handleSignOut = useSessionExpiredHandler(authClient)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  const showSessionExpiredModal = useCallback(() => {
    openModal({
      title: t('auth.sessionExpired.title'),
      body: (
        <Typography variant="body" color="muted">
          {t('auth.sessionExpired.description')}
        </Typography>
      ),
      dismissable: false,
      actions: [
        {
          label: t('common.ok'),
          variant: 'primary',
          onPress: () => {
            closeModal()
            handleSignOut()
          },
        },
      ],
    })
  }, [openModal, closeModal, handleSignOut, t])

  const showInactivityModal = useCallback(() => {
    openModal({
      title: t('auth.inactivity.title'),
      body: (
        <Typography variant="body" color="muted">
          {t('auth.inactivity.description')}
        </Typography>
      ),
      dismissable: false,
      actions: [
        {
          label: t('common.ok'),
          variant: 'primary',
          onPress: () => {
            closeModal()
            handleSignOut()
          },
        },
      ],
    })
  }, [openModal, closeModal, handleSignOut, t])

  useAuthListener(authClient)
  useConfigureHttpClient(client, authClient, API_URL, showSessionExpiredModal)
  useInactivityTimeout(
    showInactivityModal,
    INACTIVITY_DELAY_MS,
    isAuthenticated
  )

  return children
}
