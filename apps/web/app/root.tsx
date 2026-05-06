import './i18n'

import { client } from '@financial-app/http-client/client'
import { useAuthListener, useConfigureHttpClient } from '@financial-app/shared'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router'

import { queryClient } from './lib/query-client'
import { authClient } from './lib/supabase'

import type { Route } from './+types/root'
import type { ReactNode } from 'react'

import './app.css'

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3001'

/** Bootstraps auth listener and HTTP client configuration */
function AuthBootstrap({ children }: Readonly<{ children: ReactNode }>) {
  useAuthListener(authClient)
  useConfigureHttpClient(client, authClient, API_URL)
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
          <Outlet />
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
      {stack && (
        <pre className="mt-4 p-4 bg-grey-100 rounded-md overflow-x-auto text-sm">
          {stack}
        </pre>
      )}
    </main>
  )
}
