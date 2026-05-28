import { isRouteErrorResponse } from 'react-router'

import type { Route } from '../+types/root'

/**
 * Root error boundary for the application.
 * Cannot use hooks (not inside I18nextProvider) — hardcoded English strings.
 * @param props.error - The caught error or route error response
 * @returns A minimal error page with message, details, and optional stack trace (dev only)
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
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
