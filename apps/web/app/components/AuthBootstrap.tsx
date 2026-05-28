import { client } from '@financial-app/http-client/client'
import {
  isAuthenticatedAtom,
  useAuthListener,
  useConfigureHttpClient,
  useInactivityTimeout,
  useModal,
  useSessionExpiredHandler,
  useSessionExpiry,
} from '@financial-app/shared'
import { Typography } from '@financial-app/ui'
import { useAtomValue } from 'jotai'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { authClient } from '../lib/supabase'

import type { ReactNode } from 'react'

// ── Debug tracer (remove after fix confirmed) ────────────────────────
const T0 = typeof performance !== 'undefined' ? performance.now() : 0
let STEP = 0
/** Logs a numbered step with ms since module load */
function dbg(tag: string, ...args: unknown[]) {
  const ms = (performance.now() - T0).toFixed(1)
  console.warn(`[AUTH-FLOW] #${String(++STEP)} +${ms}ms [${tag}]`, ...args)
}

/** API base URL resolved from Vite env variable */
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3001'

if (import.meta.env.VITE_API_URL && !API_URL.startsWith('https://')) {
  throw new Error('VITE_API_URL must be an HTTPS URL in production')
}

/** Inactivity threshold before auto sign-out (2 minutes) */
const INACTIVITY_DELAY_MS = 120_000

/**
 * Bootstraps auth listener, HTTP client, inactivity timeout, and session expired modal.
 * Must be rendered inside QueryClientProvider, JotaiProvider, and ModalRenderer.
 * @param props.children - Application content to render once auth is wired
 * @returns The children unchanged — this component only runs side-effects via hooks
 */
export function AuthBootstrap({ children }: Readonly<{ children: ReactNode }>) {
  const { t } = useTranslation()
  const { open: openModal, close: closeModal } = useModal()
  const handleSignOut = useSessionExpiredHandler(authClient)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const navigate = useNavigate()

  /** Opens a sign-out modal with the given i18n namespace (sessionExpired | inactivity) */
  const showSignOutModal = useCallback(
    (ns: 'sessionExpired' | 'inactivity') => {
      openModal({
        title: t(`auth.${ns}.title`),
        body: (
          <Typography variant="body" color="muted">
            {t(`auth.${ns}.description`)}
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
              void navigate('/login', { replace: true })
            },
          },
        ],
      })
    },
    [openModal, closeModal, handleSignOut, navigate, t]
  )

  const showSessionExpiredModal = useCallback(() => {
    showSignOutModal('sessionExpired')
  }, [showSignOutModal])

  const showInactivityModal = useCallback(() => {
    showSignOutModal('inactivity')
  }, [showSignOutModal])

  const showSessionWarningModal = useCallback(
    (extend: () => void) => {
      openModal({
        title: t('auth.sessionWarning.title'),
        body: (
          <Typography variant="body" color="muted">
            {t('auth.sessionWarning.description')}
          </Typography>
        ),
        dismissable: false,
        actions: [
          {
            label: t('auth.sessionWarning.ignore'),
            variant: 'secondary',
            onPress: () => {
              closeModal()
            },
          },
          {
            label: t('auth.sessionWarning.extend'),
            variant: 'primary',
            onPress: () => {
              closeModal()
              extend()
            },
          },
        ],
      })
    },
    [openModal, closeModal, t]
  )

  dbg('AUTH-BOOTSTRAP', 'render, isAuthenticated:', isAuthenticated)
  useAuthListener(authClient)
  useConfigureHttpClient(client, authClient, API_URL, showSessionExpiredModal)
  useSessionExpiry(authClient, showSessionWarningModal, isAuthenticated)
  useInactivityTimeout(
    showInactivityModal,
    INACTIVITY_DELAY_MS,
    isAuthenticated
  )

  return children
}
