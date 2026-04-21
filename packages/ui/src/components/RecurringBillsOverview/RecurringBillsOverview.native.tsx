import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { BillSummaryRow } from '../BillSummaryRow/BillSummaryRow.native'
import { SectionLink } from '../SectionLink/SectionLink.native'

import type { IRecurringBillsOverviewProps } from './RecurringBillsOverview'

/** Native implementation of the RecurringBillsOverview section component. */
export const RecurringBillsOverview = ({
  paid,
  upcoming,
  dueSoon,
  onSeeDetails,
}: IRecurringBillsOverviewProps) => (
  <View>
    <View style={tw`flex-row justify-between items-center`}>
      <Text
        style={tw`text-base font-bold text-grey-900`}
        accessibilityRole="header"
      >
        Recurring Bills
      </Text>
      <SectionLink label="See Details" onPress={onSeeDetails} />
    </View>
    <View style={tw`bg-white rounded-xl p-5 mt-3 gap-3`}>
      <BillSummaryRow label="Paid Bills" amount={paid} color="green" />
      <BillSummaryRow label="Total Upcoming" amount={upcoming} color="yellow" />
      <BillSummaryRow label="Due Soon" amount={dueSoon} color="cyan" />
    </View>
  </View>
)
