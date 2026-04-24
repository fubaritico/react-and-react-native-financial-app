import './i18n'

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router'

import type { Route } from './+types/root'
import type { ReactNode } from 'react'

import './app.css'

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
  return <Outlet />
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
