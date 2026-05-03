import {
  Card,
  ColorBarItem,
  Currency,
  Icon,
  SectionLink,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { View } from 'react-native'

import { shared } from './PotsOverview.styles'

import type { IPotsOverviewProps } from './PotsOverview'

/** Native implementation of the PotsOverview section component. */
export const PotsOverview = ({
  title,
  seeDetailsLabel,
  totalSavedLabel,
  savingsIconLabel,
  totalSaved,
  pots,
  onSeeDetails,
  icon,
  locale = 'en-US',
  currency = 'USD',
}: Readonly<IPotsOverviewProps>) => {
  return (
    <Card>
      {/* Header row */}
      <View style={tw`${shared.header}`}>
        <Typography variant="subsection-title" accessibilityRole="header">
          {title}
        </Typography>
        <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
      </View>

      {/* Content */}
      <View>
        {/* Total Saved box */}
        <View style={tw`${shared.totalSavedBox}`}>
          {/* Icon area */}
          <View
            accessibilityLabel={savingsIconLabel}
            style={tw`${shared.iconArea}`}
          >
            {icon ?? (
              <Icon name="pot" iconSize="5xl" color={tw.color('green')} />
            )}
          </View>

          {/* Total saved text */}
          <View>
            <Typography variant="body" color="muted">
              {totalSavedLabel}
            </Typography>
            <Currency
              amount={totalSaved}
              locale={locale}
              currency={currency}
              digits={0}
              variant="display-lg"
            />
          </View>
        </View>

        {/* Pots grid — 2 columns */}
        <View style={tw`flex-row flex-wrap mt-4`}>
          {pots.map((pot) => (
            <View key={pot.name} style={tw`w-1/2 py-2`}>
              <ColorBarItem
                label={pot.name}
                amount={pot.total}
                color={pot.color}
                locale={locale}
                currency={currency}
              />
            </View>
          ))}
        </View>
      </View>
    </Card>
  )
}
