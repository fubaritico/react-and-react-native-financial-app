import * as Sentry from '@sentry/react-router'
import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN as string,
  environment: import.meta.env.MODE,
  tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
  integrations: [Sentry.reactRouterTracingIntegration()],
})
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  )
})
