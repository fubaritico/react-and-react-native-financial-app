import './i18n'

import { ModalRenderer } from '@financial-app/features/shared'
import { client } from '@financial-app/http-client/client'
import {
  isAuthenticatedAtom,
  useAuthListener,
  useConfigureHttpClient,
  useInactivityTimeout,
  useModal,
  useSessionExpiredHandler,
} from '@financial-app/shared'
import { Typography } from '@financial-app/ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { Provider as JotaiProvider } from 'jotai'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useNavigate,
} from 'react-router'

import { queryClient } from './lib/query-client'
import { authClient } from './lib/supabase'

import type { Route } from './+types/root'
import type { ReactNode } from 'react'

import './app.css'

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3001'

/** Inactivity threshold before auto sign-out (30 seconds) */
const INACTIVITY_DELAY_MS = 30_000

/** Bootstraps auth listener, HTTP client, inactivity timeout, and session expired modal */
function AuthBootstrap({ children }: Readonly<{ children: ReactNode }>) {
  const { t } = useTranslation()
  const { open: openModal, close: closeModal } = useModal()
  const handleSignOut = useSessionExpiredHandler(authClient)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const navigate = useNavigate()

  const showSessionExpiredModal = useCallback(() => {
    openModal({
      title: t('auth.sessionExpired.title', 'Session expired'),
      body: (
        <Typography variant="body" color="muted">
          {t(
            'auth.sessionExpired.description',
            'Your session has expired. Please sign in again.'
          )}
        </Typography>
      ),
      dismissable: false,
      actions: [
        {
          label: t('common.ok', 'OK'),
          variant: 'primary',
          onPress: () => {
            closeModal()
            handleSignOut()
            void navigate('/login', { replace: true })
          },
        },
      ],
    })
  }, [openModal, closeModal, handleSignOut, navigate, t])

  const showInactivityModal = useCallback(() => {
    openModal({
      title: t('auth.inactivity.title', 'Signed out due to inactivity'),
      body: (
        <Typography variant="body" color="muted">
          {t(
            'auth.inactivity.description',
            'You were signed out for security after a period of inactivity.'
          )}
        </Typography>
      ),
      dismissable: false,
      actions: [
        {
          label: t('common.ok', 'OK'),
          variant: 'primary',
          onPress: () => {
            closeModal()
            handleSignOut()
            void navigate('/login', { replace: true })
          },
        },
      ],
    })
  }, [openModal, closeModal, handleSignOut, navigate, t])

  useAuthListener(authClient)
  useConfigureHttpClient(client, authClient, API_URL, showSessionExpiredModal)
  useInactivityTimeout(
    showInactivityModal,
    INACTIVITY_DELAY_MS,
    isAuthenticated
  )

  return children
}

export function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <Meta />
        <Links />
        <title>Financial App</title>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>
          <ModalRenderer>
            <Outlet />
          </ModalRenderer>
        </AuthBootstrap>
      </QueryClientProvider>
    </JotaiProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // Error boundary cannot use hooks (not inside I18nextProvider).
  // Keep hardcoded English strings for error pages.
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground">{message}</h1>
      <p className="text-foreground-muted mt-2">{details}</p>
      {import.meta.env.DEV && stack && (
        <pre className="mt-4 p-4 bg-grey-100 rounded-md overflow-x-auto text-sm">
          {stack}
        </pre>
      )}
    </main>
  )
}
