import { CurrencyProvider, ModalRenderer } from '@financial-app/features/shared'
import { createAppQueryClient } from '@financial-app/shared'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { useState } from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'

import { AuthBootstrap } from './components/AuthBootstrap'
import i18n from './i18n'

import type { ReactNode } from 'react'

import './app.css'

/**
 * Root HTML layout rendered on every page (SSR + client).
 * Provides the document shell: html, head, body, meta, scripts.
 */
export function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={i18n.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <Meta />
        <Links />
        <title>Financial App</title>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'if(sessionStorage.getItem("splashShown")==="1")document.documentElement.classList.add("splash-seen")',
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

/**
 * Root application component — provider stack wrapping all routes.
 * QueryClient created via useState to avoid sharing cache between SSR requests.
 */
export default function App() {
  const [queryClient] = useState(() => createAppQueryClient())

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>
          <CurrencyProvider>
            <ModalRenderer>
              <Outlet />
            </ModalRenderer>
          </CurrencyProvider>
        </AuthBootstrap>
      </QueryClientProvider>
    </JotaiProvider>
  )
}

export { ErrorBoundary } from './components/ErrorBoundary'
