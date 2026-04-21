import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { SectionLink } from '../SectionLink/SectionLink.native'

import type { IPotsOverviewProps } from './PotsOverview'

/** Native implementation of the PotsOverview section component. */
export const PotsOverview = ({
  totalSaved,
  pots,
  onSeeDetails,
  icon,
}: IPotsOverviewProps) => (
  <View>
    {/* Header row */}
    <View style={tw`flex-row justify-between items-center`}>
      <Text
        style={tw`text-base font-bold text-grey-900`}
        accessibilityRole="header"
      >
        Pots
      </Text>
      <SectionLink label="See Details" onPress={onSeeDetails} />
    </View>

    {/* Card */}
    <View style={tw`bg-white rounded-xl p-5 mt-3`}>
      {/* Total Saved box */}
      <View style={tw`bg-beige-100 rounded-xl p-4 flex-row items-center gap-4`}>
        {/* Icon area */}
        <View
          accessibilityLabel="Savings icon"
          style={tw`bg-grey-900 w-10 h-10 rounded-xl items-center justify-center`}
        >
          {icon ?? <Text style={tw`text-white font-bold text-base`}>$</Text>}
        </View>

        {/* Total saved text */}
        <View>
          <Text style={tw`text-xs text-grey-500`}>Total Saved</Text>
          <Text style={tw`text-2xl font-bold text-grey-900`}>{totalSaved}</Text>
        </View>
      </View>

      {/* Pots grid — 2 columns */}
      <View style={tw`flex-row flex-wrap mt-4`}>
        {pots.map((pot) => (
          <View key={pot.name} style={tw`w-1/2 py-2`}>
            <View
              style={[
                tw`pl-4`,
                { borderLeftWidth: 4, borderLeftColor: tw.color(pot.color) },
              ]}
            >
              <Text style={tw`text-xs text-grey-500`}>{pot.name}</Text>
              <Text style={tw`text-sm font-bold text-grey-900`}>
                {pot.total}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  </View>
)
