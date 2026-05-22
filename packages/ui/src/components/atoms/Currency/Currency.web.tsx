import { useCurrencyFormat } from '#Lib/CurrencyContext'

import type { ICurrencyProps } from './Currency'

/**
 * Web implementation of the Currency atom.
 * Formats a numeric amount using the currency formatter from context.
 * Composable: `<Typography variant="heading-lg"><Currency>{100}</Currency></Typography>`
 */
export function Currency({
  children,
  sign = 'auto',
}: Readonly<ICurrencyProps>) {
  const { format } = useCurrencyFormat()

  if (typeof children !== 'number' || !Number.isFinite(children)) {
    console.error(
      `[Currency] Expected a finite number as children, got: ${String(children)}`
    )
    return <>—</>
  }

  return <>{format(children, sign)}</>
}
