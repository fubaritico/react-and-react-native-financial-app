import { View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './ColorBarItem.styles'

import type { IColorBarItemProps } from './ColorBarItem'

import { Currency, Typography } from '#Atoms'

/** Native implementation of the ColorBarItem molecule. */
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
    <View
      style={[
        tw`${shared.root} border-l-${color}`,
        hasSecondary && tw`${shared.rowLayout}`,
      ]}
    >
      {hasSecondary ? (
        <>
          <Typography variant="caption" color="muted">
            {label}
          </Typography>
          <View style={tw`${shared.secondaryGroup}`}>
            <Currency
              amount={amount}
              locale={locale}
              currency={currency}
              variant={amountVariant}
            />
            <Typography variant="caption" color="muted">
              {secondaryLabel}
            </Typography>
            <Currency
              amount={secondaryAmount}
              locale={locale}
              currency={currency}
              variant="caption"
              color="muted"
            />
          </View>
        </>
      ) : (
        <>
          <Typography variant="caption" color="muted">
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
    </View>
  )
}
