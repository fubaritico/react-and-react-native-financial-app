import { View } from 'react-native'

import tw from '../../../lib/tw'
import { Icon } from '../../atoms/Icon/Icon.native'
import { Typography } from '../../atoms/Typography/Typography.native'
import { SectionLink } from '../../molecules/SectionLink/SectionLink.native'

import styles from './PotsOverview.styles'

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
}: IPotsOverviewProps) => {
  return (
    <View style={tw`${styles.root}`}>
      {/* Header row */}
      <View style={tw`${styles.header}`}>
        <Typography variant="subsection-title" accessibilityRole="header">
          {title}
        </Typography>
        <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
      </View>

      {/* Content */}
      <View>
        {/* Total Saved box */}
        <View style={tw`${styles.totalSavedBox}`}>
          {/* Icon area */}
          <View
            accessibilityLabel={savingsIconLabel}
            style={tw`${styles.iconArea}`}
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
            <Typography variant="display-lg">{totalSaved}</Typography>
          </View>
        </View>

        {/* Pots grid — 2 columns */}
        <View style={tw`flex-row flex-wrap mt-4`}>
          {pots.map((pot) => (
            <View key={pot.name} style={tw`w-1/2 py-2`}>
              <View
                style={tw`${styles.potItem} border-l-4 border-l-${pot.color}`}
              >
                <Typography variant="caption" color="muted">
                  {pot.name}
                </Typography>
                <Typography variant="body-bold">{pot.total}</Typography>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
