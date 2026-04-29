import {
  BillSummaryRow,
  SectionLink,
  Typography,
} from '@financial-app/ui/native'
import { View } from 'react-native'

import tw from '../../lib/tw'

import { shared } from './RecurringBillsOverview.styles'

import type { IRecurringBillsOverviewProps } from './RecurringBillsOverview'

/** Native implementation of the RecurringBillsOverview section component. */
export const RecurringBillsOverview = ({
  title,
  seeDetailsLabel,
  paidBillsLabel,
  totalUpcomingLabel,
  dueSoonLabel,
  paid,
  upcoming,
  dueSoon,
  onSeeDetails,
}: Readonly<IRecurringBillsOverviewProps>) => {
  return (
    <View style={tw`${shared.root}`}>
      <View style={tw`${shared.header}`}>
        <Typography variant="subsection-title" accessibilityRole="header">
          {title}
        </Typography>
        <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
      </View>
      <View style={tw`${shared.list}`}>
        <BillSummaryRow label={paidBillsLabel} amount={paid} color="green" />
        <BillSummaryRow
          label={totalUpcomingLabel}
          amount={upcoming}
          color="yellow"
        />
        <BillSummaryRow label={dueSoonLabel} amount={dueSoon} color="cyan" />
      </View>
    </View>
  )
}
