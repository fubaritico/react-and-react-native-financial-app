import { cn } from '#Lib/cn'

import { Currency, Typography } from '#Atoms/index.web'

import { shared, web } from './ColorBarItem.styles'

import type { IColorBarItemProps } from './ColorBarItem'
import type { CSSProperties } from 'react'

/** Web implementation of the ColorBarItem molecule. */
export function ColorBarItem({
  label,
  amount,
  color,
  locale = 'en-US',
  currency = 'USD',
  secondaryAmount,
  secondaryLabel = 'of',
  amountVariant = 'body-bold',
}: Readonly<IColorBarItemProps>) {
  const hasSecondary = secondaryAmount !== undefined

  return (
    <div
      className={cn(
        shared.root,
        'border-l-[var(--bar-color)]',
        hasSecondary && web.rowLayout
      )}
      style={
        {
          '--bar-color': `var(--color-base-${color}-DEFAULT)`,
        } as CSSProperties
      }
    >
      {hasSecondary ? (
        <>
          <Typography variant="caption" color="muted" as="span">
            {label}
          </Typography>
          <span className={web.secondaryGroup}>
            <Currency
              amount={amount}
              locale={locale}
              currency={currency}
              variant={amountVariant}
            />
            <Typography variant="caption" color="muted" as="span">
              {secondaryLabel}
            </Typography>
            <Currency
              amount={secondaryAmount}
              locale={locale}
              currency={currency}
              variant="caption"
              color="muted"
            />
          </span>
        </>
      ) : (
        <>
          <Typography variant="caption" color="muted" as="p">
            {label}
          </Typography>
          <Currency
            amount={amount}
            locale={locale}
            currency={currency}
            variant={amountVariant}
          />
        </>
      )}
    </div>
  )
}
