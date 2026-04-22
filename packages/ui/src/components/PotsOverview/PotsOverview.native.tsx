import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { SectionLink } from '../SectionLink/SectionLink.native'

import styles from './PotsOverview.styles'

import type { IPotsOverviewProps } from './PotsOverview'

/** Native implementation of the PotsOverview section component. */
export const PotsOverview = ({
  totalSaved,
  pots,
  onSeeDetails,
  icon,
}: IPotsOverviewProps) => (
  <View style={tw`${styles.root}`}>
    {/* Header row */}
    <View style={tw`${styles.header}`}>
      <Text style={tw`${styles.title}`} accessibilityRole="header">
        Pots
      </Text>
      <SectionLink label="See Details" onPress={onSeeDetails} />
    </View>

    {/* Content */}
    <View>
      {/* Total Saved box */}
      <View style={tw`${styles.totalSavedBox}`}>
        {/* Icon area */}
        <View accessibilityLabel="Savings icon" style={tw`${styles.iconArea}`}>
          {icon ?? <Text style={tw`${styles.iconFallback}`}>$</Text>}
        </View>

        {/* Total saved text */}
        <View>
          <Text style={tw`${styles.totalLabel}`}>Total Saved</Text>
          <Text style={tw`${styles.totalAmount}`}>{totalSaved}</Text>
        </View>
      </View>

      {/* Pots grid — 2 columns */}
      <View style={tw`flex-row flex-wrap mt-4`}>
        {pots.map((pot) => (
          <View key={pot.name} style={tw`w-1/2 py-2`}>
            <View
              style={tw`${styles.potItem} border-l-4 border-l-${pot.color}`}
            >
              <Text style={tw`${styles.potName}`}>{pot.name}</Text>
              <Text style={tw`${styles.potTotal}`}>{pot.total}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  </View>
)
