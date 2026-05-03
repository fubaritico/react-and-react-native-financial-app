import { Typography } from '../Typography/Typography.web'

import { formatCurrency } from './Currency.utils'

import type { ICurrencyProps } from './Currency'

/** Web implementation of the Currency atom. */
export function Currency({
  amount,
  locale = 'en-US',
  currency = 'USD',
  digits = 2,
  sign = 'auto',
  variant = 'body-bold',
  color = 'foreground',
}: Readonly<ICurrencyProps>) {
  const formatted = formatCurrency(amount, locale, currency, digits, sign)

  return (
    <Typography variant={variant} color={color} as="span">
      {formatted}
    </Typography>
  )
}
