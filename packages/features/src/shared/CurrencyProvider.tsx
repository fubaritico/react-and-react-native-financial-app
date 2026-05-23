import { getUsersMePreferencesOptions } from '@financial-app/http-client'
import {
  CurrencyContext as SharedCurrencyContext,
  initRates,
  useCurrency,
} from '@financial-app/shared'
import { CurrencyContext as UICurrencyContext } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ReactNode } from 'react'

/**
 * Inner bridge — reads `useCurrency().format` (which depends on shared's CurrencyContext)
 * and provides it to ui's CurrencyContext so the `<Currency>` atom can format amounts.
 * @param props - Component props
 * @param props.children - React children to wrap with the UI currency context
 * @returns The children wrapped in a UI CurrencyContext provider
 */
function UICurrencyBridge({ children }: Readonly<{ children: ReactNode }>) {
  const { format } = useCurrency()

  const uiValue = useMemo(() => ({ format }), [format])

  return (
    <UICurrencyContext.Provider value={uiValue}>
      {children}
    </UICurrencyContext.Provider>
  )
}

/**
 * Provides currency configuration to the entire component tree.
 * Reads the user's preferred currency from cached preferences (TanStack Query)
 * and the current i18n language, then wires both shared and ui CurrencyContexts.
 *
 * Initializes live exchange rates on mount via {@link initRates}.
 * Children are not rendered until rates are ready.
 *
 * Place inside QueryClientProvider + AuthBootstrap (needs auth for preferences query).
 * Falls back to USD / en when preferences are not yet loaded.
 */
export function CurrencyProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { i18n } = useTranslation()
  const [ratesReady, setRatesReady] = useState(false)

  const { data: preferences } = useQuery({
    ...getUsersMePreferencesOptions(),
    staleTime: Infinity,
  })

  /** Fetches live exchange rates once on mount. */
  useEffect(() => {
    initRates()
      .then(() => {
        setRatesReady(true)
      })
      .catch((error: unknown) => {
        console.error(
          '[CurrencyProvider] Failed to fetch exchange rates:',
          error
        )
      })
  }, [])

  const sharedValue = useMemo(
    () => ({
      currency: preferences?.currency ?? 'USD',
      language: i18n.language,
    }),
    [preferences?.currency, i18n.language]
  )

  if (!ratesReady) return null

  return (
    <SharedCurrencyContext.Provider value={sharedValue}>
      <UICurrencyBridge>{children}</UICurrencyBridge>
    </SharedCurrencyContext.Provider>
  )
}
