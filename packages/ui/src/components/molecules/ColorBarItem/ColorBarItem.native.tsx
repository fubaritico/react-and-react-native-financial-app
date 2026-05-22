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
            <Typography variant={amountVariant}>
              <Currency>{amount}</Currency>
            </Typography>
            <Typography variant="caption" color="muted">
              {secondaryLabel}
            </Typography>
            <Typography variant="caption" color="muted">
              <Currency>{secondaryAmount}</Currency>
            </Typography>
          </View>
        </>
      ) : (
        <>
          <Typography variant="caption" color="muted">
            {label}
          </Typography>
          <Typography variant={amountVariant}>
            <Currency>{amount}</Currency>
          </Typography>
        </>
      )}
    </View>
  )
}
